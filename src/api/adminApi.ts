import apiClient from './apiClient';
import type {
  LoginRequest,
  LoginResponse,
  CreateAdminRequest,
  UserDto,
  AdminDashboardDto,
  UserRole,
} from '../types/auth';

export const adminApi = {
  /** POST /api/admin/login — dedicated admin login (rejects regular Users) */
  adminLogin: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/admin/login', data);
    return response.data;
  },

  /** POST /api/admin/create — SuperAdmin only: create a new Admin account */
  createAdmin: async (data: CreateAdminRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/admin/create', data);
    return response.data;
  },

  /** GET /api/admin/users — get all users in the system */
  getAllUsers: async (): Promise<UserDto[]> => {
    const response = await apiClient.get<UserDto[]>('/admin/users');
    return response.data;
  },

  /** PUT /api/admin/users/{id}/role — update a user's role */
  updateUserRole: async (userId: string, newRole: UserRole): Promise<void> => {
    await apiClient.put(`/admin/users/${userId}/role`, { newRole });
  },

  /** DELETE /api/admin/users/{id} — delete a user */
  deleteUser: async (userId: string): Promise<void> => {
    await apiClient.delete(`/admin/users/${userId}`);
  },

  /** GET /api/admin/dashboard — get platform statistics */
  getDashboard: async (): Promise<AdminDashboardDto> => {
    const response = await apiClient.get<AdminDashboardDto>('/admin/dashboard');
    return response.data;
  },
};
