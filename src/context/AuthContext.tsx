import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { authApi } from "../api/authApi";
import { useAuthStore } from "../store/authStore";
import { adminApi } from "../api/adminApi";
import type {
  LoginResponse,
  LoginRequest,
  RegisterRequest,
  UserRoleString,
} from "../types/auth";

/** Stored user shape (everything from LoginResponse except the token) */
interface StoredUser {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRoleString;
}

interface AuthContextType {
  user: StoredUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  login: (data: LoginRequest) => Promise<void>;
  adminLogin: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Decode a JWT and check if it has expired.
 * Returns true if the token is still valid.
 */
function isTokenValid(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Bootstrap: restore session from localStorage on mount ────────
  useEffect(() => {
    const storedToken = localStorage.getItem("badil_token");
    const storedUser = localStorage.getItem("badil_user");

    if (storedToken && storedUser) {
      // Validate token expiry before restoring
      if (isTokenValid(storedToken)) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem("badil_token");
          localStorage.removeItem("badil_user");
        }
      } else {
        // Token expired — clear everything
        localStorage.removeItem("badil_token");
        localStorage.removeItem("badil_user");
      }
    }
    setIsLoading(false);
  }, []);

  // Helper to persist user info from the LoginResponse
  const handleAuthResponse = useCallback((response: LoginResponse) => {
    useAuthStore.getState().setAuth(response);

    localStorage.setItem("badil_token", response.token);

    const storedUser: StoredUser = {
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
      role: response.role,
    };

    localStorage.setItem("badil_user", JSON.stringify(storedUser));
    setToken(response.token);
    setUser(storedUser);
  }, []);

  const login = useCallback(
    async (data: LoginRequest) => {
      const response = await authApi.login(data);
      handleAuthResponse(response);
    },
    [handleAuthResponse],
  );

  const adminLogin = useCallback(
    async (data: LoginRequest) => {
      const response = await adminApi.adminLogin(data);
      handleAuthResponse(response);
    },
    [handleAuthResponse],
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      const response = await authApi.register(data);
      handleAuthResponse(response);
    },
    [handleAuthResponse],
  );

  const logout = useCallback(() => {
    useAuthStore.getState().logout();
    setToken(null);
    setUser(null);
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    isAdmin: user?.role === "Admin" || user?.role === "SuperAdmin",
    isSuperAdmin: user?.role === "SuperAdmin",
    login,
    adminLogin,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
