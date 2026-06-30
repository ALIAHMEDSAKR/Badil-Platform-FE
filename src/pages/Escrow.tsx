// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Escrow Management Page
// Wired to: transactionApi, wasteListingApi
// Uses: Card, Badge, Button, Modal
// ═══════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Shield,
  Clock,
  ArrowRight,
  TrendingUp,
  Tag,
  DollarSign,
  User,
  Truck,
  CheckCircle,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { transactionApi } from "../api/transactionApi";
import { wasteListingApi } from "../api/wasteListingApi";
import { useAuthStore } from "../store/authStore";
import type { TransactionDto } from "../types/transaction";
import type { WasteListingDto } from "../types/wasteListing";
import type { EscrowStatusString } from "../types/enums";

// ── Decode user ID from token helper ──
function getUserIdFromToken(token: string | null): string | null {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return (
      payload.nameid ||
      payload.sub ||
      payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
      null
    );
  } catch {
    return null;
  }
}

// ── Status Mapping Details ──
interface StatusDetail {
  label: string;
  colorClass: string;
  stepIdx: number;
}

const statusMap: Record<EscrowStatusString, StatusDetail> = {
  AwaitingDeposit: { label: "Awaiting Deposit", colorClass: "text-blue-400 bg-blue-500/10 border-blue-500/25", stepIdx: 1 },
  FundsLocked: { label: "Funds Secured / Locked", colorClass: "text-amber-400 bg-amber-500/10 border-amber-500/25", stepIdx: 2 },
  InTransit: { label: "In Transit / Shipped", colorClass: "text-teal-400 bg-[#2dd4bf]/10 border-[#2dd4bf]/25", stepIdx: 3 },
  InspectionPeriod: { label: "Inspection Period", colorClass: "text-purple-400 bg-purple-500/10 border-purple-500/25", stepIdx: 3 },
  FundsReleased: { label: "Completed / Released", colorClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25", stepIdx: 4 },
  Disputed: { label: "Disputed", colorClass: "text-red-400 bg-red-500/10 border-red-500/25", stepIdx: 3 },
};

export function Escrow() {
  const { token } = useAuthStore();
  const currentUserId = useMemo(() => getUserIdFromToken(token), [token]);

  const [transactions, setTransactions] = useState<TransactionDto[]>([]);
  const [listings, setListings] = useState<WasteListingDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const [txRes, listRes] = await Promise.allSettled([
        transactionApi.getMine(),
        wasteListingApi.getAll(), // Fetch all to map listing details
      ]);
      if (txRes.status === "fulfilled") setTransactions(txRes.value);
      if (listRes.status === "fulfilled") setListings(listRes.value);
    } catch {
      setError("Failed to fetch escrow transactions. The backend may be offline.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Map transaction to listing detail helper
  const getListingForTx = (listingId: string): WasteListingDto | undefined => {
    return listings.find((l) => l.id === listingId);
  };

  // ── Operations ──
  const handleLockFunds = async (id: string) => {
    setActionLoadingId(id);
    try {
      await transactionApi.lockFunds(id);
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, escrowState: "FundsLocked" as EscrowStatusString } : t))
      );
    } catch {
      alert("Failed to deposit funds. Please check server logs.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleConfirmShipment = async (id: string) => {
    setActionLoadingId(id);
    try {
      await transactionApi.confirmDelivery(id); // Changes to InTransit
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, escrowState: "InTransit" as EscrowStatusString } : t))
      );
    } catch {
      alert("Failed to confirm shipment. Please check server logs.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReleaseFunds = async (id: string) => {
    setActionLoadingId(id);
    try {
      await transactionApi.releaseFunds(id); // Changes to FundsReleased
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, escrowState: "FundsReleased" as EscrowStatusString } : t))
      );
    } catch {
      alert("Failed to release payment. Please check server logs.");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white dashboard-title">Escrow Deals</h1>
          <p className="text-sm text-gray-400 mt-1">
            Secure, milestone-based payments with automated verification.
          </p>
        </div>
        <Badge variant="teal" size="md" icon={<Shield className="w-4 h-4 text-[#2dd4bf]" />}>
          Verified Escrow Shield Enabled
        </Badge>
      </div>

      {/* Loading Overlay */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2dd4bf]" />
          <p className="text-sm text-gray-400 mt-4">Loading escrow contracts...</p>
        </div>
      ) : error ? (
        <div className="px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm flex items-center justify-between">
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={fetchData}>
            Retry
          </Button>
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-20 bg-black/10 border border-[var(--border)] rounded-xl">
          <Shield className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-300">No Escrow Transactions Yet</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mt-2">
            Once you purchase a resource on the marketplace or a partner accepts your listing, a secure escrow contract will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {transactions.map((tx) => {
            const listing = getListingForTx(tx.listingId);
            const isBuyer = tx.buyerId === currentUserId;
            const isSeller = tx.sellerId === currentUserId;
            const stateInfo = statusMap[tx.escrowState] || { label: tx.escrowState, colorClass: "text-gray-400 bg-gray-800/30", stepIdx: 1 };

            return (
              <Card key={tx.id} noPadding className="dashboard-card overflow-hidden">
                {/* Top header strip */}
                <div className="px-5 py-4 bg-black/10 border-b border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs text-gray-500">
                      CONTRACT: <strong className="text-gray-300 font-mono">#{tx.id.toUpperCase().slice(0, 8)}</strong>
                    </span>
                    <span className="text-xs text-gray-600">•</span>
                    <span className="text-xs text-gray-500">
                      DATE: <strong className="text-gray-300">{new Date(tx.createdAt).toLocaleDateString()}</strong>
                    </span>
                    <span className="text-xs text-gray-600">•</span>
                    {isBuyer && (
                      <Badge variant="info" size="sm" icon={<User className="w-3 h-3" />}>
                        My Role: Buyer
                      </Badge>
                    )}
                    {isSeller && (
                      <Badge variant="purple" size="sm" icon={<User className="w-3 h-3" />}>
                        My Role: Seller
                      </Badge>
                    )}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${stateInfo.colorClass}`}>
                    {stateInfo.label}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Material listing summary */}
                  <div className="lg:col-span-5 flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-black/20 flex items-center justify-center shrink-0 border border-[var(--border)]">
                      {listing?.imageUrls?.[0] ? (
                        <img src={listing.imageUrls[0]} alt="Listing" className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <Tag className="w-6 h-6 text-[#2dd4bf]" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-base">
                        {listing?.materialType || "Unknown Resource"}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1 max-w-sm truncate">
                        {listing?.description || "No specifications loaded."}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-gray-500">
                          QTY: <strong className="text-gray-300">{listing?.quantity || tx.agreedPrice / 10} kg</strong>
                        </span>
                        <span className="text-xs text-gray-600">|</span>
                        <span className="text-xs text-gray-500">
                          Deal Value: <strong className="text-teal-400 font-semibold">${tx.agreedPrice.toLocaleString()}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Flow Steps Progress */}
                  <div className="lg:col-span-7 flex flex-col justify-center">
                    <div className="relative flex items-center justify-between w-full">
                      {/* Line connector background */}
                      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-black/40 z-0" />
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#2dd4bf] z-0 transition-all duration-300"
                        style={{
                          width: `${((stateInfo.stepIdx - 1) / 3) * 100}%`,
                        }}
                      />

                      {/* Step 1: Deposit */}
                      <div className="relative z-10 flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center border text-xs font-bold transition-colors ${stateInfo.stepIdx >= 1
                              ? "bg-[#2dd4bf] text-[#0b1a1a] border-[#2dd4bf]"
                              : "bg-[#0a1414] text-gray-500 border-[var(--border)]"
                            }`}
                        >
                          1
                        </div>
                        <span className="text-[10px] text-gray-500 font-medium mt-1">Awaiting Deposit</span>
                      </div>

                      {/* Step 2: Secured */}
                      <div className="relative z-10 flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center border text-xs font-bold transition-colors ${stateInfo.stepIdx >= 2
                              ? "bg-[#2dd4bf] text-[#0b1a1a] border-[#2dd4bf]"
                              : "bg-[#0a1414] text-gray-500 border-[var(--border)]"
                            }`}
                        >
                          2
                        </div>
                        <span className="text-[10px] text-gray-500 font-medium mt-1">Funds Locked</span>
                      </div>

                      {/* Step 3: Transit */}
                      <div className="relative z-10 flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center border text-xs font-bold transition-colors ${stateInfo.stepIdx >= 3
                              ? "bg-[#2dd4bf] text-[#0b1a1a] border-[#2dd4bf]"
                              : "bg-[#0a1414] text-gray-500 border-[var(--border)]"
                            }`}
                        >
                          3
                        </div>
                        <span className="text-[10px] text-gray-500 font-medium mt-1">In Transit</span>
                      </div>

                      {/* Step 4: Released */}
                      <div className="relative z-10 flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center border text-xs font-bold transition-colors ${stateInfo.stepIdx >= 4
                              ? "bg-emerald-500 text-[#0b1a1a] border-emerald-500"
                              : "bg-[#0a1414] text-gray-500 border-[var(--border)]"
                            }`}
                        >
                          ✓
                        </div>
                        <span className="text-[10px] text-gray-500 font-medium mt-1">Completed</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom action panel */}
                <div className="px-5 py-3.5 bg-black/10 border-t border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {tx.escrowState === "AwaitingDeposit" && isBuyer && "Payment required to lock the materials."}
                      {tx.escrowState === "AwaitingDeposit" && isSeller && "Waiting for the buyer to deposit secure funds."}
                      {tx.escrowState === "FundsLocked" && isBuyer && "Secure funds locked in escrow. Waiting for shipment."}
                      {tx.escrowState === "FundsLocked" && isSeller && "Buyer deposited funds. Please dispatch the material."}
                      {tx.escrowState === "InTransit" && isBuyer && "Material is shipped. Release payment upon audit verification."}
                      {tx.escrowState === "InTransit" && isSeller && "Shipment logged. Waiting for buyer to release funds."}
                      {tx.escrowState === "FundsReleased" && "Transaction completed successfully."}
                    </span>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    {/* Buyer: Deposit funds */}
                    {tx.escrowState === "AwaitingDeposit" && isBuyer && (
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<DollarSign className="w-3.5 h-3.5" />}
                        isLoading={actionLoadingId === tx.id}
                        className="btn-primary-gradient"
                        onClick={() => handleLockFunds(tx.id)}
                      >
                        Lock & Secure Funds
                      </Button>
                    )}

                    {/* Seller: Mark as shipped */}
                    {tx.escrowState === "FundsLocked" && isSeller && (
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<Truck className="w-3.5 h-3.5" />}
                        isLoading={actionLoadingId === tx.id}
                        className="btn-primary-gradient"
                        onClick={() => handleConfirmShipment(tx.id)}
                      >
                        Confirm Dispatch & Ship
                      </Button>
                    )}

                    {/* Buyer: Release funds */}
                    {(tx.escrowState === "InTransit" || tx.escrowState === "InspectionPeriod") && isBuyer && (
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
                        isLoading={actionLoadingId === tx.id}
                        className="btn-primary-gradient"
                        onClick={() => handleReleaseFunds(tx.id)}
                      >
                        Release Payment
                      </Button>
                    )}

                    {/* Dispute ticket request option */}
                    {["FundsLocked", "InTransit", "InspectionPeriod"].includes(tx.escrowState) && (
                      <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                        Dispute Deal
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
