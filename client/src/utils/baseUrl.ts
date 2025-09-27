// src/utils/baseUrl.ts
import axios from "axios";
import { getStoredAuth } from "./authToken";

const api = axios.create({
  // baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
   baseURL: "https://baleryon.in",
});

api.interceptors.request.use((config) => {
  const { token } = getStoredAuth();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
