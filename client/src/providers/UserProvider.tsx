import React, { createContext, useContext, useState } from 'react';
import type { AuthData } from '../types';
import { getStoredAuth, setStoredAuth, removeStoredAuth } from '../utils/storage';
import { useAxios } from './AxiosProvider';
import { useToast } from './ToastProvider';
import { useNavigate } from 'react-router-dom';

interface UserContextType {
  auth: AuthData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userName: string) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const axios = useAxios();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [auth, setAuthState] = useState<AuthData | null>(getStoredAuth);
  const [loading, setLoading] = useState(false);

  const setAuth = (value: AuthData | null) => {
    if (value) {
      setStoredAuth(value);
    } else {
      removeStoredAuth();
    }
    setAuthState(value);
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data } = await axios.post<AuthData>('/api/auth/login', { email, password });
      setAuth(data);
      showToast('¡Bienvenido de nuevo!', 'success');
      navigate('/map');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al iniciar sesion', 'error');
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, userName: string) => {
    setLoading(true);
    try {
      const { data } = await axios.post<AuthData>('/api/auth/register', { email, password, userName });
      setAuth(data);
      showToast('¡Cuenta creada con éxito!', 'success');
      navigate('/map');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al registrarse', 'error');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await axios.delete('/api/positions').catch(() => {});
    setAuth(null);
    navigate('/login');
  };

  return (
    <UserContext.Provider value={{ auth, loading, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
};

export default UserProvider;
