'use client'

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface PricePoint { sim_month: number; price: number; market_event?: string | null }

function MiniChart({ data }: { data: PricePoint[] }) {
  if (!data.length) return <div className="h-32 flex items-center justify-center text-xs text-slate-600">Loading...</div>
  const prices = data.map(d => d.price)
  const min = Math.min(...prices) * 0.98
  const max = Math.max(...prices) * 1.02
  const range = max - min || 1
  const w = 600, h = 120, pad = 16
  const points = data.map((d, i) => {
    const x = pad + (i / (data.length - 1 || 1)) * (w - pad * 2)
    const y = h - pad - ((d.price - min) / range) * (h - pad * 2)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
  const last = prices[prices.length - 1]
  const first = prices[0]
  const up = last >= first
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 120 }}>
      <defs>
        <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={up ? '#10b981' : '#f87171'} stopOpacity="0.25" />
          <stop offset="100%" stopColor={up ? '#10b981' : '#f87171'} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`${pad},${h - pad} ${points} ${w - pad},${h - pad}`}
        fill="url(#priceGrad)"
      />
      <polyline points={points} fill="none" stroke={up ? '#10b981' : '#f87171'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d, i) => {
        if (!d.market_event) return null
        const x = pad + (i / (data.length - 1 || 1)) * (w - pad * 2)
        const y = h - pad - ((d.price - min) / range) * (h - pad * 2)
        return <circle key={i} cx={x} cy={y} r="4" fill="#f59e0b" />
      })}
    </svg>
  )
}

const PL = [
  { label: 'Gross Revenue', value: 251_640_000, is_positive: true, indent: 0 },
  { label: 'Trade Discounts', value: -18_640_000, is_positive: false, indent: 1 },
  { label: 'Net Revenue', value: 233_000_000, is_positive: true, indent: 0, bold: true },
  { label: 'Cost of Goods Sold', value: -144_460_000, is_positive: false, indent: 1 },
  { label: 'Gross Profit', value: 88_540_000, is_positive: true, indent: 0, bold: true },
  { label: 'Gross Margin %', value: null, display: '38.0%', indent: 1 },
  { label: 'Marketing Spend', value: -9_320_000, is_positive: false, indent: 1 },
  { label: 'Distribution Cost', value: -18_640_000, is_positive: false, indent: 1 },
  { label: 'Admin Cost', value: -6_990_000, is_positive: false, indent: 1 },
  { label: 'EBITDA', value: 32_620_000, is_positive: true, indent: 0, bold: true },
  { label: 'EBITDA Margin %', value: null, display: '14.0%', indent: 1 },
  { label: 'Depreciation', value: -5_825_000, is_positive: false, indent: 1 },
  { label: 'Interest', value: -4_660_000, is_positive: false, indent: 1 },
  { label: 'Tax (9% UAE CT)', value: -2_002_000, is_positive: false, indent: 1 },
  { label: 'Net Profit', value: 20_133_000, is_positive: true, indent: 0, bold: true },
  { label: 'Net Margin %', value: null, display: '8.6%', indent: 1 },
  { label: 'EPS (AED)', value: null, display: '0.682 (TTM)', indent: 1 },
]

function fmt(n: number) {
  const abs = Math.abs(n)
  if (abs >= 1e6) return `AED ${(n / 1e6).toFixed(1)}M`
  return `AED ${n.toLocaleString()}`
}

export default function FinancePage() {
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([])
  const [currentPrice, setCurrentPrice] = useState(15.00)

  useEffect(() => {
    Promise.all([
      fetch('/api/simulator/game/state').then(r => r.json()),
      fetch('/api/simulator/share-price/history?limit=12').then(r => r.json()),
    ]).then(([state, hist]) => {
      if (state.gameState) setCurrentPrice(state.gameState.share_price)
      if (hist.history) setPriceHistory(hist.history)
    }).catch(() => {})
  }, [])

  const prevPrice = priceHistory.length > 1 ? priceHistory[priceHistory.length - 2]?.price ?? 14.65 : 14.65
  const delta = currentPrice - prevPrice
  const pct = (delta / prevPrice) * 100

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Finance</h1>
        <p className="text-slate-400 text-sm mt-1">CFO: Nadia Al Zahra · January 2024 · Monthly P&L</p>
      </motion.div>

      {/* Share price chart */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }} className="bg-white/4 border border-white/8 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="text-xs text-slate-500 mb-1">DFM: ALMANR</div>
            <div className="text-3xl font-bold font-mono text-white">AED {currentPrice.toFixed(2)}</div>
            <div className={`flex items-center gap-1 text-sm font-mono mt-1 ${delta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {delta >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {delta >= 0 ? '+' : ''}{pct.toFixed(2)}% MTD
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500 mb-1">Market Cap</div>
            <div className="text-lg font-mono text-white">AED {(currentPrice * 390_000_000 / 1e9).toFixed(2)}B</div>
          </div>
        </div>
        <MiniChart data={priceHistory} />
        <div className="text-xs text-slate-600 mt-2">● Market event · Yellow dots indicate events affecting share price</div>
      </motion.div>

      {/* P&L */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white/4 border border-white/8 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/8">
          <h2 className="text-sm font-semibold text-white">Monthly P&L · January 2024</h2>
        </div>
        <div className="divide-y divide-white/4">
          {PL.map(({ label, value, display, indent, bold }) => (
            <div key={label} className={`flex items-center justify-between px-4 py-2 ${bold ? 'bg-white/3' : ''}`} style={{ paddingLeft: `${(indent ?? 0) * 16 + 16}px` }}>
              <span className={`text-sm ${bold ? 'font-semibold text-white' : 'text-slate-400'}`}>{label}</span>
              <span className={`text-sm font-mono ${bold ? 'font-bold text-white' : value !== null && value < 0 ? 'text-red-400' : 'text-slate-300'}`}>
                {display ?? (value !== null ? fmt(value) : '—')}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Balance sheet highlights */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Balance Sheet Highlights</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Cash', value: 'AED 320M' },
            { label: 'Receivables', value: 'AED 128M' },
            { label: 'Inventory Value', value: 'AED 42M' },
            { label: 'Total Debt', value: 'AED 850M' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white/4 border border-white/8 rounded-xl p-4">
              <div className="text-lg font-bold font-mono text-white">{value}</div>
              <div className="text-xs text-slate-500 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
