'use client'

import { motion } from 'motion/react'
import { Megaphone, TrendingUp, Eye, Heart } from 'lucide-react'

const CAMPAIGNS = [
  { id: 1, name: 'Full Cream Milk — Peak Quality', status: 'live', channels: 'TV, Digital, Retail', spend: 1200000, reach: 2840000, engagement: 8.2, roi: 3.4 },
  { id: 2, name: 'Orange Juice — Morning Energy', status: 'live', channels: 'Digital, Outdoor', spend: 680000, reach: 1240000, engagement: 6.1, roi: 2.8 },
  { id: 3, name: 'Ramadan Campaign Prep', status: 'planning', channels: 'Multi-channel', spend: 0, reach: 0, engagement: 0, roi: 0 },
  { id: 4, name: 'UAE National Day Pack — Limited Edition', status: 'planning', channels: 'Retail, Social', spend: 420000, reach: 950000, engagement: 12.1, roi: 4.2 },
]

const SPENDS = [
  { type: 'TV/Traditional Media', pct: 35, value: 4550000 },
  { type: 'Digital Marketing', pct: 28, value: 3640000 },
  { type: 'Retail Activation', pct: 22, value: 2860000 },
  { type: 'Sponsorships', pct: 15, value: 1950000 },
]

export default function MarketingPage() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Marketing</h1>
        <p className="text-slate-400 text-sm mt-1">CMO: Leila Mansouri · AED 13M annual budget · 4 active campaigns</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Annual Budget', value: 'AED 13M', icon: Megaphone },
          { label: 'Spend YTD', value: 'AED 2.9M', icon: TrendingUp },
          { label: 'Total Reach', value: '5.0M', icon: Eye },
          { label: 'Avg Engagement', value: '8.1%', icon: Heart },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white/4 border border-white/8 rounded-xl p-4">
            <Icon size={16} className="text-emerald-400 mb-2" />
            <div className="text-lg font-bold font-mono text-white">{value}</div>
            <div className="text-xs text-slate-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Campaigns */}
      <div>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">Active Campaigns</h2>
        <div className="space-y-3">
          {CAMPAIGNS.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-white/4 border border-white/8 rounded-xl p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-medium">{c.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{c.channels}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${c.status === 'live' ? 'text-emerald-400 bg-emerald-400/12' : 'text-amber-400 bg-amber-400/12'}`}>
                  {c.status}
                </span>
              </div>
              {c.status === 'live' ? (
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <div className="text-slate-500">Spend</div>
                    <div className="font-mono text-white">AED {(c.spend / 1e6).toFixed(1)}M</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Reach</div>
                    <div className="font-mono text-white">{(c.reach / 1e6).toFixed(1)}M</div>
                  </div>
                  <div>
                    <div className="text-slate-500">ROI</div>
                    <div className="font-mono text-emerald-400">{c.roi.toFixed(1)}x</div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500">Planning phase — budget pending approval</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Budget breakdown */}
      <div>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">Annual Budget Allocation</h2>
        <div className="space-y-2">
          {SPENDS.map((s, i) => (
            <motion.div
              key={s.type}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 + i * 0.05 }}
            >
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-slate-400">{s.type}</span>
                <span className="font-mono text-white">AED {(s.value / 1e6).toFixed(1)}M ({s.pct}%)</span>
              </div>
              <div className="w-full bg-white/8 rounded-full h-2">
                <motion.div initial={{ width: 0 }} animate={{ width: `${s.pct}%` }} transition={{ duration: 0.7, delay: 0.3 + i * 0.05 }} className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
