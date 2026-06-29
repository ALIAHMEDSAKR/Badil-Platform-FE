import { type LucideIcon, SearchX } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  message?: string
  icon?: LucideIcon
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ 
  title = 'No Results Found', 
  message = 'We couldn\'t find any records matching your criteria.',
  icon: Icon = SearchX,
  action,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-16 text-center ${className}`}>
      <div className="w-20 h-20 rounded-full bg-[#132020] border border-[#1f3333] flex items-center justify-center mb-5">
        <Icon size={36} className="text-[#6b9090] opacity-50" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-[#e8f4f4] mb-2">{title}</h3>
      <p className="text-sm text-[#6b9090] max-w-sm mb-6">{message}</p>
      
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  )
}
