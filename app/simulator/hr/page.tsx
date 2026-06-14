'use client'

import { motion } from 'motion/react'
import { Users, Award, AlertTriangle } from 'lucide-react'

const DEPARTMENTS = [
  { name: 'Supply Chain', headcount: 450, engagement: 68, attrition_risk: 'high', avg_tenure: 4.2 },
  { name: 'Sales', headcount: 380, engagement: 71, attrition_risk: 'medium', avg_tenure: 3.8 },
  { name: 'Operations', headcount: 520, engagement: 75, attrition_risk: 'low', avg_tenure: 5.1 },
  { name: 'Finance', headcount: 280, engagement: 78, attrition_risk: 'low', avg_tenure: 5.8 },
  { name: 'Marketing', headcount: 240, engagement: 82, attrition_risk: 'low', avg_tenure: 4.5 },
  { name: 'Board & Exec', headcount: 22, engagement: 88, attrition_risk: 'low', avg_tenure: 7.2 },
]

export default function HRPage() {
  const totalHeadcount = DEPARTMENTS.reduce((sum, d) => sum + d.headcount, 0)
  const atRiskCount = DEPARTMENTS.filter(d => d.attrition_risk === 'high').reduce((sum, d) => sum + d.headcount, 0)

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Human Resources</h1>
        <p className="text-slate-400 text-sm mt-1">VP HR: Mohammed Al Balushi · 2,400 employees · 72% engagement</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Headcount', value: totalHeadcount, icon: Users },
          { label: 'Avg Engagement', value: '72%', icon: Award },
          { label: 'Attrition Risk', value: `${atRiskCount}`, icon: AlertTriangle, sub: 'high-risk roles' },
          { label: 'Avg Tenure', value: '5.1y', icon: Award },
        ].map(({ label, value, icon: Icon, sub }) => (
          <div key={label} className="bg-white/4 border border-white/8 rounded-xl p-4">
            <Icon size={16} className="text-emerald-400 mb-2" />
            <div className="text-lg font-bold font-mono text-white">{value}</div>
            <div className="text-xs text-slate-500 mt-1">{label}</div>
            {sub && <div className="text-xs text-slate-600">{sub}</div>}
          </div>
        ))}
      </div>

      {/* Department breakdown */}
      <div>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">Headcount & Engagement by Department</h2>
        <div className="space-y-3">
          {DEPARTMENTS.map((d, i) => {
            const riskColor = d.attrition_risk === 'high' ? 'text-red-400' : d.attrition_risk === 'medium' ? 'text-amber-400' : 'text-emerald-400'
            return (
              <motion.div
                key={d.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="p-4 bg-white/4 border border-white/8 rounded-xl"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-medium">{d.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{d.headcount} people · Avg tenure {d.avg_tenure}y</p>
                  </div>
                  <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${riskColor} ${d.attrition_risk === 'high' ? 'bg-red-400/12' : d.attrition_risk === 'medium' ? 'bg-amber-400/12' : 'bg-emerald-400/12'}`}>
                    {d.attrition_risk} risk
                  </span>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Engagement Score</span>
                    <span>{d.engagement}%</span>
                  </div>
                  <div className="w-full bg-white/8 rounded-full h-2">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${d.engagement}%` }} transition={{ duration: 0.7 }} className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full" />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* HR Actions */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="bg-amber-500/8 border border-amber-500/25 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-white mb-1">Recommended Actions</h3>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• Supply Chain dept: 68% engagement below 75% threshold — initiate retention conversations</li>
              <li>• Sales: 3 resignations risk in Q1 2024 — approval pending for retention bonuses</li>
              <li>• Q1 training budget: AED 480K allocated for leadership development</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
