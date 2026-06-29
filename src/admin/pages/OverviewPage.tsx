import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  Shield,
  AlertTriangle,
  Clock,
  Filter,
  Download,
  FileText,
  Check,
  X,
  Eye,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAdminStats } from '../../hooks/admin/useAdminStats'
import { useVerifications, useApproveVerification, useRejectVerification } from '../../hooks/admin/useVerifications'
import { useDisputes } from '../../hooks/admin/useDisputes'
import { StatCard, StatCardSkeleton } from '../../components/admin/StatCard'
import { StatusBadge } from '../../components/admin/StatusBadge'
import { LoadingState } from '../../components/admin/LoadingState'
import { ErrorState } from '../../components/admin/ErrorState'
import { EmptyState } from '../../components/admin/EmptyState'
import { RejectModal } from '../../components/admin/RejectModal'
import { exportComplianceReport } from '../../api/adminDashboardApi'
import type { AdminVerification, AdminDispute } from '../../types/admin'

export function OverviewPage() {
  const statsQuery = useAdminStats()
  const verificationsQuery = useVerifications()
  const disputesQuery = useDisputes()

  const approveMutation = useApproveVerification()
  const rejectMutation = useRejectVerification()

  const [rejectTarget, setRejectTarget] = useState<{
    id: string
    factoryName: string
  } | null>(null)

  const [isExporting, setIsExporting] = useState(false)

  async function handleExport() {
    setIsExporting(true)
    try {
      const blob = await exportComplianceReport()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `badil-compliance-${new Date().toISOString().split('T')[0]}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Report downloaded')
    } catch {
      toast.error('Failed to export report')
    } finally {
      setIsExporting(false)
    }
  }

  const recentVerifications = verificationsQuery.data?.items.slice(0, 5)
  const recentDisputes = disputesQuery.data?.items.slice(0, 5)

  return (
    <>
      {/* ── Page Header ──────────────────────────────────────── */}
      <header className="flex flex-wrap items-start justify-between gap-4 mb-7">
        <div>
          <h1 className="text-2xl font-bold text-[#e8f4f4] mb-1">
            Admin Dashboard
          </h1>
          <p className="text-sm text-[#6b9090]">
            Platform overview, pending verifications, and active disputes.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5 items-center">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold border border-[#1f3333] rounded-lg text-[#e8f4f4] bg-transparent hover:bg-[#1a2a2a] transition-colors cursor-pointer"
          >
            <Filter size={16} strokeWidth={2} aria-hidden />
            Filters
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-[#00c896] text-[#0f1a1a] hover:bg-[#00a07a] transition-colors cursor-pointer border-none disabled:opacity-60"
          >
            <Download size={16} strokeWidth={2} aria-hidden />
            {isExporting ? 'Exporting…' : 'Export Report'}
          </button>
        </div>
      </header>

      {/* ── Stat Cards ───────────────────────────────────────── */}
      <section
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-7"
        aria-label="Key metrics"
      >
        {statsQuery.isLoading || verificationsQuery.isLoading || disputesQuery.isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : statsQuery.error ? (
          <div className="col-span-full text-center py-8 text-[#6b9090]">
            <p>Failed to load statistics.</p>
            <button
              onClick={() => { statsQuery.refetch(); verificationsQuery.refetch(); disputesQuery.refetch(); }}
              className="mt-2 text-[#00c896] text-sm hover:underline bg-transparent border-none cursor-pointer"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            <StatCard
              label="Total Users"
              value={statsQuery.data?.totalUsers ?? 0}
              icon={Users}
            />
            <StatCard
              label="Total Admins"
              value={statsQuery.data?.totalAdmins ?? 0}
              icon={Shield}
              iconColor="#4a9eff"
              iconBg="rgba(74, 158, 255, 0.12)"
            />
            <StatCard
              label="Active Disputes"
              value={disputesQuery.data?.total ?? 0}
              icon={AlertTriangle}
              iconColor={(disputesQuery.data?.total ?? 0) > 0 ? '#ef4444' : undefined}
              iconBg={(disputesQuery.data?.total ?? 0) > 0 ? 'rgba(239, 68, 68, 0.12)' : undefined}
            />
            <StatCard
              label="Pending Verifications"
              value={verificationsQuery.data?.total ?? 0}
              icon={Clock}
              iconColor={(verificationsQuery.data?.total ?? 0) > 0 ? '#ffd700' : undefined}
              iconBg={(verificationsQuery.data?.total ?? 0) > 0 ? 'rgba(255, 215, 0, 0.12)' : undefined}
            />
          </>
        )}
      </section>

      {/* ── Pending Factory Verifications ─────────────────────── */}
      <VerificationsTable
        data={recentVerifications}
        isLoading={verificationsQuery.isLoading}
        error={verificationsQuery.error}
        refetch={verificationsQuery.refetch}
        onApprove={(id) => approveMutation.mutate(id)}
        onReject={(id, name) => setRejectTarget({ id, factoryName: name })}
      />

      {/* ── Active Disputes ──────────────────────────────────── */}
      <DisputesTable
        data={recentDisputes}
        isLoading={disputesQuery.isLoading}
        error={disputesQuery.error}
        refetch={disputesQuery.refetch}
      />

      {/* ── Reject Modal ─────────────────────────────────────── */}
      <RejectModal
        open={!!rejectTarget}
        factoryName={rejectTarget?.factoryName ?? ''}
        isLoading={rejectMutation.isPending}
        onClose={() => setRejectTarget(null)}
        onConfirm={(reason) => {
          if (rejectTarget) {
            rejectMutation.mutate(
              { id: rejectTarget.id, reason },
              { onSuccess: () => setRejectTarget(null) }
            )
          }
        }}
      />
    </>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   Sub-components (kept in same file — both under 60 lines)
   ═══════════════════════════════════════════════════════════════════ */

// ── Verifications Table ────────────────────────────────────────────

interface VerificationsTableProps {
  data: AdminVerification[] | undefined
  isLoading: boolean
  error: Error | null
  refetch: () => void
  onApprove: (id: string) => void
  onReject: (id: string, factoryName: string) => void
}

function VerificationsTable({ data, isLoading, error, refetch, onApprove, onReject }: VerificationsTableProps) {
  return (
    <section className="bg-[#132020] border border-[#1f3333] rounded-lg mb-6 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-[#1f3333]">
        <h2 className="text-base font-semibold text-[#e8f4f4]">
          Pending Factory Verifications
        </h2>
        <Link
          to="/admin/verifications"
          className="text-sm font-medium text-[#00c896] hover:underline"
        >
          View All History
        </Link>
      </div>

      <div className="overflow-x-auto">
        {isLoading ? (
          <LoadingState message="Loading verifications..." />
        ) : error ? (
          <ErrorState title="Failed to load verifications" onRetry={refetch} />
        ) : !data || data.length === 0 ? (
          <EmptyState title="No pending verifications" message="There are no active verification requests at this time." />

        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#0f1a1a]">
                <th scope="col" className="text-left px-4 py-3 text-xs uppercase tracking-widest text-[#6b9090] font-medium">Company ID</th>
                <th scope="col" className="text-left px-4 py-3 text-xs uppercase tracking-widest text-[#6b9090] font-medium">Document</th>
                <th scope="col" className="text-left px-4 py-3 text-xs uppercase tracking-widest text-[#6b9090] font-medium">Date</th>
                <th scope="col" className="text-left px-4 py-3 text-xs uppercase tracking-widest text-[#6b9090] font-medium">Status</th>
                <th scope="col" className="text-left px-4 py-3 text-xs uppercase tracking-widest text-[#6b9090] font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((v) => {
                const dateStr = new Date(v.createdAt).toLocaleDateString()
                return (
                <tr key={v.id} className="border-b border-[#1f3333] hover:bg-[#1a2a2a] transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-[#e8f4f4] font-mono text-xs">{v.companyId}</p>
                  </td>
                  <td className="px-4 py-3">
                    {v.documentUrls?.length > 0 ? (
                      <a
                        href={v.documentUrls[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#00c896] hover:underline font-medium"
                      >
                        <FileText size={14} strokeWidth={2} aria-hidden />
                        View Document
                      </a>
                    ) : (
                      <span className="text-[#6b9090]">No document</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[#e8f4f4]">{dateStr}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={v.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onApprove(v.id)}
                        className="p-1 rounded text-[#6b9090] hover:bg-[#0a2a15] hover:text-[#00c896] transition-colors"
                        title="Approve"
                        aria-label="Approve Verification"
                      >
                        <Check size={16} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onReject(v.id, v.companyId)}
                        className="p-1 rounded text-[#6b9090] hover:bg-[#2a0a0a] hover:text-[#ef4444] transition-colors ml-1"
                        title="Reject"
                        aria-label="Reject Verification"
                      >
                        <X size={16} aria-hidden="true" />
                      </button>
                      <Link
                        to={`/admin/verifications/${v.id}`}
                        className="p-1 rounded text-[#6b9090] hover:bg-[#1f3333] hover:text-[#e8f4f4] transition-colors ml-1"
                        title="View details"
                        aria-label="View Details"
                      >
                        <Eye size={16} aria-hidden="true" />
                      </Link>
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}

// ── Disputes Table ─────────────────────────────────────────────────

interface DisputesTableProps {
  data: AdminDispute[] | undefined
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

function DisputesTable({ data, isLoading, error, refetch }: DisputesTableProps) {
  return (
    <section className="bg-[#132020] border border-[#1f3333] rounded-lg mb-6 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-[#1f3333]">
        <h2 className="text-base font-semibold text-[#e8f4f4]">
          Active Disputes Queue
        </h2>
        <Link
          to="/admin/disputes"
          className="text-sm font-medium text-[#00c896] hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="overflow-x-auto">
        {isLoading ? (
          <LoadingState message="Loading disputes..." />
        ) : error ? (
          <ErrorState title="Failed to load disputes" onRetry={refetch} />
        ) : !data || data.length === 0 ? (
          <EmptyState title="No active disputes" message="There are no active dispute tickets at this time." />

        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#0f1a1a]">
                <th scope="col" className="text-left px-4 py-3 text-xs uppercase tracking-widest text-[#6b9090] font-medium">Dispute ID</th>
                <th scope="col" className="text-left px-4 py-3 text-xs uppercase tracking-widest text-[#6b9090] font-medium">Transaction ID</th>
                <th scope="col" className="text-left px-4 py-3 text-xs uppercase tracking-widest text-[#6b9090] font-medium">Raised By (User ID)</th>
                <th scope="col" className="text-left px-4 py-3 text-xs uppercase tracking-widest text-[#6b9090] font-medium">Opened</th>
                <th scope="col" className="text-left px-4 py-3 text-xs uppercase tracking-widest text-[#6b9090] font-medium">Status</th>
                <th scope="col" className="text-left px-4 py-3 text-xs uppercase tracking-widest text-[#6b9090] font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => {
                const dateStr = new Date(d.createdAt).toLocaleDateString()
                return (
                <tr key={d.id} className="border-b border-[#1f3333] hover:bg-[#1a2a2a] transition-colors">
                  <td className="px-4 py-3 font-semibold text-[#e8f4f4] font-mono text-xs">{d.id}</td>
                  <td className="px-4 py-3 text-[#6b9090] font-mono text-xs">{d.transactionId}</td>
                  <td className="px-4 py-3 text-[#e8f4f4] font-mono text-xs">{d.raisedByUserId}</td>
                  <td className="px-4 py-3 text-[#e8f4f4]">{dateStr}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={d.status} />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/admin/disputes/${d.id}`}
                      className="p-1.5 rounded-md text-[#6b9090] hover:bg-[#1f3333] hover:text-[#e8f4f4] transition-colors"
                      title="View dispute"
                      aria-label="View Dispute"
                    >
                      <Eye size={16} aria-hidden="true" />
                    </Link>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}

