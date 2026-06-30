// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Standardised Logo Component
// Reusable diamond-in-circle logo with optional "Badil" text.
// Replaces all inline SVG logo duplicates across the codebase.
// ═══════════════════════════════════════════════════════════════════

import type { CSSProperties } from 'react';

interface BadilLogoProps {
  /** Controls icon and text dimensions */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Show the "Badil" wordmark next to the icon */
  showText?: boolean;
  /** Optional subtitle rendered below the brand name */
  subtitle?: string;
  /** Additional className on the root element */
  className?: string;
  /** Inline style override */
  style?: CSSProperties;
}

const sizeMap = {
  sm: { icon: 24, svg: 14, font: '1.05rem', gap: '0.5rem' },
  md: { icon: 36, svg: 16, font: '1.1rem', gap: '0.65rem' },
  lg: { icon: 48, svg: 22, font: '1.6rem', gap: '0.75rem' },
  xl: { icon: 64, svg: 28, font: '2rem', gap: '1rem' },
};

export function BadilLogo({
  size = 'sm',
  showText = true,
  subtitle,
  className = '',
  style,
}: BadilLogoProps) {
  const s = sizeMap[size];

  return (
    <div
      className={`badil-logo badil-logo--${size} ${className}`}
      style={{ display: 'flex', alignItems: 'center', gap: s.gap, ...style }}
    >
      {/* Icon container — teal circle with dark diamond */}
      <div
        className="badil-logo__icon"
        style={{
          width: s.icon,
          height: s.icon,
          minWidth: s.icon,
          borderRadius: size === 'sm' ? 6 : '50%',
          background: 'linear-gradient(135deg, #4fd1c5, #2dd4bf)',
          display: 'grid',
          placeItems: 'center',
          transform: size === 'sm' ? 'rotate(45deg)' : 'none',
        }}
      >
        <svg
          width={s.svg}
          height={s.svg}
          viewBox="0 0 16 16"
          fill="none"
          style={{ transform: size === 'sm' ? 'rotate(-45deg)' : 'none' }}
        >
          <path d="M8 2L14 8L8 14L2 8L8 2Z" fill="#0a1414" />
        </svg>
      </div>

      {/* Wordmark */}
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
          <span
            className="badil-logo__text"
            style={{
              fontSize: s.font,
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.3px',
              lineHeight: 1.1,
            }}
          >
            Badil
          </span>
          {subtitle && (
            <span
              className="badil-logo__subtitle"
              style={{
                fontSize: '0.7rem',
                color: 'rgba(255,255,255,0.45)',
                letterSpacing: '0.2px',
                lineHeight: 1.2,
              }}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
