import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Calendar, FileText, CheckCircle2 } from 'lucide-react'
import { useDispute, useUpdateDisputeStatus, useResolveDispute } from '../../hooks/admin/useDisputes'
import { StatusBadge } from '../../components/admin/StatusBadge'
import { LoadingState } from '../../components/admin/LoadingState'
import { ErrorState } from '../../components/admin/ErrorState'

export function DisputeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: dispute, isLoading, error } = useDispute(id ?? '')
  const updateStatusMutation = useUpdateDisputeStatus()
  const resolveMutation = useResolveDispute()

  const [remarks, setRemarks] = useState('')

  if (isLoading) {
    return <LoadingState message="Loading dispute details..." className="min-h-[60vh]" />
  }

  if (error || !dispute) {
    return (
      <ErrorState 
        title="Failed to load details" 
        message="Could not retrieve the requested dispute details."
        className="min-h-[60vh]"
      />
    )
  }

  const dateStr = new Date(dispute.createdAt).toLocaleString()

  const handleInvestigate = () => {
    updateStatusMutation.mutate({ id: dispute.id, status: 1 }) // 1 = UnderInvestigation
  }

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault()
    if (!remarks.trim()) return
    resolveMutation.mutate({ id: dispute.id, remarks }, {
      onSuccess: () => navigate('/admin/disputes')
    })
  }

  return (
    <>
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="mb-6">
        <Link
          to="/admin/disputes"
          className="inline-flex items-center gap-2 text-sm text-[#00c896] hover:underline mb-4 font-medium"
        >
          <ArrowLeft size={16} />
          Back to Disputes
        </Link>
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#e8f4f4] mb-1">
              Dispute Resolution
            </h1>
            <p className="text-sm text-[#6b9090] font-mono">
              ID: {dispute.id}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={dispute.status} />
            {dispute.status === 'open' && (
              <button
                type="button"
                onClick={handleInvestigate}
                disabled={updateStatusMutation.isPending}
                className="ml-2 px-3 py-1.5 bg-[#0a1a3a] text-[#4a9eff] border border-[#1a3a6a] rounded-md font-medium text-sm hover:bg-[#1a3a6a] transition-colors disabled:opacity-50"
              >
                {updateStatusMutation.isPending ? 'Updating...' : 'Start Investigation'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Details Grid ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Info */}
        <div className="lg:col-span-1 space-y-6">
          <section className="bg-[#132020] border border-[#1f3333] rounded-lg p-5">
            <h2 className="text-sm font-semibold text-[#6b9090] uppercase tracking-wider mb-4 flex items-center gap-2">
              <FileText size={16} />
              Case Details
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-[#6b9090] mb-1">Transaction ID</p>
                <p className="text-sm text-[#e8f4f4] font-mono">{dispute.transactionId}</p>
              </div>
              <div>
                <p className="text-xs text-[#6b9090] mb-1 flex items-center gap-1"><User size={12} /> Raised By User</p>
                <p className="text-sm text-[#e8f4f4] font-mono">{dispute.raisedByUserId}</p>
              </div>
              <div>
                <p className="text-xs text-[#6b9090] mb-1 flex items-center gap-1"><Calendar size={12} /> Opened At</p>
                <p className="text-sm text-[#e8f4f4]">{dateStr}</p>
              </div>
            </div>
          </section>

          {dispute.status === 'Resolved' && dispute.adminResolutionRemarks && (
            <section className="bg-[#0a2a15] border border-[#1a4a2a] rounded-lg p-5">
              <h2 className="text-sm font-semibold text-[#00c896] uppercase tracking-wider mb-2 flex items-center gap-2">
                <CheckCircle2 size={16} />
                Resolution Remarks
              </h2>
              <p className="text-sm text-[#e8f4f4] leading-relaxed">
                {dispute.adminResolutionRemarks}
              </p>
            </section>
          )}
        </div>

        {/* Right Column: Reason & Action */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-[#132020] border border-[#1f3333] rounded-lg p-6">
            <h2 className="text-base font-semibold text-[#e8f4f4] mb-3">Dispute Reason</h2>
            <div className="p-4 bg-[#0f1a1a] border border-[#1f3333] rounded-md min-h-[100px]">
              {dispute.reason ? (
                <p className="text-sm text-[#e8f4f4] whitespace-pre-wrap leading-relaxed">{dispute.reason}</p>
              ) : (
                <p className="text-sm text-[#6b9090] italic">No detailed reason provided by the user.</p>
              )}
            </div>
          </section>

          {/* Resolution Form (only if not resolved) */}
          {dispute.status !== 'Resolved' && (
            <section className="bg-[#132020] border border-[#1f3333] rounded-lg p-6">
              <h2 className="text-base font-semibold text-[#e8f4f4] mb-1">Resolve Dispute</h2>
              <p className="text-sm text-[#6b9090] mb-4">Provide final remarks outlining the decision and any actions taken. This will mark the case as Resolved.</p>
              
              <form onSubmit={handleResolve}>
                <div className="mb-4">
                  <label htmlFor="remarks" className="block text-xs font-medium text-[#6b9090] mb-2">Resolution Remarks</label>
                  <textarea
                    id="remarks"
                    rows={4}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    required
                    placeholder="E.g., After reviewing the transaction logs..."
                    className="w-full bg-[#0f1a1a] border border-[#1f3333] rounded-lg p-3 text-sm text-[#e8f4f4] focus:outline-none focus:border-[#00c896] focus:ring-1 focus:ring-[#00c896] transition-all resize-y"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={resolveMutation.isPending || !remarks.trim()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#00c896] text-[#0f1a1a] rounded-lg font-semibold text-sm hover:bg-[#00a07a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle2 size={16} />
                    {resolveMutation.isPending ? 'Resolving...' : 'Submit Resolution'}
                  </button>
                </div>
              </form>
            </section>
          )}
        </div>
      </div>
    </>
  )
}
