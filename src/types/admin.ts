// ═══════════════════════════════════════════════════════════════════
// Badil Admin — TypeScript interfaces for admin API responses
// Source of truth: SKILL.md API contract
// ═══════════════════════════════════════════════════════════════════

// ── Dashboard ──────────────────────────────────────────────────────

/** GET /api/admin/dashboard/stats */
export interface DashboardStats {
  totalUsers: number
  totalAdmins: number
  activeDisputes: number
  pendingVerifications: number
}

// ── Verifications ──────────────────────────────────────────────────

export type VerificationStatus = 'Pending' | 'Approved' | 'Rejected'

/** GET /api/Admin/verification-requests */
export interface AdminVerification {
  id: string
  companyId: string
  documentUrls: string[]
  status: VerificationStatus
  reviewedByAdminId: string | null
  createdAt: string
}

/** GET /api/Admin/verification-requests — paginated response */
export interface AdminVerificationsResponse {
  items: AdminVerification[]
  total: number
  page: number
  pageSize: number
}

// ── Disputes ───────────────────────────────────────────────────────

export type AdminDisputeStatus = 'open' | 'UnderInvestigation' | 'Resolved'

/** GET /api/Admin/disputes */
export interface AdminDispute {
  id: string
  transactionId: string
  raisedByUserId: string
  reason: string | null
  status: AdminDisputeStatus
  adminResolutionRemarks: string | null
  createdAt: string
}

/** GET /api/Admin/disputes — paginated response */
export interface AdminDisputesResponse {
  items: AdminDispute[]
  total: number
  page: number
  pageSize: number
}

/** GET /api/admin/disputes/{id}/messages */
export interface DisputeMessage {
  id: string
  senderName: string
  senderAvatar: string | null
  content: string
  sentAt: string
}

// ── Analytics ──────────────────────────────────────────────────────

/** GET /api/admin/analytics/overview */
export interface AnalyticsOverview {
  totalUsers: number
  totalFactories: number
  activeOffers: number
  completedDeals: number
  co2Saved: number
  wasteDiverted: number
}

/** GET /api/admin/analytics/charts */
export interface AnalyticsCharts {
  dealsByMonth: { month: string; count: number }[]
  wasteByCategory: { category: string; amount: number }[]
  userGrowth: { month: string; count: number }[]
}

// ── Settings ───────────────────────────────────────────────────────

/** GET/PUT /api/admin/settings */
export interface AdminSettings {
  notifyEmail: boolean
  notifyInApp: boolean
  notifyNewVerifications: boolean
  notifyNewDisputes: boolean
}
