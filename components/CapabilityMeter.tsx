'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { TrendingUp, RefreshCw } from 'lucide-react'
import { fetchCapabilityMetrics, subscribeToCapabilityMetrics } from '@/lib/supabase'
import type { CapabilityData, RealTimeSubscription } from '@/lib/types'

const mockCapabilityData: CapabilityData = {
  overallScore: 87,
  lastEvaluated: new Date().toISOString(),
  metrics: [
    {
      id: '1',
      name: 'Demand Forecasting',
      current: 94,
      target: 95,
      unit: '%',
      trend: 'up',
      lastUpdated: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'OTIF Score',
      current: 99.7,
      target: 99.8,
      unit: '%',
      trend: 'stable',
      lastUpdated: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Disruption Detection',
      current: 87,
      target: 90,
      unit: '%',
      trend: 'up',
      lastUpdated: new Date().toISOString(),
    },
    {
      id: '4',
      name: 'Cost Optimization',
      current: 76,
      target: 85,
      unit: '%',
      trend: 'down',
      lastUpdated: new Date().toISOString(),
    },
  ],
}

export default function CapabilityMeter() {
  const [data, setData] = useState<CapabilityData>(mockCapabilityData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let subscription: RealTimeSubscription | null = null

    const loadData = async () => {
      try {
        setLoading(true)
        const result = await fetchCapabilityMetrics()
        if (result) {
          setData(result)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load metrics')
        setData(mockCapabilityData)
      } finally {
        setLoading(false)
      }
    }

    const setupSubscription = async () => {
      try {
        subscription = await subscribeToCapabilityMetrics(
          (newData) => setData(newData),
          (err) => setError(err.message)
        )
      } catch (err) {
        console.error('Subscription setup failed:', err)
      }
    }

    loadData()
    setupSubscription()

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-emerald-400" />
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-400 rotate-180" />
      default:
        return <div className="h-4 w-4 text-slate-500" />
    }
  }

  return (
    <section className="relative py-20 sm:py-32 bg-gradient-to-b from-off-black to-slate-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 right-0 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      <div className="container-max relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-12"
        >
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-100">
              Capability Meter
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl">
              Real-time performance metrics across all supply chain optimization capabilities.
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="card lg:col-span-2"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-slate-100">Overall Capability Score</h3>
                <motion.button
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.5 }}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                  disabled={loading}
                >
                  <RefreshCw className={`h-5 w-5 text-emerald-400 ${loading ? 'animate-spin' : ''}`} />
                </motion.button>
              </div>

              <div className="relative h-48 flex items-center justify-center">
                <svg className="h-32 w-32" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-slate-700"
                  />
                  <motion.circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={`${(data.overallScore / 100) * 2 * Math.PI * 50} ${
                      2 * Math.PI * 50
                    }`}
                    className="text-emerald-400"
                    style={{
                      transform: 'rotate(-90deg)',
                      transformOrigin: '60px 60px',
                    }}
                    initial={{ strokeDasharray: '0 314.16' }}
                    whileInView={{
                      strokeDasharray: `${(data.overallScore / 100) * 2 * Math.PI * 50} ${
                        2 * Math.PI * 50
                      }`,
                    }}
                    transition={{ duration: 1.5, delay: 0.2 }}
                    viewport={{ once: true }}
                  />
                </svg>
                <div className="absolute text-center">
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <div className="text-5xl font-bold text-emerald-400">{data.overallScore}</div>
                    <div className="text-sm text-slate-400">Overall Score</div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {data.metrics.map((metric, index) => (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-100">{metric.name}</h3>
                    {getTrendIcon(metric.trend)}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Current</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {metric.current}
                        {metric.unit}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(metric.current / metric.target) * 100}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 pt-2 border-t border-slate-800">
                    Target: {metric.target}
                    {metric.unit}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center text-sm text-slate-500"
          >
            Last evaluated: {new Date(data.lastEvaluated).toLocaleString()}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
