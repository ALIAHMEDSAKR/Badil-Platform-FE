import apiClient from "./apiClient";
import type {
  LoginRequest,
  LoginResponse,
  CreateAdminRequest,
  UserDto,
  AdminDashboardDto,
  UserRole,
} from "../types/auth";
import type { VerificationRequestDto } from "../types/verification";
import type { DisputeTicketDto } from "../types/dispute";

export const adminApi = {
  /** POST /api/Admin/login — dedicated admin login (rejects regular Users) */
  adminLogin: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>("/Admin/login", data);
    return response.data;
  },

  /** POST /api/Admin/create — SuperAdmin only: create a new Admin account */
  createAdmin: async (data: CreateAdminRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>("/Admin/create", data);
    return response.data;
  },

  /** GET /api/Admin/users — get all users in the system */
  getAllUsers: async (): Promise<UserDto[]> => {
    const response = await apiClient.get<UserDto[]>("/Admin/users");
    return response.data;
  },

  /** PUT /api/Admin/users/{id}/role — update a user's role */
  updateUserRole: async (userId: string, newRole: UserRole): Promise<void> => {
    await apiClient.put(`/Admin/users/${userId}/role`, { newRole });
  },

  /** DELETE /api/Admin/users/{id} — delete a user */
  deleteUser: async (userId: string): Promise<void> => {
    await apiClient.delete(`/Admin/users/${userId}`);
  },

  /** GET /api/Admin/dashboard — get platform statistics */
  getDashboard: async (): Promise<AdminDashboardDto> => {
    const response = await apiClient.get<AdminDashboardDto>("/Admin/dashboard");
    return response.data;
  },

  /** GET /api/Admin/verification-requests — pending verification requests */
  getVerificationRequests: async (): Promise<VerificationRequestDto[]> => {
    const response = await apiClient.get<VerificationRequestDto[]>(
      "/Admin/verification-requests",
    );
    return response.data;
  },

  /** GET /api/Admin/disputes — open dispute tickets */
  getDisputes: async (): Promise<DisputeTicketDto[]> => {
    const response = await apiClient.get<DisputeTicketDto[]>("/Admin/disputes");
    return response.data;
  },
};
