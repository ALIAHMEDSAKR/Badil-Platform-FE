// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Select Component
// Custom styled dropdown matching the dark Badil theme
// Replaces native browser select with consistent dark-teal styling
// ═══════════════════════════════════════════════════════════════════

import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

// ── Types ──────────────────────────────────────────────────────────

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  selectSize?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const sizeStyles = {
  sm: 'h-9 text-xs px-3 pr-8',
  md: 'h-11 text-sm px-4 pr-10',
  lg: 'h-13 text-base px-4 pr-10',
};

// ── Component ──────────────────────────────────────────────────────

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      placeholder,
      selectSize = 'md',
      fullWidth = true,
      className,
      id,
      ...props
    },
    ref,
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-gray-300"
          >
            {label}
          </label>
        )}

        {/* Select wrapper */}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              // Base
              'w-full rounded-lg border bg-[#0f2424] text-gray-200 appearance-none cursor-pointer',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-[#2dd4bf]/40 focus:border-[#2dd4bf]/60',
              // Border
              error
                ? 'border-red-500/60 focus:ring-red-500/30 focus:border-red-500/60'
                : 'border-[#2a4a4a] hover:border-[#3a5a5a]',
              // Size
              sizeStyles[selectSize],
              // Disabled
              'disabled:opacity-50 disabled:cursor-not-allowed',
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="bg-[#0f2424] text-gray-500">
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
                className="bg-[#0f2424] text-gray-200"
              >
                {opt.label}
              </option>
            ))}
          </select>

          {/* Custom chevron */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Error / Helper text */}
        {error && (
          <p className="text-xs text-red-400">{error}</p>
        )}
        {!error && helperText && (
          <p className="text-xs text-gray-500">{helperText}</p>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';
