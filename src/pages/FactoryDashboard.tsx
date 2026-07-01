// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Factory Dashboard Page (Unified Tabs)
// Wired to: wasteListingApi, materialRequestApi, transactionApi
// ═══════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Leaf,
  DollarSign,
  Filter,
  Download,
  MoreVertical,
  Briefcase,
  ShoppingCart
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { DataTable, type DataTableColumn } from "../components/ui/DataTable";
import { wasteListingApi } from "../api/wasteListingApi";
import { materialRequestApi } from "../api/materialRequestApi";
import { transactionApi } from "../api/transactionApi";
import { useAuthStore } from "../store/authStore";
import type { WasteListingDto } from "../types/wasteListing";
import type { MaterialRequestDto } from "../types/materialRequest";
import type { TransactionDto } from "../types/transaction";
import type { EscrowStatusString } from "../types/enums";

type Tab = "seller" | "buyer";

function getStatusBadge(escrowState: EscrowStatusString) {
  const map: Record<EscrowStatusString, { label: string; variant: "teal" | "warning" | "success" | "info" | "danger" }> = {
    AwaitingDeposit: { label: "Awaiting Deposit", variant: "info" },
    FundsLocked: { label: "Funds Locked", variant: "teal" },
    InTransit: { label: "In Transit", variant: "teal" },
    InspectionPeriod: { label: "Inspection", variant: "warning" },
    FundsReleased: { label: "Completed", variant: "success" },
    Disputed: { label: "Disputed", variant: "danger" },
  };
  const entry = map[escrowState] || { label: "Unknown", variant: "info" as const };
  return <Badge variant={entry.variant} dot size="sm">{entry.label}</Badge>;
}

export function FactoryDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>("seller");
  
  const [transactions, setTransactions] = useState<TransactionDto[]>([]);
  const [listings, setListings] = useState<WasteListingDto[]>([]);
  const [requests, setRequests] = useState<MaterialRequestDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const [txRes, listRes, reqRes] = await Promise.allSettled([
        transactionApi.getMine(),
        wasteListingApi.getMine(),
        materialRequestApi.getMine(),
      ]);
      if (txRes.status === "fulfilled") setTransactions(txRes.value);
      if (listRes.status === "fulfilled") setListings(listRes.value);
      if (reqRes.status === "fulfilled") setRequests(reqRes.value);
    } catch {
      setError("Failed to load dashboard data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Seller = user is the seller in the transaction
  const sellerTransactions = useMemo(() => {
    if (!user) return [];
    return transactions.filter(t => t.sellerId === user.id);
  }, [transactions, user]);

  // Buyer = user is the buyer in the transaction
  const buyerTransactions = useMemo(() => {
    if (!user) return [];
    return transactions.filter(t => t.buyerId === user.id);
  }, [transactions, user]);

  const activeTransactions = activeTab === "seller" ? sellerTransactions : buyerTransactions;

  // ── Stats ──
  const sellerStats = [
    {
      icon: Briefcase,
      iconBg: "bg-[#2dd4bf]/15 text-[#2dd4bf]",
      label: "My Active Listings",
      value: listings.filter(l => l.status === "Available").length,
      change: "Items for sale",
      changeColor: "text-[#2dd4bf]",
    },
    {
      icon: Shield,
      iconBg: "bg-amber-500/15 text-amber-400",
      label: "Pending Sales (Escrow)",
      value: sellerTransactions.filter(t => ["AwaitingDeposit", "FundsLocked", "InTransit"].includes(t.escrowState)).length,
      change: "Active deals",
      changeColor: "text-amber-400",
    },
    {
      icon: DollarSign,
      iconBg: "bg-emerald-500/15 text-emerald-400",
      label: "Total Revenue",
      value: "$" + sellerTransactions.filter(t => t.escrowState === "FundsReleased").reduce((acc, t) => acc + t.agreedPrice, 0).toLocaleString(),
      change: "Completed sales",
      changeColor: "text-emerald-400",
    },
    {
      icon: Leaf,
      iconBg: "bg-[#2dd4bf]/15 text-[#2dd4bf]",
      label: "Waste Diverted",
      value: listings.reduce((acc, l) => acc + l.quantity, 0) + " units",
      change: "Total posted",
      changeColor: "text-[#2dd4bf]",
    },
  ];

  const buyerStats = [
    {
      icon: ShoppingCart,
      iconBg: "bg-[#2dd4bf]/15 text-[#2dd4bf]",
      label: "My Active Requests",
      value: requests.length,
      change: "Items needed",
      changeColor: "text-[#2dd4bf]",
    },
    {
      icon: Shield,
      iconBg: "bg-amber-500/15 text-amber-400",
      label: "Pending Purchases",
      value: buyerTransactions.filter(t => ["AwaitingDeposit", "FundsLocked", "InTransit"].includes(t.escrowState)).length,
      change: "Active deals",
      changeColor: "text-amber-400",
    },
    {
      icon: DollarSign,
      iconBg: "bg-emerald-500/15 text-emerald-400",
      label: "Total Spent",
      value: "$" + buyerTransactions.filter(t => t.escrowState === "FundsReleased").reduce((acc, t) => acc + t.agreedPrice, 0).toLocaleString(),
      change: "Completed purchases",
      changeColor: "text-emerald-400",
    },
    {
      icon: Leaf,
      iconBg: "bg-[#2dd4bf]/15 text-[#2dd4bf]",
      label: "Resources Sourced",
      value: requests.reduce((acc, r) => acc + r.targetQuantity, 0) + " units",
      change: "Total requested",
      changeColor: "text-[#2dd4bf]",
    },
  ];

  const stats = activeTab === "seller" ? sellerStats : buyerStats;

  // ── Table Columns ──
  const columns: DataTableColumn<TransactionDto>[] = [
    {
      key: "id",
      header: "Deal ID",
      render: (row) => (
        <span className="text-sm font-medium text-white truncate">
          #{row.id.slice(0, 8).toUpperCase()}
        </span>
      ),
    },
    {
      key: "counterparty",
      header: activeTab === "seller" ? "Buyer" : "Seller",
      render: (row) => {
        const id = activeTab === "seller" ? row.buyerId : row.sellerId;
        return (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#2dd4bf]/20 flex items-center justify-center text-[10px] font-bold text-[#2dd4bf]">
              {id.slice(0, 2).toUpperCase()}
            </div>
            <span className="text-sm text-gray-300 truncate">
              User #{id.slice(0, 6)}
            </span>
          </div>
        );
      },
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

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white dashboard-title">Factory Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">
          Unified overview of your sales and purchases
        </p>
      </div>

      {/* Unified Tabs */}
      <div className="flex border-b border-[var(--border)] mb-8">
        <button
          onClick={() => setActiveTab("seller")}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "seller"
              ? "border-[#2dd4bf] text-[#2dd4bf]"
              : "border-transparent text-gray-400 hover:text-gray-200"
          }`}
        >
          Seller View
        </button>
        <button
          onClick={() => setActiveTab("buyer")}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "buyer"
              ? "border-[#2dd4bf] text-[#2dd4bf]"
              : "border-transparent text-gray-400 hover:text-gray-200"
          }`}
        >
          Buyer View
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} variant="stat" className="dashboard-card">
            <div className="flex items-start justify-between">
              <div className={`p-2.5 rounded-lg stat-icon-glow ${stat.iconBg}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-semibold ${stat.changeColor}`}>
                {stat.change}
              </span>
            </div>
            <p className="mt-4 text-sm text-gray-400">{stat.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
          </Card>
        ))}
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm flex items-center justify-between">
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={fetchData}>
            Retry
          </Button>
        </div>
      )}

      <Card noPadding className="dashboard-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-5 pt-5 pb-0 gap-4">
          <h2 className="text-lg font-semibold text-white">
            {activeTab === "seller" ? "My Sales (Escrow)" : "My Purchases (Escrow)"}
          </h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" leftIcon={<Filter className="w-3.5 h-3.5" />}>
              Filter
            </Button>
            <Button variant="ghost" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>
              Export
            </Button>
          </div>
        </div>

        <div className="mt-4 px-5 pb-2 dashboard-table-wrap">
          <DataTable
            columns={columns}
            data={activeTransactions}
            rowKey={(row) => row.id}
            isLoading={isLoading}
            emptyMessage={activeTab === "seller" ? "No sales yet." : "No purchases yet."}
            onRowClick={(row) => navigate(`/app/transactions/${row.id}`)}
          />
        </div>
      </Card>
    </div>
  );
}
