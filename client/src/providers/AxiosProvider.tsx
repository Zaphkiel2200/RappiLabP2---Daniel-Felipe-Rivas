import React, { createContext, useContext, useMemo } from "react";
import axios from "axios";
import type { AxiosInstance } from "axios";
import { getStoredAuth } from "../utils/storage";

const AxiosContext = createContext<AxiosInstance | null>(null);

export const AxiosProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const instance = useMemo(() => {
    const baseURL = import.meta.env.VITE_API_URL || "";
    const inst = axios.create({ baseURL });

    // Interceptor para añadir el token a cada petición
    inst.interceptors.request.use((config) => {
      const auth = getStoredAuth();
      if (auth?.session?.access_token) {
        config.headers.Authorization = `Bearer ${auth.session.access_token}`;
      }
      return config;
    });

    // Interceptor para manejar errores globales (ej: 401 Unauthorized)
    inst.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Si el token no es válido, podríamos redirigir al login
          // window.location.href = "/login";
        }
        const message = error.response?.data?.message || "Ocurrió un error inesperado";
        return Promise.reject(new Error(message));
      }
    );

    return inst;
  }, []);

  return (
    <AxiosContext.Provider value={instance}>{children}</AxiosContext.Provider>
  );
};

export const useAxios = () => {
  const ctx = useContext(AxiosContext);
  if (!ctx) throw new Error("useAxios must be used within AxiosProvider");
  return ctx;
};

export default AxiosProvider;
