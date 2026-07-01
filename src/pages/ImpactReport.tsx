import { useState, useEffect, useCallback, useMemo } from "react";
import { 
  Leaf, 
  Wind, 
  DollarSign, 
  TrendingUp, 
  Download,
  Calendar,
  BarChart3
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { transactionApi } from "../api/transactionApi";
import { wasteListingApi } from "../api/wasteListingApi";
import { useAuthStore } from "../store/authStore";
import type { TransactionDto } from "../types/transaction";
import type { WasteListingDto } from "../types/wasteListing";

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

export function ImpactReport() {
  const { token } = useAuthStore();
  const currentUserId = getUserIdFromToken(token);

  const [transactions, setTransactions] = useState<TransactionDto[]>([]);
  const [listings, setListings] = useState<WasteListingDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const [txRes, listRes] = await Promise.allSettled([
        transactionApi.getMine(),
        wasteListingApi.getAll()
      ]);

      if (txRes.status === "fulfilled") setTransactions(txRes.value);
      if (listRes.status === "fulfilled") setListings(listRes.value);
    } catch {
      setError("Failed to load impact report data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Aggregate metrics
  const metrics = useMemo(() => {
    let totalWasteKg = 0;
    let totalValue = 0;

    // We only count Completed (FundsReleased) transactions where user is Seller (they diverted the waste)
    const completedSales = transactions.filter(
      t => t.sellerId === currentUserId && t.escrowState === "FundsReleased"
    );

    completedSales.forEach(tx => {
      totalValue += tx.agreedPrice;
      const listing = listings.find(l => l.id === tx.listingId);
      if (listing) {
        totalWasteKg += listing.quantity; // Assuming listing quantity is in kg
      } else {
        // fallback estimate based on price if listing is gone
        totalWasteKg += (tx.agreedPrice / 10);
      }
    });

    const wasteTons = totalWasteKg / 1000;
    const co2Tons = wasteTons * 0.8; // standard proxy: 1 ton waste = 0.8 ton CO2 saved

    return {
      wasteTons: wasteTons.toFixed(2),
      co2Tons: co2Tons.toFixed(2),
      totalValue: totalValue.toLocaleString()
    };
  }, [transactions, listings, currentUserId]);

  // Generate chart data (group by month)
  const chartData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = new Date().getMonth();
    
    // Create an array for the last 6 months
    const data = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date();
      d.setMonth(currentMonth - (5 - i));
      return {
        label: months[d.getMonth()],
        value: 0,
        monthIndex: d.getMonth(),
        year: d.getFullYear()
      };
    });

    // We only count Completed (FundsReleased) transactions where user is Seller (they diverted the waste)
    const completedSales = transactions.filter(
      t => t.sellerId === currentUserId && t.escrowState === "FundsReleased"
    );

    completedSales.forEach(tx => {
      const txDate = new Date(tx.createdAt);
      const mIndex = txDate.getMonth();
      const y = txDate.getFullYear();

      // find in our data array
      const bucket = data.find(d => d.monthIndex === mIndex && d.year === y);
      if (bucket) {
        const listing = listings.find(l => l.id === tx.listingId);
        bucket.value += (listing ? listing.quantity / 1000 : (tx.agreedPrice / 10) / 1000); // tons
      }
    });

    const maxVal = Math.max(...data.map(d => d.value), 10); // min height of 10 for scale

    return data.map(d => ({
      ...d,
      heightPercent: (d.value / maxVal) * 100
    }));
  }, [transactions, listings, currentUserId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 animate-fade-in">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Aggregating impact metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-up">
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Leaf className="w-6 h-6 text-emerald-400" />
            Environmental Impact
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Quantify your factory's contribution to the circular economy.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" leftIcon={<Calendar className="w-4 h-4" />}>
            Last 6 Months
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            leftIcon={<Download className="w-4 h-4" />}
            className="bg-emerald-500 hover:bg-emerald-600 text-black border-none"
            onClick={() => alert("Downloading PDF report...")}
          >
            Export PDF
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm">
          {error}
        </div>
      )}

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="dashboard-card border border-[var(--border)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <BarChart3 className="w-24 h-24 text-emerald-400" />
          </div>
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <Leaf className="w-5 h-5" />
            </div>
            <p className="text-sm text-gray-400 font-medium">Total Waste Diverted</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white">{metrics.wasteTons}</span>
              <span className="text-lg text-emerald-400">tons</span>
            </div>
          </div>
        </Card>

        <Card className="dashboard-card border border-[var(--border)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wind className="w-24 h-24 text-blue-400" />
          </div>
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
              <Wind className="w-5 h-5" />
            </div>
            <p className="text-sm text-gray-400 font-medium">CO₂ Emissions Prevented</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white">{metrics.co2Tons}</span>
              <span className="text-lg text-blue-400">tons</span>
            </div>
          </div>
        </Card>

        <Card className="dashboard-card border border-[var(--border)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign className="w-24 h-24 text-amber-400" />
          </div>
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
              <DollarSign className="w-5 h-5" />
            </div>
            <p className="text-sm text-gray-400 font-medium">Financial Value Unlocked</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-lg text-amber-400">$</span>
              <span className="text-4xl font-bold text-white">{metrics.totalValue}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Chart Section */}
      <Card className="dashboard-card border border-[var(--border)]">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-semibold text-white">Waste Diversion Trend</h2>
          <Badge variant="teal" icon={<TrendingUp className="w-3 h-3" />}>+12.5% this month</Badge>
        </div>

        <div className="h-64 flex items-end justify-between gap-2 px-2 pb-6 border-b border-[var(--border)] relative">
          {/* Y-axis grid lines (mock) */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
            <div className="border-b border-gray-800 w-full h-0" />
            <div className="border-b border-gray-800 w-full h-0" />
            <div className="border-b border-gray-800 w-full h-0" />
            <div className="border-b border-gray-800 w-full h-0" />
          </div>

          {chartData.map((d, idx) => (
            <div key={idx} className="relative flex flex-col items-center flex-1 group z-10 h-full justify-end">
              {/* Tooltip */}
              <div className="opacity-0 group-hover:opacity-100 absolute -top-10 bg-[#1a2e2e] border border-[var(--border)] px-3 py-1.5 rounded-lg text-xs text-white font-medium whitespace-nowrap transition-opacity shadow-xl z-20">
                {d.value.toFixed(1)} tons
              </div>
              
              {/* Bar */}
              <div 
                className="w-full max-w-[48px] bg-gradient-to-t from-[#2dd4bf]/20 to-[#2dd4bf] rounded-t-sm transition-all duration-500 ease-out"
                style={{ height: `${Math.max(d.heightPercent, 2)}%` }} // min height 2% for visibility
              />
            </div>
          ))}
        </div>
        
        {/* X-axis labels */}
        <div className="flex items-center justify-between gap-2 px-2 pt-4">
          {chartData.map((d, idx) => (
            <div key={idx} className="flex-1 text-center text-xs font-medium text-gray-500">
              {d.label}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
