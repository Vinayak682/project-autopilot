'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Play, Loader2 } from 'lucide-react'
import type { ProjectShowcase, DemoResult } from '@/lib/types'

interface ProjectCardProps {
  project: ProjectShowcase
  index: number
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<DemoResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const runDemo = async () => {
    setIsRunning(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(project.demoEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const data = (await response.json()) as DemoResult
      setResult(data)

      if (!data.success) {
        setError(data.error || 'Demo execution failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setResult(null)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <div className="card h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
            {project.icon}
          </div>
          <span className="text-xs font-bold text-slate-500 uppercase">
            Live Demo
          </span>
        </div>

        <h3 className="text-xl font-bold text-slate-100 mb-2">{project.title}</h3>
        <p className="text-slate-400 text-sm mb-4 flex-grow">{project.description}</p>

        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-slate-500">Capabilities</p>
            <div className="flex flex-wrap gap-2">
              {project.capabilities.map((cap) => (
                <span
                  key={cap}
                  className="inline-flex items-center rounded-full bg-slate-800/50 px-2.5 py-0.5 text-xs font-medium text-slate-300 border border-slate-700"
                >
                  {cap}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-slate-500">Key Metrics</p>
            <div className="grid grid-cols-2 gap-2">
              {project.metrics.map((metric) => (
                <div key={metric.label} className="p-2 rounded bg-slate-800/30 border border-slate-700">
                  <p className="text-xs text-slate-500">{metric.label}</p>
                  <p className="font-mono font-bold text-emerald-400 text-sm">
                    {metric.value}
                    {metric.unit}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-3 rounded-lg text-sm border ${
              result.success
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-red-500/10 border-red-500/30 text-red-300'
            }`}
          >
            {result.success ? '✓ Demo executed successfully' : '✗ Demo failed'}
            {result.executionTime && (
              <div className="text-xs text-slate-400 mt-1">
                Execution time: {result.executionTime}ms
              </div>
            )}
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 rounded-lg text-sm bg-red-500/10 border border-red-500/30 text-red-300"
          >
            Error: {error}
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={runDemo}
          disabled={isRunning}
          className="mt-6 button-primary w-full flex items-center justify-center gap-2"
        >
          {isRunning ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Run Demo
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}
