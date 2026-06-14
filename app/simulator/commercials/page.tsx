'use client'

import { motion } from 'motion/react'
import { Award, ShoppingCart, TrendingUp } from 'lucide-react'

const ACCOUNTS = [
  { name: 'Carrefour UAE', ytd_revenue: 45000000, trade_spend: 2800000, margin: 32.0, status: 'strategic', renewal: 'Q2 2024' },
  { name: 'Lulu Hypermarket', ytd_revenue: 38500000, trade_spend: 2100000, margin: 30.5, status: 'strategic', renewal: 'Q3 2024' },
  { name: 'Spinneys Kuwait', ytd_revenue: 18600000, trade_spend: 980000, margin: 28.0, status: 'growth', renewal: 'Q4 2024' },
  { name: 'Al Manara Group', ytd_revenue: 32100000, trade_spend: 1500000, margin: 29.5, status: 'stable', renewal: 'Q1 2025' },
  { name: 'Emirates Airlines Catering', ytd_revenue: 8200000, trade_spend: 420000, margin: 42.0, status: 'high_margin', renewal: 'Jan 2025' },
]

const DEALS = [
  { name: 'Carrefour Q1 Promotional Shelf', value: 1200000, discount_pct: 12, expected_uplift: 18 },
  { name: 'Lulu Premium Placement', value: 850000, discount_pct: 10, expected_uplift: 14 },
  { name: 'Spinneys Launch Support', value: 620000, discount_pct: 8, expected_uplift: 22 },
]

export default function CommercialsPage() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Commercials</h1>
        <p className="text-slate-400 text-sm mt-1">Commercial Director: Layla Karimi · Key account contracts & trade spend</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Key Accounts', value: '5', icon: Award },
          { label: 'Total YTD Revenue', value: 'AED 142M', icon: ShoppingCart },
          { label: 'Avg Trade Spend', value: '8.9%', icon: TrendingUp },
          { label: 'Avg Account Margin', value: '32.4%', icon: Award },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white/4 border border-white/8 rounded-xl p-4">
            <Icon size={16} className="text-emerald-400 mb-2" />
            <div className="text-lg font-bold font-mono text-white">{value}</div>
            <div className="text-xs text-slate-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Key accounts */}
      <div>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">Strategic Accounts</h2>
        <div className="space-y-2">
          {ACCOUNTS.map((a, i) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between p-3 bg-white/4 border border-white/8 rounded-xl"
            >
              <div>
                <h3 className="text-white font-medium text-sm">{a.name}</h3>
                <p className="text-xs text-slate-500">Renewal: {a.renewal}</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-mono text-white">AED {(a.ytd_revenue / 1e6).toFixed(0)}M</div>
                <div className="text-xs text-slate-500">{a.margin}% margin</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Active deals */}
      <div>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">Active Trade Deals</h2>
        <div className="space-y-2">
          {DEALS.map((d, i) => (
            <motion.div
              key={d.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className="p-4 bg-white/4 border border-white/8 rounded-xl"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-white font-medium text-sm">{d.name}</h3>
                <span className="text-xs font-mono text-emerald-400">−{d.discount_pct}%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Deal Value: <span className="text-white font-mono">AED {(d.value / 1e6).toFixed(1)}M</span></span>
                <span className="text-emerald-400">+{d.expected_uplift}% uplift</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
