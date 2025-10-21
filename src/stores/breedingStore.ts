import { create } from 'zustand';
import { db, BreedingEvent } from '@/lib/db';

interface BreedingState {
  breedingEvents: BreedingEvent[];
  loading: boolean;
  fetchBreedingEvents: () => Promise<void>;
  createBreedingEvent: (event: Omit<BreedingEvent, 'id' | 'createdAt' | 'updatedAt'>) => Promise<BreedingEvent>;
  updateBreedingEvent: (id: number, updates: Partial<BreedingEvent>) => Promise<void>;
  deleteBreedingEvent: (id: number) => Promise<void>;
  getBreedingEvent: (id: number) => Promise<BreedingEvent | undefined>;
}

export const useBreedingStore = create<BreedingState>((set) => ({
  breedingEvents: [],
  loading: false,
  
  fetchBreedingEvents: async () => {
    set({ loading: true });
    try {
      const events = await db.breedingEvents.orderBy('dataCruzamento').reverse().toArray();
      set({ breedingEvents: events, loading: false });
    } catch (error) {
      console.error('Error fetching breeding events:', error);
      set({ loading: false });
    }
  },
  
  createBreedingEvent: async (eventData) => {
    const now = new Date().toISOString();
    const event: BreedingEvent = {
      ...eventData,
      createdAt: now,
      updatedAt: now,
    };
    
    const id = await db.breedingEvents.add(event);
    const createdEvent = { ...event, id };
    
    set((state) => ({
      breedingEvents: [createdEvent, ...state.breedingEvents],
    }));
    
    return createdEvent;
  },
  
  updateBreedingEvent: async (id, updates) => {
    await db.breedingEvents.update(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    
    set((state) => ({
      breedingEvents: state.breedingEvents.map((e) => 
        (e.id === id ? { ...e, ...updates } : e)
      ),
    }));
  },
  
  deleteBreedingEvent: async (id) => {
    await db.breedingEvents.delete(id);
    set((state) => ({
      breedingEvents: state.breedingEvents.filter((e) => e.id !== id),
    }));
  },
  
  getBreedingEvent: async (id) => {
    return await db.breedingEvents.get(id);
  },
}));
