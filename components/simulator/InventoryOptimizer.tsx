'use client'

import { useState } from 'react'
import { motion } from 'motion/react'

export function InventoryOptimizer() {
  const [targetTurnover, setTargetTurnover] = useState(8.5)
  const [targetDOH, setTargetDOH] = useState(43)
  const [currentRevenue, setCurrentRevenue] = useState(233)

  const calculateInventoryValue = (revenue: number, turnover: number) => {
    return (revenue / turnover).toFixed(1)
  }

  const calculateCashTied = (revenue: number, doh: number) => {
    const dailyRevenue = revenue / 30
    return (dailyRevenue * doh).toFixed(1)
  }

  const invValue = calculateInventoryValue(currentRevenue, targetTurnover)
  const cashTied = calculateCashTied(currentRevenue, targetDOH)

  return (
    <div className="bg-white/4 border border-white/8 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">Inventory Optimization</h3>

      {/* Revenue baseline */}
      <div className="mb-6">
        <label className="block text-xs text-slate-400 font-medium mb-2">Monthly Revenue (AED M)</label>
        <input
          type="number"
          value={currentRevenue}
          onChange={e => setCurrentRevenue(Math.max(100, parseInt(e.target.value) || 233))}
          className="w-full px-3 py-2 bg-white/6 border border-white/10 rounded-lg text-white text-sm"
        />
      </div>

      {/* Inventory turnover */}
      <div className="mb-6">
        <label className="block text-xs text-slate-400 font-medium mb-3">Inventory Turnover Target (x/year)</label>
        <input
          type="range"
          min={6}
          max={12}
          step={0.5}
          value={targetTurnover}
          onChange={e => setTargetTurnover(parseFloat(e.target.value))}
          className="w-full mb-2"
        />
        <div className="text-sm text-white font-mono">{targetTurnover}x</div>
        <p className="text-xs text-slate-500 mt-1">Higher turnover = less capital tied up, faster obsolescence risk</p>
      </div>

      {/* Days on hand */}
      <div className="mb-6">
        <label className="block text-xs text-slate-400 font-medium mb-3">Days on Hand Target</label>
        <input
          type="range"
          min={20}
          max={60}
          step={2}
          value={targetDOH}
          onChange={e => setTargetDOH(parseInt(e.target.value))}
          className="w-full mb-2"
        />
        <div className="text-sm text-white font-mono">{targetDOH} days</div>
        <p className="text-xs text-slate-500 mt-1">Target: 40-45 DOH for FMCG (balance holding cost vs OTIF)</p>
      </div>

      {/* Outcomes */}
      <div className="grid sm:grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/3 rounded-xl p-4"
        >
          <div className="text-xs text-slate-500 mb-1">Inventory Value</div>
          <div className="text-2xl font-mono font-bold text-white">AED {invValue}M</div>
          <p className="text-xs text-slate-600 mt-1">At {targetTurnover}x annual turnover</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white/3 rounded-xl p-4"
        >
          <div className="text-xs text-slate-500 mb-1">Cash Tied Up</div>
          <div className="text-2xl font-mono font-bold text-cyan-400">AED {cashTied}M</div>
          <p className="text-xs text-slate-600 mt-1">Working capital at {targetDOH} DOH</p>
        </motion.div>
      </div>

      {/* Comparison to current */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-4 p-3 bg-slate-500/8 border border-slate-500/20 rounded-lg"
      >
        <p className="text-xs text-slate-400 leading-relaxed">
          Current state: 8.5x turnover, 43 DOH, AED 27.4M inventory, AED 15.6M working capital.
          {targetTurnover > 8.5 ? '✓ Improvement ' : targetTurnover < 8.5 ? '⚠ Increase ' : ''}in efficiency.
        </p>
      </motion.div>
    </div>
  )
}
