'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '@/lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authAPI.getMe().then((res) => {
        if (res.success) {
          setUser(res.data.user);
        } else {
          localStorage.removeItem('token');
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.success) {
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
    }
    return res;
  };

  const register = async (name, email, password) => {
    const res = await authAPI.register({ name, email, password });
    if (res.success) {
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;