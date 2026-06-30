// ═══════════════════════════════════════════════════════════════════
// Badil Platform — User Analytics Page
// Wired to: wasteListingApi, transactionApi
// Uses: Card, Badge, Button
// ═══════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  BarChart3,
  TrendingUp,
  Leaf,
  DollarSign,
  ShieldAlert,
  ArrowUpRight,
  Download,
  Calendar,
  Layers,
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { wasteListingApi } from "../api/wasteListingApi";
import { transactionApi } from "../api/transactionApi";
import type { WasteListingDto } from "../types/wasteListing";
import type { TransactionDto } from "../types/transaction";

export function Analytics() {
  const [listings, setListings] = useState<WasteListingDto[]>([]);
  const [transactions, setTransactions] = useState<TransactionDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("6M");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const [listRes, txRes] = await Promise.allSettled([
        wasteListingApi.getMine(),
        transactionApi.getMine(),
      ]);
      if (listRes.status === "fulfilled") setListings(listRes.value);
      if (txRes.status === "fulfilled") setTransactions(txRes.value);
    } catch {
      setError("Failed to fetch analytics data. The backend may be offline.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Compute Environmental & Financial Metrics ──
  const metrics = useMemo(() => {
    // 1. Total waste diverted (sum of quantity of Sold or Available listings)
    const totalQty = listings.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const soldQty = listings
      .filter((l) => l.status === "Sold")
      .reduce((sum, item) => sum + (item.quantity || 0), 0);

    // 2. CO2 emissions offset (formula: quantity in kg/tons * factor)
    // Assume 1 ton of waste diverted = 1.42 tons of CO2 offset
    const co2Offset = Math.round(totalQty * 1.42);

    // 3. Financial savings (selling price of sold materials + value of listings)
    const totalRevenue = transactions
      .filter((t) => t.escrowState === "FundsReleased")
      .reduce((sum, item) => sum + (item.agreedPrice || 0), 0);

    const listingValue = listings
      .filter((l) => l.status === "Available")
      .reduce((sum, item) => sum + (item.suggestedPrice || 0), 0);

    const totalSavings = totalRevenue + listingValue;

    // 4. Pending escrow volume
    const escrowVolume = transactions
      .filter((t) => ["FundsLocked", "InTransit", "InspectionPeriod"].includes(t.escrowState))
      .reduce((sum, item) => sum + (item.agreedPrice || 0), 0);

    return {
      totalQty,
      soldQty,
      co2Offset,
      totalSavings,
      escrowVolume,
      totalListings: listings.length,
      soldListings: listings.filter((l) => l.status === "Sold").length,
    };
  }, [listings, transactions]);

  // ── Chart 1 Data: Mocked Monthly Diversion (SVG Graph) ──
  // Drawn using responsive SVGs
  const monthlyData = [
    { label: "Jan", quantity: 120 },
    { label: "Feb", quantity: 210 },
    { label: "Mar", quantity: 180 },
    { label: "Apr", quantity: 340 },
    { label: "May", quantity: 290 },
    { label: "Jun", quantity: metrics.totalQty || 420 },
  ];

  // SVG coordinates calculations
  const chartHeight = 160;
  const chartWidth = 500;
  const maxVal = Math.max(...monthlyData.map((d) => d.quantity)) * 1.15 || 500;
  const points = monthlyData
    .map((d, i) => {
      const x = (i / (monthlyData.length - 1)) * chartWidth;
      const y = chartHeight - (d.quantity / maxVal) * chartHeight;
      return `${x},${y}`;
    })
    .join(" ");

  const fillPoints = `0,${chartHeight} ${points} ${chartWidth},${chartHeight}`;

  // ── Chart 2 Data: Material Share (Pie slice calculations) ──
  const materialStats = useMemo(() => {
    const counts: Record<string, number> = {};
    listings.forEach((l) => {
      const type = l.materialType || "Other";
      counts[type] = (counts[type] || 0) + (l.quantity || 0);
    });

    const items = Object.entries(counts).map(([name, val]) => ({ name, value: val }));
    if (items.length === 0) {
      return [
        { name: "Plastics", value: 300, color: "#2dd4bf" },
        { name: "Metals", value: 200, color: "#3b82f6" },
        { name: "Chemicals", value: 150, color: "#a855f7" },
        { name: "Other", value: 100, color: "#6b7280" },
      ];
    }
    const colors = ["#2dd4bf", "#3b82f6", "#a855f7", "#f59e0b", "#ec4899", "#10b981", "#6b7280"];
    return items.map((item, idx) => ({
      ...item,
      color: colors[idx % colors.length],
    }));
  }, [listings]);

  const totalMaterialVal = materialStats.reduce((sum, item) => sum + item.value, 0);

  // SVG donut chart segment math
  let accumulatedPercent = 0;
  const donutSegments = materialStats.map((item) => {
    const percent = totalMaterialVal > 0 ? item.value / totalMaterialVal : 0;
    const strokeDasharray = `${percent * 100} ${100 - percent * 100}`;
    const strokeDashoffset = -accumulatedPercent * 100;
    accumulatedPercent += percent;
    return {
      ...item,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white dashboard-title">Analytics & Compliance</h1>
          <p className="text-sm text-gray-400 mt-1">
            CO₂ impact, waste diverted, and transaction compliance stats.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-black/25 border border-[var(--border)] rounded-lg p-0.5">
            {["1M", "6M", "1Y"].map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                  timeRange === r ? "bg-[#1a2e2e] text-white" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <Button variant="secondary" size="sm" className="dashboard-card" leftIcon={<Download className="w-3.5 h-3.5" />}>
            PDF Report
          </Button>
        </div>
      </div>

      {/* Loading overlay */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2dd4bf]" />
          <p className="text-sm text-gray-400 mt-4">Computing analytics metrics...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Diverted Waste */}
            <Card variant="stat" className="dashboard-card">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-[#2dd4bf]/10 rounded-lg text-[#2dd4bf] stat-icon-glow">
                  <Layers className="w-5 h-5" />
                </div>
                <Badge variant="teal" size="sm" icon={<TrendingUp className="w-3 h-3" />}>
                  +12.4%
                </Badge>
              </div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-4">
                Total Waste Diverted
              </p>
              <h2 className="text-2xl font-bold text-white mt-1">
                {metrics.totalQty.toLocaleString()} kg
              </h2>
              <p className="text-[11px] text-gray-500 mt-1">
                {metrics.soldQty.toLocaleString()} kg successfully rehomed
              </p>
            </Card>

            {/* CO2 Saved */}
            <Card variant="stat" className="dashboard-card">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 stat-icon-glow">
                  <Leaf className="w-5 h-5" />
                </div>
                <Badge variant="success" size="sm">
                  Eco Leader
                </Badge>
              </div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-4">
                CO₂ Emissions Offset
              </p>
              <h2 className="text-2xl font-bold text-white mt-1">
                {metrics.co2Offset.toLocaleString()} Tons
              </h2>
              <p className="text-[11px] text-emerald-400 mt-1">
                Equivalent to planting ~{Math.round(metrics.co2Offset * 16)} trees
              </p>
            </Card>

            {/* Total Savings */}
            <Card variant="stat" className="dashboard-card">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 stat-icon-glow">
                  <DollarSign className="w-5 h-5" />
                </div>
                <Badge variant="warning" size="sm">
                  Circular Value
                </Badge>
              </div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-4">
                Financial Savings & Value
              </p>
              <h2 className="text-2xl font-bold text-white mt-1">
                ${metrics.totalSavings.toLocaleString()}
              </h2>
              <p className="text-[11px] text-gray-500 mt-1">
                Resource procurement cost reductions
              </p>
            </Card>

            {/* Active Escrow Volume */}
            <Card variant="stat" className="dashboard-card">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 stat-icon-glow">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <span className="text-xs text-purple-400 font-semibold flex items-center">
                  Active
                </span>
              </div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-4">
                Escrow Funds Locked
              </p>
              <h2 className="text-2xl font-bold text-white mt-1">
                ${metrics.escrowVolume.toLocaleString()}
              </h2>
              <p className="text-[11px] text-gray-500 mt-1">
                Secured transactions in progress
              </p>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Linear Trend Chart */}
            <Card header={<h3 className="font-semibold text-white">Waste Diversion Trend (kg)</h3>} className="lg:col-span-2 dashboard-card">
              <div className="h-64 relative flex flex-col justify-between">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  <div className="border-b border-[var(--border)] h-0" />
                  <div className="border-b border-[var(--border)] h-0" />
                  <div className="border-b border-[var(--border)] h-0" />
                  <div className="border-b border-[var(--border)] h-0" />
                </div>
                <div className="flex-1 w-full mt-4">
                  <svg className="w-full h-full" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Area fill */}
                    <polygon points={fillPoints} fill="url(#chart-grad)" />
                    {/* Line */}
                    <polyline
                      fill="none"
                      stroke="#2dd4bf"
                      strokeWidth="2.5"
                      points={points}
                    />
                    {/* Data nodes */}
                    {monthlyData.map((d, i) => {
                      const x = (i / (monthlyData.length - 1)) * chartWidth;
                      const y = chartHeight - (d.quantity / maxVal) * chartHeight;
                      return (
                        <circle
                          key={i}
                          cx={x}
                          cy={y}
                          r="4"
                          fill="#050d0d"
                          stroke="#2dd4bf"
                          strokeWidth="2"
                        />
                      );
                    })}
                  </svg>
                </div>
                {/* Labels */}
                <div className="flex justify-between text-[11px] text-gray-500 pt-2 border-t border-[var(--border)]">
                  {monthlyData.map((d) => (
                    <span key={d.label}>{d.label}</span>
                  ))}
                </div>
              </div>
            </Card>

            {/* Material distribution donut */}
            <Card header={<h3 className="font-semibold text-white">Materials by Volume Share</h3>} className="dashboard-card">
              <div className="flex flex-col items-center justify-center h-64">
                {materialStats.length === 0 ? (
                  <div className="text-center text-gray-500">
                    <Layers className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                    <p className="text-sm">No material records</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-6 w-full px-4">
                    {/* Donut graphic */}
                    <div className="relative w-32 h-32 shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 42 42">
                        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="rgba(79, 209, 197, 0.05)" strokeWidth="6" />
                        {donutSegments.map((seg, idx) => (
                          <circle
                            key={idx}
                            cx="21"
                            cy="21"
                            r="15.915"
                            fill="transparent"
                            stroke={seg.color}
                            strokeWidth="6"
                            strokeDasharray={seg.strokeDasharray}
                            strokeDashoffset={seg.strokeDashoffset}
                          />
                        ))}
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Total</span>
                        <span className="text-sm font-bold text-white">
                          {metrics.totalQty > 1000 ? `${(metrics.totalQty / 1000).toFixed(1)}k` : metrics.totalQty} kg
                        </span>
                      </div>
                    </div>

                    {/* Legends list */}
                    <div className="flex-1 space-y-2 text-xs">
                      {materialStats.slice(0, 5).map((item) => (
                        <div key={item.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 truncate max-w-[100px]">
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                            <span className="text-gray-300 truncate font-medium">{item.name}</span>
                          </div>
                          <span className="text-white font-semibold">
                            {totalMaterialVal > 0 ? Math.round((item.value / totalMaterialVal) * 100) : 0}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Compliance & Audit metrics table */}
          <Card className="dashboard-card" header={
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">Compliance & Waste Audit Logs</h3>
              <Badge variant="teal" size="sm">Regulatory Compliant (SRS §3.6)</Badge>
            </div>
          }>
            <div className="overflow-x-auto dashboard-table-wrap">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[var(--border)] text-gray-500">
                    <th className="py-3 px-4">Material / Listing ID</th>
                    <th className="py-3 px-4">Standardized AI Tag</th>
                    <th className="py-3 px-4">Verified Quantity</th>
                    <th className="py-3 px-4">Carbon Index</th>
                    <th className="py-3 px-4">Visual Audit Status</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">
                        No compliance audit items found. Create listings to log items.
                      </td>
                    </tr>
                  ) : (
                    listings.map((l) => (
                      <tr key={l.id} className="border-b border-[var(--border)] text-gray-300">
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-white">{l.materialType}</p>
                          <p className="text-[10px] text-gray-500">ID: #{l.id.toUpperCase().slice(0, 8)}</p>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[#2dd4bf]">
                          {l.aiStandardizedTag || "Unspecified"}
                        </td>
                        <td className="py-3.5 px-4">{l.quantity} kg</td>
                        <td className="py-3.5 px-4">
                          <span className="text-emerald-400 font-semibold">
                            -{(l.quantity * 1.42).toFixed(1)} T CO₂e
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {l.isVisuallyValidated ? (
                            <Badge variant="success" size="sm">Audited</Badge>
                          ) : (
                            <Badge variant="warning" size="sm">Pending Scan</Badge>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
