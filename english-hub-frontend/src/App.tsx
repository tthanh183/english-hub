import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import VerifyPage from './pages/VerifyPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminPage from './pages/admin/AdminPage';
import DashboardLayout from './layout/DashboardLayout';

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
          <Route path="/admin" element={<DashboardLayout />}>
            {/* Admin specific routes */}
            <Route path="dashboard" element={<AdminPage />} />
            {/* Other admin routes */}
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
