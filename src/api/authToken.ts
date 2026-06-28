import { useAuthStore } from "../store/authStore";

const TOKEN_KEY = "badil_token";

/** Read JWT from Zustand store or localStorage (supports both auth flows). */
export function getAuthToken(): string | null {
  return useAuthStore.getState().token ?? localStorage.getItem(TOKEN_KEY);
}

/** Clear auth state in both Zustand and localStorage. */
export function clearAuth(): void {
  useAuthStore.getState().logout();
}
