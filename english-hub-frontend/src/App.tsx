import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import HomePage from '@/pages/HomePage';
import VerifyPage from '@/pages/VerifyPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminDashboardLayout from '@/layouts/AdminDashboardLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import UserManagement from '@/pages/admin/UserManagement';
import CourseManagement from './pages/admin/CourseManagement';
import CourseDetail from './pages/admin/CourseDetail';
import { ROUTES } from './constants/routes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.VERIFY} element={<VerifyPage />} />
        <Route
          path={ROUTES.FORGOT_PASSWORD}
          element={<div>Forgot Password</div>}
        />

        <Route element={<ProtectedRoute adminRequired={true} />}>
          <Route path={ROUTES.ADMIN} element={<AdminDashboardLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path={ROUTES.ADMIN_USERS} element={<UserManagement />} />
            <Route path={ROUTES.ADMIN_COURSES} element={<CourseManagement />} />
            <Route
              path={ROUTES.ADMIN_COURSES_DETAIL}
              element={<CourseDetail />}
            />
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
