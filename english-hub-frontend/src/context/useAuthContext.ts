import { createContext, useContext, useState } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  isAdmin: boolean;
  userId: string;
  setIsAuthenticated: (value: boolean) => void;
  setIsAdmin: (value: boolean) => void;
  setUserId: (value: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within a AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>('');

  const value = {
    isAuthenticated,
    isAdmin,
    userId,
    setIsAuthenticated,
    setIsAdmin,
    setUserId,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
