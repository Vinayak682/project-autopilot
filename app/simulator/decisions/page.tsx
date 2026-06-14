'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronRight, Loader2, CheckCircle2, TrendingUp, TrendingDown, Zap } from 'lucide-react'

interface Option {
  id: string
  label: string
  cost_aed: number
  description: string
  kpi_delta: Record<string, number>
  risk: 'low' | 'medium' | 'high'
}

interface Decision {
  id: string
  title: string
  context: string
  decision_type: string
  department: string
  options: Option[]
}

const DECISIONS: Decision[] = [
  {
    id: 'D-001',
    title: 'Demand Forecast Methodology Upgrade',
    context: 'Current statistical model shows 88% accuracy vs 92% target. Demand Planning team proposes upgrading to an ML-based model with Ramadan seasonality.',
    decision_type: 'supply_chain',
    department: 'Supply Chain',
    options: [
      { id: 'upgrade_ml', label: 'Upgrade to ML Model', cost_aed: 480000, description: 'Purchase Kinaxis forecasting module. 6-week implementation. Projected to lift accuracy to 93%.', kpi_delta: { forecast_accuracy_pct: 5, otif_pct: 0.8 }, risk: 'low' },
      { id: 'improve_existing', label: 'Enhance Current Model', cost_aed: 120000, description: 'Hire 1 data analyst. Add Ramadan seasonal uplift manually. Limited improvement expected.', kpi_delta: { forecast_accuracy_pct: 2 }, risk: 'low' },
      { id: 'defer', label: 'Defer to Q3', cost_aed: 0, description: 'No action this month. Risk of continuing shortfall vs target.', kpi_delta: { forecast_accuracy_pct: -0.5, employee_engagement: -1 }, risk: 'medium' },
    ],
  },
  {
    id: 'D-002',
    title: 'UAE National Day Pack Launch',
    context: 'Marketing proposes a limited-edition UAE National Day packaging run for FMC-001 and FMC-003. Carrefour has offered prime shelf space at 2x normal placement.',
    decision_type: 'marketing',
    department: 'Marketing',
    options: [
      { id: 'full_launch', label: 'Full Launch (2 SKUs)', cost_aed: 1800000, description: 'Run both SKUs. Carrefour placement + social media campaign. Projected +18% volume uplift for 6 weeks.', kpi_delta: { net_revenue_growth_pct: 3.5, market_share_uae: 0.4 }, risk: 'low' },
      { id: 'single_sku', label: 'Limited to 1 SKU', cost_aed: 900000, description: 'Full Cream Milk only. Reduced risk, reduced upside.', kpi_delta: { net_revenue_growth_pct: 1.8, market_share_uae: 0.2 }, risk: 'low' },
      { id: 'skip', label: 'Skip This Year', cost_aed: 0, description: 'Pass on the opportunity. Carrefour may give space to competitor.', kpi_delta: { market_share_uae: -0.3 }, risk: 'medium' },
    ],
  },
  {
    id: 'D-003',
    title: 'Employee Retention Package',
    context: 'HR reports engagement score at 72%, with attrition risk in Supply Chain and Sales. Mohammed Al Balushi recommends a retention package.',
    decision_type: 'hr',
    department: 'HR',
    options: [
      { id: 'full_package', label: 'Full Retention Package', cost_aed: 3200000, description: '8% salary increase + annual bonus accelerator + L&D budget of AED 800K. Projects engagement to 82%.', kpi_delta: { employee_engagement: 10 }, risk: 'low' },
      { id: 'targeted', label: 'Targeted Key Roles Only', cost_aed: 1100000, description: 'Retention bonuses for 15 critical roles in Supply Chain and Sales. Partial uplift.', kpi_delta: { employee_engagement: 4 }, risk: 'low' },
      { id: 'defer_hr', label: 'Annual Review (Defer)', cost_aed: 0, description: 'Address at annual review. Risk of losing 3-4 senior people this quarter.', kpi_delta: { employee_engagement: -3 }, risk: 'high' },
    ],
  },
]

const RISK_CLS: Record<string, string> = {
  low: 'text-emerald-400 bg-emerald-400/12',
  medium: 'text-amber-400 bg-amber-400/12',
  high: 'text-red-400 bg-red-400/12',
}

function KPIBadge({ delta }: { delta: Record<string, number> }) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {Object.entries(delta).map(([k, v]) => (
        <span key={k} className={`flex items-center gap-0.5 text-xs font-mono px-2 py-0.5 rounded ${v >= 0 ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>
          {v >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {k.replace(/_pct|_aed/g, '').replace(/_/g, ' ')}: {v >= 0 ? '+' : ''}{v}
        </span>
      ))}
    </div>
  )
}

export default function DecisionsPage() {
  const [selected, setSelected] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState<string | null>(null)
  const [completed, setCompleted] = useState<Record<string, { option: Option; priceResult: unknown }>>({})
  const [priceChange, setPriceChange] = useState<{ from: number; to: number } | null>(null)

  const handleSubmit = async (decision: Decision, optionId: string) => {
    const option = decision.options.find(o => o.id === optionId)!
    setSubmitting(decision.id)
    try {
      const res = await fetch('/api/simulator/decisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision_key: decision.id,
          choice_made: optionId,
          decision_type: decision.decision_type,
          cost_aed: option.cost_aed,
          kpi_delta: option.kpi_delta,
        }),
      })
      const data = await res.json()
      setCompleted(prev => ({ ...prev, [decision.id]: { option, priceResult: data.priceResult } }))
      if (data.priceResult) {
        setPriceChange({ from: data.decision?.share_price_before ?? 15.00, to: data.priceResult.price })
      }
    } catch {
      // DB not wired — still mark as selected for UX
      setCompleted(prev => ({ ...prev, [decision.id]: { option, priceResult: null } }))
    } finally {
      setSubmitting(null)
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Monthly Decisions</h1>
        <p className="text-slate-400 text-sm mt-1">January 2024 · {DECISIONS.length} decisions pending · Each choice moves your share price</p>
      </motion.div>

      {/* Price change notification */}
      <AnimatePresence>
        {priceChange && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-xl"
          >
            <Zap size={16} className="text-emerald-400 flex-shrink-0" />
            <span className="text-sm text-slate-300">
              Share price moved: AED {priceChange.from.toFixed(2)} → <span className="text-white font-bold font-mono">AED {priceChange.to.toFixed(2)}</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decision cards */}
      {DECISIONS.map((decision, di) => {
        const done = !!completed[decision.id]
        const chosenOption = completed[decision.id]?.option

        return (
          <motion.div
            key={decision.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: di * 0.08 }}
            className={`border rounded-2xl overflow-hidden transition-all ${done ? 'border-emerald-500/25 bg-emerald-500/4' : 'border-white/8 bg-white/4'}`}
          >
            <div className="p-5 border-b border-white/8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs text-slate-500 font-mono mb-1">{decision.id} · {decision.department}</div>
                  <h3 className="text-lg font-bold text-white">{decision.title}</h3>
                </div>
                {done && <CheckCircle2 size={20} className="text-emerald-400 flex-shrink-0 mt-1" />}
              </div>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">{decision.context}</p>
            </div>

            {done ? (
              <div className="p-5">
                <div className="text-xs text-emerald-400 font-semibold mb-2">Decision Made</div>
                <div className="font-medium text-white">{chosenOption?.label}</div>
                <KPIBadge delta={chosenOption?.kpi_delta ?? {}} />
              </div>
            ) : (
              <div className="p-5 space-y-3">
                {decision.options.map(opt => (
                  <div
                    key={opt.id}
                    onClick={() => setSelected(prev => ({ ...prev, [decision.id]: opt.id }))}
                    className={`border rounded-xl p-4 cursor-pointer transition-all ${
                      selected[decision.id] === opt.id
                        ? 'border-emerald-500/50 bg-emerald-500/8'
                        : 'border-white/8 hover:border-white/16 hover:bg-white/3'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-medium text-white text-sm">{opt.label}</span>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${RISK_CLS[opt.risk]}`}>{opt.risk}</span>
                        {opt.cost_aed > 0 && <span className="text-xs font-mono text-slate-400">AED {(opt.cost_aed / 1e6).toFixed(1)}M</span>}
                        {opt.cost_aed === 0 && <span className="text-xs text-slate-600">No cost</span>}
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{opt.description}</p>
                    <KPIBadge delta={opt.kpi_delta} />
                  </div>
                ))}

                <button
                  onClick={() => selected[decision.id] && handleSubmit(decision, selected[decision.id])}
                  disabled={!selected[decision.id] || submitting === decision.id}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-xl transition-all disabled:opacity-40"
                >
                  {submitting === decision.id ? (
                    <><Loader2 size={16} className="animate-spin" /> Applying Decision...</>
                  ) : (
                    <>Confirm Decision <ChevronRight size={16} /></>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
