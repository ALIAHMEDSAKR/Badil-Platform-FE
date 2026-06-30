// ═══════════════════════════════════════════════════════════════════
// Badil Platform — HeroSection UI Component
// Provides a full‑width hero banner with optional background image, title, subtitle, and CTA button.
// Used on Marketplace, Analytics, Settings, etc. to match the LandingPage design.
// ═══════════════════════════════════════════════════════════════════

import { ReactNode } from 'react';
import Button from './Button';
import { cn } from '../../utils/cn';

export interface HeroSectionProps {
  /** Background image URL (optional) */
  backgroundImage?: string;
  /** Main heading text */
  title: ReactNode;
  /** Optional sub‑heading / description */
  subtitle?: ReactNode;
  /** Text for the primary call‑to‑action button */
  ctaLabel?: string;
  /** Click handler for the CTA button */
  onCtaClick?: () => void;
  /** Optional secondary button label and handler */
  secondaryLabel?: string;
  onSecondaryClick?: () => void;
  /** Additional classes for the container */
  className?: string;
}

export function HeroSection({
  backgroundImage,
  title,
  subtitle,
  ctaLabel,
  onCtaClick,
  secondaryLabel,
  onSecondaryClick,
  className,
}: HeroSectionProps) {
  const bgStyle = backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {};
  return (
    <section
      className={cn(
        'relative flex flex-col items-center justify-center text-center py-20 px-4 bg-[#0f2424] text-white',
        className,
      )}
      style={bgStyle}
    >
      {/* Optional dark overlay when a background image is present */}
      {backgroundImage && (
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />
      )}
      <div className="relative z-10 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{title}</h1>
        {subtitle && (
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-prose mx-auto">{subtitle}</p>
        )}
        <div className="flex gap-4 justify-center items-center">
          {ctaLabel && (
            <Button variant="primary" size="lg" onClick={onCtaClick}>
              {ctaLabel}
            </Button>
          )}
          {secondaryLabel && (
            <Button variant="outline" size="lg" onClick={onSecondaryClick}>
              {secondaryLabel}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
