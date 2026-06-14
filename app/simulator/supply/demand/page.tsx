'use client'

import { motion } from 'motion/react'
import { TrendingUp, TrendingDown } from 'lucide-react'

const DEMAND_DATA = [
  { sku: 'FMC-001', name: 'Full Cream Milk 1L', cls: 'A', channel: 'Modern Trade', jan: 42000, feb: 38000, mar: 47000, apr: 51000, trend: 'up' },
  { sku: 'FMC-003', name: 'Long Life Milk 1L', cls: 'A', channel: 'Modern Trade', jan: 89000, feb: 82000, mar: 96000, apr: 104000, trend: 'up' },
  { sku: 'FMC-005', name: 'Orange Juice 1L', cls: 'A', channel: 'Modern Trade', jan: 34000, feb: 31000, mar: 38000, apr: 42000, trend: 'up' },
  { sku: 'FMC-007', name: 'Mango Nectar 1L', cls: 'A', channel: 'Export', jan: 28000, feb: 26000, mar: 31000, apr: 29000, trend: 'down' },
  { sku: 'FMC-004', name: 'Yoghurt Plain 500g', cls: 'A', channel: 'Traditional Trade', jan: 19000, feb: 17000, mar: 22000, apr: 25000, trend: 'up' },
  { sku: 'FMC-014', name: 'Ayran 330ml', cls: 'A', channel: 'Foodservice', jan: 15000, feb: 14000, mar: 17000, apr: 18000, trend: 'up' },
  { sku: 'FMC-006', name: 'Apple Juice 1L', cls: 'B', channel: 'Modern Trade', jan: 12000, feb: 11000, mar: 14000, apr: 13000, trend: 'down' },
  { sku: 'FMC-008', name: 'Labneh 400g', cls: 'B', channel: 'Traditional Trade', jan: 9000, feb: 8500, mar: 10000, apr: 11000, trend: 'up' },
]

const CLS_COLOR: Record<string, string> = { A: 'text-emerald-400 bg-emerald-400/12', B: 'text-blue-400 bg-blue-400/12', C: 'text-slate-400 bg-slate-400/12' }
const MONTHS = ['Jan 24', 'Feb 24', 'Mar 24', 'Apr 24']

export default function DemandPage() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Demand Planning</h1>
        <p className="text-slate-400 text-sm mt-1">Owner: Ravi Krishnamurthy · 4-month rolling forecast · Accuracy: 88%</p>
      </motion.div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Forecast Accuracy', value: '88.0%', sub: 'vs 92% target' },
          { label: 'SKUs Forecasted', value: '20 / 20', sub: '100% coverage' },
          { label: 'Channels', value: '4', sub: 'MT, TT, FS, Export' },
          { label: 'Horizon', value: '12 months', sub: 'Jan–Dec 2024' },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-white/4 border border-white/8 rounded-xl p-4">
            <div className="text-xl font-bold font-mono text-white">{value}</div>
            <div className="text-xs text-slate-500 mt-1">{label}</div>
            <div className="text-xs text-slate-600">{sub}</div>
          </div>
        ))}
      </div>

      {/* Demand table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <div className="bg-white/4 border border-white/8 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-white/8">
            <h2 className="text-sm font-semibold text-white">Forecast by SKU · Units</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="text-left p-3 text-xs text-slate-500 font-medium">SKU</th>
                  <th className="text-left p-3 text-xs text-slate-500 font-medium">Product</th>
                  <th className="text-left p-3 text-xs text-slate-500 font-medium">Class</th>
                  <th className="text-left p-3 text-xs text-slate-500 font-medium">Channel</th>
                  {MONTHS.map(m => (
                    <th key={m} className="text-right p-3 text-xs text-slate-500 font-medium">{m}</th>
                  ))}
                  <th className="text-center p-3 text-xs text-slate-500 font-medium">Trend</th>
                </tr>
              </thead>
              <tbody>
                {DEMAND_DATA.map((row, i) => (
                  <motion.tr
                    key={row.sku}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.04 }}
                    className="border-b border-white/4 hover:bg-white/3 transition-colors"
                  >
                    <td className="p-3 font-mono text-xs text-slate-400">{row.sku}</td>
                    <td className="p-3 text-white text-sm">{row.name}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${CLS_COLOR[row.cls]}`}>{row.cls}</span>
                    </td>
                    <td className="p-3 text-xs text-slate-400">{row.channel}</td>
                    <td className="p-3 text-right font-mono text-sm text-slate-300">{row.jan.toLocaleString()}</td>
                    <td className="p-3 text-right font-mono text-sm text-slate-300">{row.feb.toLocaleString()}</td>
                    <td className="p-3 text-right font-mono text-sm text-slate-300">{row.mar.toLocaleString()}</td>
                    <td className="p-3 text-right font-mono text-sm text-slate-300">{row.apr.toLocaleString()}</td>
                    <td className="p-3 text-center">
                      {row.trend === 'up' ? <TrendingUp size={14} className="text-emerald-400 mx-auto" /> : <TrendingDown size={14} className="text-red-400 mx-auto" />}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
