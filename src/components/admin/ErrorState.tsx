import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({ 
  title = 'Something went wrong', 
  message = 'Failed to load data. Please try again.', 
  onRetry,
  className = ''
}: ErrorStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center ${className}`}>
      <div className="w-16 h-16 rounded-full bg-[#2a0a0a] flex items-center justify-center mb-4">
        <AlertTriangle size={32} className="text-[#ef4444]" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-[#e8f4f4] mb-2">{title}</h3>
      <p className="text-sm text-[#6b9090] max-w-md mb-6">{message}</p>
      
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-[#1f3333] hover:bg-[#2a4a4a] text-[#e8f4f4] rounded-lg font-medium text-sm transition-colors"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      )}
    </div>
  )
}
