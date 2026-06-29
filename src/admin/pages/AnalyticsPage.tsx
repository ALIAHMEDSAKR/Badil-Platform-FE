import { useState } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { Printer, TrendingUp, Factory, Leaf } from 'lucide-react'

// Mock Data
const monthlyData = [
  { name: 'Jan', transactions: 45, co2Offset: 120, wasteDiverted: 85 },
  { name: 'Feb', transactions: 52, co2Offset: 145, wasteDiverted: 90 },
  { name: 'Mar', transactions: 68, co2Offset: 190, wasteDiverted: 110 },
  { name: 'Apr', transactions: 74, co2Offset: 210, wasteDiverted: 130 },
  { name: 'May', transactions: 85, co2Offset: 250, wasteDiverted: 160 },
  { name: 'Jun', transactions: 92, co2Offset: 280, wasteDiverted: 185 },
]

export function AnalyticsPage() {
  const [isPrinting, setIsPrinting] = useState(false)

  const handlePrint = () => {
    setIsPrinting(true)
    setTimeout(() => {
      window.print()
      setIsPrinting(false)
    }, 100)
  }

  return (
    <div className={`transition-all ${isPrinting ? 'print-mode text-black bg-white' : ''}`}>
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-[#e8f4f4] mb-1">
            Analytics & Compliance
          </h1>
          <p className="text-sm text-[#6b9090]">
            Review platform performance, environmental impact, and compliance reports.
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-[#132020] border border-[#1f3333] text-[#00c896] rounded-lg font-semibold text-sm hover:bg-[#1a2a2a] transition-colors"
        >
          <Printer size={16} />
          Export PDF Report
        </button>
      </header>

      {/* Print-Only Header */}
      <div className="hidden print:block mb-8 pb-4 border-b border-gray-300">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Badil Platform Report</h1>
        <p className="text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
      </div>

      {/* ── Key Metrics Grid ───────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#132020] border border-[#1f3333] print:border-gray-200 print:bg-white rounded-lg p-5">
          <div className="flex items-center gap-3 mb-2 text-[#6b9090] print:text-gray-500">
            <Leaf size={18} className="text-[#00c896]" />
            <h3 className="text-sm font-semibold uppercase tracking-wider">Total CO₂ Offset</h3>
          </div>
          <p className="text-3xl font-bold text-[#e8f4f4] print:text-gray-900">1,195 <span className="text-lg text-[#6b9090] print:text-gray-500 font-normal">Tons</span></p>
          <p className="text-xs text-[#00c896] mt-2 flex items-center gap-1"><TrendingUp size={12} /> +12% this month</p>
        </div>
        
        <div className="bg-[#132020] border border-[#1f3333] print:border-gray-200 print:bg-white rounded-lg p-5">
          <div className="flex items-center gap-3 mb-2 text-[#6b9090] print:text-gray-500">
            <Factory size={18} className="text-[#4a9eff]" />
            <h3 className="text-sm font-semibold uppercase tracking-wider">Waste Diverted</h3>
          </div>
          <p className="text-3xl font-bold text-[#e8f4f4] print:text-gray-900">760 <span className="text-lg text-[#6b9090] print:text-gray-500 font-normal">Tons</span></p>
          <p className="text-xs text-[#4a9eff] mt-2 flex items-center gap-1"><TrendingUp size={12} /> +15% this month</p>
        </div>

        <div className="bg-[#132020] border border-[#1f3333] print:border-gray-200 print:bg-white rounded-lg p-5">
          <div className="flex items-center gap-3 mb-2 text-[#6b9090] print:text-gray-500">
            <TrendingUp size={18} className="text-[#f59e0b]" />
            <h3 className="text-sm font-semibold uppercase tracking-wider">Completed Deals</h3>
          </div>
          <p className="text-3xl font-bold text-[#e8f4f4] print:text-gray-900">416</p>
          <p className="text-xs text-[#f59e0b] mt-2 flex items-center gap-1"><TrendingUp size={12} /> +8% this month</p>
        </div>

        <div className="bg-[#132020] border border-[#1f3333] print:border-gray-200 print:bg-white rounded-lg p-5">
          <div className="flex items-center gap-3 mb-2 text-[#6b9090] print:text-gray-500">
            <Factory size={18} className="text-[#a855f7]" />
            <h3 className="text-sm font-semibold uppercase tracking-wider">Active Factories</h3>
          </div>
          <p className="text-3xl font-bold text-[#e8f4f4] print:text-gray-900">128</p>
          <p className="text-xs text-[#a855f7] mt-2 flex items-center gap-1"><TrendingUp size={12} /> +5% this month</p>
        </div>
      </div>

      {/* ── Charts ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Environmental Impact Chart */}
        <section className="bg-[#132020] border border-[#1f3333] print:border-gray-200 print:bg-white print:break-inside-avoid rounded-lg p-6">
          <h2 className="text-base font-semibold text-[#e8f4f4] print:text-gray-900 mb-6">Environmental Impact (Tons)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isPrinting ? '#e5e7eb' : '#1f3333'} vertical={false} />
                <XAxis dataKey="name" stroke={isPrinting ? '#6b7280' : '#6b9090'} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={isPrinting ? '#6b7280' : '#6b9090'} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: isPrinting ? '#ffffff' : '#0f1a1a', borderColor: isPrinting ? '#e5e7eb' : '#1f3333', color: isPrinting ? '#111827' : '#e8f4f4' }}
                  itemStyle={{ color: isPrinting ? '#111827' : '#e8f4f4' }}
                  cursor={{ fill: isPrinting ? '#f3f4f6' : '#1a2a2a' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="co2Offset" name="CO₂ Offset" fill="#00c896" radius={[4, 4, 0, 0]} barSize={32} />
                <Bar dataKey="wasteDiverted" name="Waste Diverted" fill="#4a9eff" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Transaction Volume Chart */}
        <section className="bg-[#132020] border border-[#1f3333] print:border-gray-200 print:bg-white print:break-inside-avoid rounded-lg p-6">
          <h2 className="text-base font-semibold text-[#e8f4f4] print:text-gray-900 mb-6">Transaction Volume</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isPrinting ? '#e5e7eb' : '#1f3333'} vertical={false} />
                <XAxis dataKey="name" stroke={isPrinting ? '#6b7280' : '#6b9090'} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={isPrinting ? '#6b7280' : '#6b9090'} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: isPrinting ? '#ffffff' : '#0f1a1a', borderColor: isPrinting ? '#e5e7eb' : '#1f3333', color: isPrinting ? '#111827' : '#e8f4f4' }}
                  itemStyle={{ color: isPrinting ? '#111827' : '#e8f4f4' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="transactions" name="Transactions" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* ── Table Report (Print friendly) ───────────────────────── */}
      <section className="bg-[#132020] border border-[#1f3333] print:border-gray-200 print:bg-white rounded-lg p-6 overflow-hidden">
        <h2 className="text-base font-semibold text-[#e8f4f4] print:text-gray-900 mb-4">Monthly Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#0f1a1a] print:bg-gray-50 text-[#6b9090] print:text-gray-700 uppercase font-semibold text-xs border-b border-[#1f3333] print:border-gray-300">
              <tr>
                <th className="px-4 py-3">Month</th>
                <th className="px-4 py-3 text-right">Transactions</th>
                <th className="px-4 py-3 text-right">Waste Diverted (Tons)</th>
                <th className="px-4 py-3 text-right">CO₂ Offset (Tons)</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((row) => (
                <tr key={row.name} className="border-b border-[#1f3333] print:border-gray-200 text-[#e8f4f4] print:text-gray-800">
                  <td className="px-4 py-3 font-medium">{row.name} 2026</td>
                  <td className="px-4 py-3 text-right">{row.transactions}</td>
                  <td className="px-4 py-3 text-right text-[#4a9eff] print:text-gray-800">{row.wasteDiverted}</td>
                  <td className="px-4 py-3 text-right text-[#00c896] print:text-gray-800">{row.co2Offset}</td>
                </tr>
              ))}
              {/* Totals Row */}
              <tr className="bg-[#1a2a2a] print:bg-gray-100 font-bold text-[#e8f4f4] print:text-gray-900">
                <td className="px-4 py-3">Total (YTD)</td>
                <td className="px-4 py-3 text-right">{monthlyData.reduce((acc, curr) => acc + curr.transactions, 0)}</td>
                <td className="px-4 py-3 text-right text-[#4a9eff] print:text-gray-900">{monthlyData.reduce((acc, curr) => acc + curr.wasteDiverted, 0)}</td>
                <td className="px-4 py-3 text-right text-[#00c896] print:text-gray-900">{monthlyData.reduce((acc, curr) => acc + curr.co2Offset, 0)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  )
}
