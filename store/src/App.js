import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './views/components/Layout';
import HomePage from './views/pages/HomePage';
import LoginPage from './views/pages/LoginPage';
import CatalogPage from './views/pages/CatalogPage';
import GamePage from './views/pages/GamePage';
import ProfilePage from './views/pages/ProfilePage';
import { useAuth } from './controllers/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const App = () => (
  <AnimatePresence mode="wait">
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalogo" element={<CatalogPage />} />
        <Route path="/jogo/:appId" element={<GamePage />} />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  </AnimatePresence>
);

export default App;
