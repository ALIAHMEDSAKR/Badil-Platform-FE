// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Badge Component
// For status indicators: "In Transit", "Pending", "Verified", etc.
// Variants match the status colors across screens 5, 6, 8
// ═══════════════════════════════════════════════════════════════════

import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

// ── Types ──────────────────────────────────────────────────────────

export type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'teal'
  | 'purple'
  | 'neutral';

export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  /** Show a leading dot indicator */
  dot?: boolean;
  /** Optional icon before text */
  icon?: ReactNode;
}

// ── Styles ─────────────────────────────────────────────────────────

const variantStyles: Record<BadgeVariant, string> = {
  default:
    'bg-gray-800/60 text-gray-300 border-gray-600/30',
  success:
    'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  warning:
    'bg-amber-500/15 text-amber-400 border-amber-500/25',
  danger:
    'bg-red-500/15 text-red-400 border-red-500/25',
  info:
    'bg-blue-500/15 text-blue-400 border-blue-500/25',
  teal:
    'bg-[#2dd4bf]/15 text-[#2dd4bf] border-[#2dd4bf]/25',
  purple:
    'bg-purple-500/15 text-purple-400 border-purple-500/25',
  neutral:
    'bg-[#1a2e2e] text-gray-400 border-[#2a4a4a]',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-gray-400',
  success: 'bg-emerald-400',
  warning: 'bg-amber-400',
  danger: 'bg-red-400',
  info: 'bg-blue-400',
  teal: 'bg-[#2dd4bf]',
  purple: 'bg-purple-400',
  neutral: 'bg-gray-500',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
};

// ── Component ──────────────────────────────────────────────────────

export function Badge({
  variant = 'default',
  size = 'md',
  dot = false,
  icon,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border whitespace-nowrap',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])} />
      )}
      {icon}
      {children}
    </span>
  );
}
