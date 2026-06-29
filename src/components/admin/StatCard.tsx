import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: number | string
  icon: LucideIcon
  /** Override icon container colors for tinted cards (e.g. red for disputes) */
  iconColor?: string
  iconBg?: string
}

/** Skeleton placeholder shown while stat data is loading */
export function StatCardSkeleton() {
  return (
    <article className="bg-[#132020] border border-[#1f3333] rounded-lg p-5 animate-pulse">
      <div className="w-9 h-9 rounded-lg bg-[#1a2a2a] mb-3" />
      <div className="h-3 w-20 bg-[#1a2a2a] rounded mb-3" />
      <div className="h-8 w-16 bg-[#1a2a2a] rounded" />
    </article>
  )
}

export function StatCard({ label, value, icon: Icon, iconColor, iconBg }: StatCardProps) {
  return (
    <article className="bg-[#132020] border border-[#1f3333] rounded-lg p-5">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
        style={{
          color: iconColor ?? '#00c896',
          backgroundColor: iconBg ?? 'rgba(0, 200, 150, 0.12)',
        }}
      >
        <Icon size={20} strokeWidth={2} />
      </div>
      <p className="text-sm text-[#6b9090]">{label}</p>
      <p className="text-3xl font-bold text-[#e8f4f4] mt-2">{value}</p>
    </article>
  )
}
