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
    const codigo = await generatePlantCode(plantData.origem, plantData.maeId);
    const qrCodeData = await QRCode.toDataURL(`app://plant/${codigo}`);
    
    const now = new Date().toISOString();
    const plant: Plant = {
      ...plantData,
      codigo,
      qrCodeData,
      createdAt: now,
      updatedAt: now,
    };
    
    const id = await db.plants.add(plant);
    const createdPlant = { ...plant, id };
    
    set((state) => ({
      plants: [createdPlant, ...state.plants],
    }));
    
    return createdPlant;
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
}));
