'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { fetchRecentDecisions, subscribeToDecisions } from '@/lib/supabase'
import type { AgentDecision, RealTimeSubscription } from '@/lib/types'
import { Zap, TrendingUp, AlertCircle } from 'lucide-react'

const mockDecisions: AgentDecision[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    agent: 'Route Optimizer',
    action: 'Rerouted 47 shipments via Memphis hub',
    reasoning: 'Dallas-Fort Worth hub experiencing 90% capacity due to weather delays',
    confidence: 0.96,
    result: 'Reduced ETA variance by 12 hours',
    impactMetrics: { costSavings: 23400, timeGain: 12 },
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    agent: 'Demand Forecaster',
    action: 'Increased inventory allocation for Product SKU-2847',
    reasoning: 'Detected 310% surge in demand across EU market with 94% confidence',
    confidence: 0.94,
    result: 'Prevented stockout probability reduced from 31% to 2%',
    impactMetrics: { demandCovered: 4200, revenueProtected: 890000 },
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 900000).toISOString(),
    agent: 'Supplier Manager',
    action: 'Activated secondary supplier for Component B',
    reasoning: 'Primary supplier lead time increased from 7 days to 28 days',
    confidence: 0.88,
    result: 'Maintained supply continuity across 15 production lines',
    impactMetrics: { componentsCovered: 12500, downtimeAvoided: 180 },
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 1200000).toISOString(),
    agent: 'Pricing Optimizer',
    action: 'Dynamic pricing adjustment on 82 SKUs',
    reasoning: 'Supply constraint + demand surge identified in APAC region',
    confidence: 0.91,
    result: 'Margin improvement of 4.2% across adjusted products',
    impactMetrics: { marginGain: 0.042, volumeImpact: 0.8 },
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 1500000).toISOString(),
    agent: 'Warehouse Planner',
    action: 'Prepositioned inventory in 4 distribution centers',
    reasoning: 'Seasonal demand peak forecast shows 18-day supply window',
    confidence: 0.85,
    result: 'Reduced fulfillment time by 2.3 days on average',
    impactMetrics: { fulfillmentSpeedup: 2.3, inventoryCost: 156000 },
  },
]

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 0.9) return 'text-emerald-400'
  if (confidence >= 0.8) return 'text-blue-400'
  return 'text-amber-400'
}

const getConfidenceBg = (confidence: number) => {
  if (confidence >= 0.9) return 'bg-emerald-500/20 border-emerald-500/30'
  if (confidence >= 0.8) return 'bg-blue-500/20 border-blue-500/30'
  return 'bg-amber-500/20 border-amber-500/30'
}

export default function AgentDecisionFeed() {
  const [decisions, setDecisions] = useState<AgentDecision[]>(mockDecisions)
  const [, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDecision, setSelectedDecision] = useState<AgentDecision | null>(decisions[0])

  useEffect(() => {
    let subscription: RealTimeSubscription | null = null

    const loadData = async () => {
      try {
        setLoading(true)
        const result = await fetchRecentDecisions(10)
        if (result.length > 0) {
          setDecisions(result)
          setSelectedDecision(result[0])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load decisions')
      } finally {
        setLoading(false)
      }
    }

    const setupSubscription = async () => {
      try {
        subscription = await subscribeToDecisions(
          (newDecision) => {
            setDecisions((prev) => [newDecision, ...prev.slice(0, 9)])
          },
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

  return (
    <section className="relative py-20 sm:py-32 bg-gradient-to-b from-off-black via-slate-900 to-off-black overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl opacity-20" />
        <div className="absolute bottom-1/4 -left-40 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl opacity-20" />
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
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-emerald-400" />
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-100">
                Agent Decision Feed
              </h2>
            </div>
            <p className="text-lg text-slate-400 max-w-2xl">
              Real-time decisions made by autonomous AI agents optimizing your supply chain.
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-4 text-amber-400 text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {selectedDecision && (
                <motion.div
                  key={selectedDecision.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="card border-emerald-500/30 bg-emerald-500/5 h-full"
                >
                  <div className="space-y-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            {selectedDecision.agent}
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-100">
                          {selectedDecision.action}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {new Date(selectedDecision.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1.5 rounded-lg border font-mono font-bold ${getConfidenceBg(selectedDecision.confidence)} ${getConfidenceColor(selectedDecision.confidence)}`}
                      >
                        {(selectedDecision.confidence * 100).toFixed(0)}%
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-800">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">
                          Reasoning
                        </p>
                        <p className="text-slate-300 leading-relaxed">
                          {selectedDecision.reasoning}
                        </p>
                      </div>

                      {selectedDecision.result && (
                        <div>
                          <p className="text-xs uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            Result
                          </p>
                          <p className="text-slate-300 leading-relaxed">
                            {selectedDecision.result}
                          </p>
                        </div>
                      )}

                      {selectedDecision.impactMetrics && (
                        <div>
                          <p className="text-xs uppercase tracking-wider text-slate-500 mb-3">
                            Impact Metrics
                          </p>
                          <div className="grid grid-cols-2 gap-3">
                            {Object.entries(selectedDecision.impactMetrics).map(([key, value]) => (
                              <div key={key} className="p-2 rounded bg-slate-800/50 border border-slate-700">
                                <p className="text-xs text-slate-500 capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </p>
                                <p className="text-emerald-400 font-bold text-sm mt-1">
                                  {typeof value === 'number' && value > 1
                                    ? value.toLocaleString()
                                    : `${(value * 100).toFixed(1)}%`}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="space-y-3 h-fit sticky top-20">
              <p className="text-xs uppercase tracking-wider text-slate-500 px-2">Recent Decisions</p>
              {decisions.map((decision, idx) => (
                <motion.button
                  key={decision.id}
                  onClick={() => setSelectedDecision(decision)}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedDecision?.id === decision.id
                      ? 'bg-emerald-500/20 border-emerald-500/50'
                      : 'bg-slate-800/30 border-slate-700/30 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-slate-400 uppercase">
                        {decision.agent}
                      </p>
                      <div
                        className={`text-xs font-bold ${getConfidenceColor(decision.confidence)}`}
                      >
                        {(decision.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                    <p
                      className={`text-sm font-medium line-clamp-2 ${
                        selectedDecision?.id === decision.id
                          ? 'text-slate-100'
                          : 'text-slate-400'
                      }`}
                    >
                      {decision.action}
                    </p>
                    <p className="text-xs text-slate-600">
                      {new Date(decision.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
