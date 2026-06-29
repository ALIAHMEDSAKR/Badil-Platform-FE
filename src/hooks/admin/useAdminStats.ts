import { useQuery } from '@tanstack/react-query'
import { fetchDashboardStats, fetchRecentVerifications, fetchRecentDisputes } from '../../api/adminDashboardApi'

/** Dashboard KPI stats — 4 metric cards */
export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'stats'],
    queryFn: fetchDashboardStats,
  })
}

/** Recent verifications for dashboard table */
export function useRecentVerifications(limit = 5) {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'recent-verifications', { limit }],
    queryFn: () => fetchRecentVerifications(limit),
  })
}

/** Recent disputes for dashboard table */
export function useRecentDisputes(limit = 5) {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'recent-disputes', { limit }],
    queryFn: () => fetchRecentDisputes(limit),
  })
}
