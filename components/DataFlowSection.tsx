'use client'

import { motion } from 'motion/react'
import { Database, BarChart3, Zap, Target } from 'lucide-react'

const dataFlowStages = [
  {
    icon: Database,
    title: 'Data Ingestion',
    description: 'Real-time data from 200+ supply chain sources',
    metrics: ['50K events/sec', '99.99% uptime', 'Sub-100ms latency'],
  },
  {
    icon: BarChart3,
    title: 'Analysis Engine',
    description: 'Multi-model AI processing and pattern detection',
    metrics: ['47 models', '94% accuracy', 'Ensemble voting'],
  },
  {
    icon: Zap,
    title: 'Decision Making',
    description: 'Autonomous agents evaluate and execute decisions',
    metrics: ['<50ms latency', '99.7% confidence', 'Real-time'],
  },
  {
    icon: Target,
    title: 'Optimization',
    description: 'Continuous improvement and learning loop',
    metrics: ['+8.3% efficiency', 'Daily updates', 'Self-adapting'],
  },
]

export default function DataFlowSection() {
  return (
    <section className="relative py-20 sm:py-32 bg-off-black overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent" />
      </div>

      <div className="container-max relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-12"
        >
          <div className="space-y-4 max-w-3xl">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-100">
              Data Flow Architecture
            </h2>
            <p className="text-lg text-slate-400">
              From ingestion to action: How Project Autopilot transforms raw data into intelligent decisions.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {dataFlowStages.map((stage, index) => {
              const Icon = stage.icon
              return (
                <motion.div
                  key={stage.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="card group relative">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/10 group-hover:to-emerald-500/5 transition-colors" />

                    <div className="relative space-y-4">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-white" />
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-slate-100">{stage.title}</h3>
                        <p className="text-sm text-slate-400 mt-1">{stage.description}</p>
                      </div>

                      <div className="space-y-1 pt-4 border-t border-slate-800">
                        {stage.metrics.map((metric) => (
                          <div key={metric} className="text-xs text-slate-500">
                            <span className="text-emerald-400">✓</span>
                            {' '}
                            {metric}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {index < dataFlowStages.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, scaleX: 0 }}
                      whileInView={{ opacity: 1, scaleX: 1 }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                      viewport={{ once: true }}
                      className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-500/0 origin-left"
                    />
                  )}
                </motion.div>
              )
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-12 pt-12 border-t border-slate-800"
          >
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  label: 'Sources Connected',
                  value: '200+',
                  subtext: 'ERP, WMS, TMS, Marketplace APIs',
                },
                {
                  label: 'Daily Transactions',
                  value: '4.3B',
                  subtext: 'Orders, shipments, inventory updates',
                },
                {
                  label: 'Decision Latency',
                  value: '<50ms',
                  subtext: 'From data to action execution',
                },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                  <p className="text-3xl sm:text-4xl font-bold text-emerald-400">{stat.value}</p>
                  <p className="text-xs text-slate-600 mt-2">{stat.subtext}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
