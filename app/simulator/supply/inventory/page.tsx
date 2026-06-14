'use client'

import { motion } from 'motion/react'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'

const INVENTORY = [
  { sku: 'FMC-001', name: 'Full Cream Milk 1L', cls: 'A', dubai: 12, jebel: 8, riyadh: 15, kuwait: 9, avg_doh: 11, status: 'warn' },
  { sku: 'FMC-002', name: 'Skimmed Milk 1L', cls: 'A', dubai: 18, jebel: 14, riyadh: 20, kuwait: 12, avg_doh: 16, status: 'ok' },
  { sku: 'FMC-003', name: 'Long Life Milk 1L', cls: 'A', dubai: 42, jebel: 6, riyadh: 38, kuwait: 31, avg_doh: 29, status: 'warn' },
  { sku: 'FMC-004', name: 'Yoghurt Plain 500g', cls: 'A', dubai: 9, jebel: 11, riyadh: 14, kuwait: 8, avg_doh: 11, status: 'warn' },
  { sku: 'FMC-005', name: 'Orange Juice 1L', cls: 'A', dubai: 22, jebel: 18, riyadh: 25, kuwait: 16, avg_doh: 20, status: 'ok' },
  { sku: 'FMC-007', name: 'Mango Nectar 1L', cls: 'A', dubai: 34, jebel: 28, riyadh: 41, kuwait: 22, avg_doh: 31, status: 'ok' },
  { sku: 'FMC-014', name: 'Ayran 330ml', cls: 'A', dubai: 4, jebel: 3, riyadh: 7, kuwait: 5, avg_doh: 5, status: 'stockout' },
  { sku: 'FMC-006', name: 'Apple Juice 1L', cls: 'B', dubai: 58, jebel: 62, riyadh: 71, kuwait: 44, avg_doh: 59, status: 'excess' },
  { sku: 'FMC-008', name: 'Labneh 400g', cls: 'B', dubai: 17, jebel: 14, riyadh: 19, kuwait: 11, avg_doh: 15, status: 'ok' },
  { sku: 'FMC-009', name: 'Cheddar Cheese 200g', cls: 'B', dubai: 29, jebel: 24, riyadh: 33, kuwait: 18, avg_doh: 26, status: 'ok' },
]

function DOHCell({ days }: { days: number }) {
  let color = 'text-emerald-400'
  if (days < 7) color = 'text-red-400 font-bold'
  else if (days < 14) color = 'text-amber-400'
  else if (days > 45) color = 'text-blue-400'
  return <span className={`font-mono text-sm ${color}`}>{days}d</span>
}

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  ok: { label: 'OK', cls: 'bg-emerald-400/12 text-emerald-400' },
  warn: { label: 'LOW', cls: 'bg-amber-400/12 text-amber-400' },
  stockout: { label: 'RISK', cls: 'bg-red-400/12 text-red-400' },
  excess: { label: 'EXCESS', cls: 'bg-blue-400/12 text-blue-400' },
}

export default function InventoryPage() {
  const stockouts = INVENTORY.filter(r => r.status === 'stockout').length
  const excess = INVENTORY.filter(r => r.status === 'excess').length
  const ok = INVENTORY.filter(r => r.status === 'ok').length

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Inventory Management</h1>
        <p className="text-slate-400 text-sm mt-1">4 Distribution Centres · Days on Hand heatmap · ABC class view</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Inventory Turnover', value: '8.5x', note: 'Target 9.0x' },
          { label: 'Avg Days on Hand', value: '43 DOH', note: 'Target <40' },
          { label: 'Stockout Risk SKUs', value: `${stockouts}`, note: `${INVENTORY.length} total SKUs` },
          { label: 'Excess Stock SKUs', value: `${excess}`, note: `${ok} at OK level` },
        ].map(({ label, value, note }) => (
          <div key={label} className="bg-white/4 border border-white/8 rounded-xl p-4">
            <div className="text-xl font-bold font-mono text-white">{value}</div>
            <div className="text-xs text-slate-500 mt-1">{label}</div>
            <div className="text-xs text-slate-600">{note}</div>
          </div>
        ))}
      </div>

      {/* Heatmap table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <div className="bg-white/4 border border-white/8 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-white/8 flex items-center gap-4">
            <h2 className="text-sm font-semibold text-white">DOH by SKU × Warehouse</h2>
            <div className="flex items-center gap-3 ml-auto text-xs text-slate-500">
              <span className="flex items-center gap-1"><span className="text-red-400 font-bold">&lt;7d</span> Stockout</span>
              <span className="flex items-center gap-1"><span className="text-amber-400">&lt;14d</span> Low</span>
              <span className="flex items-center gap-1"><span className="text-emerald-400">OK</span> 14-45d</span>
              <span className="flex items-center gap-1"><span className="text-blue-400">&gt;45d</span> Excess</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="text-left p-3 text-xs text-slate-500 font-medium">SKU</th>
                  <th className="text-left p-3 text-xs text-slate-500 font-medium">Product</th>
                  <th className="text-center p-3 text-xs text-slate-500 font-medium">Cls</th>
                  <th className="text-center p-3 text-xs text-slate-500 font-medium">Dubai DC</th>
                  <th className="text-center p-3 text-xs text-slate-500 font-medium">Jebel Ali</th>
                  <th className="text-center p-3 text-xs text-slate-500 font-medium">Riyadh DC</th>
                  <th className="text-center p-3 text-xs text-slate-500 font-medium">Kuwait DC</th>
                  <th className="text-center p-3 text-xs text-slate-500 font-medium">Avg DOH</th>
                  <th className="text-center p-3 text-xs text-slate-500 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {INVENTORY.map((row, i) => {
                  const badge = STATUS_BADGE[row.status]
                  return (
                    <motion.tr
                      key={row.sku}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.15 + i * 0.04 }}
                      className="border-b border-white/4 hover:bg-white/3"
                    >
                      <td className="p-3 font-mono text-xs text-slate-400">{row.sku}</td>
                      <td className="p-3 text-white">{row.name}</td>
                      <td className="p-3 text-center"><span className="text-xs font-bold text-emerald-400">{row.cls}</span></td>
                      <td className="p-3 text-center"><DOHCell days={row.dubai} /></td>
                      <td className="p-3 text-center"><DOHCell days={row.jebel} /></td>
                      <td className="p-3 text-center"><DOHCell days={row.riyadh} /></td>
                      <td className="p-3 text-center"><DOHCell days={row.kuwait} /></td>
                      <td className="p-3 text-center"><DOHCell days={row.avg_doh} /></td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${badge.cls}`}>{badge.label}</span>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Alert callouts */}
      <div className="grid sm:grid-cols-2 gap-3">
        {INVENTORY.filter(r => r.status === 'stockout' || (r.status === 'warn' && r.avg_doh < 12)).map(row => (
          <div key={row.sku} className="flex items-start gap-3 p-3 border border-red-500/20 bg-red-500/6 rounded-xl">
            <AlertTriangle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm text-white font-medium">{row.name}</div>
              <div className="text-xs text-slate-400">{row.avg_doh}d avg DOH — raise PO or expedite from surplus DC</div>
            </div>
          </div>
        ))}
        {INVENTORY.filter(r => r.status === 'excess').map(row => (
          <div key={row.sku} className="flex items-start gap-3 p-3 border border-blue-500/20 bg-blue-500/6 rounded-xl">
            <CheckCircle2 size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm text-white font-medium">{row.name}</div>
              <div className="text-xs text-slate-400">{row.avg_doh}d avg DOH — consider promotion to reduce excess</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
