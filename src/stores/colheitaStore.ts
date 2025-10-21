import { create } from 'zustand';
import { db, Colheita, Cura } from '@/lib/db';

interface ColheitaState {
  colheitas: Colheita[];
  curas: Cura[];
  loading: boolean;
  
  fetchColheitas: () => Promise<void>;
  fetchCuras: () => Promise<void>;
  
  createColheita: (colheita: Omit<Colheita, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Colheita>;
  updateColheita: (id: number, updates: Partial<Colheita>) => Promise<void>;
  deleteColheita: (id: number) => Promise<void>;
  getColheita: (id: number) => Promise<Colheita | undefined>;
  getColheitasByPlant: (plantId: number) => Promise<Colheita[]>;
  
  createCura: (cura: Omit<Cura, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Cura>;
  updateCura: (id: number, updates: Partial<Cura>) => Promise<void>;
  deleteCura: (id: number) => Promise<void>;
  getCura: (id: number) => Promise<Cura | undefined>;
  getCurasByColheita: (colheitaId: number) => Promise<Cura[]>;
}

export const useColheitaStore = create<ColheitaState>((set) => ({
  colheitas: [],
  curas: [],
  loading: false,
  
  fetchColheitas: async () => {
    set({ loading: true });
    try {
      const colheitas = await db.colheitas.orderBy('dataColheita').reverse().toArray();
      set({ colheitas, loading: false });
    } catch (error) {
      console.error('Error fetching colheitas:', error);
      set({ loading: false });
    }
  },
  
  fetchCuras: async () => {
    set({ loading: true });
    try {
      const curas = await db.curas.orderBy('createdAt').reverse().toArray();
      set({ curas, loading: false });
    } catch (error) {
      console.error('Error fetching curas:', error);
      set({ loading: false });
    }
  },
  
  createColheita: async (colheitaData) => {
    const now = new Date().toISOString();
    const colheita: Omit<Colheita, 'id'> = {
      ...colheitaData,
      createdAt: now,
      updatedAt: now,
    };
    
    const id = await db.colheitas.add(colheita as Colheita);
    const createdColheita = { ...colheita, id } as Colheita;
    
    set((state) => ({
      colheitas: [createdColheita, ...state.colheitas],
    }));
    
    return createdColheita;
  },
  
  updateColheita: async (id, updates) => {
    await db.colheitas.update(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    
    set((state) => ({
      colheitas: state.colheitas.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
  },
  
  deleteColheita: async (id) => {
    // Delete related curas first
    const curas = await db.curas.where('colheitaId').equals(id).toArray();
    await Promise.all(curas.map((cura) => db.curas.delete(cura.id!)));
    
    await db.colheitas.delete(id);
    set((state) => ({
      colheitas: state.colheitas.filter((c) => c.id !== id),
      curas: state.curas.filter((c) => c.colheitaId !== id),
    }));
  },
  
  getColheita: async (id) => {
    return await db.colheitas.get(id);
  },
  
  getColheitasByPlant: async (plantId) => {
    return await db.colheitas.where('plantId').equals(plantId).toArray();
  },
  
  createCura: async (curaData) => {
    const now = new Date().toISOString();
    const cura: Omit<Cura, 'id'> = {
      ...curaData,
      burpingRegistros: curaData.burpingRegistros || [],
      createdAt: now,
      updatedAt: now,
    };
    
    const id = await db.curas.add(cura as Cura);
    const createdCura = { ...cura, id } as Cura;
    
    set((state) => ({
      curas: [createdCura, ...state.curas],
    }));
    
    return createdCura;
  },
  
  updateCura: async (id, updates) => {
    await db.curas.update(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    
    set((state) => ({
      curas: state.curas.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
  },
  
  deleteCura: async (id) => {
    await db.curas.delete(id);
    set((state) => ({
      curas: state.curas.filter((c) => c.id !== id),
    }));
  },
  
  getCura: async (id) => {
    return await db.curas.get(id);
  },
  
  getCurasByColheita: async (colheitaId) => {
    return await db.curas.where('colheitaId').equals(colheitaId).toArray();
  },
}));
