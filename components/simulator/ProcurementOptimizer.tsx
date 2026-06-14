'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { TrendingUp, TrendingDown } from 'lucide-react'

export function ProcurementOptimizer() {
  const [orderFreq, setOrderFreq] = useState(14) // days
  const [safetyStock, setSafetyStock] = useState(45) // %
  const [bullwhip, setBullwhip] = useState(12) // demand variance amplification

  // Calculate metrics
  const holdingCost = (safetyStock / 100) * 2.5 // % of inventory value
  const stockoutRisk = Math.max(0, 100 - (safetyStock * 1.2))
  const totalCost = holdingCost + Math.max(0, stockoutRisk * 0.15)
  const optimalFreq = Math.round(28 / (bullwhip / 10))

  return (
    <div className="bg-white/4 border border-white/8 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">Procurement Trade-offs</h3>

      {/* Order frequency slider */}
      <div className="mb-6">
        <label className="block text-xs text-slate-400 font-medium mb-2">Order Frequency (every X days)</label>
        <input
          type="range"
          min={7}
          max={28}
          step={1}
          value={orderFreq}
          onChange={e => setOrderFreq(parseInt(e.target.value))}
          className="w-full mb-2"
        />
        <div className="text-sm text-white font-mono">{orderFreq} days between orders</div>
        <p className="text-xs text-slate-500 mt-1">More frequent = higher ordering cost, lower stockout risk</p>
      </div>

      {/* Safety stock slider */}
      <div className="mb-6">
        <label className="block text-xs text-slate-400 font-medium mb-2">Safety Stock Buffer</label>
        <input
          type="range"
          min={10}
          max={80}
          step={5}
          value={safetyStock}
          onChange={e => setSafetyStock(parseInt(e.target.value))}
          className="w-full mb-2"
        />
        <div className="text-sm text-white font-mono">{safetyStock}% above baseline</div>
        <p className="text-xs text-slate-500 mt-1">Higher buffer = more working capital tied up, lower stockout risk</p>
      </div>

      {/* Bullwhip effect slider */}
      <div className="mb-6">
        <label className="block text-xs text-slate-400 font-medium mb-2">Demand Signal Variance (Bullwhip)</label>
        <input
          type="range"
          min={5}
          max={25}
          step={1}
          value={bullwhip}
          onChange={e => setBullwhip(parseInt(e.target.value))}
          className="w-full mb-2"
        />
        <div className="text-sm text-white font-mono">{bullwhip}% demand amplification upstream</div>
        <p className="text-xs text-slate-500 mt-1">Lower = better supply chain alignment (S&OP discipline)</p>
      </div>

      {/* Trade-off outcomes */}
      <div className="bg-white/3 rounded-xl p-4 space-y-2 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Holding Cost</span>
          <span className={`text-sm font-mono font-bold ${holdingCost > 4 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {holdingCost.toFixed(2)}% of inventory value
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Stockout Risk</span>
          <span className={`text-sm font-mono font-bold ${stockoutRisk > 20 ? 'text-red-400' : 'text-emerald-400'}`}>
            {stockoutRisk.toFixed(1)}%
          </span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <span className="text-sm text-slate-400">Total Cost Impact</span>
          <span className={`text-sm font-mono font-bold ${totalCost > 5 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {totalCost.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Recommendation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`p-3 rounded-lg border ${
          totalCost < 3
            ? 'bg-emerald-500/8 border-emerald-500/20'
            : totalCost < 5
            ? 'bg-amber-500/8 border-amber-500/20'
            : 'bg-red-500/8 border-red-500/20'
        }`}
      >
        <p className="text-xs text-slate-300">
          {orderFreq === optimalFreq
            ? `✓ Order frequency is optimal (${optimalFreq}d)`
            : `Suggested order frequency: ${optimalFreq}d`
          }
        </p>
      </motion.div>
    </div>
  )
}
