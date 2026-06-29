import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, Eye, Filter } from 'lucide-react'
import { useDisputes } from '../../hooks/admin/useDisputes'
import { StatusBadge } from '../../components/admin/StatusBadge'
import { LoadingState } from '../../components/admin/LoadingState'
import { ErrorState } from '../../components/admin/ErrorState'
import { EmptyState } from '../../components/admin/EmptyState'
import type { AdminDisputeStatus } from '../../types/admin'

type TabType = 'All' | AdminDisputeStatus

export function DisputesPage() {
  const { data, isLoading, error, refetch } = useDisputes()

  const [activeTab, setActiveTab] = useState<TabType>('All')
  const [searchTerm, setSearchTerm] = useState('')

  // Filter local data
  const filteredData = useMemo(() => {
    if (!data?.items) return []
    let list = data.items

    if (activeTab !== 'All') {
      list = list.filter(d => d.status === activeTab)
    }

    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase()
      list = list.filter(
        d => d.id.toLowerCase().includes(q) || d.transactionId.toLowerCase().includes(q)
      )
    }

    return list
  }, [data, activeTab, searchTerm])

  const tabs: { label: string; value: TabType }[] = [
    { label: 'All Cases', value: 'All' },
    { label: 'Open', value: 'open' },
    { label: 'Investigating', value: 'UnderInvestigation' },
    { label: 'Resolved', value: 'Resolved' },
  ]

  return (
    <>
      <header className="mb-7">
        <h1 className="text-2xl font-bold text-[#e8f4f4] mb-1">
          Dispute Mediation
        </h1>
        <p className="text-sm text-[#6b9090]">
          Manage and resolve conflicts between buyers and sellers.
        </p>
      </header>

      {/* ── Toolbar ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        {/* Tabs */}
        <div className="flex bg-[#132020] p-1 rounded-lg border border-[#1f3333] overflow-x-auto max-w-full">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`whitespace-nowrap px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
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
              placeholder="Search by ID or Txn..."
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
            <LoadingState message="Loading disputes..." />
          ) : error ? (
            <ErrorState title="Failed to load disputes" onRetry={() => refetch()} />
          ) : filteredData.length === 0 ? (
            <EmptyState 
              title={searchTerm ? 'No matches found' : 'No active disputes'} 
              message={searchTerm ? 'Try adjusting your search criteria.' : 'There are no dispute tickets matching this status.'} 
            />
          ) : (
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#0f1a1a] border-b border-[#1f3333]">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#6b9090] uppercase tracking-wider">Dispute ID</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#6b9090] uppercase tracking-wider">Transaction ID</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#6b9090] uppercase tracking-wider">Raised By</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#6b9090] uppercase tracking-wider">Date Opened</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#6b9090] uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#6b9090] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((d) => {
                  const dateStr = new Date(d.createdAt).toLocaleDateString()
                  return (
                    <tr key={d.id} className="border-b border-[#1f3333] hover:bg-[#1a2a2a] transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-[#e8f4f4] font-mono text-xs">{d.id.substring(0, 13)}...</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-[#6b9090] font-mono text-xs">{d.transactionId.substring(0, 13)}...</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-[#e8f4f4] font-mono text-xs">{d.raisedByUserId.substring(0, 13)}...</div>
                      </td>
                      <td className="px-5 py-4 text-[#e8f4f4]">{dateStr}</td>
                      <td className="px-5 py-4">
                        <StatusBadge status={d.status} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end">
                          <Link
                            to={`/admin/disputes/${d.id}`}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[#6b9090] bg-[#1a2a2a] hover:bg-[#1f3333] hover:text-[#00c896] transition-colors"
                            title="View dispute"
                            aria-label="View Dispute"
                          >
                            <Eye size={16} aria-hidden="true" />
                            <span className="text-xs font-medium">View</span>
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
    </>
  )
}
