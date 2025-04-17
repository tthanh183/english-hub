import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import HomePage from '@/pages/HomePage';
import VerifyPage from '@/pages/VerifyPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminDashboardLayout from '@/layouts/AdminDashboardLayout';
import AdminDashboard from '@/pages/admin/AdminDashboardPage';
import UserManagement from '@/pages/admin/UserManagementPage';
import CourseManagement from '@/pages/admin/CourseManagementPage';
import CourseDetail from '@/pages/admin/CourseDetailPage';
import { ROUTES } from './constants/routes';
import HomeLayout from './layouts/HomeLayout';
import ListeningReadingPage from './pages/home/ListeningReadingPage';
import CourseDetailPage from './pages/home/CourseDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.VERIFY} element={<VerifyPage />} />
        {/* <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} /> */}

        <Route path={ROUTES.HOME} element={<HomeLayout />}>
          <Route index element={<HomePage />} />
          <Route
            path={ROUTES.COURSES_LISTENING_READING}
            element={<ListeningReadingPage />}
          />
          <Route path={ROUTES.COURSE_DETAIL} element={<CourseDetailPage />} />
        </Route>

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
