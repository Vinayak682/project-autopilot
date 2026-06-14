'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react'

interface Supplier { code: string; name: string; reliability: number; lead_time: number; cost_idx: number; capacity: number; is_selected: boolean }

export function SupplierSelector() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { code: 'SUP-001', name: 'Al Rawabi Fresh Farms', reliability: 94.0, lead_time: 1, cost_idx: 100, capacity: 450000, is_selected: true },
    { code: 'SUP-002', name: 'Emirates Packaging Co', reliability: 91.0, lead_time: 7, cost_idx: 98, capacity: 280000, is_selected: true },
    { code: 'SUP-003', name: 'Saudi Fruit Concentrate LLC', reliability: 88.0, lead_time: 14, cost_idx: 105, capacity: 180000, is_selected: false },
    { code: 'SUP-006', name: 'Turkish Nuts & Dried Fruit', reliability: 79.0, lead_time: 28, cost_idx: 92, capacity: 120000, is_selected: false },
  ])
  const [totalCost, setTotalCost] = useState(198)

  const toggleSupplier = (code: string) => {
    setSuppliers(prev =>
      prev.map(s => {
        if (s.code === code) {
          const newState = !s.is_selected
          if (newState) {
            setTotalCost(prev => prev + s.cost_idx)
          } else {
            setTotalCost(prev => prev - s.cost_idx)
          }
          return { ...s, is_selected: newState }
        }
        return s
      })
    )
  }

  const selectedCount = suppliers.filter(s => s.is_selected).length
  const avgReliability = (
    suppliers.filter(s => s.is_selected).reduce((sum, s) => sum + s.reliability, 0) / selectedCount || 0
  ).toFixed(1)

  return (
    <div className="bg-white/4 border border-white/8 rounded-2xl p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white">Supplier Selection</h3>
        <p className="text-xs text-slate-500 mt-1">Choose suppliers for Raw Milk & Concentrates procurement</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white/4 rounded-lg p-3">
          <div className="text-xs text-slate-500">Selected</div>
          <div className="text-2xl font-bold text-white">{selectedCount}</div>
        </div>
        <div className="bg-white/4 rounded-lg p-3">
          <div className="text-xs text-slate-500">Avg Reliability</div>
          <div className="text-2xl font-bold text-emerald-400">{avgReliability}%</div>
        </div>
        <div className="bg-white/4 rounded-lg p-3">
          <div className="text-xs text-slate-500">Cost Index</div>
          <div className="text-2xl font-bold text-white">{totalCost}</div>
        </div>
      </div>

      {/* Supplier cards */}
      <div className="space-y-2">
        {suppliers.map((sup, i) => (
          <motion.button
            key={sup.code}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => toggleSupplier(sup.code)}
            className={`w-full text-left p-3 rounded-xl border transition-all ${
              sup.is_selected
                ? 'border-emerald-500/40 bg-emerald-500/8'
                : 'border-white/8 bg-white/3 hover:bg-white/4'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                sup.is_selected
                  ? 'border-emerald-400 bg-emerald-500/20'
                  : 'border-slate-600'
              }`}>
                {sup.is_selected && <CheckCircle2 size={14} className="text-emerald-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white">{sup.name}</div>
                <p className="text-xs text-slate-500 mt-0.5">{sup.code}</p>
              </div>
              <div className="text-right text-xs flex-shrink-0">
                <div className="text-slate-400">Reliability: <span className="text-emerald-400 font-mono">{sup.reliability}%</span></div>
                <div className="text-slate-500 mt-0.5">Lead: {sup.lead_time}d · Cap: {(sup.capacity / 1000).toFixed(0)}K</div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Risk assessment */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 p-3 bg-amber-500/8 border border-amber-500/20 rounded-lg flex items-start gap-2"
      >
        <AlertTriangle size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-amber-300 leading-relaxed">
          Current selection has {selectedCount === 1 ? 'single-source risk' : 'diversified supply'}. Cost index {totalCost > 200 ? 'above' : 'within'} budget.
        </p>
      </motion.div>
    </div>
  )
}
