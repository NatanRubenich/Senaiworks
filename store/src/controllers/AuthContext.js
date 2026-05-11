import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authModel } from '../models/auth.model';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('senaiworks_store_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('senaiworks_store_token'));
  const [loading, setLoading] = useState(false);

  const persist = (newToken, newUser) => {
    if (newToken) localStorage.setItem('senaiworks_store_token', newToken);
    if (newUser) localStorage.setItem('senaiworks_store_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const refresh = useCallback(async () => {
    if (!token) return;
    try {
      const res = await authModel.getMe();
      persist(token, res.data.user);
    } catch {
      logout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (token && !user) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authModel.login(email, password);
      persist(res.data.token, res.data.user);
      return res.data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    setLoading(true);
    try {
      const res = await authModel.register(data);
      persist(res.data.token, res.data.user);
      return res.data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('senaiworks_store_token');
    localStorage.removeItem('senaiworks_store_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};
