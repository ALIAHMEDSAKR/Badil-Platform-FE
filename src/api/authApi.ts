import apiClient from "./apiClient";
import type {
  LoginResponse,
  LoginRequest,
  RegisterRequest,
  UserProfile,
} from "../types/auth";

export const authApi = {
  /** POST /api/Auth/login */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>("/Auth/login", data);
    return response.data;
  },

  /** POST /api/Auth/register */
  register: async (data: RegisterRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      "/Auth/register",
      data,
    );
    return response.data;
  },

  /** GET /api/Auth/profile — current user profile (JWT required) */
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>("/Auth/profile");
    return response.data;
  },
};
