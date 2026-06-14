'use client'

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import Link from 'next/link'
import {
  ArrowUpRight, ArrowDownRight, BarChart3, Truck, DollarSign,
  Users, Megaphone, Globe, ChevronRight, AlertTriangle, CheckCircle2,
} from 'lucide-react'

interface KPI {
  label: string
  value: string
  target: string
  status: 'good' | 'warn' | 'bad'
  delta?: string
}

interface PricePoint { sim_month: number; price: number; market_event?: string }

function StatusDot({ status }: { status: 'good' | 'warn' | 'bad' }) {
  return (
    <span className={`inline-block w-2 h-2 rounded-full ${
      status === 'good' ? 'bg-emerald-400' : status === 'warn' ? 'bg-amber-400' : 'bg-red-400'
    }`} />
  )
}

function KPICard({ label, value, target, status, delta }: KPI) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="bg-white/4 border border-white/8 rounded-xl p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-slate-500 uppercase tracking-wider">{label}</span>
        <StatusDot status={status} />
      </div>
      <div className="text-2xl font-bold text-white font-mono mb-1">{value}</div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500">Target: {target}</span>
        {delta && (
          <span className={`text-xs font-mono flex items-center gap-0.5 ${delta.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
            {delta.startsWith('+') ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
            {delta}
          </span>
        )}
      </div>
    </motion.div>
  )
}

function MiniChart({ data }: { data: PricePoint[] }) {
  if (!data.length) return <div className="h-20 flex items-center justify-center text-xs text-slate-600">No history</div>

  const prices = data.map(d => d.price)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const range = max - min || 1

  const w = 280, h = 60, pad = 8
  const points = data.map((d, i) => {
    const x = pad + (i / (data.length - 1 || 1)) * (w - pad * 2)
    const y = h - pad - ((d.price - min) / range) * (h - pad * 2)
    return `${x},${y}`
  }).join(' ')

  const lastPrice = prices[prices.length - 1]
  const firstPrice = prices[0]
  const up = lastPrice >= firstPrice

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-16">
      <polyline
        points={points}
        fill="none"
        stroke={up ? '#10b981' : '#f87171'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((d, i) => {
        if (!d.market_event) return null
        const x = pad + (i / (data.length - 1 || 1)) * (w - pad * 2)
        const y = h - pad - ((d.price - min) / range) * (h - pad * 2)
        return <circle key={i} cx={x} cy={y} r="3" fill="#f59e0b" />
      })}
    </svg>
  )
}

const QUICK_LINKS = [
  { label: 'Supply Chain', href: '/simulator/supply', icon: Truck, desc: 'OTIF 96.4% · 3 alerts' },
  { label: 'S&OP', href: '/simulator/sop', icon: BarChart3, desc: 'Month 1 cycle pending' },
  { label: 'Finance', href: '/simulator/finance', icon: DollarSign, desc: 'AED 233M revenue' },
  { label: 'HR', href: '/simulator/hr', icon: Users, desc: '72% engagement' },
  { label: 'Marketing', href: '/simulator/marketing', icon: Megaphone, desc: 'Q1 campaign live' },
  { label: 'Expansion', href: '/simulator/expansion', icon: Globe, desc: '8 opportunities' },
]

export default function OverviewPage() {
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([])
  const [currentPrice, setCurrentPrice] = useState(15.00)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stateRes, histRes] = await Promise.all([
          fetch('/api/simulator/game/state'),
          fetch('/api/simulator/share-price/history?limit=12'),
        ])
        const stateData = await stateRes.json()
        const histData = await histRes.json()
        if (stateData.gameState) setCurrentPrice(stateData.gameState.share_price ?? 15.00)
        if (histData.history) setPriceHistory(histData.history)
      } catch {
        // Default state when DB not ready
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const KPIs: KPI[] = [
    { label: 'OTIF %', value: '96.4%', target: '98%', status: 'warn', delta: '-0.4%' },
    { label: 'Forecast Accuracy', value: '88.0%', target: '92%', status: 'warn', delta: '+1.2%' },
    { label: 'Gross Margin', value: '38.0%', target: '40%', status: 'warn', delta: '+0.3%' },
    { label: 'EBITDA Margin', value: '14.0%', target: '15%', status: 'warn', delta: '-0.5%' },
    { label: 'Market Share UAE', value: '18.0%', target: '20%', status: 'warn', delta: '+0.2%' },
    { label: 'Inventory Turnover', value: '8.5x', target: '9x', status: 'warn', delta: '-0.3x' },
    { label: 'Employee Sentiment', value: '72%', target: '80%', status: 'bad', delta: '-2%' },
    { label: 'Fill Rate', value: '97.2%', target: '98.5%', status: 'warn', delta: '+0.1%' },
  ]

  const prevPrice = priceHistory.length > 1 ? priceHistory[priceHistory.length - 2]?.price ?? 15.00 : 14.65
  const priceDelta = currentPrice - prevPrice
  const pricePct = (priceDelta / prevPrice) * 100

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header row */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Executive Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">January 2024 · Month 1 of FY2024</p>
        </div>
        <Link
          href="/simulator/decisions"
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500/16 text-emerald-400 rounded-lg text-sm font-medium hover:bg-emerald-500/24 transition-colors"
        >
          Open Decisions <ChevronRight size={14} />
        </Link>
      </motion.div>

      {/* Share price hero card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white/4 border border-white/8 rounded-2xl p-6"
      >
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="flex-1">
            <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">DFM: ALMANR · Share Price</div>
            <div className="flex items-end gap-4">
              <span className="text-5xl font-bold font-mono text-white">AED {currentPrice.toFixed(2)}</span>
              <span className={`flex items-center gap-1 text-lg font-mono font-medium mb-1 ${priceDelta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {priceDelta >= 0 ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                {priceDelta >= 0 ? '+' : ''}{pricePct.toFixed(2)}%
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <div className="text-xs text-slate-500">Market Cap</div>
                <div className="text-sm font-mono text-white">AED {(currentPrice * 390_000_000 / 1e9).toFixed(2)}B</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">EPS (TTM)</div>
                <div className="text-sm font-mono text-white">AED 0.682</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">P/E Multiple</div>
                <div className="text-sm font-mono text-white">22.0x</div>
              </div>
            </div>
          </div>
          <div className="w-full sm:w-72">
            <div className="text-xs text-slate-500 mb-2">6-Month Price History</div>
            {loading ? (
              <div className="h-16 bg-white/4 rounded animate-pulse" />
            ) : (
              <MiniChart data={priceHistory.slice(-6)} />
            )}
            <div className="text-xs text-slate-600 mt-1">● Market event</div>
          </div>
        </div>
      </motion.div>

      {/* KPI Grid */}
      <div>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">KPI Scorecard</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {KPIs.map((kpi, i) => (
            <motion.div key={kpi.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 + i * 0.04 }}>
              <KPICard {...kpi} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick nav */}
      <div>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Departments</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {QUICK_LINKS.map(({ label, href, icon: Icon, desc }, i) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
            >
              <Link
                href={href}
                className="flex items-start gap-3 p-4 bg-white/4 border border-white/8 rounded-xl hover:bg-white/6 hover:border-emerald-500/30 transition-all group"
              >
                <Icon size={18} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-white group-hover:text-emerald-300 transition-colors">{label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Alerts */}
      <div>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Active Alerts</h2>
        <div className="space-y-2">
          {[
            { icon: AlertTriangle, color: 'amber', text: 'OTIF dropped below 97% threshold — review dispatch schedule', href: '/simulator/supply' },
            { icon: AlertTriangle, color: 'amber', text: 'Employee engagement at 72% — below 75% target. HR action required', href: '/simulator/hr' },
            { icon: AlertTriangle, color: 'red', text: 'Forecast accuracy 88% vs 92% target — demand plan needs revision', href: '/simulator/supply/demand' },
            { icon: CheckCircle2, color: 'emerald', text: 'Fill Rate 97.2% — holding above 97% floor. Maintain safety stock', href: '/simulator/supply/inventory' },
          ].map(({ icon: Icon, color, text, href }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
            >
              <Link
                href={href}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all hover:bg-white/4 ${
                  color === 'red' ? 'border-red-500/20 bg-red-500/6'
                  : color === 'amber' ? 'border-amber-500/20 bg-amber-500/6'
                  : 'border-emerald-500/20 bg-emerald-500/6'
                }`}
              >
                <Icon size={15} className={`mt-0.5 flex-shrink-0 ${
                  color === 'red' ? 'text-red-400' : color === 'amber' ? 'text-amber-400' : 'text-emerald-400'
                }`} />
                <span className="text-sm text-slate-300">{text}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
