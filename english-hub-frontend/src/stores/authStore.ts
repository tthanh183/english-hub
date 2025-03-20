import { create } from 'zustand';

type AuthState = {
  isAuthenticated: boolean;
  userId: string | null;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setUserId: (userId: string) => void;
};

export const useAuthStore = create<AuthState>(set => ({
  isAuthenticated: false,
  userId: null,
  setIsAuthenticated: isAuthenticated => set({ isAuthenticated }),
  setUserId: userId => set({ userId }),
}));
