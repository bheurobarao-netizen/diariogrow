import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  pin: string | null;
  setPin: (pin: string) => void;
  login: (pin: string) => boolean;
  logout: () => void;
}

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || '12345grow';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      pin: null,
      setPin: (pin: string) => {
        set({ pin, isAuthenticated: true });
      },
      login: (pin: string) => {
        const storedPin = get().pin;
        // If no PIN is set yet, check against admin password
        if (!storedPin) {
          if (pin === ADMIN_PASSWORD) {
            set({ pin, isAuthenticated: true });
            return true;
          }
          return false;
        }
        // If PIN is already set, use it
        if (storedPin === pin) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ pin: state.pin }),
    }
  )
);
