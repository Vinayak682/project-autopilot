'use client'

import { motion } from 'motion/react'
import ProjectCard from './ProjectCard'
import type { ProjectShowcase } from '@/lib/types'

const projects: ProjectShowcase[] = [
  {
    id: '1',
    title: 'OTIF Copilot',
    description:
      'Real-time On-Time In-Full analysis with predictive optimization recommendations. Monitors delivery windows and automatically adjusts routes.',
    capabilities: ['Predictive Analytics', 'Route Optimization', 'Real-time Tracking'],
    metrics: [
      { label: 'Current OTIF', value: '99.7', unit: '%' },
      { label: 'Avg Improvement', value: '+2.4', unit: '%' },
      { label: 'Scope', value: '50K+', unit: 'SKUs' },
    ],
    demoEndpoint: '/api/demo/otif-copilot',
    icon: '📦',
  },
  {
    id: '2',
    title: 'GCC Surge Forecaster',
    description:
      'Detects demand surges across Global Commodity Centers with multi-factor analysis. Accounts for seasonality, events, and market conditions.',
    capabilities: ['Demand Forecasting', 'Surge Detection', 'Factor Analysis'],
    metrics: [
      { label: 'Forecast Accuracy', value: '94', unit: '%' },
      { label: 'Lead Time', value: '5-7', unit: 'days' },
      { label: 'Coverage', value: '12', unit: 'regions' },
    ],
    demoEndpoint: '/api/demo/gcc-surge',
    icon: '📈',
  },
  {
    id: '3',
    title: 'Model Comparison Engine',
    description:
      'Compare forecasting models in real-time. Evaluates accuracy, speed, and resource utilization to recommend optimal models per scenario.',
    capabilities: ['Model Selection', 'Benchmarking', 'Performance Analysis'],
    metrics: [
      { label: 'Models Evaluated', value: '47', unit: '' },
      { label: 'Avg Latency', value: '42', unit: 'ms' },
      { label: 'Accuracy Gain', value: '+8.3', unit: '%' },
    ],
    demoEndpoint: '/api/demo/forecast',
    icon: '🤖',
  },
  {
    id: '4',
    title: 'Capability Evaluator',
    description:
      'Daily automated evaluation of supply chain capabilities against targets. Identifies gaps and recommends optimization strategies.',
    capabilities: ['Capability Assessment', 'Gap Analysis', 'Recommendations'],
    metrics: [
      { label: 'Overall Score', value: '87', unit: '/100' },
      { label: 'Metrics Tracked', value: '24', unit: '' },
      { label: 'Update Frequency', value: 'Daily', unit: '' },
    ],
    demoEndpoint: '/api/capability-meter/evaluate',
    icon: '⚡',
  },
]

export default function ProjectsSection() {
  return (
    <section className="relative py-20 sm:py-32 bg-gradient-to-b from-slate-900 via-off-black to-slate-900 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl opacity-20" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl opacity-20" />
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
              Live Demos & Projects
            </h2>
            <p className="text-lg text-slate-400">
              Explore our AI-powered supply chain optimization demos. Run live models and see real-time
              results powered by state-of-the-art AI agents.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl p-6 text-center"
          >
            <p className="text-sm text-slate-400">
              💡
              {' '}
              Click &quot;Run Demo&quot; on any card to execute the live analysis in real-time.
              <span className="block text-xs text-slate-600 mt-2">
                Demos connect to Anthropic Claude API for advanced reasoning and analysis.
              </span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
