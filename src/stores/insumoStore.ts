import { create } from 'zustand';
import { db, Insumo } from '@/lib/db';

interface InsumoState {
  insumos: Insumo[];
  loading: boolean;
  fetchInsumos: () => Promise<void>;
  createInsumo: (insumo: Omit<Insumo, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Insumo>;
  updateInsumo: (id: number, updates: Partial<Insumo>) => Promise<void>;
  deleteInsumo: (id: number) => Promise<void>;
  getInsumo: (id: number) => Promise<Insumo | undefined>;
  searchInsumos: (query: string) => Promise<Insumo[]>;
}

export const useInsumoStore = create<InsumoState>((set, get) => ({
  insumos: [],
  loading: false,
  
  fetchInsumos: async () => {
    set({ loading: true });
    try {
      const insumos = await db.insumos.orderBy('nomeProduto').toArray();
      set({ insumos, loading: false });
    } catch (error) {
      console.error('Error fetching insumos:', error);
      set({ loading: false });
    }
  },
  
  createInsumo: async (insumoData) => {
    const now = new Date().toISOString();
    const insumo: Omit<Insumo, 'id'> = {
      ...insumoData,
      createdAt: now,
      updatedAt: now,
    };
    
    const id = await db.insumos.add(insumo as Insumo);
    const createdInsumo = { ...insumo, id } as Insumo;
    
    set((state) => ({
      insumos: [...state.insumos, createdInsumo].sort((a, b) =>
        a.nomeProduto.localeCompare(b.nomeProduto)
      ),
    }));
    
    return createdInsumo;
  },
  
  updateInsumo: async (id, updates) => {
    await db.insumos.update(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    
    set((state) => ({
      insumos: state.insumos.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    }));
  },
  
  deleteInsumo: async (id) => {
    await db.insumos.delete(id);
    set((state) => ({
      insumos: state.insumos.filter((i) => i.id !== id),
    }));
  },
  
  getInsumo: async (id) => {
    return await db.insumos.get(id);
  },
  
  searchInsumos: async (query) => {
    const lowerQuery = query.toLowerCase();
    return get().insumos.filter(
      (insumo) =>
        insumo.nomeProduto.toLowerCase().includes(lowerQuery) ||
        insumo.marca?.toLowerCase().includes(lowerQuery)
    );
  },
}));
