// src/utils/baseUrl.ts
import axios from "axios";
import { getStoredAuth, clearAuth } from "./authToken";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  //  baseURL: "https://baleryon.in",
});

api.interceptors.request.use((config) => {
  const { token } = getStoredAuth();
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      clearAuth();
    }
    return Promise.reject(err);
  }
);

export default api;
