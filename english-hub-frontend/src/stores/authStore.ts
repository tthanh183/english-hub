import { create } from 'zustand';

import { getUserIdFromToken, isAdminFromToken } from '@/utils/jwtUtil';

type AuthState = {
  isAuthenticated: boolean;
  userId: string | null;
  isAdmin: boolean;
  setAuth: (accessToken: string | null, refreshToken: string | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>(set => ({
  isAuthenticated: !!localStorage.getItem('accessToken'),
  userId: localStorage.getItem('userId') || null,
  isAdmin: localStorage.getItem('isAdmin') === 'true',

  setAuth: (accessToken, refreshToken) => {
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken || '');
      localStorage.setItem('userId', getUserIdFromToken(accessToken));
      localStorage.setItem('isAdmin', isAdminFromToken(accessToken).toString());

      set({
        isAuthenticated: true,
        userId: getUserIdFromToken(accessToken),
        isAdmin: isAdminFromToken(accessToken),
      });
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('isAdmin');

    set({
      isAuthenticated: false,
      userId: null,
      isAdmin: false,
    });
  },
  
}));
