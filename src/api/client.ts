// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Store-Aware Axios API Client
// Reads JWT from Zustand auth store for every request.
// Handles 401 (auto-logout) and 403 (redirect to /unauthorized).
//
// NOTE: The legacy `apiClient.ts` is preserved for existing components.
//       All NEW domain API modules import from this file.
// ═══════════════════════════════════════════════════════════════════

import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// ── Instance ───────────────────────────────────────────────────────

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://localhost:5269/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15_000,
});

// ── Request Interceptor: Attach JWT from Zustand store ─────────────

client.interceptors.request.use(
  (config) => {
    // Read directly from Zustand store (outside of React)
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response Interceptor: Handle auth errors globally ──────────────

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Token expired or invalid — clear auth state
      useAuthStore.getState().logout();

      // Only redirect if we're not already on a login page
      if (
        window.location.pathname !== '/login' &&
        window.location.pathname !== '/admin/login'
      ) {
        window.location.href = '/login';
      }
    }

    if (status === 403) {
      window.location.href = '/unauthorized';
    }

    return Promise.reject(error);
  },
);

export default client;
