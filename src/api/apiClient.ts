import axios from "axios";
import { clearAuth, getAuthToken } from "./authToken";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://localhost:44317/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// ── Request interceptor: attach JWT token ──────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor: handle 401 & 403 globally ────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuth();

      // Only redirect if we're not already on a login page
      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/admin/login"
      ) {
        window.location.href = "/login";
      }
    }

    if (error.response?.status === 403) {
      window.location.href = "/unauthorized";
    }

    return Promise.reject(error);
  },
);

export default apiClient;
