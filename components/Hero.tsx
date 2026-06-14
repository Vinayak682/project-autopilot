'use client'

import { motion } from 'motion/react'
import { ArrowRight, Zap } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-off-black via-off-black to-slate-900 pt-20 sm:pt-32 pb-20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-0 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl opacity-20" />
      </div>

      <div className="container-max relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-2"
              >
                <Zap className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-400">
                  AI-Powered Supply Chain
                </span>
              </motion.div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="block text-slate-100">Autopilot Your</span>
                <span className="gradient-text block">Supply Chain</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-400 max-w-lg leading-relaxed">
                Real-time optimization, predictive disruption detection, and autonomous agent
                decision-making. Monitor every metric that matters.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="button-primary"
              >
                View Live Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="button-secondary"
              >
                Read Documentation
              </motion.button>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-6 pt-8 border-t border-slate-800"
            >
              {[
                { label: 'OTIF Score', value: '99.7%' },
                { label: 'Forecast Accuracy', value: '94%' },
                { label: 'Decision Latency', value: '<50ms' },
              ].map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-emerald-400">{stat.value}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative h-96 lg:h-full min-h-96"
          >
            <div className="absolute inset-0 rounded-2xl border border-slate-700/50 bg-gradient-to-b from-slate-800/30 to-slate-900/30 backdrop-blur-xl p-8">
              <div className="h-full flex flex-col justify-between">
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="h-2 bg-gradient-to-r from-emerald-500/20 to-emerald-500/5 rounded-full"
                    />
                  ))}
                </div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="space-y-3"
                >
                  {[0.6, 0.8, 0.95].map((height, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Metric {i + 1}</span>
                        <span>{Math.round(height * 100)}%</span>
                      </div>
                      <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                          style={{ width: `${height * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
