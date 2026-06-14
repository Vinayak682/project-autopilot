'use client'

import { motion } from 'motion/react'
import { BarChart3, TrendingUp, Shield, Zap } from 'lucide-react'

const BOARD_MEMBERS = [
  { name: 'Sheikh Mohammed Al Hamdan Al Maktoum', title: 'Chairman', focus: 'Strategic Direction' },
  { name: 'Fatima Al Rashidi', title: 'Independent Director', focus: 'Risk & Governance' },
  { name: 'Dr. Khalid Al Suwaidi', title: 'Audit Committee Chair', focus: 'Financial Controls' },
  { name: 'James Thornton', title: 'Independent Director', focus: 'International Markets' },
  { name: 'Rania Al Farsi', title: 'NRC Member', focus: 'Remuneration & Culture' },
]

const BOARD_PACK = [
  { section: 'Executive Summary', content: 'CEO overview of month performance vs KPIs', icon: BarChart3 },
  { section: 'Financial Results', content: 'P&L, Cash Flow, Balance Sheet highlights', icon: TrendingUp },
  { section: 'Risk Dashboard', content: 'Market, operational, financial, compliance risks', icon: Shield },
  { section: 'Strategy Updates', content: 'Progress on expansion, M&A, partnerships', icon: Zap },
]

export default function BoardPage() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Board Room</h1>
        <p className="text-slate-400 text-sm mt-1">5 Directors · Quarterly Board Packs · Investor Relations</p>
      </motion.div>

      <div className="bg-amber-500/8 border border-amber-500/25 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <Shield size={20} className="text-amber-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-white font-semibold mb-1">Next Board Meeting</h3>
            <p className="text-slate-300 text-sm">Q1 2024 Board Meeting · 30 March 2024 · Al Manar HQ, Dubai</p>
            <p className="text-xs text-slate-500 mt-2">Agenda: FY2024 Q1 Results, Strategy Review, Expansion Committee, Remuneration Report</p>
          </div>
        </div>
      </div>

      {/* Board members */}
      <div>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Board of Directors</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BOARD_MEMBERS.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-white/4 border border-white/8 rounded-xl p-4"
            >
              <h3 className="text-white font-medium text-sm">{m.name}</h3>
              <p className="text-xs text-emerald-400 mt-1 font-mono">{m.title}</p>
              <p className="text-xs text-slate-500 mt-2">{m.focus}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Board pack sections */}
      <div>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Q1 2024 Board Pack Contents</h2>
        <div className="space-y-3">
          {BOARD_PACK.map(({ section, content, icon: Icon }, i) => (
            <motion.div
              key={section}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
              className="flex items-start gap-4 p-4 bg-white/4 border border-white/8 rounded-xl"
            >
              <Icon size={16} className="text-emerald-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-white font-medium text-sm">{section}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{content}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Investor relations */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="bg-white/4 border border-white/8 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-4">Investor Relations</h2>
        <div className="space-y-3 text-sm text-slate-300">
          <div className="flex justify-between pb-2 border-b border-white/8">
            <span>Share Price</span>
            <span className="font-mono text-white">AED 15.00</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-white/8">
            <span>Market Cap</span>
            <span className="font-mono text-white">AED 5.85B</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-white/8">
            <span>EPS (TTM)</span>
            <span className="font-mono text-white">AED 0.682</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-white/8">
            <span>P/E Multiple</span>
            <span className="font-mono text-white">22.0x</span>
          </div>
          <div className="flex justify-between">
            <span>Dividend (Indicated)</span>
            <span className="font-mono text-emerald-400">AED 0.24 (1.6%)</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
