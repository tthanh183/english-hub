import { Navigate, Outlet } from 'react-router-dom';

import { showError } from '@/hooks/useToast';
import { useAuthStore } from '@/stores/authStore';

type ProtectedRouteProps = {
  adminRequired: boolean;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ adminRequired }) => {
  let { isAuthenticated, isAdmin } = useAuthStore();
  isAuthenticated = true;
  isAdmin = true; 
  if (!isAuthenticated) {
    showError('You need to login first');
    return <Navigate to="/" />;
  }

  if (adminRequired && !isAdmin) {
    showError('You need to be an admin to access this page');
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
