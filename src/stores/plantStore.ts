import { create } from 'zustand';
import { db, Plant } from '@/lib/db';
import QRCode from 'qrcode';

interface PlantState {
  plants: Plant[];
  loading: boolean;
  fetchPlants: () => Promise<void>;
  createPlant: (plant: Omit<Plant, 'id' | 'createdAt' | 'updatedAt' | 'codigo' | 'qrCodeData'>) => Promise<Plant>;
  updatePlant: (id: number, updates: Partial<Plant>) => Promise<void>;
  deletePlant: (id: number) => Promise<void>;
  getPlant: (id: number) => Promise<Plant | undefined>;
  getMotherPlants: () => Promise<Plant[]>;
  getClonesByMother: (motherId: number) => Promise<Plant[]>;
  movePlant: (plantId: number, newParentId: number | null) => Promise<void>;
  convertToMother: (plantId: number) => Promise<void>;
  canMove: (plantId: number, newParentId: number | null) => Promise<boolean>;
}

const generatePlantCode = async (origem: 'semente' | 'clone', maeId?: number): Promise<string> => {
  const year = new Date().getFullYear();
  
  if (origem === 'semente') {
    const count = await db.plants.where('origem').equals('semente').count();
    return `PL-${year}-${String(count + 1).padStart(3, '0')}`;
  } else {
    const mae = await db.plants.get(maeId!);
    if (!mae) throw new Error('Planta mãe não encontrada');
    const cloneCount = await db.plants.where('maeId').equals(maeId!).count();
    return `CL-${mae.codigo}-${String(cloneCount + 1).padStart(3, '0')}`;
  }
};

export const usePlantStore = create<PlantState>((set, get) => ({
  plants: [],
  loading: false,
  
  fetchPlants: async () => {
    set({ loading: true });
    try {
      const plants = await db.plants.orderBy('createdAt').reverse().toArray();
      set({ plants, loading: false });
    } catch (error) {
      console.error('Error fetching plants:', error);
      set({ loading: false });
    }
  },
  
  createPlant: async (plantData) => {
    try {
      console.log('Creating plant with data:', plantData);
      
      let geracao = 0;
      if (plantData.origem === 'clone' && plantData.maeId) {
        const mae = await db.plants.get(plantData.maeId);
        if (mae) {
          geracao = mae.geracao + 1;
        }
      }
      
      const codigo = await generatePlantCode(plantData.origem, plantData.maeId);
      console.log('Generated code:', codigo);
      
      const tempId = Date.now();
      const qrCodeData = await QRCode.toDataURL(`${window.location.origin}/plants/${tempId}`);
      console.log('Generated QR code');
      
      const now = new Date().toISOString();
      const plant: Omit<Plant, 'id'> = {
        ...plantData,
        geracao,
        codigo,
        qrCodeData,
        createdAt: now,
        updatedAt: now,
      };
      
      console.log('Plant object before add:', plant);
      const id = await db.plants.add(plant as Plant);
      console.log('Plant created with id:', id);
      
      const finalQrCodeData = await QRCode.toDataURL(`${window.location.origin}/plants/${id}`);
      await db.plants.update(id, { qrCodeData: finalQrCodeData });
      
      const createdPlant = { ...plant, id, qrCodeData: finalQrCodeData } as Plant;
      
      set((state) => ({
        plants: [createdPlant, ...state.plants],
      }));
      
      return createdPlant;
    } catch (error) {
      console.error('Error in createPlant:', error);
      throw error;
    }
  },
  
  updatePlant: async (id, updates) => {
    await db.plants.update(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    
    set((state) => ({
      plants: state.plants.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  },
  
  deletePlant: async (id) => {
    const clones = await db.plants.where('maeId').equals(id).toArray();
    if (clones.length > 0) {
      throw new Error('Não é possível excluir uma planta mãe com clones ativos');
    }
    
    await db.plants.delete(id);
    set((state) => ({
      plants: state.plants.filter((p) => p.id !== id),
    }));
  },
  
  getPlant: async (id) => {
    return await db.plants.get(id);
  },
  
  getMotherPlants: async () => {
    return await db.plants.where('origem').equals('semente').and((p) => p.viva).toArray();
  },
  
  getClonesByMother: async (motherId) => {
    return await db.plants.where('maeId').equals(motherId).toArray();
  },

  movePlant: async (plantId, newParentId) => {
    const canMoveResult = await get().canMove(plantId, newParentId);
    if (!canMoveResult) {
      throw new Error('Não é possível mover: criaria um loop na hierarquia');
    }

    let newGeneration = 0;
    if (newParentId) {
      const newParent = await db.plants.get(newParentId);
      if (newParent) {
        newGeneration = newParent.geracao + 1;
      }
    }

    await db.plants.update(plantId, {
      maeId: newParentId,
      geracao: newGeneration,
    });

    await updateDescendantsGeneration(plantId, newGeneration);
    await get().fetchPlants();
  },

  convertToMother: async (plantId) => {
    const plant = await db.plants.get(plantId);
    if (!plant) throw new Error('Planta não encontrada');

    const year = new Date().getFullYear();
    const count = await db.plants.where('origem').equals('semente').count();
    const newCode = `PL-${year}-${String(count + 1).padStart(3, '0')}`;

    await db.plants.update(plantId, {
      origem: 'semente',
      maeId: undefined,
      geracao: 0,
      codigo: newCode,
    });

    await updateDescendantsGeneration(plantId, 0);
    await get().fetchPlants();
  },

  canMove: async (plantId, newParentId) => {
    if (!newParentId) return true;
    return !(await checkIfDescendant(plantId, newParentId));
  },
}));

async function checkIfDescendant(sourceId: number, targetId: number): Promise<boolean> {
  if (sourceId === targetId) return true;

  const target = await db.plants.get(targetId);
  if (!target || !target.maeId) return false;

  return checkIfDescendant(sourceId, target.maeId);
}

async function updateDescendantsGeneration(parentId: number, parentGeneration: number): Promise<void> {
  const children = await db.plants.where('maeId').equals(parentId).toArray();
  if (children.length === 0) return;

  const newGeneration = parentGeneration + 1;

  for (const child of children) {
    await db.plants.update(child.id!, { geracao: newGeneration });
    await updateDescendantsGeneration(child.id!, newGeneration);
  }
}
