import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Shield } from 'lucide-react';
import { BadilLogo } from '../components/ui/BadilLogo';
import './LoginPage.css';

export function AdminLoginPage() {
  const { adminLogin, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated as admin
  if (isAuthenticated && isAdmin) {
    navigate('/admin/dashboard', { replace: true });
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    try {
      await adminLogin({ email: email.trim(), password });
      navigate('/admin/dashboard', { replace: true });
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string }; status?: number } };
        if (axiosErr.response?.status === 401) {
          const msg = axiosErr.response?.data?.message || 'Invalid email or password.';
          setError(msg);
        } else if (axiosErr.response?.data?.message) {
          setError(axiosErr.response.data.message);
        } else {
          setError('Something went wrong. Please try again.');
        }
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page auth-page--admin">
      {/* ── Left Panel: Admin Hero ─────────────────────────────────── */}
      <div className="auth-hero auth-hero--admin">
        <div className="auth-hero__bg auth-hero__bg--admin" />
        <div className="auth-hero__content">
          <div className="auth-hero__logo">
            <BadilLogo size="sm" />
            <span className="auth-hero__admin-badge">Admin</span>
          </div>

          <div className="auth-hero__tagline">
            <h1>
              Platform
              <br />
              <span>Control Center</span>
            </h1>
            <p>
              Access the administrative dashboard to manage users, monitor platform
              activity, and oversee the Badil industrial symbiosis marketplace.
            </p>
          </div>

          <div className="auth-hero__footer">
            <div className="auth-hero__security-badge">
              <Shield size={14} />
              <span>Secured administrative access</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel: Form ─────────────────────────────────────── */}
      <div className="auth-form-panel auth-form-panel--admin">
        <div className="auth-form-container">
          <h2 className="auth-form__title">Admin Sign In</h2>
          <p className="auth-form__subtitle">
            Enter your administrator credentials to continue.
          </p>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="auth-error" role="alert">
                <AlertCircle />
                <span>{error}</span>
              </div>
            )}

            <div className="auth-field">
              <div className="auth-field__header">
                <label className="auth-field__label" htmlFor="admin-login-email">
                  Admin Email
                </label>
              </div>
              <div className="auth-input-wrapper">
                <Mail />
                <input
                  id="admin-login-email"
                  className="auth-input"
                  type="email"
                  placeholder="admin@badil.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <div className="auth-field__header">
                <label className="auth-field__label" htmlFor="admin-login-password">
                  Password
                </label>
              </div>
              <div className="auth-input-wrapper">
                <Lock />
                <input
                  id="admin-login-password"
                  className="auth-input auth-input--has-toggle"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`auth-submit auth-submit--admin ${isLoading ? 'auth-submit--loading' : ''}`}
              disabled={isLoading}
            >
              Sign in to Dashboard
              {isLoading && <span className="auth-submit__spinner" />}
            </button>
          </form>

          <div className="auth-legal" style={{ marginTop: '1.5rem' }}>
            <p className="auth-legal__text">
              This portal is restricted to authorized administrators only.
              Unauthorized access attempts are logged and monitored.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
