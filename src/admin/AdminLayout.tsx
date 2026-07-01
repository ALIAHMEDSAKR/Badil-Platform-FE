import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ClipboardCheck,
  Scale,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '../store/authStore'
import apiClient from '../api/apiClient'
import './admin.css'

const navItems = [
  { to: '/admin', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/verifications', label: 'Verifications', icon: ClipboardCheck },
  { to: '/admin/disputes', label: 'Disputes', icon: Scale },
  { to: '/admin/users', label: 'User Management', icon: Users },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
]

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'flex items-center gap-3 px-4 h-10 text-sm rounded-none w-full transition-colors',
    isActive
      ? 'text-[#00c896] bg-[#0f2a2a] border-l-2 border-[#00c896]'
      : 'text-[#6b9090] hover:text-[#e8f4f4] hover:bg-[#1a2a2a] border-l-2 border-transparent',
  ].join(' ')

export function AdminLayout() {
  const navigate = useNavigate()
  const { user, logout: contextLogout } = useAuthStore()

  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : 'SA'

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : 'System Admin'

  const roleLabel =
    user?.role === 'SuperAdmin'
      ? 'Level 3 Access'
      : user?.role === 'Admin'
        ? 'Level 2 Access'
        : 'Standard Access'

  async function handleLogout() {
    try {
      await apiClient.post('/auth/logout')
    } catch {
      // Logout endpoint may not exist yet — proceed regardless
    } finally {
      contextLogout()
      toast.success('Logged out successfully')
      navigate('/login', { replace: true })
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-[#0f1a1a] text-[#e8f4f4] font-['Inter',system-ui,sans-serif] text-sm">
      {/* ── Sidebar ────────────────────────────────────── */}
      <aside
        className="w-[240px] shrink-0 flex flex-col bg-[#132020] border-r border-[#1f3333] min-h-screen"
        aria-label="Admin navigation"
      >
        {/* Profile section */}
        <div className="flex items-center gap-3 px-4 py-5">
          <div
            className="w-10 h-10 rounded-full bg-[#00c896] flex items-center justify-center text-white font-semibold text-sm shrink-0"
            aria-hidden
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#e8f4f4] truncate">
              {displayName}
            </p>
            <p className="text-xs text-[#6b9090]">{roleLabel}</p>
          </div>
        </div>

        {/* Main navigation */}
        <nav className="flex flex-col gap-0.5 flex-1 px-0">
          {navItems.map(({ to, end, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={end} className={navLinkClass}>
              <Icon size={18} strokeWidth={2} aria-hidden />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom section — Settings + Logout */}
        <div className="mt-auto border-t border-[#1f3333] pt-2 pb-4 flex flex-col gap-0.5">
          <NavLink to="/admin/settings" end className={navLinkClass}>
            <Settings size={18} strokeWidth={2} aria-hidden />
            Settings
          </NavLink>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 h-10 text-sm text-[#ef4444] hover:bg-[#2a0a0a] w-full cursor-pointer rounded-none transition-colors bg-transparent border-none"
          >
            <LogOut size={18} strokeWidth={2} aria-hidden />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main content ───────────────────────────────── */}
      <main className="admin-main flex-1 min-w-0 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
