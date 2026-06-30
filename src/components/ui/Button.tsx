// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Button Component
// Variants: primary (teal), secondary (dark), outline, ghost, danger
// Sizes: sm, md, lg
// Supports: loading state, icons, disabled, full-width
// ═══════════════════════════════════════════════════════════════════

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

// ── Types ──────────────────────────────────────────────────────────

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

// ── Variant Styles ─────────────────────────────────────────────────

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-active)] text-[var(--color-primary-dark)] font-semibold shadow-lg shadow-teal-500/20',
  secondary:
    'bg-[var(--color-bg)] hover:bg-[var(--color-surface)] active:bg-[var(--color-surface-dark)] text-gray-200 border border-[var(--color-border)]',
  outline:
    'bg-transparent hover:bg-[var(--color-bg)] active:bg-[var(--color-surface)] text-[var(--color-primary)] border border-[var(--color-primary)]/40 hover:border-[var(--color-primary)]/70',
  ghost:
    'bg-transparent hover:bg-[var(--color-bg)] active:bg-[var(--color-surface)] text-gray-300 hover:text-white',
  danger:
    'bg-red-600/20 hover:bg-red-600/30 active:bg-red-600/40 text-red-400 border border-red-500/30',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-md gap-1.5',
  md: 'px-4 py-2.5 text-sm rounded-lg gap-2',
  lg: 'px-6 py-3 text-base rounded-lg gap-2.5',
};

// ── Component ──────────────────────────────────────────────────────

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          // Base
          'inline-flex items-center justify-center font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2dd4bf]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f2424]',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          'cursor-pointer select-none',
          // Variant + Size
          variantStyles[variant],
          sizeStyles[size],
          // Full width
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  },
);

Button.displayName = 'Button';
