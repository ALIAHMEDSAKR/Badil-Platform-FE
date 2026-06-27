// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Class Name Utility
// Merges Tailwind classes safely (handles conflicts like `p-2 p-4`)
// Usage: cn('base-class', conditional && 'active-class', className)
// ═══════════════════════════════════════════════════════════════════

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
