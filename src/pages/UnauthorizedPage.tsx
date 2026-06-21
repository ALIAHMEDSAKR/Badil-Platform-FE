import { Link } from 'react-router-dom';
import { ShieldOff } from 'lucide-react';

export function UnauthorizedPage() {
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
      <div style={{ maxWidth: 440 }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 16,
            background: 'rgba(245, 101, 101, 0.12)',
            display: 'grid',
            placeItems: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <ShieldOff size={36} color="#f56565" strokeWidth={1.5} />
        </div>

        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            margin: '0 0 0.5rem',
            letterSpacing: '-0.5px',
          }}
        >
          Access Denied
        </h1>
        <p
          style={{
            margin: '0 0 2rem',
            color: '#7d9d9a',
            fontSize: '0.95rem',
            lineHeight: 1.5,
          }}
        >
          You don't have the required permissions to access this page.
          If you believe this is an error, please contact your administrator.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.65rem 1.5rem',
              borderRadius: 8,
              background: '#4fd1c5',
              color: '#0b1414',
              fontWeight: 600,
              textDecoration: 'none',
              fontSize: '0.9rem',
              transition: 'transform 0.15s, box-shadow 0.25s',
            }}
          >
            Go to Dashboard
          </Link>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.65rem 1.5rem',
              borderRadius: 8,
              background: 'transparent',
              color: '#7d9d9a',
              fontWeight: 500,
              textDecoration: 'none',
              fontSize: '0.9rem',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
