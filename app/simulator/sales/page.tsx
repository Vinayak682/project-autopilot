'use client'

import { motion } from 'motion/react'
import { TrendingUp, TrendingDown } from 'lucide-react'

const CHANNELS = [
  { name: 'Modern Trade', revenue: 112_000_000, contribution: 48, trend: 'up', growth: 8.2, top_customer: 'Carrefour UAE' },
  { name: 'Traditional Trade', revenue: 81_200_000, contribution: 35, trend: 'down', growth: -2.1, top_customer: 'Al Manara Group' },
  { name: 'Foodservice', revenue: 28_050_000, contribution: 12, trend: 'up', growth: 15.4, top_customer: 'Emirates Airlines' },
  { name: 'Export', revenue: 11_750_000, contribution: 5, trend: 'up', growth: 22.3, top_customer: 'Spinneys Kuwait' },
]

const REGIONS = [
  { name: 'UAE', revenue: 175_000_000, contribution: 75, market_share: 18.0, outlets: 1240 },
  { name: 'Saudi Arabia', revenue: 35_000_000, contribution: 15, market_share: 4.2, outlets: 380 },
  { name: 'Kuwait', revenue: 18_600_000, contribution: 8, market_share: 6.8, outlets: 210 },
  { name: 'Qatar', revenue: 4_650_000, contribution: 2, market_share: 2.1, outlets: 85 },
]

export default function SalesPage() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Sales</h1>
        <p className="text-slate-400 text-sm mt-1">VP Sales: Priya Nair · AED 233M January revenue · 4 channels · GCC-wide</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Revenue', value: 'AED 233M', note: 'Jan 2024' },
          { label: 'Channel Growth', value: '+5.1%', note: 'vs prior month' },
          { label: 'Market Share UAE', value: '18.0%', note: 'vs 20% target' },
          { label: 'Outlets', value: '1,915', note: 'GCC-wide' },
        ].map(({ label, value, note }) => (
          <div key={label} className="bg-white/4 border border-white/8 rounded-xl p-4">
            <div className="text-xl font-bold font-mono text-white">{value}</div>
            <div className="text-xs text-slate-500 mt-1">{label}</div>
            <div className="text-xs text-slate-600">{note}</div>
          </div>
        ))}
      </div>

      {/* Channels */}
      <div>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">Revenue by Channel</h2>
        <div className="space-y-3">
          {CHANNELS.map((ch, i) => (
            <motion.div
              key={ch.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white/4 border border-white/8 rounded-xl p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-medium">{ch.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{ch.top_customer}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-mono font-bold text-white">AED {(ch.revenue / 1e6).toFixed(0)}M</div>
                  <div className="text-xs text-slate-500">{ch.contribution}% of total</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="w-full bg-white/8 rounded-full h-1.5 mr-3">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${ch.contribution}%` }} transition={{ duration: 0.8 }} className="h-full bg-emerald-400 rounded-full" />
                </div>
                <span className={`flex items-center gap-1 font-mono ${ch.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {ch.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {ch.growth >= 0 ? '+' : ''}{ch.growth}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Regions */}
      <div>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">Geographic Breakdown</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {REGIONS.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className="bg-white/4 border border-white/8 rounded-xl p-4"
            >
              <h3 className="text-white font-medium mb-3">{r.name}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Revenue</span>
                  <span className="font-mono text-white">AED {(r.revenue / 1e6).toFixed(0)}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Market Share</span>
                  <span className="font-mono text-emerald-400">{r.market_share}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Outlets</span>
                  <span className="font-mono text-white">{r.outlets}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
