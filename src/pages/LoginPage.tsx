import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../api/authApi';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { BadilLogo } from '../components/ui/BadilLogo';
import loginHero from '../assets/login-hero.png';
import './LoginPage.css';

export function LoginPage() {
  const { setAuth, isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  if (isAuthenticated && user) {
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname;
    const destination =
      from ||
      (user.role === 'SuperAdmin' || user.role === 'Admin'
        ? '/admin/dashboard'
        : '/app');
    navigate(destination, { replace: true });
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
      const response = await authApi.login({ email: email.trim(), password });
      setAuth(response);
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname;
      const destination =
        from ||
        (response.role === 'SuperAdmin' || response.role === 'Admin'
          ? '/admin'
          : '/app');
      navigate(destination, { replace: true });
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string, errors?: Record<string, string[]> }; status?: number } };
        if (axiosErr.response?.status === 401) {
          setError('Invalid email or password.');
        } else if (axiosErr.response?.data?.errors) {
          const firstErrorKey = Object.keys(axiosErr.response.data.errors)[0];
          setError(axiosErr.response.data.errors[firstErrorKey][0]);
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
    <div className="auth-page">
      {/* ── Left Panel: Hero ──────────────────────────────────────── */}
      <div className="auth-hero">
        <div className="auth-hero__bg">
          <img src={loginHero} alt="Industrial greenhouse facility" />
        </div>
        <div className="auth-hero__content">
          <div className="auth-hero__logo">
            <BadilLogo size="sm" />
          </div>

          <div className="auth-hero__tagline">
            <h1>
              Transform Waste
              <br />
              into <span>Value</span>
            </h1>
            <p>
              Join the leading AI-powered industrial symbiosis marketplace.
              Connect your factory to the circular economy and turn by-products
              into revenue.
            </p>
          </div>

          <div className="auth-hero__footer">
            <span className="auth-hero__footer-text">
              Trusted by over 500+ manufacturing leaders
            </span>
            <div className="auth-hero__partners">
              <div className="auth-hero__partner-logo" />
              <div className="auth-hero__partner-logo" />
              <div className="auth-hero__partner-logo" />
              <div className="auth-hero__partner-logo" />
              <div className="auth-hero__partner-logo" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel: Form ─────────────────────────────────────── */}
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <h2 className="auth-form__title">Welcome back</h2>
          <p className="auth-form__subtitle">
            Please enter your details to sign in.
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
                <label className="auth-field__label" htmlFor="login-email">
                  Business Email
                </label>
              </div>
              <div className="auth-input-wrapper">
                <Mail />
                <input
                  id="login-email"
                  className="auth-input"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <div className="auth-field__header">
                <label className="auth-field__label" htmlFor="login-password">
                  Password
                </label>
                <button type="button" className="auth-field__link" tabIndex={-1}>
                  Forgot password?
                </button>
              </div>
              <div className="auth-input-wrapper">
                <Lock />
                <input
                  id="login-password"
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
              className={`auth-submit ${isLoading ? 'auth-submit--loading' : ''}`}
              disabled={isLoading}
            >
              Sign in
              {isLoading && <span className="auth-submit__spinner" />}
            </button>
          </form>

          <div className="auth-footer">
            <p className="auth-footer__text">
              New to Badil?{' '}
              <Link to="/register" className="auth-footer__link">
                Register your Factory
              </Link>
            </p>
          </div>

          <div className="auth-legal">
            <p className="auth-legal__text">
              By continuing, you agree to Badil's{' '}
              <a href="#">Terms of Service</a> and{' '}
              <a href="#">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
