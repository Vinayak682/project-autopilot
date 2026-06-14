'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { TrendingUp, RotateCcw } from 'lucide-react'

interface Point { x: number; y: number }

export function DemandCurveBuilder() {
  const [points, setPoints] = useState<Point[]>([
    { x: 10, y: 2500000 },
    { x: 12, y: 2200000 },
    { x: 14, y: 1800000 },
    { x: 16, y: 1400000 },
  ])
  const [baselineUnits, setBaselineUnits] = useState(2_350_000)
  const [pricePoint, setPricePoint] = useState(12)

  const handleReset = () => {
    setPoints([
      { x: 10, y: 2500000 },
      { x: 12, y: 2200000 },
      { x: 14, y: 1800000 },
      { x: 16, y: 1400000 },
    ])
    setPricePoint(12)
  }

  const handleDragPoint = (idx: number, newX: number) => {
    const clamped = Math.max(8, Math.min(20, newX))
    setPoints(prev => {
      const updated = [...prev]
      updated[idx] = { ...updated[idx], x: clamped }
      return updated
    })
  }

  const selectedPoint = points.find(p => Math.abs(p.x - pricePoint) < 0.5)
  const currentDemand = selectedPoint?.y ?? baselineUnits

  const minPrice = 8, maxPrice = 20
  const minUnits = 1_000_000, maxUnits = 2_800_000

  return (
    <div className="bg-white/4 border border-white/8 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">Demand Curve Analysis</h3>
          <p className="text-xs text-slate-500 mt-1">Adjust price elasticity for FMC-001 (Full Cream Milk)</p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/8 hover:bg-white/12 text-slate-400 rounded-lg text-xs transition-colors"
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      {/* SVG Chart */}
      <div className="mb-6 p-4 bg-white/2 rounded-xl">
        <svg viewBox="0 0 500 300" className="w-full border border-white/10 rounded-lg bg-white/3">
          {/* Grid */}
          {[0, 1, 2, 3, 4].map(i => (
            <line
              key={`grid-v-${i}`}
              x1={100 + i * 100}
              y1={250}
              x2={100 + i * 100}
              y2={20}
              stroke="white"
              strokeWidth="0.5"
              strokeDasharray="4"
              opacity="0.1"
            />
          ))}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <line
              key={`grid-h-${i}`}
              x1={80}
              y1={250 - i * 46}
              x2={480}
              y2={250 - i * 46}
              stroke="white"
              strokeWidth="0.5"
              strokeDasharray="4"
              opacity="0.1"
            />
          ))}

          {/* Axes */}
          <line x1="80" y1="250" x2="480" y2="250" stroke="white" strokeWidth="1.5" opacity="0.3" />
          <line x1="80" y1="250" x2="80" y2="20" stroke="white" strokeWidth="1.5" opacity="0.3" />

          {/* Axis labels */}
          <text x="460" y="270" fontSize="12" fill="white" opacity="0.5">
            Price
          </text>
          <text x="20" y="30" fontSize="12" fill="white" opacity="0.5">
            Demand
          </text>

          {/* Demand curve */}
          {points.length > 1 && (
            <polyline
              points={points.map(p => `${80 + ((p.x - minPrice) / (maxPrice - minPrice)) * 400},${250 - ((p.y - minUnits) / (maxUnits - minUnits)) * 230}`).join(' ')}
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
            />
          )}

          {/* Points */}
          {points.map((p, i) => {
            const sx = 80 + ((p.x - minPrice) / (maxPrice - minPrice)) * 400
            const sy = 250 - ((p.y - minUnits) / (maxUnits - minUnits)) * 230
            const isSelected = Math.abs(p.x - pricePoint) < 0.5
            return (
              <motion.g
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileTap={{ scale: 1.3 }}
                onMouseDown={e => {
                  const svg = e.currentTarget.parentElement as unknown as SVGElement
                  const rect = svg?.getBoundingClientRect()
                  const move = (me: MouseEvent) => {
                    const newX = ((me.clientX - rect.left - 80) / 400) * (maxPrice - minPrice) + minPrice
                    handleDragPoint(i, newX)
                  }
                  const up = () => {
                    document.removeEventListener('mousemove', move)
                    document.removeEventListener('mouseup', up)
                  }
                  document.addEventListener('mousemove', move)
                  document.addEventListener('mouseup', up)
                }}
              >
                <circle
                  cx={sx}
                  cy={sy}
                  r={isSelected ? 6 : 4}
                  fill={isSelected ? '#10b981' : '#06b6d4'}
                  opacity="0.8"
                  style={{ cursor: 'grab' }}
                />
              </motion.g>
            )
          })}
        </svg>
      </div>

      {/* Current state */}
      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-white/4 rounded-lg p-3">
          <div className="text-xs text-slate-500 mb-1">Current Price Point</div>
          <div className="text-xl font-mono font-bold text-emerald-400">AED {pricePoint.toFixed(2)}</div>
        </div>
        <div className="bg-white/4 rounded-lg p-3">
          <div className="text-xs text-slate-500 mb-1">Expected Demand</div>
          <div className="text-xl font-mono font-bold text-white">{(currentDemand / 1e6).toFixed(2)}M units</div>
        </div>
        <div className="bg-white/4 rounded-lg p-3">
          <div className="text-xs text-slate-500 mb-1">Price Elasticity</div>
          <div className="text-xl font-mono font-bold text-cyan-400">−1.8</div>
        </div>
      </div>

      {/* Price slider */}
      <div>
        <label className="block text-xs text-slate-400 mb-2 font-medium">Test Price Point (AED)</label>
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          step={0.5}
          value={pricePoint}
          onChange={e => setPricePoint(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  )
}
