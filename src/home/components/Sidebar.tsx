import { Link, NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Store,
  Package,
  ShoppingCart,
  MessageSquare,
  BarChart3,
  Settings,
  Plus,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Marketplace', icon: Store, to: '/' },
  { label: 'My Listings', icon: Package, to: '/listings' },
  { label: 'Orders', icon: ShoppingCart, to: '/orders' },
  { label: 'Messages', icon: MessageSquare, to: '/messages', badge: 3 },
  { label: 'Impact Reports', icon: BarChart3, to: '/impact' },
]

export function Sidebar() {
  return (
    <aside className="home-sidebar" aria-label="Main navigation">
      <Link to="/" className="home-sidebar__brand">
        <div className="home-sidebar__logo-icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2L14 8L8 14L2 8L8 2Z" fill="#0a1414" />
          </svg>
        </div>
        <div className="home-sidebar__brand-text">
          <span className="home-sidebar__brand-name">Badil</span>
          <span className="home-sidebar__brand-sub">Industrial Symbiosis</span>
        </div>
      </Link>

      <nav className="home-sidebar__nav">
        {navItems.map(({ label, icon: Icon, to, badge }) => (
          <NavLink
            key={label}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `home-sidebar__link${isActive ? ' home-sidebar__link--active' : ''}`
            }
          >
            <Icon size={18} strokeWidth={2} aria-hidden />
            <span className="home-sidebar__link-label">{label}</span>
            {badge != null && (
              <span className="home-sidebar__badge" aria-label={`${badge} unread`}>
                {badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="home-sidebar__bottom">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `home-sidebar__link${isActive ? ' home-sidebar__link--active' : ''}`
          }
        >
          <Settings size={18} strokeWidth={2} aria-hidden />
          <span className="home-sidebar__link-label">Settings</span>
        </NavLink>
        <Link to="/register" className="home-sidebar__cta">
          <Plus size={16} strokeWidth={2.5} aria-hidden />
          Post New Waste
        </Link>
      </div>
    </aside>
  )
}
