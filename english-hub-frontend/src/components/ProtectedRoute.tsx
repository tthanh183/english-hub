import { Navigate, Outlet } from 'react-router-dom';

import { showError } from '@/hooks/useToast';
import { useAuthStore } from '@/stores/authStore';

type ProtectedRouteProps = {
  adminRequired: boolean;
};

export default function ProtectedRoute({ adminRequired }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin } = useAuthStore();

  if (!isAuthenticated) {
    showError('You need to login first');
    return null;
  }

  if (adminRequired && !isAdmin) {
    showError('You need to be an admin to access this page');
    return <Navigate to="/" />;
  }

  return <Outlet />;
  
}
