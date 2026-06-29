import { useState } from 'react'
import { X } from 'lucide-react'

interface RejectModalProps {
  open: boolean
  factoryName: string
  onClose: () => void
  onConfirm: (reason: string) => void
  isLoading?: boolean
}

export function RejectModal({ open, factoryName, onClose, onConfirm, isLoading }: RejectModalProps) {
  const [reason, setReason] = useState('')

  if (!open) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (reason.trim()) {
      onConfirm(reason.trim())
      setReason('')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Dialog */}
      <div
        className="relative bg-[#132020] border border-[#1f3333] rounded-xl shadow-2xl w-full max-w-md mx-4 p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reject-modal-title"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-[#6b9090] hover:text-[#e8f4f4] transition-colors bg-transparent border-none cursor-pointer"
          aria-label="Close dialog"
        >
          <X size={20} strokeWidth={2} />
        </button>

        <h2
          id="reject-modal-title"
          className="text-lg font-semibold text-[#e8f4f4] mb-1"
        >
          Reject Factory
        </h2>
        <p className="text-sm text-[#6b9090] mb-5">
          You are about to reject <span className="text-[#e8f4f4] font-medium">{factoryName}</span>.
          Please provide a reason.
        </p>

        <form onSubmit={handleSubmit}>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter rejection reason..."
            rows={4}
            className="w-full bg-[#1a2a2a] border border-[#1f3333] rounded-lg px-3 py-2 text-sm text-[#e8f4f4] placeholder-[#4a7070] resize-none focus:outline-none focus:ring-2 focus:ring-[#00c896] focus:border-transparent"
            required
            autoFocus
          />

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-[#6b9090] hover:text-[#e8f4f4] bg-transparent border border-[#1f3333] rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!reason.trim() || isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-[#ef4444] hover:bg-[#dc2626] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-none"
            >
              {isLoading ? 'Rejecting…' : 'Reject Factory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
