import { create } from 'zustand';
import { db, Tent } from '@/lib/db';

interface TentState {
  tents: Tent[];
  loading: boolean;
  fetchTents: () => Promise<void>;
  createTent: (tent: Omit<Tent, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Tent>;
  updateTent: (id: number, updates: Partial<Tent>) => Promise<void>;
  deleteTent: (id: number) => Promise<void>;
  getTent: (id: number) => Promise<Tent | undefined>;
}

export const useTentStore = create<TentState>((set) => ({
  tents: [],
  loading: false,
  
  fetchTents: async () => {
    set({ loading: true });
    try {
      const tents = await db.tents.orderBy('createdAt').reverse().toArray();
      set({ tents, loading: false });
    } catch (error) {
      console.error('Error fetching tents:', error);
      set({ loading: false });
    }
  },
  
  createTent: async (tentData) => {
    const now = new Date().toISOString();
    const tent: Omit<Tent, 'id'> = {
      ...tentData,
      createdAt: now,
      updatedAt: now,
    };
    
    const id = await db.tents.add(tent as Tent);
    const createdTent = { ...tent, id } as Tent;
    
    set((state) => ({
      tents: [createdTent, ...state.tents],
    }));
    
    return createdTent;
  },
  
  updateTent: async (id, updates) => {
    await db.tents.update(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    
    set((state) => ({
      tents: state.tents.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  },
  
  deleteTent: async (id) => {
    // Check if any plants are using this tent
    const plants = await db.plants.where('tentId').equals(id).toArray();
    if (plants.length > 0) {
      throw new Error('Não é possível excluir uma tenda com plantas alocadas');
    }
    
    await db.tents.delete(id);
    set((state) => ({
      tents: state.tents.filter((t) => t.id !== id),
    }));
  },
  
  getTent: async (id) => {
    return await db.tents.get(id);
  },
}));
