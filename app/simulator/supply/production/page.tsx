'use client'

import { motion } from 'motion/react'

const FACILITIES = [
  {
    name: 'Dubai Plant',
    location: 'Dubai Industrial City',
    capacity_units: 1200000,
    planned: 1050000,
    actual: 980000,
    oee: 82.0,
    utilization: 79.2,
    downtime_h: 18,
    reject_pct: 1.4,
    lines: ['Line 1 – UHT Milk', 'Line 2 – Juices', 'Line 3 – Yoghurt'],
  },
  {
    name: 'Jebel Ali Plant',
    location: 'Jebel Ali Free Zone',
    capacity_units: 900000,
    planned: 780000,
    actual: 748000,
    oee: 83.2,
    utilization: 76.4,
    downtime_h: 9,
    reject_pct: 1.1,
    lines: ['Line 4 – Fresh Dairy', 'Line 5 – Labneh & Cheese'],
  },
]

function ProgressBar({ value, max, color = 'emerald' }: { value: number; max: number; color?: string }) {
  const pct = (value / max) * 100
  return (
    <div className="h-2 bg-white/8 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={`h-full rounded-full bg-${color}-400`}
      />
    </div>
  )
}

export default function ProductionPage() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Production Planning</h1>
        <p className="text-slate-400 text-sm mt-1">COO: Omar Bin Rashid · 2 plants · 5 production lines</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-6">
        {FACILITIES.map((f, i) => (
          <motion.div
            key={f.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/4 border border-white/8 rounded-2xl p-6 space-y-5"
          >
            <div>
              <h2 className="text-lg font-bold text-white">{f.name}</h2>
              <p className="text-xs text-slate-500">{f.location}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'OEE', value: `${f.oee}%`, target: '85%', ok: f.oee >= 83 },
                { label: 'Utilization', value: `${f.utilization}%`, target: '80%', ok: f.utilization >= 78 },
                { label: 'Downtime', value: `${f.downtime_h}h`, target: '<12h', ok: f.downtime_h < 12 },
                { label: 'Reject %', value: `${f.reject_pct}%`, target: '<1.5%', ok: f.reject_pct < 1.5 },
              ].map(({ label, value, target, ok }) => (
                <div key={label} className="bg-white/4 rounded-xl p-3">
                  <div className={`text-lg font-bold font-mono ${ok ? 'text-emerald-400' : 'text-amber-400'}`}>{value}</div>
                  <div className="text-xs text-slate-500">{label} · vs {target}</div>
                </div>
              ))}
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Output: {f.actual.toLocaleString()} / {f.planned.toLocaleString()} units</span>
                <span>{((f.actual / f.planned) * 100).toFixed(0)}% of plan</span>
              </div>
              <ProgressBar value={f.actual} max={f.capacity_units} color="emerald" />
            </div>

            <div>
              <div className="text-xs text-slate-500 mb-2">Production Lines</div>
              <div className="space-y-1">
                {f.lines.map(line => (
                  <div key={line} className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400/60 flex-shrink-0" />
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
