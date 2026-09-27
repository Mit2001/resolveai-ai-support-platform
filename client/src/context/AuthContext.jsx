import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('resolveai_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('resolveai_token') || null);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('resolveai_token');
      if (savedToken) {
        try {
          const res = await authApi.getMe();
          if (res.data?.data) {
            setUser(res.data.data);
            localStorage.setItem('resolveai_user', JSON.stringify(res.data.data));
          }
        } catch (error) {
          console.warn('Session expired, clearing local auth state.');
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await authApi.login({ email, password });
      const userData = res.data.data;
      setUser(userData);
      setToken(userData.token);
      localStorage.setItem('resolveai_token', userData.token);
      localStorage.setItem('resolveai_user', JSON.stringify(userData));
      toast.success(`Welcome back, ${userData.name}!`, 'Logged in');
      return userData;
    } catch (error) {
      const msg = error.response?.data?.message || 'Invalid email or password';
      toast.error(msg, 'Authentication Failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const res = await authApi.register(userData);
      const data = res.data.data;
      setUser(data);
      setToken(data.token);
      localStorage.setItem('resolveai_token', data.token);
      localStorage.setItem('resolveai_user', JSON.stringify(data));
      toast.success('Account created successfully!', 'Welcome to ResolveAI');
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      toast.error(msg, 'Registration Error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async (role = 'agent') => {
    const credentials = {
      admin: { email: 'admin@resolveai.io', password: 'password123' },
      agent: { email: 'agent@resolveai.io', password: 'password123' },
      customer: { email: 'customer@resolveai.io', password: 'password123' },
    };

    const target = credentials[role] || credentials.agent;
    return await login(target.email, target.password);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('resolveai_token');
    localStorage.removeItem('resolveai_user');
    toast.info('You have been signed out.');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        demoLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
