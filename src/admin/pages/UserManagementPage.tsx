import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, UserPlus, Trash2, Shield, User as UserIcon, ShieldAlert } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useUsers, useUpdateUserRole, useDeleteUser } from '../../hooks/admin/useUsers'
import { UserRole } from '../../types/auth'
import { LoadingState } from '../../components/admin/LoadingState'
import { ErrorState } from '../../components/admin/ErrorState'
import { EmptyState } from '../../components/admin/EmptyState'

export function UserManagementPage() {
  const { user } = useAuthStore()
  const isSuperAdmin = user?.role === 'SuperAdmin'
  
  const { data: users, isLoading, error, refetch } = useUsers()
  const updateRoleMutation = useUpdateUserRole()
  const deleteMutation = useDeleteUser()

  const [searchQuery, setSearchQuery] = useState('')

  const filteredUsers = useMemo(() => {
    if (!users) return []
    if (!searchQuery.trim()) return users

    const q = searchQuery.toLowerCase()
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q)
    )
  }, [users, searchQuery])

  const roleToEnum = (roleStr: string): UserRole => {
    if (roleStr === 'SuperAdmin') return UserRole.SuperAdmin
    if (roleStr === 'Admin') return UserRole.Admin
    return UserRole.User
  }

  const handleDelete = (userId: string, userEmail: string) => {
    if (confirm(`Are you sure you want to delete ${userEmail}? This action cannot be undone.`)) {
      deleteMutation.mutate(userId)
    }
  }

  return (
    <>
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-7">
        <div>
          <h1 className="text-2xl font-bold text-[#e8f4f4] mb-1">
            User Management
          </h1>
          <p className="text-sm text-[#6b9090]">
            View all users, update roles, and manage accounts across the platform.
          </p>
        </div>
        {isSuperAdmin && (
          <Link
            to="/admin/create"
            className="flex items-center gap-2 px-4 py-2 bg-[#00c896] text-[#0f1a1a] rounded-lg font-semibold text-sm hover:bg-[#00a07a] transition-colors"
          >
            <UserPlus size={16} />
            Create Admin
          </Link>
        )}
      </header>

      {/* ── Toolbar ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b9090]"
          />
          <input
            type="text"
            placeholder="Search by email, role, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#132020] border border-[#1f3333] text-[#e8f4f4] text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-[#00c896] focus:ring-1 focus:ring-[#00c896] transition-all"
          />
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────────────── */}
      <section className="bg-[#132020] border border-[#1f3333] rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1f3333] flex justify-between items-center bg-[#0f1a1a]">
          <h2 className="text-sm font-semibold text-[#e8f4f4]">All Users ({filteredUsers.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          {isLoading ? (
            <LoadingState message="Loading users..." />
          ) : error ? (
            <ErrorState title="Failed to load users" onRetry={() => refetch()} />
          ) : filteredUsers.length === 0 ? (
            <EmptyState 
              title={searchQuery ? 'No users found' : 'No users available'} 
              message={searchQuery ? 'Try adjusting your search criteria.' : 'There are no users registered in the system.'} 
            />
          ) : (
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#0f1a1a] border-b border-[#1f3333]">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#6b9090] uppercase tracking-wider">User</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#6b9090] uppercase tracking-wider">Role</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#6b9090] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const isUpdating = updateRoleMutation.isPending && updateRoleMutation.variables?.userId === user.id
                  const isDeleting = deleteMutation.isPending && deleteMutation.variables === user.id
                  
                  return (
                    <tr key={user.id} className="border-b border-[#1f3333] hover:bg-[#1a2a2a] transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#1f3333] flex items-center justify-center flex-shrink-0 text-[#6b9090]">
                            {user.role === 'SuperAdmin' ? <ShieldAlert size={14} /> : user.role === 'Admin' ? <Shield size={14} /> : <UserIcon size={14} />}
                          </div>
                          <div>
                            <div className="font-medium text-[#e8f4f4]">{user.email}</div>
                            <div className="text-xs text-[#6b9090] font-mono mt-0.5">ID: {user.id.substring(0, 13)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          className="bg-[#0f1a1a] border border-[#1f3333] text-[#e8f4f4] text-xs rounded px-2 py-1.5 focus:outline-none focus:border-[#00c896] disabled:opacity-50"
                          value={roleToEnum(user.role)}
                          onChange={(e) =>
                            updateRoleMutation.mutate({ userId: user.id, newRole: Number(e.target.value) as UserRole })
                          }
                          disabled={isUpdating || (!isSuperAdmin && user.role === 'SuperAdmin')}
                        >
                          <option value={UserRole.User}>User</option>
                          <option value={UserRole.Admin}>Admin</option>
                          {isSuperAdmin && (
                            <option value={UserRole.SuperAdmin}>SuperAdmin</option>
                          )}
                        </select>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end">
                          <button
                            type="button"
                            onClick={() => handleDelete(user.id, user.email)}
                            disabled={isDeleting || (!isSuperAdmin && user.role === 'SuperAdmin')}
                            className="p-1.5 rounded-md text-[#6b9090] hover:bg-[#2a0a0a] hover:text-[#ef4444] transition-colors disabled:opacity-50"
                            title="Delete user"
                            aria-label="Delete User"
                          >
                            <Trash2 size={18} aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </>
  )
}
