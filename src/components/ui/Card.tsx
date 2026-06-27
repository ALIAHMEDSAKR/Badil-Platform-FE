// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Card Component
// Used for: dashboard stat cards, marketplace listing wraps, detail panels
// Matches the bordered charcoal cards with teal hover glow from mockups
// ═══════════════════════════════════════════════════════════════════

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

// ── Types ──────────────────────────────────────────────────────────

export type CardVariant = 'default' | 'stat' | 'interactive';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  /** Optional header content — rendered above the body */
  header?: ReactNode;
  /** Optional footer content — rendered below the body with a top border */
  footer?: ReactNode;
  /** Remove default padding */
  noPadding?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
  default:
    'bg-[#0f2424] border border-[#1e3a3a] rounded-xl',
  stat:
    'bg-[#0f2424] border border-[#1e3a3a] rounded-xl hover:border-[#2dd4bf]/30 transition-colors duration-200',
  interactive:
    'bg-[#0f2424] border border-[#1e3a3a] rounded-xl hover:border-[#2dd4bf]/40 hover:shadow-lg hover:shadow-teal-900/20 transition-all duration-200 cursor-pointer',
};

// ── Component ──────────────────────────────────────────────────────

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', header, footer, noPadding, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(variantStyles[variant], className)}
        {...props}
      >
        {/* Header */}
        {header && (
          <div className="px-5 py-4 border-b border-[#1e3a3a]">
            {header}
          </div>
        )}

        {/* Body */}
        <div className={cn(!noPadding && 'p-5')}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-5 py-3 border-t border-[#1e3a3a]">
            {footer}
          </div>
        )}
      </div>
    );
  },
);

Card.displayName = 'Card';
