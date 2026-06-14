'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { Building2, TrendingUp, Users, Globe, ChevronRight, Play, Zap } from 'lucide-react'

const STATS = [
  { label: 'Revenue', value: 'AED 2.8B', icon: TrendingUp },
  { label: 'Employees', value: '2,400', icon: Users },
  { label: 'Markets', value: '6 GCC', icon: Globe },
  { label: 'Listed', value: 'DFM', icon: Building2 },
]

const CHALLENGES = [
  'Make supply & demand decisions every month',
  'React to 20 live market events (Ramadan surge, competitor attacks, raw material shocks)',
  'Run monthly S&OP cycles across all departments',
  'Watch your share price move with every decision',
  'Expand from GCC to global stage through 8 opportunities',
  'Manage 22 people across your org — board, C-Suite, directors',
]

export default function SimulatorOnboarding() {
  const [seeding, setSeeding] = useState(false)
  const [seeded, setSeeded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSeed = async () => {
    setSeeding(true)
    setError(null)
    try {
      const res = await fetch('/api/simulator/seed', { method: 'POST' })
      const data = await res.json()
      if (data.success) setSeeded(true)
      else setError(data.error ?? 'Seed failed')
    } catch (e) {
      setError(String(e))
    } finally {
      setSeeding(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-3">
            DFM: ALMANR · AED 15.00
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Al Manar Industries LLC
          </h1>
          <p className="text-slate-400 text-lg mb-2">
            Dubai-based GCC FMCG powerhouse. You are the MD/CEO.
          </p>
          <p className="text-slate-500 text-sm mb-8">
            Every decision you make moves the share price. Every month is a battle.
            You have 22 people, 6 markets, and a DFM listing counting on you.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            {STATS.map(({ label, value, icon: Icon }) => (
              <motion.div
                key={label}
                whileHover={{ scale: 1.02 }}
                className="bg-white/4 border border-white/8 rounded-xl p-4"
              >
                <Icon size={16} className="text-emerald-400 mb-2" />
                <div className="text-lg font-bold text-white">{value}</div>
                <div className="text-xs text-slate-500">{label}</div>
              </motion.div>
            ))}
          </div>

          {/* What you'll do */}
          <div className="bg-white/4 border border-white/8 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={16} className="text-emerald-400" />
              <span className="text-sm font-semibold text-white uppercase tracking-wider">Your Mission</span>
            </div>
            <ul className="space-y-2.5">
              {CHALLENGES.map((c, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                  className="flex items-start gap-3 text-sm text-slate-300"
                >
                  <ChevronRight size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  {c}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3">
            {!seeded ? (
              <button
                onClick={handleSeed}
                disabled={seeding}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-xl transition-all disabled:opacity-60"
              >
                {seeding ? (
                  <><span className="animate-spin">⟳</span> Seeding Company Data...</>
                ) : (
                  <><Play size={16} /> Initialize Al Manar Industries</>
                )}
              </button>
            ) : (
              <Link
                href="/simulator/overview"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-xl transition-all"
              >
                Enter CEO Dashboard <ChevronRight size={16} />
              </Link>
            )}
            <Link
              href="/simulator/overview"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white/8 hover:bg-white/12 text-white rounded-xl transition-all text-sm"
            >
              Skip to Dashboard
            </Link>
          </div>

          {seeded && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-sm text-emerald-400"
            >
              Company initialized. 20 SKUs, 22 people, 6 months price history loaded.
            </motion.p>
          )}
          {error && (
            <p className="mt-4 text-sm text-red-400">Error: {error}</p>
          )}
        </motion.div>
      </div>
    </div>
  )
}
