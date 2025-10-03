import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  pin: string | null;
  setPin: (pin: string) => void;
  login: (pin: string) => boolean;
  logout: () => void;
}

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
