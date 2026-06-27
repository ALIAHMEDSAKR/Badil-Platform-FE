// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Auth Layout Shell
// Split-screen layout: hero panel left, form content right
// Matches the login screen mockup (loginscreen.png)
// ═══════════════════════════════════════════════════════════════════

import { type ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface AuthLayoutProps {
  children: ReactNode;
  className?: string;
}

export function AuthLayout({ children, className }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-[#0b1a1a]">
      {/* ── Left Hero Panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-10">
        {/* Background overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/src/assets/login-hero.png)',
            filter: 'brightness(0.4)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1a1a] via-[#0b1a1a]/60 to-transparent" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#2dd4bf] flex items-center justify-center">
            <svg className="w-5 h-5 text-[#0b1a1a]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2L3 7v11h14V7l-7-5zm0 2.236L15 8.118V16H5V8.118L10 4.236z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-white">Badil</span>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 mb-16">
          <h1 className="text-5xl font-bold text-white leading-tight mb-5">
            Transform Waste
            <br />
            into <span className="text-[#2dd4bf]">Value</span>
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-md">
            Join the leading AI-powered industrial symbiosis marketplace. Connect
            your factory to the circular economy and turn by-products into revenue.
          </p>
        </div>

        {/* Trust line */}
        <div className="relative z-10">
          <div className="border-t border-white/10 pt-5">
            <p className="text-gray-500 text-sm">
              Trusted by over 500+ manufacturing leaders
            </p>
          </div>
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div
        className={cn(
          'w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10',
          className,
        )}
      >
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
