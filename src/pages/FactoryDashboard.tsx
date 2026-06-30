// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Factory Dashboard Page
// Wired to: wasteListingApi, transactionApi
// Uses: Card, Badge, DataTable atomic components
// Matches: screen5.png (Factory Dashboard)
// ═══════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ListOrdered,
  Shield,
  Leaf,
  DollarSign,
  TrendingUp,
  Filter,
  Download,
  MoreVertical,
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { DataTable, type DataTableColumn } from "../components/ui/DataTable";
import { wasteListingApi } from "../api/wasteListingApi";
import { transactionApi } from "../api/transactionApi";
import type { WasteListingDto } from "../types/wasteListing";
import type { TransactionDto } from "../types/transaction";
import type { EscrowStatusString } from "../types/enums";

// ── Stat Card ──────────────────────────────────────────────────────

interface StatItem {
  icon: typeof ListOrdered;
  iconBg: string;
  label: string;
  value: string | number;
  change: string;
  changeColor: string;
}

function StatCard({ stat }: { stat: StatItem }) {
  const Icon = stat.icon;
  return (
    <Card variant="stat" className="dashboard-card">
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-lg stat-icon-glow ${stat.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className={`text-xs font-semibold ${stat.changeColor}`}>
          <TrendingUp className="w-3 h-3 inline mr-0.5" />
          {stat.change}
        </span>
      </div>
      <p className="mt-4 text-sm text-gray-400">{stat.label}</p>
      <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
    </Card>
  );
}

// ── Escrow Status Mapping ──────────────────────────────────────────

function getStatusBadge(escrowState: EscrowStatusString) {
  const map: Record<
    EscrowStatusString,
    {
      label: string;
      variant: "teal" | "warning" | "success" | "info" | "danger";
    }
  > = {
    AwaitingDeposit: {
      label: "Awaiting Deposit",
      variant: "info",
    },
    FundsLocked: { label: "Funds Locked", variant: "teal" },
    InTransit: { label: "In Transit", variant: "teal" },
    InspectionPeriod: {
      label: "Inspection",
      variant: "warning",
    },
    FundsReleased: { label: "Completed", variant: "success" },
    Disputed: { label: "Disputed", variant: "danger" },
  };
  const entry = map[escrowState] || {
    label: "Unknown",
    variant: "info" as const,
  };
  return (
    <Badge variant={entry.variant} dot size="sm">
      {entry.label}
    </Badge>
  );
}

// ── Tab Type ───────────────────────────────────────────────────────

type Tab = "active" | "past" | "drafts";

// ── Page Component ─────────────────────────────────────────────────

export function FactoryDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("active");
  const [transactions, setTransactions] = useState<TransactionDto[]>([]);
  const [listings, setListings] = useState<WasteListingDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const [txRes, listRes] = await Promise.allSettled([
        transactionApi.getAll(),
        wasteListingApi.getAll(),
      ]);
      if (txRes.status === "fulfilled") setTransactions(txRes.value);
      if (listRes.status === "fulfilled") setListings(listRes.value);
    } catch {
      setError("Failed to load dashboard data. The backend may be offline.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Stats ──
  const stats: StatItem[] = [
    {
      icon: ListOrdered,
      iconBg: "bg-[#2dd4bf]/15 text-[#2dd4bf]",
      label: "Active Listings",
      value: listings.length || 0,
      change: "+2%",
      changeColor: "text-[#2dd4bf]",
    },
    {
      icon: Shield,
      iconBg: "bg-amber-500/15 text-amber-400",
      label: "Pending Escrow",
      value:
        transactions.filter((t) =>
          ["AwaitingDeposit", "FundsLocked", "InTransit"].includes(
            t.escrowState,
          ),
        ).length || 0,
      change: "+1 pending",
      changeColor: "text-amber-400",
    },
    {
      icon: Leaf,
      iconBg: "bg-emerald-500/15 text-emerald-400",
      label: "Total CO2 Saved",
      value: "850 tons",
      change: "+15%",
      changeColor: "text-emerald-400",
    },
    {
      icon: DollarSign,
      iconBg: "bg-[#2dd4bf]/15 text-[#2dd4bf]",
      label: "Cost Savings",
      value: "$124k",
      change: "+8%",
      changeColor: "text-[#2dd4bf]",
    },
  ];

  // ── Table Columns ──
  const columns: DataTableColumn<TransactionDto>[] = [
    {
      key: "listing",
      header: "Listing Name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#1a2e2e] flex items-center justify-center shrink-0">
            <ListOrdered className="w-4 h-4 text-gray-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-white truncate">
              Listing #{row.listingId.slice(0, 8)}
            </p>
            <p className="text-[11px] text-gray-500">
              ID: #{row.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>
      ),
      width: "min-w-[200px]",
    },
    {
      key: "buyer",
      header: "Buyer",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#2dd4bf]/20 flex items-center justify-center text-[10px] font-bold text-[#2dd4bf]">
            {row.buyerId.slice(0, 2).toUpperCase()}
          </div>
          <span className="text-sm text-gray-300 truncate">
            Buyer #{row.buyerId.slice(0, 6)}
          </span>
        </div>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (row) => (
        <span className="text-sm font-medium text-white">
          ${row.agreedPrice.toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => getStatusBadge(row.escrowState),
    },
    {
      key: "action",
      header: "Action",
      headerAlign: "center",
      render: () => (
        <div className="flex justify-center">
          <button className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-[#1a2e2e] transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // ── Tabs ──
  const tabs: { key: Tab; label: string }[] = [
    { key: "active", label: "Active Deals" },
    { key: "past", label: "Past Transactions" },
    { key: "drafts", label: "Draft Listings" },
  ];

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white dashboard-title">Factory Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">
          Overview of waste-to-resource operations
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm flex items-center justify-between">
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={fetchData}>
            Retry
          </Button>
        </div>
      )}

      {/* Deals Section */}
      <Card noPadding className="dashboard-card">
        {/* Tabs + Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-5 pt-5 pb-0 gap-4">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "text-[#2dd4bf] bg-[#2dd4bf]/10"
                    : "text-gray-400 hover:text-gray-200 hover:bg-[#1a2e2e]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Filter className="w-3.5 h-3.5" />}
            >
              Filter
            </Button>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Export
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 px-5 pb-2 dashboard-table-wrap">
          <DataTable
            columns={columns}
            data={transactions}
            rowKey={(row) => row.id}
            isLoading={isLoading}
            emptyMessage="No transactions found. Create a listing to get started."
            onRowClick={(row) => navigate(`/app/transactions/${row.id}`)}
          />
        </div>

        {/* Pagination hint */}
        {transactions.length > 0 && (
          <div className="px-5 py-3 border-t border-[var(--border)] flex items-center justify-between text-xs text-gray-500">
            <span>
              Showing 1 to {transactions.length} of {transactions.length}{" "}
              results
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
