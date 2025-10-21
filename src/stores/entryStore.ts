import { create } from 'zustand';
import { db, Entry } from '@/lib/db';

interface EntryState {
  entries: Entry[];
  loading: boolean;
  fetchEntries: () => Promise<void>;
  createEntry: (entry: Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Entry>;
  updateEntry: (id: number, updates: Partial<Entry>) => Promise<void>;
  deleteEntry: (id: number) => Promise<void>;
  getEntry: (id: number) => Promise<Entry | undefined>;
  getEntriesByDate: (date: string) => Promise<Entry[]>;
  getEntriesByPlant: (plantId: number) => Promise<Entry[]>;
}

export const useEntryStore = create<EntryState>((set) => ({
  entries: [],
  loading: false,
  
  fetchEntries: async () => {
    set({ loading: true });
    try {
      const entries = await db.entries.orderBy('date').reverse().toArray();
      set({ entries, loading: false });
    } catch (error) {
      console.error('Error fetching entries:', error);
      set({ loading: false });
    }
  },
  
  createEntry: async (entryData) => {
    const now = new Date().toISOString();
    const entry: Entry = {
      ...entryData,
      nutrientesAplicados: entryData.nutrientesAplicados || [],
      acoesRealizadas: entryData.acoesRealizadas || [],
      problemasObservados: entryData.problemasObservados || [],
      acoesCorretivas: entryData.acoesCorretivas || [],
      photos: entryData.photos || [],
      videos: entryData.videos || [],
      createdAt: now,
      updatedAt: now,
    };
    
    const id = await db.entries.add(entry);
    const createdEntry = { ...entry, id };
    
    set((state) => ({
      entries: [createdEntry, ...state.entries],
    }));
    
    return createdEntry;
  },
  
  updateEntry: async (id, updates) => {
    await db.entries.update(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    
    set((state) => ({
      entries: state.entries.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }));
  },
  
  deleteEntry: async (id) => {
    await db.entries.delete(id);
    set((state) => ({
      entries: state.entries.filter((e) => e.id !== id),
    }));
  },
  
  getEntry: async (id) => {
    return await db.entries.get(id);
  },
  
  getEntriesByDate: async (date) => {
    return await db.entries.where('date').equals(date).toArray();
  },
  
  getEntriesByPlant: async (plantId) => {
    return await db.entries.where('plantId').equals(plantId).toArray();
  },
}));
