import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './styles/global.css';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import OnboardingPage from './pages/auth/OnboardingPage';
import PayFeePage from './pages/auth/PayFeePage';

// Developer Pages
import DashboardPage from './pages/dashboard/DashboardPage';
import StorePage from './pages/store/StorePage';
import ConfigPage from './pages/config/ConfigPage';

// Admin Pages
import AdminPage from './pages/admin/AdminPage';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#1b2838' }}>
        <div className="sw-spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#1b2838' }}>
        <div className="sw-spinner"></div>
      </div>
    );
  }

  if (user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Module A: Onboarding */}
      <Route path="/onboarding" element={<PrivateRoute><OnboardingPage /></PrivateRoute>} />
      <Route path="/pay-fee" element={<PrivateRoute><PayFeePage /></PrivateRoute>} />

      {/* Developer Dashboard */}
      <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/games" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />

      {/* Module B: Store Page Administration */}
      <Route path="/games/:gameId/store" element={<PrivateRoute><StorePage /></PrivateRoute>} />

      {/* Module C: Game Configuration */}
      <Route path="/games/:gameId/config" element={<PrivateRoute><ConfigPage /></PrivateRoute>} />

      {/* Module D: Admin Panel */}
      <Route path="/admin" element={<PrivateRoute adminOnly><AdminPage /></PrivateRoute>} />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
