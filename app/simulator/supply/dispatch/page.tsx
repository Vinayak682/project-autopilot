'use client'

import { motion } from 'motion/react'
import { CheckCircle2, XCircle } from 'lucide-react'

const ROUTES = [
  { id: 1, route: 'Dubai DC → Carrefour UAE', mode: 'Refrigerated Truck', planned: 12000, actual: 11800, otif: true, delay_h: 0.5, cost: 18500, status: 'delivered' },
  { id: 2, route: 'Jebel Ali DC → Lulu Hypermarket', mode: 'Refrigerated Truck', planned: 18000, actual: 17200, otif: true, delay_h: 1.2, cost: 24000, status: 'delivered' },
  { id: 3, route: 'Dubai DC → Abu Dhabi Distribution', mode: 'Refrigerated Truck', planned: 9500, actual: 8800, otif: false, delay_h: 6.5, cost: 31000, status: 'delayed' },
  { id: 4, route: 'Riyadh DC → Riyadh Modern Trade', mode: 'Refrigerated Truck', planned: 22000, actual: 21500, otif: true, delay_h: 0, cost: 42000, status: 'delivered' },
  { id: 5, route: 'Kuwait DC → Sultan Center', mode: 'Refrigerated Van', planned: 6500, actual: 6500, otif: true, delay_h: 0, cost: 8800, status: 'delivered' },
  { id: 6, route: 'Dubai DC → Qatar Distribution', mode: 'Refrigerated Truck', planned: 8200, actual: 0, otif: false, delay_h: 0, cost: 28000, status: 'in_transit' },
]

const STATUS_STYLE: Record<string, { label: string; cls: string }> = {
  delivered: { label: 'Delivered', cls: 'text-emerald-400 bg-emerald-400/12' },
  delayed: { label: 'Delayed', cls: 'text-red-400 bg-red-400/12' },
  in_transit: { label: 'In Transit', cls: 'text-amber-400 bg-amber-400/12' },
}

const totalOTIF = ROUTES.filter(r => r.otif).length
const otifPct = ((totalOTIF / ROUTES.length) * 100).toFixed(1)

export default function DispatchPage() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Dispatch & Logistics</h1>
        <p className="text-slate-400 text-sm mt-1">Owner: Thomas Andersen · 6 active routes · January 2024</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'OTIF %', value: `${otifPct}%`, note: 'Target 98%' },
          { label: 'Active Routes', value: String(ROUTES.length), note: '4 countries' },
          { label: 'Units Dispatched', value: '78,800', note: 'Jan week 1' },
          { label: 'Logistics Cost', value: 'AED 152K', note: 'Week to date' },
        ].map(({ label, value, note }) => (
          <div key={label} className="bg-white/4 border border-white/8 rounded-xl p-4">
            <div className="text-xl font-bold font-mono text-white">{value}</div>
            <div className="text-xs text-slate-500 mt-1">{label}</div>
            <div className="text-xs text-slate-600">{note}</div>
          </div>
        ))}
      </div>

      <div className="bg-white/4 border border-white/8 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/8">
          <h2 className="text-sm font-semibold text-white">Route Board · Week 1 January</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                {['Route', 'Mode', 'Planned', 'Actual', 'OTIF', 'Delay', 'Cost (AED)', 'Status'].map(h => (
                  <th key={h} className="text-left p-3 text-xs text-slate-500 font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROUTES.map((r, i) => {
                const s = STATUS_STYLE[r.status]
                return (
                  <motion.tr
                    key={r.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="border-b border-white/4 hover:bg-white/3"
                  >
                    <td className="p-3 text-white text-sm max-w-[200px] truncate">{r.route}</td>
                    <td className="p-3 text-xs text-slate-400 whitespace-nowrap">{r.mode}</td>
                    <td className="p-3 font-mono text-sm text-slate-300">{r.planned.toLocaleString()}</td>
                    <td className="p-3 font-mono text-sm text-slate-300">{r.actual > 0 ? r.actual.toLocaleString() : '—'}</td>
                    <td className="p-3">{r.otif ? <CheckCircle2 size={14} className="text-emerald-400" /> : <XCircle size={14} className="text-red-400" />}</td>
                    <td className="p-3 font-mono text-sm">
                      {r.delay_h > 0 ? <span className={r.delay_h > 4 ? 'text-red-400' : 'text-amber-400'}>{r.delay_h}h</span> : <span className="text-emerald-400">—</span>}
                    </td>
                    <td className="p-3 font-mono text-sm text-slate-300">{r.cost.toLocaleString()}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${s.cls}`}>{s.label}</span>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
