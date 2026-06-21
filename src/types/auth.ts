// ============ Enums ============

/** Mirrors the .NET backend UserRole enum (Badil.Domain.Enum.UserRole) */
export const UserRole = {
  SuperAdmin: 0,
  Admin: 1,
  User: 2,
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

/** String versions returned from API responses */
export type UserRoleString = "SuperAdmin" | "Admin" | "User";

// ============ Auth DTOs ============

/** POST /api/auth/login & POST /api/admin/login — request body */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * POST /api/auth/register — request body
 * Fields: Email, Password, FirstName, LastName, PhoneNumber, Role
 */
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: UserRole; // always send UserRole.User (2) for public registration
}

/**
 * Flat response from both login & register.
 * Token + user profile info.
 */
export interface LoginResponse {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRoleString;
}

// ============ Admin DTOs ============

/** POST /api/admin/create — request body (SuperAdmin only) */
export interface CreateAdminRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/** PUT /api/admin/users/{id}/role — request body */
export interface UpdateUserRoleRequest {
  newRole: UserRole;
}

/** GET /api/admin/users — single user in the response array */
export interface UserDto {
  id: string; // GUID
  email: string;
  role: string;
}

/** GET /api/admin/dashboard — response body */
export interface AdminDashboardDto {
  totalUsers: number;
  totalAdmins: number;
}

// ============ Error Response ============

export interface ApiError {
  message: string;
}
