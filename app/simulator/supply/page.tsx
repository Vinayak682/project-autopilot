'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { TrendingUp, Package, ShoppingCart, Truck, BarChart3, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'

const MODULES = [
  {
    key: 'demand',
    label: 'Demand Planning',
    href: '/simulator/supply/demand',
    icon: TrendingUp,
    kpi: '88% Forecast Accuracy',
    status: 'warn' as const,
    desc: '12-month rolling demand forecast · Channel split · Seasonal uplift model',
  },
  {
    key: 'production',
    label: 'Production Planning',
    href: '/simulator/supply/production',
    icon: BarChart3,
    kpi: '82% OEE · 78% Utilization',
    status: 'warn' as const,
    desc: 'Manufacturing schedule · Capacity planning · Quality metrics',
  },
  {
    key: 'inventory',
    label: 'Inventory Management',
    href: '/simulator/supply/inventory',
    icon: Package,
    kpi: '8.5x Turnover · 43 DOH',
    status: 'warn' as const,
    desc: 'ABC analysis · Safety stock · Stockout alerts across 4 DCs',
  },
  {
    key: 'procurement',
    label: 'Procurement',
    href: '/simulator/supply/procurement',
    icon: ShoppingCart,
    kpi: '8 Suppliers · 91% Reliability',
    status: 'good' as const,
    desc: 'Supplier scorecards · PO tracker · Contract management',
  },
  {
    key: 'dispatch',
    label: 'Dispatch & Logistics',
    href: '/simulator/supply/dispatch',
    icon: Truck,
    kpi: '96.4% OTIF · 5 Routes',
    status: 'warn' as const,
    desc: 'Route planning · OTIF tracker · Last-mile cold chain',
  },
]

const SUPPLY_KPIS = [
  { label: 'OTIF %', value: '96.4%', target: '98%', status: 'warn' as const },
  { label: 'Fill Rate', value: '97.2%', target: '98.5%', status: 'warn' as const },
  { label: 'Forecast Accuracy', value: '88.0%', target: '92%', status: 'warn' as const },
  { label: 'Inventory Turnover', value: '8.5x', target: '9.0x', status: 'warn' as const },
  { label: 'Supplier Reliability', value: '91%', target: '95%', status: 'warn' as const },
  { label: 'Perfect Order %', value: '94.1%', target: '96%', status: 'bad' as const },
]

function StatusIcon({ status }: { status: 'good' | 'warn' | 'bad' }) {
  if (status === 'good') return <CheckCircle2 size={14} className="text-emerald-400" />
  if (status === 'warn') return <AlertTriangle size={14} className="text-amber-400" />
  return <XCircle size={14} className="text-red-400" />
}

export default function SupplyChainPage() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Supply Chain Hub</h1>
        <p className="text-slate-400 text-sm mt-1">CSCO: Faris Al Tamimi · 5 modules · January 2024</p>
      </motion.div>

      {/* Top KPI bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
      >
        {SUPPLY_KPIS.map(({ label, value, target, status }) => (
          <div key={label} className="bg-white/4 border border-white/8 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500 leading-tight">{label}</span>
              <StatusIcon status={status} />
            </div>
            <div className="text-lg font-bold font-mono text-white">{value}</div>
            <div className="text-xs text-slate-600">vs {target}</div>
          </div>
        ))}
      </motion.div>

      {/* Module cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MODULES.map(({ key, label, href, icon: Icon, kpi, status, desc }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06 }}
          >
            <Link
              href={href}
              className="block bg-white/4 border border-white/8 rounded-xl p-5 hover:bg-white/6 hover:border-emerald-500/30 transition-all group h-full"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/12 flex items-center justify-center">
                  <Icon size={18} className="text-emerald-400" />
                </div>
                <StatusIcon status={status} />
              </div>
              <h3 className="font-semibold text-white mb-1 group-hover:text-emerald-300 transition-colors">{label}</h3>
              <p className="text-xs text-emerald-400 font-mono mb-2">{kpi}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Alerts */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">Supply Chain Alerts</h2>
        <div className="space-y-2">
          {[
            { status: 'bad' as const, text: 'FMC-003 (Long Life Milk 1L): Jebel Ali DC at 8 DOH — below 14-day safety stock' },
            { status: 'warn' as const, text: 'PO-2024-0020 (Saudi Fruit Concentrate): 5-day delay. Mango season demand at risk' },
            { status: 'warn' as const, text: 'Dubai Plant OEE dropped to 79% this week — maintenance window recommended' },
            { status: 'good' as const, text: 'Supplier SUP-007 (European Dairy Cultures): 97% reliability — contract renewal recommended' },
          ].map(({ status, text }, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 p-3 rounded-xl border ${
                status === 'bad' ? 'border-red-500/20 bg-red-500/6'
                : status === 'warn' ? 'border-amber-500/20 bg-amber-500/6'
                : 'border-emerald-500/20 bg-emerald-500/6'
              }`}
            >
              <StatusIcon status={status} />
              <span className="text-sm text-slate-300">{text}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
