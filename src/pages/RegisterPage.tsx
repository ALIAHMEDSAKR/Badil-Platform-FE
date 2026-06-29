import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/auth';
import { Mail, Lock, Eye, EyeOff, AlertCircle, User, Phone } from 'lucide-react';
import loginHero from '../assets/login-hero.png';
import './LoginPage.css';

export function RegisterPage() {
  const { register, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated && user) {
    const destination =
      user.role === 'Admin' || user.role === 'SuperAdmin'
        ? '/admin/dashboard'
        : '/dashboard';
    navigate(destination, { replace: true });
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phoneNumber.trim() || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        password,
        role: UserRole.User,
      });
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string, errors?: Record<string, string[]> }; status?: number } };
        if (axiosErr.response?.data?.errors) {
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
            <div className="auth-hero__logo-icon">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L14 8L8 14L2 8L8 2Z" fill="#0a1414" />
              </svg>
            </div>
            <span className="auth-hero__logo-text">Badil</span>
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
          <h2 className="auth-form__title">Create your account</h2>
          <p className="auth-form__subtitle">
            Register your factory to start trading by-products.
          </p>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="auth-error" role="alert">
                <AlertCircle />
                <span>{error}</span>
              </div>
            )}

            <div className="auth-field-row">
              <div className="auth-field">
                <label className="auth-field__label" htmlFor="reg-firstname">
                  First Name
                </label>
                <div className="auth-input-wrapper">
                  <User />
                  <input
                    id="reg-firstname"
                    className="auth-input"
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    autoComplete="given-name"
                    required
                  />
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-field__label" htmlFor="reg-lastname">
                  Last Name
                </label>
                <div className="auth-input-wrapper">
                  <User />
                  <input
                    id="reg-lastname"
                    className="auth-input"
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    autoComplete="family-name"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-field__label" htmlFor="reg-email">
                Business Email
              </label>
              <div className="auth-input-wrapper">
                <Mail />
                <input
                  id="reg-email"
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
              <label className="auth-field__label" htmlFor="reg-phone">
                Phone Number
              </label>
              <div className="auth-input-wrapper">
                <Phone />
                <input
                  id="reg-phone"
                  className="auth-input"
                  type="tel"
                  placeholder="+962 7X XXX XXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  autoComplete="tel"
                  required
                />
              </div>
            </div>

            <div className="auth-field-row">
              <div className="auth-field">
                <label className="auth-field__label" htmlFor="reg-password">
                  Password
                </label>
                <div className="auth-input-wrapper">
                  <Lock />
                  <input
                    id="reg-password"
                    className="auth-input auth-input--has-toggle"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
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

              <div className="auth-field">
                <label className="auth-field__label" htmlFor="reg-confirm">
                  Confirm Password
                </label>
                <div className="auth-input-wrapper">
                  <Lock />
                  <input
                    id="reg-confirm"
                    className="auth-input auth-input--has-toggle"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowConfirm(!showConfirm)}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className={`auth-submit ${isLoading ? 'auth-submit--loading' : ''}`}
              disabled={isLoading}
            >
              Register
              {isLoading && <span className="auth-submit__spinner" />}
            </button>
          </form>

          <div className="auth-footer">
            <p className="auth-footer__text">
              Already have an account?{' '}
              <Link to="/login" className="auth-footer__link">
                Sign in
              </Link>
            </p>
          </div>

          <div className="auth-legal">
            <p className="auth-legal__text">
              By registering, you agree to Badil's{' '}
              <a href="#">Terms of Service</a> and{' '}
              <a href="#">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
