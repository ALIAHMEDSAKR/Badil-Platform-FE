import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, X, FileText, Download } from 'lucide-react'
import { useVerification, useApproveVerification, useRejectVerification } from '../../hooks/admin/useVerifications'
import { StatusBadge } from '../../components/admin/StatusBadge'
import { RejectModal } from '../../components/admin/RejectModal'
import { LoadingState } from '../../components/admin/LoadingState'
import { ErrorState } from '../../components/admin/ErrorState'

export function VerificationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: verification, isLoading, error } = useVerification(id ?? '')
  const approveMutation = useApproveVerification()
  const rejectMutation = useRejectVerification()

  const [rejectTarget, setRejectTarget] = useState<{ id: string; companyId: string } | null>(null)

  if (isLoading) {
    return <LoadingState message="Loading verification details..." className="min-h-[60vh]" />
  }

  if (error || !verification) {
    return (
      <ErrorState 
        title="Failed to load details" 
        message="Could not retrieve the requested verification details."
        className="min-h-[60vh]"
      />
    )
  }

  const dateStr = new Date(verification.createdAt).toLocaleString()

  return (
    <>
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="mb-6">
        <Link
          to="/admin/verifications"
          className="inline-flex items-center gap-2 text-sm text-[#00c896] hover:underline mb-4 font-medium"
        >
          <ArrowLeft size={16} />
          Back to Verifications
        </Link>
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#e8f4f4] mb-1">
              Verification Request
            </h1>
            <p className="text-sm text-[#6b9090] font-mono">
              ID: {verification.id}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={verification.status} />
            {verification.status === 'Pending' && (
              <div className="flex items-center gap-2 ml-2">
                <button
                  type="button"
                  onClick={() => approveMutation.mutate(verification.id, {
                    onSuccess: () => navigate('/admin/verifications')
                  })}
                  disabled={approveMutation.isPending}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0a2a15] text-[#00c896] border border-[#1a4a2a] rounded-md font-medium text-sm hover:bg-[#1a4a2a] transition-colors disabled:opacity-50"
                  aria-label="Approve Verification"
                >
                  <Check size={16} aria-hidden="true" />
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => setRejectTarget({ id: verification.id, companyId: verification.companyId })}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2a0a0a] text-[#ef4444] border border-[#4a1a1a] rounded-md font-medium text-sm hover:bg-[#4a1a1a] transition-colors"
                  aria-label="Reject Verification"
                >
                  <X size={16} aria-hidden="true" />
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Details Grid ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <section className="bg-[#132020] border border-[#1f3333] rounded-lg p-5">
            <h2 className="text-sm font-semibold text-[#6b9090] uppercase tracking-wider mb-4">Request Info</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-[#6b9090] mb-1">Company ID</p>
                <p className="text-sm text-[#e8f4f4] font-mono">{verification.companyId}</p>
              </div>
              <div>
                <p className="text-xs text-[#6b9090] mb-1">Submitted At</p>
                <p className="text-sm text-[#e8f4f4]">{dateStr}</p>
              </div>
              {verification.reviewedByAdminId && (
                <div>
                  <p className="text-xs text-[#6b9090] mb-1">Reviewed By Admin</p>
                  <p className="text-sm text-[#e8f4f4] font-mono">{verification.reviewedByAdminId}</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Documents Area */}
        <div className="lg:col-span-2">
          <section className="bg-[#132020] border border-[#1f3333] rounded-lg p-5 min-h-[400px]">
            <h2 className="text-sm font-semibold text-[#6b9090] uppercase tracking-wider mb-4">Submitted Documents</h2>
            
            {verification.documentUrls && verification.documentUrls.length > 0 ? (
              <div className="space-y-6">
                {verification.documentUrls.map((url, idx) => {
                  const isImage = url.match(/\.(jpeg|jpg|gif|png)$/i) !== null
                  return (
                    <div key={idx} className="border border-[#1f3333] rounded-lg overflow-hidden bg-[#0f1a1a]">
                      <div className="flex items-center justify-between p-3 border-b border-[#1f3333] bg-[#1a2a2a]">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-[#6b9090]" />
                          <span className="text-sm text-[#e8f4f4] font-medium">Document {idx + 1}</span>
                        </div>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-medium text-[#00c896] hover:underline"
                        >
                          <Download size={14} />
                          Download
                        </a>
                      </div>
                      <div className="p-4 flex items-center justify-center min-h-[300px] bg-[#0f1a1a]">
                        {isImage ? (
                          <img src={url} alt={`Document ${idx + 1} for company ${verification.companyId}`} className="max-w-full max-h-[600px] object-contain rounded" />
                        ) : (
                          <iframe src={url} className="w-full h-[500px] border-0 rounded" title={`Document ${idx + 1}`} />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText size={48} className="mx-auto text-[#1f3333] mb-3" />
                <p className="text-[#6b9090]">No documents provided for this request.</p>
              </div>
            )}
          </section>
        </div>
      </div>

      <RejectModal
        open={!!rejectTarget}
        factoryName={`Company ${rejectTarget?.companyId ?? ''}`}
        isLoading={rejectMutation.isPending}
        onClose={() => setRejectTarget(null)}
        onConfirm={(reason) => {
          if (rejectTarget) {
            rejectMutation.mutate(
              { id: rejectTarget.id, reason },
              { onSuccess: () => { setRejectTarget(null); navigate('/admin/verifications') } }
            )
          }
        }}
      />
    </>
  )
}
