import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, Eye, Filter, Check, X } from 'lucide-react'
import { useVerifications, useApproveVerification, useRejectVerification } from '../../hooks/admin/useVerifications'
import { StatusBadge } from '../../components/admin/StatusBadge'
import { RejectModal } from '../../components/admin/RejectModal'
import { LoadingState } from '../../components/admin/LoadingState'
import { ErrorState } from '../../components/admin/ErrorState'
import { EmptyState } from '../../components/admin/EmptyState'
import type { VerificationStatus } from '../../types/admin'

type TabType = 'All' | VerificationStatus

export function VerificationsPage() {
  const { data, isLoading, error, refetch } = useVerifications()
  const approveMutation = useApproveVerification()
  const rejectMutation = useRejectVerification()

  const [activeTab, setActiveTab] = useState<TabType>('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [rejectTarget, setRejectTarget] = useState<{
    id: string
    companyId: string
  } | null>(null)

  // Filter local data since API doesn't support query filters right now
  const filteredData = useMemo(() => {
    if (!data?.items) return []
    let list = data.items

    if (activeTab !== 'All') {
      list = list.filter(v => v.status === activeTab)
    }

    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase()
      list = list.filter(v => v.companyId.toLowerCase().includes(q) || v.id.toLowerCase().includes(q))
    }

    return list
  }, [data, activeTab, searchTerm])

  const tabs: { label: string; value: TabType }[] = [
    { label: 'All Requests', value: 'All' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Approved', value: 'Approved' },
    { label: 'Rejected', value: 'Rejected' },
  ]

  return (
    <>
      <header className="mb-7">
        <h1 className="text-2xl font-bold text-[#e8f4f4] mb-1">
          Factory Verifications
        </h1>
        <p className="text-sm text-[#6b9090]">
          Review submitted compliance documents and verify factory profiles.
        </p>
      </header>

      {/* ── Toolbar ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        {/* Tabs */}
        <div className="flex bg-[#132020] p-1 rounded-lg border border-[#1f3333]">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.value
                  ? 'bg-[#1a2a2a] text-[#00c896] shadow-sm'
                  : 'text-[#6b9090] hover:text-[#e8f4f4] hover:bg-[#1a2a2a]/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b9090]"
            />
            <input
              type="text"
              placeholder="Search by Company ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#132020] border border-[#1f3333] text-[#e8f4f4] text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-[#00c896] focus:ring-1 focus:ring-[#00c896] transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-[#132020] border border-[#1f3333] rounded-lg text-[#e8f4f4] text-sm hover:bg-[#1a2a2a] transition-colors">
            <Filter size={16} />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────────────── */}
      <section className="bg-[#132020] border border-[#1f3333] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <LoadingState message="Loading verifications..." />
          ) : error ? (
            <ErrorState title="Failed to load verifications" onRetry={() => refetch()} />
          ) : filteredData.length === 0 ? (
            <EmptyState 
              title={searchTerm ? 'No matches found' : 'No verifications'} 
              message={searchTerm ? 'Try adjusting your search filters.' : 'There are no verification requests in this queue.'} 
            />
          ) : (
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#0f1a1a] border-b border-[#1f3333]">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#6b9090] uppercase tracking-wider">Company ID</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#6b9090] uppercase tracking-wider">Submitted</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#6b9090] uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#6b9090] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((v) => {
                  const dateStr = new Date(v.createdAt).toLocaleDateString()
                  return (
                    <tr key={v.id} className="border-b border-[#1f3333] hover:bg-[#1a2a2a] transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-medium text-[#e8f4f4] font-mono text-sm">{v.companyId}</div>
                        <div className="text-xs text-[#6b9090] font-mono mt-1">Req ID: {v.id.substring(0, 8)}...</div>
                      </td>
                      <td className="px-5 py-4 text-[#e8f4f4]">{dateStr}</td>
                      <td className="px-5 py-4">
                        <StatusBadge status={v.status} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {v.status === 'Pending' && (
                            <>
                              <button
                                type="button"
                                onClick={() => approveMutation.mutate(v.id)}
                                className="p-1.5 rounded-md text-[#6b9090] hover:bg-[#0a2a15] hover:text-[#00c896] transition-colors"
                                title="Approve"
                                aria-label="Approve Verification"
                              >
                                <Check size={18} aria-hidden="true" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setRejectTarget({ id: v.id, companyId: v.companyId })}
                                className="p-1.5 rounded-md text-[#6b9090] hover:bg-[#2a0a0a] hover:text-[#ef4444] transition-colors"
                                title="Reject"
                                aria-label="Reject Verification"
                              >
                                <X size={18} aria-hidden="true" />
                              </button>
                            </>
                          )}
                          <Link
                            to={`/admin/verifications/${v.id}`}
                            className="p-1.5 rounded-md text-[#6b9090] hover:bg-[#1f3333] hover:text-[#e8f4f4] transition-colors ml-2"
                            title="View details"
                            aria-label="View Details"
                          >
                            <Eye size={18} aria-hidden="true" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* ── Reject Modal ─────────────────────────────────────── */}
      <RejectModal
        open={!!rejectTarget}
        factoryName={`Company ${rejectTarget?.companyId ?? ''}`}
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
