// ═══════════════════════════════════════════════════════════════════
// Badil Platform — DataTable Component
// Reusable table for transaction lists, verification boards, user mgmt
// Matches the dark-bordered tables from screens 5 and 8
// ═══════════════════════════════════════════════════════════════════

import { type ReactNode } from 'react';
import { cn } from '../../utils/cn';

// ── Types ──────────────────────────────────────────────────────────

export interface DataTableColumn<T> {
  /** Unique key for the column */
  key: string;
  /** Column header label */
  header: string;
  /** Render function for cell content */
  render: (row: T, index: number) => ReactNode;
  /** Header alignment */
  headerAlign?: 'left' | 'center' | 'right';
  /** Column width class (e.g., 'w-48', 'min-w-[200px]') */
  width?: string;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  /** Unique key extractor for each row */
  rowKey: (row: T, index: number) => string;
  /** Loading state */
  isLoading?: boolean;
  /** Custom empty state message */
  emptyMessage?: string;
  /** Click handler for a row */
  onRowClick?: (row: T, index: number) => void;
  /** Additional wrapper class */
  className?: string;
}

// ── Component ──────────────────────────────────────────────────────

export function DataTable<T>({
  columns,
  data,
  rowKey,
  isLoading = false,
  emptyMessage = 'No data available',
  onRowClick,
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      <table className="w-full border-collapse">
        {/* ── Head ── */}
        <thead>
          <tr className="border-b border-[#1e3a3a]">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500',
                  col.width,
                  col.headerAlign === 'center' && 'text-center',
                  col.headerAlign === 'right' && 'text-right',
                  col.headerAlign !== 'center' && col.headerAlign !== 'right' && 'text-left',
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* ── Body ── */}
        <tbody>
          {isLoading ? (
            // Loading skeleton rows
            Array.from({ length: 4 }).map((_, i) => (
              <tr key={`skeleton-${i}`} className="border-b border-[#1e3a3a]/50">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-4">
                    <div className="h-4 bg-[#1a2e2e] rounded animate-pulse" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            // Empty state
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-sm text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            // Data rows
            data.map((row, index) => (
              <tr
                key={rowKey(row, index)}
                onClick={() => onRowClick?.(row, index)}
                className={cn(
                  'border-b border-[#1e3a3a]/50 transition-colors duration-150',
                  'hover:bg-[#1a2e2e]/50',
                  onRowClick && 'cursor-pointer',
                )}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3.5 text-sm text-gray-300">
                    {col.render(row, index)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
