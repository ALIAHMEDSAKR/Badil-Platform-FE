// ═══════════════════════════════════════════════════════════════════
// Badil Admin — API functions for admin dashboard endpoints
// Follows SKILL.md API contract. Uses the legacy apiClient (JWT-attached).
// ═══════════════════════════════════════════════════════════════════

import apiClient from './apiClient'
import type {
  DashboardStats,
  AdminVerification,
  AdminVerificationsResponse,
  AdminDispute,
  AdminDisputesResponse,
  DisputeMessage,
  AnalyticsOverview,
  AnalyticsCharts,
  AdminSettings,
} from '../types/admin'

// ── Dashboard ──────────────────────────────────────────────────────

/** GET /api/Admin/dashboard */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  const { data } = await apiClient.get<DashboardStats>('/Admin/dashboard')
  return data
}

/** GET /api/Admin/verification-requests */
export async function fetchRecentVerifications(limit = 5): Promise<AdminVerification[]> {
  const { data } = await apiClient.get<AdminVerification[]>('/Admin/verification-requests')
  // Backend doesn't support ?limit=N, so we slice on frontend for now
  return data.slice(0, limit)
}

/** GET /api/Admin/disputes */
export async function fetchRecentDisputes(limit = 5): Promise<AdminDispute[]> {
  const { data } = await apiClient.get<AdminDispute[]>('/Admin/disputes')
  return data.slice(0, limit)
}

// ── Verifications ──────────────────────────────────────────────────

interface VerificationListParams {
  status?: string
  search?: string
  page?: number
  pageSize?: number
}

/** GET /api/VerificationRequest */
export async function fetchVerifications(
  _params: VerificationListParams = {}
): Promise<AdminVerificationsResponse> {
  // Real backend doesn't paginate, we fetch all and mock pagination
  const { data } = await apiClient.get<AdminVerification[]>('/VerificationRequest')
  return {
    items: data,
    total: data.length,
    page: 1,
    pageSize: data.length || 20
  }
}

/** GET /api/VerificationRequest/{id} */
export async function fetchVerificationById(id: string): Promise<AdminVerification> {
  const { data } = await apiClient.get<AdminVerification>(`/VerificationRequest/${id}`)
  return data
}

/** POST /api/VerificationRequest/{id}/approve */
export async function approveVerification(id: string): Promise<void> {
  await apiClient.post(`/VerificationRequest/${id}/approve`, {})
}

/** POST /api/VerificationRequest/{id}/reject */
export async function rejectVerification(id: string, reason: string): Promise<void> {
  await apiClient.post(`/VerificationRequest/${id}/reject`, { reason })
}

// ── Disputes ───────────────────────────────────────────────────────

interface DisputeListParams {
  status?: string
  page?: number
  pageSize?: number
}

/** GET /api/DisputeTicket */
export async function fetchDisputes(
  _params: DisputeListParams = {}
): Promise<AdminDisputesResponse> {
  const { data } = await apiClient.get<AdminDispute[]>('/DisputeTicket')
  return {
    items: data,
    total: data.length,
    page: 1,
    pageSize: data.length || 20
  }
}

/** GET /api/DisputeTicket/{id} */
export async function fetchDisputeById(id: string): Promise<AdminDispute> {
  const { data } = await apiClient.get<AdminDispute>(`/DisputeTicket/${id}`)
  return data
}

/** PUT /api/DisputeTicket/{id} */
export async function updateDispute(id: string, status: number, adminResolutionRemarks: string = ''): Promise<void> {
  await apiClient.put(`/DisputeTicket/${id}`, { status, adminResolutionRemarks })
}

/** POST /api/DisputeTicket/{id}/resolve */
export async function resolveDispute(
  id: string,
  remarks: string
): Promise<void> {
  await apiClient.post(`/DisputeTicket/${id}/resolve`, { remarks })
}

/** GET /api/admin/disputes/{id}/messages */
export async function fetchDisputeMessages(id: string): Promise<DisputeMessage[]> {
  const { data } = await apiClient.get<DisputeMessage[]>(`/admin/disputes/${id}/messages`)
  return data
}

/** POST /api/admin/disputes/{id}/messages */
export async function sendDisputeMessage(id: string, content: string): Promise<void> {
  await apiClient.post(`/admin/disputes/${id}/messages`, { content })
}

// ── Analytics ──────────────────────────────────────────────────────

/** GET /api/admin/analytics/overview */
export async function fetchAnalyticsOverview(): Promise<AnalyticsOverview> {
  const { data } = await apiClient.get<AnalyticsOverview>('/admin/analytics/overview')
  return data
}

/** GET /api/admin/analytics/charts */
export async function fetchAnalyticsCharts(): Promise<AnalyticsCharts> {
  const { data } = await apiClient.get<AnalyticsCharts>('/admin/analytics/charts')
  return data
}

/** GET /api/admin/analytics/export → PDF blob */
export async function exportComplianceReport(): Promise<Blob> {
  const { data } = await apiClient.get('/admin/analytics/export', {
    responseType: 'blob',
  })
  return data as Blob
}

// ── Settings ───────────────────────────────────────────────────────

/** GET /api/admin/settings */
export async function fetchAdminSettings(): Promise<AdminSettings> {
  const { data } = await apiClient.get<AdminSettings>('/admin/settings')
  return data
}

/** PUT /api/admin/settings */
export async function updateAdminSettings(settings: Partial<AdminSettings>): Promise<void> {
  await apiClient.put('/admin/settings', settings)
}
