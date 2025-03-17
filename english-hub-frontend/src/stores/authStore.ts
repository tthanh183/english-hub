import { create } from 'zustand';

import {
  registerUser,
  verifyUser,
  RegisterRequest,
  VerifyRequest,
} from '../services/authService';

interface AuthState {
  isAuthenticated: boolean;
  user: { id: string; username: string; email: string } | null;
  register: (data: RegisterRequest) => Promise<void>;
  verify: (data: VerifyRequest) => Promise<void>;
}

export const useAuthStore = create<AuthState>(set => ({
  isAuthenticated: false,
  user: null,
  register: async (data: RegisterRequest) => {
    try {
      const response = await registerUser(data);
      set({ user: response.data.result, isAuthenticated: true });
    } catch (error) {
      console.error('Registration failed', error);
    }
  },
  verify: async (data: VerifyRequest) => {
    try {
      const response = await verifyUser(data);
      set({ user: response.data, isAuthenticated: true });
    } catch (error) {
      console.error('Verification failed', error);
    }
  },
}));
