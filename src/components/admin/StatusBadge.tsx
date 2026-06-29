import type { VerificationStatus, AdminDisputeStatus } from '../../types/admin'

type BadgeStatus = VerificationStatus | AdminDisputeStatus

const statusStyles: Record<string, string> = {
  pending:   'bg-[#2a1f00] text-[#ffd700] border border-[#b8860b]',
  reviewing: 'bg-[#0a1a3a] text-[#4a9eff] border border-[#1a3a6a]',
  approved:  'bg-[#0a2a15] text-[#00c896] border border-[#1a4a2a]',
  rejected:  'bg-[#2a0a0a] text-[#ff6b6b] border border-[#4a1a1a]',
  open:      'bg-[#2a1f00] text-[#ffd700] border border-[#b8860b]',
  underinvestigation: 'bg-[#0a1a3a] text-[#4a9eff] border border-[#1a3a6a]',
  resolved:  'bg-[#0a2a15] text-[#00c896] border border-[#1a4a2a]',
}

interface StatusBadgeProps {
  status: BadgeStatus
  className?: string
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase()
  const style = statusStyles[normalizedStatus] ?? 'bg-[#1a2a2a] text-[#6b9090] border border-[#1f3333]'
  
  // Format the label: e.g., "UnderInvestigation" -> "Under Investigation"
  const formattedLabel = status.replace(/([A-Z])/g, ' $1').trim()
  const label = formattedLabel.charAt(0).toUpperCase() + formattedLabel.slice(1)

  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium inline-flex items-center ${style} ${className}`}>
      {label}
    </span>
  )
}
