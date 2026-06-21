import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Recycle,
  TrendingUp,
  ArrowRight,
  LogOut,
  ChevronDown
} from 'lucide-react';
import './UserDashboard.css';

export function UserDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="user-dash">
      {/* ── Header ───────────────────────────────────────────────── */}
      <header className="user-dash__header">
        <div className="user-dash__logo">
          <div className="user-dash__logo-icon">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L14 8L8 14L2 8L8 2Z" fill="#0a1414" />
            </svg>
          </div>
          <span className="user-dash__logo-text">Badil</span>
        </div>
        <div className="user-dash__header-right">
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
              aria-expanded={showMenu}
              aria-haspopup="true"
            >
              <div className="user-dash__avatar" aria-hidden>
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </div>
              <ChevronDown size={16} color="#7d9d9a" />
            </button>

            {showMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 0.75rem)',
                  right: 0,
                  background: '#142121',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '10px',
                  padding: '0.5rem',
                  minWidth: '200px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                  zIndex: 10,
                }}
              >
                <div style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '0.5rem' }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: '#f1f5f4' }}>
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: '#7d9d9a' }}>
                    {user?.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    width: '100%',
                    padding: '0.65rem 0.5rem',
                    background: 'transparent',
                    border: 'none',
                    color: '#f56565',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    borderRadius: '6px',
                    textAlign: 'left',
                    transition: 'background 0.2s',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(245, 101, 101, 0.1)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <LogOut size={15} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Welcome Section ──────────────────────────────────────── */}
      <main className="user-dash__main">
        <section className="user-dash__welcome">
          <h1 className="user-dash__welcome-title">
            {greeting()}, <span>{user?.firstName}</span> 👋
          </h1>
          <p className="user-dash__welcome-sub">
            Welcome to your Badil dashboard. Manage your waste listings, explore
            available materials, and track your circular economy impact.
          </p>
        </section>

        {/* ── Feature Cards ────────────────────────────────────────── */}
        <section className="user-dash__grid" aria-label="Quick actions">
          <article className="user-dash__card">
            <div className="user-dash__card-icon user-dash__card-icon--mint">
              <Package size={22} />
            </div>
            <h2>My Listings</h2>
            <p>Manage your waste and by-product listings for the marketplace.</p>
            <span className="user-dash__card-tag">Coming Soon</span>
          </article>

          <article className="user-dash__card">
            <div className="user-dash__card-icon user-dash__card-icon--blue">
              <Recycle size={22} />
            </div>
            <h2>Browse Materials</h2>
            <p>Discover available materials from other factories in the network.</p>
            <span className="user-dash__card-tag">Coming Soon</span>
          </article>

          <article className="user-dash__card">
            <div className="user-dash__card-icon user-dash__card-icon--gold">
              <TrendingUp size={22} />
            </div>
            <h2>Impact Tracker</h2>
            <p>Track your CO₂ reduction and waste diversion contributions.</p>
            <span className="user-dash__card-tag">Coming Soon</span>
          </article>

          <article className="user-dash__card">
            <div className="user-dash__card-icon user-dash__card-icon--coral">
              <LayoutDashboard size={22} />
            </div>
            <h2>Activity Feed</h2>
            <p>View recent matches, transaction updates, and platform news.</p>
            <span className="user-dash__card-tag">Coming Soon</span>
          </article>
        </section>

        {/* ── Quick Stats ──────────────────────────────────────────── */}
        <section className="user-dash__stats">
          <div className="user-dash__stat">
            <p className="user-dash__stat-value">0</p>
            <p className="user-dash__stat-label">Active Listings</p>
          </div>
          <div className="user-dash__stat">
            <p className="user-dash__stat-value">0</p>
            <p className="user-dash__stat-label">Completed Deals</p>
          </div>
          <div className="user-dash__stat">
            <p className="user-dash__stat-value">0 kg</p>
            <p className="user-dash__stat-label">Waste Diverted</p>
          </div>
          <div className="user-dash__stat">
            <p className="user-dash__stat-value">0 kg</p>
            <p className="user-dash__stat-label">CO₂ Saved</p>
          </div>
        </section>

        {/* ── Explore Link ─────────────────────────────────────────── */}
        <div className="user-dash__explore">
          <Link to="/" className="user-dash__explore-link">
            Explore the Badil marketplace
            <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    </div>
  );
}
