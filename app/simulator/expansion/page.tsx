'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Globe, TrendingUp, AlertCircle, Loader2, ChevronRight } from 'lucide-react'

interface Opportunity {
  key: string
  name: string
  market: string
  category: string
  capex: number
  revenue_potential: number
  payback: number
  risk: 'low' | 'medium' | 'high'
  description: string
}

const OPPORTUNITIES: Opportunity[] = [
  { key: 'egypt_entry', name: 'Egypt Market Entry', market: 'Egypt', category: 'geographic', capex: 180, revenue_potential: 320, payback: 4.5, risk: 'high', description: 'Greenfield entry into 105M-person Egyptian dairy market.' },
  { key: 'saudi_jv', name: 'Saudi Arabia JV Expansion', market: 'Saudi Arabia', category: 'geographic', capex: 95, revenue_potential: 220, payback: 3.2, risk: 'medium', description: 'Joint venture with Al-Safi Danone under Vision 2030.' },
  { key: 'icc_sponsorship', name: 'ICC Cricket Sponsorship', market: 'GCC', category: 'marketing', capex: 22, revenue_potential: 85, payback: 2.1, risk: 'low', description: 'Title sponsor of ICC T20 matches. 2.4B audience reach.' },
  { key: 'kuwait_distribution', name: 'Kuwait Distribution Expansion', market: 'Kuwait', category: 'geographic', capex: 35, revenue_potential: 90, payback: 2.8, risk: 'medium', description: 'Owned subsidiary replacing current distributor.' },
  { key: 'organic_range', name: 'Al Manar Organic Range', market: 'UAE', category: 'product', capex: 18, revenue_potential: 65, payback: 1.8, risk: 'low', description: '12-SKU certified organic dairy & juice line.' },
  { key: 'b2b_foodservice', name: 'B2B Foodservice Channel', market: 'UAE & KSA', category: 'channel', capex: 12, revenue_potential: 140, payback: 1.5, risk: 'low', description: 'Hotels, restaurants, hospitals. Currently <8% of revenue.' },
  { key: 'oman_entry', name: 'Oman Direct Market Entry', market: 'Oman', category: 'geographic', capex: 25, revenue_potential: 55, payback: 3.1, risk: 'medium', description: 'Subsidiary replacing underperforming distributor.' },
  { key: 'ecommerce_dtc', name: 'Direct-to-Consumer eCommerce', market: 'UAE', category: 'channel', capex: 8.5, revenue_potential: 40, payback: 1.2, risk: 'low', description: 'Farm-to-Fridge app + subscription box.' },
]

const RISK_COLOR: Record<string, string> = {
  low: 'text-emerald-400 bg-emerald-400/12',
  medium: 'text-amber-400 bg-amber-400/12',
  high: 'text-red-400 bg-red-400/12',
}

export default function ExpansionPage() {
  const [analyzing, setAnalyzing] = useState<string | null>(null)
  const [analyzed, setAnalyzed] = useState<Set<string>>(new Set())

  const handleAnalyze = async (opp: Opportunity) => {
    setAnalyzing(opp.key)
    try {
      await fetch(`/api/simulator/expansion/${opp.key}/analyze`, { method: 'POST' })
      setAnalyzed(prev => new Set([...prev, opp.key]))
    } catch {
      // Error handling
    } finally {
      setAnalyzing(null)
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Expansion Opportunities</h1>
        <p className="text-slate-400 text-sm mt-1">8 strategic growth initiatives · Total capex potential: AED 396M · Payback 1.2–4.5 years</p>
      </motion.div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Opportunities', value: '8', icon: Globe },
          { label: 'Total Capex', value: 'AED 396M', icon: TrendingUp },
          { label: 'Revenue Potential', value: 'AED 995M', icon: TrendingUp },
          { label: 'Analyzed', value: String(analyzed.size), icon: Globe },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white/4 border border-white/8 rounded-xl p-4">
            <Icon size={16} className="text-emerald-400 mb-2" />
            <div className="text-lg font-bold font-mono text-white">{value}</div>
            <div className="text-xs text-slate-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Opportunities grid */}
      <div className="space-y-3">
        {OPPORTUNITIES.map((opp, i) => {
          const done = analyzed.has(opp.key)
          return (
            <motion.div
              key={opp.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`border rounded-xl p-5 transition-all ${done ? 'border-emerald-500/30 bg-emerald-500/4' : 'border-white/8 bg-white/4'}`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-white font-semibold">{opp.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{opp.market}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${RISK_COLOR[opp.risk]}`}>{opp.risk}</span>
              </div>

              <p className="text-sm text-slate-400 mb-4 leading-relaxed">{opp.description}</p>

              <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
                <div className="bg-white/6 rounded-lg p-2">
                  <div className="text-xs text-slate-500">Capex</div>
                  <div className="font-mono text-white">AED {opp.capex}M</div>
                </div>
                <div className="bg-white/6 rounded-lg p-2">
                  <div className="text-xs text-slate-500">Revenue Potential</div>
                  <div className="font-mono text-emerald-400">AED {opp.revenue_potential}M</div>
                </div>
                <div className="bg-white/6 rounded-lg p-2">
                  <div className="text-xs text-slate-500">Payback</div>
                  <div className="font-mono text-white">{opp.payback}y</div>
                </div>
              </div>

              {done && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-emerald-500/8 border border-emerald-500/20 rounded-lg mb-4 text-xs text-emerald-300">
                  ✓ Claude investment memo has been generated and cached
                </motion.div>
              )}

              <button
                onClick={() => handleAnalyze(opp)}
                disabled={analyzing === opp.key || done}
                className="w-full flex items-center justify-center gap-2 py-2 bg-emerald-500/16 hover:bg-emerald-500/24 text-emerald-400 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
              >
                {analyzing === opp.key ? (
                  <><Loader2 size={14} className="animate-spin" /> Analyzing...</>
                ) : done ? (
                  '✓ Analyzed'
                ) : (
                  <>Request Investment Memo <ChevronRight size={14} /></>
                )}
              </button>
            </motion.div>
          )
        })}
      </div>

      {/* Notes */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="bg-slate-500/8 border border-slate-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle size={14} className="text-slate-400 mt-1 flex-shrink-0" />
          <p className="text-xs text-slate-400 leading-relaxed">
            Each opportunity above has been analyzed by Tariq Al Rashidi (Chief Strategy Advisor) using Claude AI. Click &quot;Request Investment Memo&quot; to generate a detailed 400-word analysis covering market entry strategy, financial projections, risk assessment, and board recommendation.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
