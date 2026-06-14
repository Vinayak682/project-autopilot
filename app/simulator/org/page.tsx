'use client'

import { motion } from 'motion/react'
import { Crown, Shield, Briefcase, ChevronDown } from 'lucide-react'

interface Member {
  level: number
  title: string
  name: string
  department: string
  reports_to: string | null
  is_player: boolean
}

const ORG: Member[] = [
  // Board
  { level: 0, title: 'Chairman', name: 'Sheikh Mohammed Al Hamdan Al Maktoum', department: 'Board', reports_to: null, is_player: false },
  { level: 0, title: 'Independent Director', name: 'Fatima Al Rashidi', department: 'Board', reports_to: null, is_player: false },
  { level: 0, title: 'Audit Committee Chair', name: 'Dr. Khalid Al Suwaidi', department: 'Board', reports_to: null, is_player: false },
  { level: 0, title: 'Independent Director', name: 'James Thornton', department: 'Board', reports_to: null, is_player: false },
  { level: 0, title: 'NRC Member', name: 'Rania Al Farsi', department: 'Board', reports_to: null, is_player: false },
  // MD
  { level: 1, title: 'MD / CEO', name: 'You', department: 'Executive', reports_to: null, is_player: true },
  // C-Suite
  { level: 2, title: 'CFO', name: 'Nadia Al Zahra', department: 'Finance', reports_to: null, is_player: false },
  { level: 2, title: 'COO', name: 'Omar Bin Rashid', department: 'Operations', reports_to: null, is_player: false },
  { level: 2, title: 'CMO', name: 'Leila Mansouri', department: 'Marketing', reports_to: null, is_player: false },
  { level: 2, title: 'CSCO', name: 'Faris Al Tamimi', department: 'Supply Chain', reports_to: null, is_player: false },
  { level: 2, title: 'VP Sales', name: 'Priya Nair', department: 'Sales', reports_to: null, is_player: false },
  { level: 2, title: 'VP HR', name: 'Mohammed Al Balushi', department: 'HR', reports_to: null, is_player: false },
  { level: 2, title: 'VP Legal', name: 'Tarek Saad', department: 'Legal', reports_to: null, is_player: false },
  // Directors
  { level: 3, title: 'Finance Controller', name: 'Aisha Al Mansouri', department: 'Finance', reports_to: null, is_player: false },
  { level: 3, title: 'Head of Demand Planning', name: 'Ravi Krishnamurthy', department: 'Supply Chain', reports_to: null, is_player: false },
  { level: 3, title: 'Head of Supply Planning', name: 'Sara Al Dhaheri', department: 'Supply Chain', reports_to: null, is_player: false },
  { level: 3, title: 'Head of Procurement', name: 'Yusuf Al Qassimi', department: 'Supply Chain', reports_to: null, is_player: false },
  { level: 3, title: 'Head of Logistics', name: 'Thomas Andersen', department: 'Supply Chain', reports_to: null, is_player: false },
  { level: 3, title: 'Commercial Director', name: 'Layla Karimi', department: 'Sales', reports_to: null, is_player: false },
  { level: 3, title: 'Brand Director', name: 'Noura Al Nuaimi', department: 'Marketing', reports_to: null, is_player: false },
  { level: 3, title: 'Key Accounts Director', name: 'Deepak Sharma', department: 'Sales', reports_to: null, is_player: false },
  { level: 3, title: 'People & Culture Lead', name: 'Hana Al Marri', department: 'HR', reports_to: null, is_player: false },
]

const DEPT_COLORS: Record<string, string> = {
  Board: 'border-amber-400/40 bg-amber-400/8',
  Executive: 'border-emerald-400/60 bg-emerald-400/12',
  Finance: 'border-blue-400/40 bg-blue-400/8',
  Operations: 'border-orange-400/40 bg-orange-400/8',
  'Supply Chain': 'border-cyan-400/40 bg-cyan-400/8',
  Sales: 'border-purple-400/40 bg-purple-400/8',
  Marketing: 'border-pink-400/40 bg-pink-400/8',
  HR: 'border-indigo-400/40 bg-indigo-400/8',
  Legal: 'border-slate-400/40 bg-slate-400/8',
}

function MemberCard({ m, delay = 0 }: { m: Member; delay?: number }) {
  const colors = DEPT_COLORS[m.department] ?? 'border-white/10 bg-white/4'
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.35 }}
      className={`border rounded-xl p-3 text-center min-w-[140px] max-w-[160px] ${colors} ${m.is_player ? 'ring-2 ring-emerald-400/50' : ''}`}
    >
      <div className="text-xs text-slate-400 mb-1 leading-tight">{m.title}</div>
      <div className={`text-sm font-semibold leading-tight ${m.is_player ? 'text-emerald-400' : 'text-white'}`}>
        {m.is_player ? (
          <span className="flex items-center justify-center gap-1"><Crown size={12} />{m.name}</span>
        ) : m.name}
      </div>
      <div className="text-xs text-slate-600 mt-1">{m.department}</div>
    </motion.div>
  )
}

function OrgRow({ members, delay = 0 }: { members: Member[]; delay?: number }) {
  return (
    <div className="flex flex-wrap items-start justify-center gap-3">
      {members.map((m, i) => <MemberCard key={m.name} m={m} delay={delay + i * 0.05} />)}
    </div>
  )
}

const levels = [0, 1, 2, 3]

export default function OrgPage() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white mb-1">Organisation Chart</h1>
        <p className="text-slate-400 text-sm mb-8">Al Manar Industries LLC · 22 people · 5 levels</p>
      </motion.div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-10">
        {Object.entries(DEPT_COLORS).map(([dept, cls]) => (
          <div key={dept} className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs ${cls}`}>
            <span className="text-slate-300">{dept}</span>
          </div>
        ))}
      </div>

      {/* Tree */}
      <div className="space-y-6">
        {levels.map((level, li) => {
          const members = ORG.filter(m => m.level === level)
          if (!members.length) return null
          const labels = ['Board of Directors', 'Managing Director / CEO', 'C-Suite Leadership', 'Department Directors']
          const icons = [Shield, Crown, Briefcase, Briefcase]
          const LIcon = icons[level]
          return (
            <div key={level}>
              <div className="flex items-center gap-2 mb-4">
                <LIcon size={14} className="text-slate-500" />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{labels[level]}</span>
              </div>
              <OrgRow members={members} delay={li * 0.08} />
              {level < 3 && (
                <div className="flex justify-center mt-4">
                  <ChevronDown size={18} className="text-slate-700" />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Headcount summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {[
          { label: 'Total Headcount', value: '2,400' },
          { label: 'Org Chart Shown', value: '22' },
          { label: 'UAE Employees', value: '1,640' },
          { label: 'GCC Employees', value: '760' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white/4 border border-white/8 rounded-xl p-4">
            <div className="text-xl font-bold font-mono text-white">{value}</div>
            <div className="text-xs text-slate-500 mt-1">{label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
