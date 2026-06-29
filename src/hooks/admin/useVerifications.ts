import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  fetchVerifications,
  fetchVerificationById,
  approveVerification,
  rejectVerification,
} from '../../api/adminDashboardApi'
import type { AxiosError } from 'axios'

interface UseVerificationsParams {
  status?: string
  search?: string
  page?: number
  pageSize?: number
}

/** Paginated verifications list with filters */
export function useVerifications(params: UseVerificationsParams = {}) {
  return useQuery({
    queryKey: ['admin', 'verifications', params],
    queryFn: () => fetchVerifications(params),
  })
}

/** Get single verification by id */
export function useVerification(id: string) {
  return useQuery({
    queryKey: ['admin', 'verifications', id],
    queryFn: () => fetchVerificationById(id),
    enabled: !!id,
  })
}

/** Approve a factory verification */
export function useApproveVerification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => approveVerification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'verifications'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
      toast.success('Factory approved')
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      const msg = err.response?.data?.message ?? 'Failed to approve verification'
      toast.error(msg)
    },
  })
}

/** Reject a factory verification with a reason */
export function useRejectVerification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      rejectVerification(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'verifications'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
      toast.success('Factory rejected')
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      const msg = err.response?.data?.message ?? 'Failed to reject verification'
      toast.error(msg)
    },
  })
}
