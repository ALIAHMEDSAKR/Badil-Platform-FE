// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Login Page
// Wired to: useAuthStore().setAuth + authApi.login / adminApi.adminLogin
// Uses: AuthLayout, Input, Button atomic components
// Matches: loginscreen.png
// ═══════════════════════════════════════════════════════════════════

import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../api/authApi';

export function Login() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authApi.login({ email, password });
      setAuth(response);

      // Route based on role
      if (response.role === 'SuperAdmin' || response.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/app');
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Invalid email or password. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
        <p className="text-gray-400">Please enter your details to sign in.</p>
      </div>

      {/* SSO Button */}
      {/* <button
        type="button"
        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-[#0f2424] border border-[#2a4a4a] text-gray-300 text-sm font-medium hover:bg-[#1a2e2e] hover:border-[#3a5a5a] transition-all duration-200 mb-6"
      >
        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4h4v4H4V4zm0 6h4v4H4v-4zm6-6h4v4h-4V4zm6 0h4v4h-4V4zm-6 6h4v4h-4v-4zm6 0h4v4h-4v-4z" />
        </svg>
        Sign in with Corporate SSO
      </button> */} 

      {/* Divider */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-[#2a4a4a]" />
        <span className="text-xs text-gray-500 whitespace-nowrap">Or continue with email</span>
        <div className="flex-1 h-px bg-[#2a4a4a]" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Business Email"
          type="email"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="w-4 h-4" />}
          required
          autoComplete="email"
        />

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-gray-300">Password</label>
            <Link
              to="/forgot-password"
              className="text-xs text-[#2dd4bf] hover:text-[#14b8a6] transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            required
            autoComplete="current-password"
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
        >
          Sign in
        </Button>
      </form>

      {/* Register link */}
      <p className="mt-6 text-center text-sm text-gray-400">
        New to Badil?{' '}
        <Link
          to="/register"
          className="text-[#2dd4bf] hover:text-[#14b8a6] font-medium transition-colors"
        >
          Register your Factory
        </Link>
      </p>

      {/* Terms */}
      <div className="mt-8 pt-6 border-t border-[#1e3a3a]">
        <p className="text-center text-xs text-gray-600">
          By continuing, you agree to Badil&apos;s{' '}
          <a href="#" className="text-gray-400 underline hover:text-gray-300">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-gray-400 underline hover:text-gray-300">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </AuthLayout>
  );
}
