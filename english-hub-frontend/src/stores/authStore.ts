import { create } from 'zustand';

type AuthState = {
  isAuthenticated: boolean;
  userId: string | null;
  isAdmin: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setUserId: (userId: string) => void;
  setIsAdmin: (isAdmin: boolean) => void;
};

export const useAuthStore = create<AuthState>(set => ({
  isAuthenticated: false,
  userId: null,
  isAdmin: false,
  setIsAuthenticated: isAuthenticated => set({ isAuthenticated }),
  setUserId: userId => set({ userId }),
  setIsAdmin: isAdmin => set({ isAdmin }),
}));
