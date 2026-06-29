import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { adminApi } from '../../api/adminApi'
import { UserRole } from '../../types/auth'
import type { AxiosError } from 'axios'

export function useUsers() {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => adminApi.getAllUsers(),
  })
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, newRole }: { userId: string; newRole: UserRole }) =>
      adminApi.updateUserRole(userId, newRole),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
      toast.success('User role updated successfully')
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      const msg = err.response?.data?.message ?? 'Failed to update user role'
      toast.error(msg)
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => adminApi.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
      toast.success('User deleted successfully')
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      const msg = err.response?.data?.message ?? 'Failed to delete user'
      toast.error(msg)
    },
  })
}
