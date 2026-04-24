import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import VerifyOtpPage from './pages/auth/VerifyOtpPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/dashboard/DashboardPage';
import FormsPage from './pages/forms/FormsPage';
import ViewersPage from './pages/viewers/ViewersPage';
import ProfilePage from './pages/profile/ProfilePage';
import ActivityPage from './pages/activity/ActivityPage';
import LandingPage from './pages/public/LandingPage';
import TermsConditions from './pages/public/TermsConditions';
import PrivacyPolicy from './pages/public/PrivacyPolicy';

const PrivateRoute = ({ children }) => {
  const { token } = useAuthStore();
  if (!token) return <Navigate to="/home" replace />;
  return children;
};

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/home" element={<LandingPage />} />
      <Route path="/terms-conditions" element={<TermsConditions />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="forms" element={<FormsPage />} />
        <Route path="viewers" element={<ViewersPage />} />
        <Route path="activity" element={<ActivityPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
