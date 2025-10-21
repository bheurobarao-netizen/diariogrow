import { create } from 'zustand';
import { db, Equipment } from '@/lib/db';

interface EquipmentState {
  equipment: Equipment[];
  loading: boolean;
  fetchEquipment: () => Promise<void>;
  createEquipment: (equipment: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Equipment>;
  updateEquipment: (id: number, updates: Partial<Equipment>) => Promise<void>;
  deleteEquipment: (id: number) => Promise<void>;
  getEquipment: (id: number) => Promise<Equipment | undefined>;
  getEquipmentByTentId: (tentId: number) => Equipment[];
}

export const useEquipmentStore = create<EquipmentState>((set, get) => ({
  equipment: [],
  loading: false,
  
  fetchEquipment: async () => {
    set({ loading: true });
    try {
      const equipment = await db.equipment.orderBy('createdAt').reverse().toArray();
      set({ equipment, loading: false });
    } catch (error) {
      console.error('Error fetching equipment:', error);
      set({ loading: false });
    }
  },
  
  createEquipment: async (equipmentData) => {
    const now = new Date().toISOString();
    const equipment: Equipment = {
      ...equipmentData,
      createdAt: now,
      updatedAt: now,
    };
    
    const id = await db.equipment.add(equipment);
    const createdEquipment = { ...equipment, id };
    
    set((state) => ({
      equipment: [createdEquipment, ...state.equipment],
    }));
    
    return createdEquipment;
  },
  
  updateEquipment: async (id, updates) => {
    await db.equipment.update(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    
    set((state) => ({
      equipment: state.equipment.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }));
  },
  
  deleteEquipment: async (id) => {
    await db.equipment.delete(id);
    set((state) => ({
      equipment: state.equipment.filter((e) => e.id !== id),
    }));
  },
  
  getEquipment: async (id) => {
    return await db.equipment.get(id);
  },
  
  getEquipmentByTentId: (tentId) => {
    return get().equipment.filter((e) => e.tentId === tentId);
  },
}));
