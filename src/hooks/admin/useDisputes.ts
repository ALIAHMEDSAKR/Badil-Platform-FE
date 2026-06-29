import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { 
  fetchDisputes, 
  fetchDisputeById, 
  updateDispute, 
  resolveDispute 
} from '../../api/adminDashboardApi'
import type { AxiosError } from 'axios'

interface UseDisputesParams {
  status?: string
  page?: number
  pageSize?: number
}

/** Paginated disputes list with filters */
export function useDisputes(params: UseDisputesParams = {}) {
  return useQuery({
    queryKey: ['admin', 'disputes', params],
    queryFn: () => fetchDisputes(params),
  })
}

/** Get single dispute by id */
export function useDispute(id: string) {
  return useQuery({
    queryKey: ['admin', 'disputes', id],
    queryFn: () => fetchDisputeById(id),
    enabled: !!id,
  })
}

/** Update dispute status (e.g. to UnderInvestigation) */
export function useUpdateDisputeStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status, remarks }: { id: string; status: number; remarks?: string }) =>
      updateDispute(id, status, remarks),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'disputes'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
      toast.success('Dispute status updated')
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      const msg = err.response?.data?.message ?? 'Failed to update dispute status'
      toast.error(msg)
    },
  })
}

/** Resolve dispute with remarks */
export function useResolveDispute() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, remarks }: { id: string; remarks: string }) =>
      resolveDispute(id, remarks),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'disputes'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
      toast.success('Dispute resolved successfully')
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      const msg = err.response?.data?.message ?? 'Failed to resolve dispute'
      toast.error(msg)
    },
  })
}
