// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Dashboard Layout Shell
// Sidebar + Top Header + Content Outlet
// Matches screen5.png (Factory Dashboard) layout structure
// ═══════════════════════════════════════════════════════════════════

import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ListOrdered,
  Store,
  BarChart3,
  Shield,
  Settings,
  HelpCircle,
  Bell,
  Search,
  Plus,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import '../../styles/dashboard-theme.css';

// ── Navigation Items ───────────────────────────────────────────────

const mainNavItems = [
  { to: '/app', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/app/listings', icon: ListOrdered, label: 'Listings' },
  { to: '/app/marketplace', icon: Store, label: 'Marketplace' },
  { to: '/app/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/app/escrow', icon: Shield, label: 'Escrow' },
];

const bottomNavItems = [
  { to: '/app/settings', icon: Settings, label: 'Settings' },
  { to: '/app/support', icon: HelpCircle, label: 'Support' },
];

// ── Sidebar Link ───────────────────────────────────────────────────

function SidebarLink({
  to,
  icon: Icon,
  label,
  end,
  onClick,
}: {
  to: string;
  icon: typeof LayoutDashboard;
  label: string;
  end?: boolean;
  onClick?: () => void;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150',
          isActive
            ? 'bg-[#2dd4bf]/15 text-[#2dd4bf]'
            : 'text-gray-400 hover:text-gray-200 hover:bg-[#1a2e2e]',
        )
      }
    >
      <Icon className="w-[18px] h-[18px] shrink-0" />
      <span>{label}</span>
    </NavLink>
  );
}

// ── Component ──────────────────────────────────────────────────────

export function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMobile = () => setSidebarOpen(false);

  return (
    <div className="app-dashboard-container flex">
      {/* ── Mobile Overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-60 flex flex-col',
          'dashboard-sidebar',
          'transform transition-transform duration-200 lg:transform-none',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Company header */}
        <div className="px-5 py-5 border-b border-[var(--border)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#2dd4bf]/20 flex items-center justify-center stat-icon-glow text-[#2dd4bf]">
                <div className="w-5 h-5 rounded bg-[#2dd4bf]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white truncate">
                  {user?.firstName || 'Badil'} {user?.lastName || 'User'}
                </p>
                <p className="text-[11px] text-gray-500">Industrial Symbiosis</p>
              </div>
            </div>
            <button
              className="lg:hidden p-1 text-gray-400 hover:text-white"
              onClick={closeMobile}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {mainNavItems.map((item) => (
            <SidebarLink key={item.to} {...item} onClick={closeMobile} />
          ))}
        </nav>

        {/* Bottom nav */}
        <div className="px-3 pb-3 space-y-1 border-t border-[var(--border)] pt-3">
          {bottomNavItems.map((item) => (
            <SidebarLink key={item.to} {...item} onClick={closeMobile} />
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors duration-150 w-full"
          >
            <LogOut className="w-[18px] h-[18px] shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-6 dashboard-header sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#1a2e2e]"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search */}
            <div className="hidden sm:flex items-center gap-2 dashboard-search rounded-lg px-3 py-2 w-72">
              <Search className="w-4 h-4 text-gray-500 shrink-0" />
              <input
                type="text"
                placeholder="Search orders, materials..."
                className="bg-transparent text-sm text-gray-300 placeholder:text-gray-500 outline-none w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <button className="relative p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#1a2e2e] transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#2dd4bf] rounded-full animate-pulse" />
            </button>

            {/* New Listing CTA */}
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              className="btn-primary-gradient"
              onClick={() => navigate('/app/listings/new')}
            >
              New Listing
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
