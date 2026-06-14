'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { CheckCircle2, Circle, ChevronRight, BarChart3, Truck, DollarSign, Crown, Loader2 } from 'lucide-react'

const STEPS = [
  {
    id: 1,
    label: 'Demand Review',
    icon: BarChart3,
    owner: 'Ravi Krishnamurthy',
    desc: 'Review and agree the statistical demand forecast. Challenge exceptions. Confirm consensus demand.',
    fields: [
      { key: 'baseline_forecast', label: 'Statistical Forecast (units/month)', placeholder: '2,480,000' },
      { key: 'uplift_pct', label: 'Marketing Uplift %', placeholder: '8' },
      { key: 'risk_downside_pct', label: 'Downside Risk %', placeholder: '5' },
    ],
  },
  {
    id: 2,
    label: 'Supply Review',
    icon: Truck,
    owner: 'Sara Al Dhaheri',
    desc: 'Evaluate production capacity, supplier constraints, and DC availability. Confirm what can actually be supplied.',
    fields: [
      { key: 'plant_capacity', label: 'Plant Capacity Available (units)', placeholder: '2,200,000' },
      { key: 'opening_inventory', label: 'Opening Inventory (units)', placeholder: '380,000' },
      { key: 'supplier_risk', label: 'Key Supplier Risk', placeholder: 'None / Name' },
    ],
  },
  {
    id: 3,
    label: 'Reconciliation',
    icon: DollarSign,
    owner: 'Faris Al Tamimi',
    desc: 'Close the gap between demand and supply. Agree constrained plan, trade spend, and buffer.',
    fields: [
      { key: 'demand_consensus', label: 'Demand Consensus (units)', placeholder: '2,380,000' },
      { key: 'supply_commitment', label: 'Supply Commitment (units)', placeholder: '2,350,000' },
      { key: 'resolution', label: 'Resolution / Action Plan', placeholder: 'Describe how gap is closed...' },
    ],
  },
  {
    id: 4,
    label: 'Executive S&OP',
    icon: Crown,
    owner: 'MD/CEO (You)',
    desc: 'Final sign-off on the constrained plan. MD approves trade-offs, sets escalations, confirms targets.',
    fields: [
      { key: 'approved_plan', label: 'Approved Monthly Volume (units)', placeholder: '2,350,000' },
      { key: 'escalations', label: 'Escalations / Board Communications', placeholder: 'None' },
      { key: 'next_actions', label: 'Top 3 Actions for Next Month', placeholder: 'List actions...' },
    ],
  },
]

export default function SOPPage() {
  const [activeStep, setActiveStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [formData, setFormData] = useState<Record<string, Record<string, string>>>({})
  const [claudeSummary, setClaudeSummary] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentStep = STEPS.find(s => s.id === activeStep)!

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [activeStep]: { ...(prev[activeStep] ?? {}), [field]: value },
    }))
  }

  const handleComplete = async () => {
    const stepData = formData[activeStep] ?? {}
    setLoading(true)
    setError(null)
    try {
      const body: Record<string, unknown> = {
        step: activeStep,
        ...stepData,
        demand_consensus: parseFloat(stepData.demand_consensus ?? stepData.approved_plan ?? '2350000') || 2350000,
        supply_commitment: parseFloat(stepData.supply_commitment ?? stepData.plant_capacity ?? '2200000') || 2200000,
        resolution: stepData.resolution ?? stepData.next_actions ?? 'Constrained plan accepted',
        top_risk_skus: ['FMC-001', 'FMC-014'],
      }
      const res = await fetch('/api/simulator/sop/cycle', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (data.claude_summary) {
        setClaudeSummary(prev => ({ ...prev, [activeStep]: data.claude_summary }))
      }
      setCompletedSteps(prev => [...prev, activeStep])
      if (activeStep < 4) setActiveStep(activeStep + 1)
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  const isComplete = completedSteps.includes(4)

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">S&OP Cycle</h1>
        <p className="text-slate-400 text-sm mt-1">Sales & Operations Planning · January 2024 · 4-step monthly cycle</p>
      </motion.div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {STEPS.map((s, i) => {
          const done = completedSteps.includes(s.id)
          const active = s.id === activeStep
          const Icon = s.icon
          return (
            <div key={s.id} className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => completedSteps.includes(s.id - 1) || s.id === 1 ? setActiveStep(s.id) : null}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  done ? 'bg-emerald-500/16 text-emerald-400' :
                  active ? 'bg-white/10 text-white ring-1 ring-white/20' :
                  'text-slate-500'
                }`}
              >
                {done ? <CheckCircle2 size={14} /> : active ? <Icon size={14} /> : <Circle size={14} />}
                {s.label}
              </button>
              {i < STEPS.length - 1 && <ChevronRight size={14} className="text-slate-700 flex-shrink-0" />}
            </div>
          )
        })}
      </div>

      {/* Current step */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="bg-white/4 border border-white/8 rounded-2xl p-6 space-y-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/12 flex items-center justify-center flex-shrink-0">
              <currentStep.icon size={20} className="text-emerald-400" />
            </div>
            <div>
              <div className="text-xs text-emerald-400 font-mono uppercase tracking-widest mb-1">Step {currentStep.id} of 4</div>
              <h2 className="text-xl font-bold text-white">{currentStep.label}</h2>
              <p className="text-xs text-slate-400 mt-1">Owner: {currentStep.owner}</p>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">{currentStep.desc}</p>

          <div className="space-y-4">
            {currentStep.fields.map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">{label}</label>
                {key === 'resolution' || key === 'next_actions' || key === 'escalations' ? (
                  <textarea
                    rows={3}
                    placeholder={placeholder}
                    value={formData[activeStep]?.[key] ?? ''}
                    onChange={e => handleFieldChange(key, e.target.value)}
                    className="w-full bg-white/6 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 resize-none"
                  />
                ) : (
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={formData[activeStep]?.[key] ?? ''}
                    onChange={e => handleFieldChange(key, e.target.value)}
                    className="w-full bg-white/6 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Claude summary for this step */}
          {claudeSummary[activeStep] && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-500/8 border border-emerald-500/20 rounded-xl p-4"
            >
              <div className="text-xs text-emerald-400 font-semibold mb-2">Tariq Al Rashidi · Chief Strategy Advisor</div>
              <p className="text-sm text-slate-300 leading-relaxed">{claudeSummary[activeStep]}</p>
            </motion.div>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex justify-end">
            <button
              onClick={handleComplete}
              disabled={loading || completedSteps.includes(activeStep)}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-xl transition-all disabled:opacity-60"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Generating Summary...</>
              ) : completedSteps.includes(activeStep) ? (
                <><CheckCircle2 size={16} /> Step Complete</>
              ) : (
                <>Complete {currentStep.label} <ChevronRight size={16} /></>
              )}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Completed steps recap */}
      {completedSteps.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Completed Steps</h3>
          {completedSteps.map(id => {
            const s = STEPS.find(x => x.id === id)!
            return (
              <motion.div key={id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 p-3 bg-emerald-500/6 border border-emerald-500/16 rounded-xl">
                <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                <span className="text-sm text-slate-300">{s.label} · {s.owner}</span>
              </motion.div>
            )
          })}
        </div>
      )}

      {isComplete && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-emerald-500/12 border border-emerald-400/30 rounded-2xl p-6 text-center">
          <CheckCircle2 size={32} className="text-emerald-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">January S&OP Complete</h3>
          <p className="text-sm text-slate-400">The board-approved plan has been locked. Advance the month to execute.</p>
        </motion.div>
      )}
    </div>
  )
}
