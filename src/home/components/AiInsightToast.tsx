import { Plus, ArrowRight } from 'lucide-react'

interface AiInsightToastProps {
  onClick: () => void
  visible: boolean
}

export function AiInsightToast({ onClick, visible }: AiInsightToastProps) {
  if (!visible) return null

  return (
    <button type="button" className="home-ai-toast" aria-live="polite" onClick={onClick}>
      <Plus size={16} strokeWidth={2.5} aria-hidden />
      <span className="home-ai-toast__label">AI INSIGHT</span>
      2 new matches for your HDPE search
      <ArrowRight size={16} aria-hidden />
    </button>
  )
}
