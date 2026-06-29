import { Loader2 } from 'lucide-react'

interface LoadingStateProps {
  message?: string
  className?: string
}

export function LoadingState({ message = 'Loading...', className = '' }: LoadingStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-[#6b9090] ${className}`}>
      <Loader2 size={32} className="animate-spin mb-4 text-[#00c896]" aria-hidden="true" />
      <p className="text-sm font-medium animate-pulse">{message}</p>
    </div>
  )
}
