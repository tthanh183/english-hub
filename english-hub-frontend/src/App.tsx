import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import VerifyPage from './pages/VerifyPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboardLayout from './layouts/AdminDashboardLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminPage from './pages/admin/AdminPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify" element={<VerifyPage />} />

        {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} /> */}
        <Route element={<ProtectedRoute adminRequired={true} />}>
          {/* The DashboardLayout will wrap all admin pages */}
          <Route path="/admin" element={<AdminDashboardLayout />}>
            {/* Admin specific routes */}
            <Route index element={<AdminDashboard />} />
            <Route path="admin-page" element={<AdminPage />} />
            {/* Add more admin routes here */}
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
