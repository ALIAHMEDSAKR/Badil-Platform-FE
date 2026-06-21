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
import './admin.css'

const nav = [
  { to: '/admin', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/verifications', label: 'Verifications', icon: ClipboardCheck },
  { to: '/admin/disputes', label: 'Disputes', icon: Scale },
  { to: '/admin/users', label: 'User Management', icon: Users },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
]

export function AdminLayout() {
  const navigate = useNavigate()

  function handleLogout() {
    navigate('/', { replace: true })
  }

  return (
    <div className="admin-app">
      <aside className="admin-sidebar" aria-label="Admin navigation">
        <div className="admin-profile">
          <div className="admin-avatar" aria-hidden>
            SA
          </div>
          <div className="admin-profile-text">
            <p className="admin-name">System Admin</p>
            <p className="admin-role">Level 3 Access</p>
          </div>
        </div>

        <nav className="admin-nav">
          {nav.map(({ to, end, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <Icon strokeWidth={2} aria-hidden />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-nav-bottom">
          <NavLink to="/admin/settings">
            <Settings strokeWidth={2} aria-hidden />
            Settings
          </NavLink>
          <button
            type="button"
            className="admin-logout"
            onClick={handleLogout}
          >
            <LogOut strokeWidth={2} aria-hidden />
            Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
