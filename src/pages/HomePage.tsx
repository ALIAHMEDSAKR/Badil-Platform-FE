import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, you could optionally auto-redirect:
  // useEffect(() => {
  //   if (isAuthenticated && user) {
  //     navigate(user.role === 'Admin' || user.role === 'SuperAdmin' ? '/admin' : '/dashboard', { replace: true });
  //   }
  // }, [isAuthenticated, user, navigate]);

  return (
    <div
      style={{
        minHeight: '100svh',
        display: 'grid',
        placeItems: 'center',
        padding: '2rem',
        background: '#0b1414',
        color: '#f1f5f4',
        fontFamily: "'Inter', system-ui, sans-serif",
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: 420 }}>
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
          <div style={{ 
            width: 48, height: 48, 
            background: '#4fd1c5', 
            borderRadius: 12, 
            display: 'grid', placeItems: 'center',
            transform: 'rotate(45deg)'
          }}>
            <svg width="24" height="24" viewBox="0 0 16 16" fill="none" style={{ transform: 'rotate(-45deg)' }}>
              <path d="M8 2L14 8L8 14L2 8L8 2Z" fill="#0a1414" />
            </svg>
          </div>
        </div>

        <h1 style={{ fontSize: '2.25rem', fontWeight: 700, margin: '0 0 0.5rem', letterSpacing: '-0.5px' }}>
          Badil
        </h1>
        <p style={{ margin: '0 0 2rem', color: '#7d9d9a', fontSize: '0.95rem', lineHeight: 1.5 }}>
          AI-powered industrial symbiosis marketplace — B2B waste-to-resource
          exchange.
        </p>

        {isAuthenticated ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: '#5c7674' }}>
              Welcome back, {user?.firstName}
            </p>
            <Link
              to={user?.role === 'Admin' || user?.role === 'SuperAdmin' ? '/admin' : '/dashboard'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.65rem 1.25rem',
                borderRadius: 8,
                background: '#4fd1c5',
                color: '#0b1414',
                fontWeight: 600,
                textDecoration: 'none',
                fontSize: '0.9rem',
                transition: 'transform 0.15s'
              }}
            >
              Open Dashboard
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.65rem 1.25rem',
                borderRadius: 8,
                background: '#4fd1c5',
                color: '#0b1414',
                fontWeight: 600,
                textDecoration: 'none',
                fontSize: '0.9rem',
              }}
            >
              Sign in as User
            </Link>
            
            <Link
              to="/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.65rem 1.25rem',
                borderRadius: 8,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#f1f5f4',
                fontWeight: 600,
                textDecoration: 'none',
                fontSize: '0.9rem',
              }}
            >
              Register your Factory
            </Link>
            
            <Link
              to="/admin/login"
              style={{
                marginTop: '1rem',
                fontSize: '0.75rem',
                color: '#5c7674',
                textDecoration: 'underline',
              }}
            >
              Admin Portal
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
