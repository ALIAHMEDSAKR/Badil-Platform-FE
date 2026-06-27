// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Zustand Auth Store
// Manages: user profile, JWT token, auth status, role checks
// Persistence: manual sync to localStorage (badil_token, badil_user)
// Fully compatible with existing AuthContext localStorage keys
// ═══════════════════════════════════════════════════════════════════

import { create } from 'zustand';
import type { LoginResponse, UserRoleString } from '../types/auth';

// ── Types ──────────────────────────────────────────────────────────

/** Stored user shape — matches what AuthContext already persists */
export interface StoredUser {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRoleString;
}

interface AuthState {
  // ── State ──
  user: StoredUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // ── Computed-like getters (recalculated on state access) ──
  isAdmin: boolean;
  isSuperAdmin: boolean;

  // ── Actions ──
  /** Persist auth response from any login/register call */
  setAuth: (response: LoginResponse) => void;

  /** Clear all auth state + localStorage */
  logout: () => void;

  /**
   * Rehydrate state from localStorage on app boot.
   * Call this once in your root component or main.tsx.
   */
  hydrate: () => void;
}

// ── Constants ──────────────────────────────────────────────────────

const TOKEN_KEY = 'badil_token';
const USER_KEY = 'badil_user';

// ── Helpers ────────────────────────────────────────────────────────

/** Decode a JWT and check if it has expired. */
function isTokenValid(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

/** Derive role flags from a user object */
function deriveRoleFlags(user: StoredUser | null) {
  return {
    isAdmin: user?.role === 'Admin' || user?.role === 'SuperAdmin',
    isSuperAdmin: user?.role === 'SuperAdmin',
  };
}

// ── Store ──────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>((set) => ({
  // ── Initial state ──
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  isAdmin: false,
  isSuperAdmin: false,

  // ── Actions ──

  setAuth: (response: LoginResponse) => {
    const storedUser: StoredUser = {
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
      role: response.role,
    };

    // Persist to localStorage (matches existing key convention)
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(storedUser));

    set({
      user: storedUser,
      token: response.token,
      isAuthenticated: true,
      isLoading: false,
      ...deriveRoleFlags(storedUser),
    });
  },

  logout: () => {
    // Clear localStorage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      isAdmin: false,
      isSuperAdmin: false,
    });
  },

  hydrate: () => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      // Validate token expiry before restoring
      if (isTokenValid(storedToken)) {
        try {
          const user: StoredUser = JSON.parse(storedUser);
          set({
            user,
            token: storedToken,
            isAuthenticated: true,
            isLoading: false,
            ...deriveRoleFlags(user),
          });
          return;
        } catch {
          // Corrupted user data — fall through to clear
        }
      }

      // Token expired or invalid — clear everything
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }

    set({ isLoading: false });
  },
}));
