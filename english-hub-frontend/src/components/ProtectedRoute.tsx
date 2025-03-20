import { useAuthStore } from '@/stores/authStore';
import { Navigate } from 'react-router-dom';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requireAdmin?: boolean; 
  requireAuth?: boolean; 
};

export default function ProtectedRoute({
  children,
  requireAdmin = false,
  requireAuth = true,
}: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin } = useAuthStore();

  // Kiểm tra nếu trang yêu cầu đăng nhập mà người dùng chưa đăng nhập
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Kiểm tra nếu trang yêu cầu admin mà người dùng không phải là admin
  if (requireAdmin && isAuthenticated && !isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Nếu không yêu cầu login hay admin, cho phép truy cập trang
  return <>{children}</>;
}
