import { create } from 'zustand';
import { db, Task } from '@/lib/db';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  fetchTasks: () => Promise<void>;
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Task>;
  updateTask: (id: number, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  getTask: (id: number) => Promise<Task | undefined>;
  getTasksByDate: (date: string) => Promise<Task[]>;
  toggleComplete: (id: number) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,
  
  fetchTasks: async () => {
    set({ loading: true });
    try {
      const tasks = await db.tasks.orderBy('dueDate').toArray();
      set({ tasks, loading: false });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      set({ loading: false });
    }
  },
  
  createTask: async (taskData) => {
    const now = new Date().toISOString();
    const task: Task = {
      ...taskData,
      isComplete: false,
      createdAt: now,
      updatedAt: now,
    };
    
    const id = await db.tasks.add(task);
    const createdTask = { ...task, id };
    
    set((state) => ({
      tasks: [...state.tasks, createdTask].sort((a, b) => 
        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      ),
    }));
    
    return createdTask;
  },
  
  updateTask: async (id, updates) => {
    await db.tasks.update(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  },
  
  deleteTask: async (id) => {
    await db.tasks.delete(id);
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    }));
  },
  
  getTask: async (id) => {
    return await db.tasks.get(id);
  },
  
  getTasksByDate: async (date) => {
    return await db.tasks.where('dueDate').equals(date).toArray();
  },
  
  toggleComplete: async (id) => {
    const task = await db.tasks.get(id);
    if (task) {
      const isComplete = !task.isComplete;
      await get().updateTask(id, { isComplete });
    }
  },
}));
