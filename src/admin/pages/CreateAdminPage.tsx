import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import { Mail, Lock, Eye, EyeOff, AlertCircle, User, CheckCircle2 } from 'lucide-react';

export function CreateAdminPage() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validatePassword = (pw: string): string | null => {
    if (pw.length < 8) return 'Password must be at least 8 characters.';
    if (!/[A-Z]/.test(pw)) return 'Password must contain an uppercase letter.';
    if (!/[a-z]/.test(pw)) return 'Password must contain a lowercase letter.';
    if (!/\d/.test(pw)) return 'Password must contain a digit.';
    if (!/[^A-Za-z0-9]/.test(pw)) return 'Password must contain a special character.';
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const pwError = validatePassword(password);
    if (pwError) {
      setError(pwError);
      return;
    }

    setIsLoading(true);
    try {
      const response = await adminApi.createAdmin({
        email: email.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      setSuccess(`Admin account created for ${response.email}`);
      // Reset form
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');

      // Redirect after a brief delay
      setTimeout(() => navigate('/admin/users'), 2000);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string }; status?: number } };
        if (axiosErr.response?.status === 403) {
          setError('Access denied. Only SuperAdmin can create admin accounts.');
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
    <>
      <header className="admin-page-header">
        <div>
          <h1>Create Admin Account</h1>
          <p className="admin-subtitle">
            Create a new administrator account. Only SuperAdmin users can perform this action.
          </p>
        </div>
      </header>

      <div className="admin-panel" style={{ maxWidth: 520 }}>
        <div style={{ padding: '1.5rem' }}>
          <form onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="admin-form-message admin-form-message--error" role="alert">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="admin-form-message admin-form-message--success" role="status">
                <CheckCircle2 size={16} />
                <span>{success}</span>
              </div>
            )}

            <div className="admin-form-row">
              <div className="admin-form-field">
                <label className="admin-form-label" htmlFor="create-admin-firstname">
                  First Name
                </label>
                <div className="admin-input-wrapper">
                  <User size={15} className="admin-input-icon" />
                  <input
                    id="create-admin-firstname"
                    className="admin-input"
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="admin-form-field">
                <label className="admin-form-label" htmlFor="create-admin-lastname">
                  Last Name
                </label>
                <div className="admin-input-wrapper">
                  <User size={15} className="admin-input-icon" />
                  <input
                    id="create-admin-lastname"
                    className="admin-input"
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="admin-form-field">
              <label className="admin-form-label" htmlFor="create-admin-email">
                Email
              </label>
              <div className="admin-input-wrapper">
                <Mail size={15} className="admin-input-icon" />
                <input
                  id="create-admin-email"
                  className="admin-input"
                  type="email"
                  placeholder="newadmin@badil.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="admin-form-field">
              <label className="admin-form-label" htmlFor="create-admin-password">
                Password
              </label>
              <div className="admin-input-wrapper">
                <Lock size={15} className="admin-input-icon" />
                <input
                  id="create-admin-password"
                  className="admin-input admin-input--has-toggle"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <p className="admin-form-hint">
                Must contain: 8+ chars, uppercase, lowercase, digit, special character
              </p>
            </div>

            <button
              type="submit"
              className={`admin-btn admin-btn--primary admin-btn--full ${isLoading ? 'admin-btn--loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Admin Account'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
