'use client'

import { motion } from 'motion/react'
import { Activity, MapPin, Truck } from 'lucide-react'

const networkNodes = [
  { id: '1', name: 'Suppliers', color: 'from-blue-400 to-blue-600', count: 450 },
  { id: '2', name: 'Manufacturing', color: 'from-purple-400 to-purple-600', count: 42 },
  { id: '3', name: 'Distribution', color: 'from-emerald-400 to-emerald-600', count: 128 },
  { id: '4', name: 'Warehouses', color: 'from-orange-400 to-orange-600', count: 312 },
  { id: '5', name: 'Last Mile', color: 'from-pink-400 to-pink-600', count: 890 },
]

const topologyLinks = [
  { from: 0, to: 1, label: 'Inbound', delay: 0.1 },
  { from: 1, to: 2, label: 'Manufacturing', delay: 0.2 },
  { from: 2, to: 3, label: 'Distribution', delay: 0.3 },
  { from: 3, to: 4, label: 'Fulfillment', delay: 0.4 },
]

export default function NetworkTopologySection() {
  return (
    <section className="relative py-20 sm:py-32 bg-gradient-to-b from-off-black via-slate-900 to-off-black overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 right-0 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl opacity-20" />
        <div className="absolute bottom-1/4 left-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl opacity-20" />
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
              Supply Chain Topology
            </h2>
            <p className="text-lg text-slate-400">
              Unified visibility across your entire supply chain network. Monitor thousands of nodes in real-time.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-b from-slate-800/30 to-slate-900/30 border border-slate-700/30 rounded-2xl p-8 sm:p-12"
          >
            <svg
              viewBox="0 0 1200 300"
              className="w-full h-auto"
              preserveAspectRatio="xMidYMid meet"
            >
              {topologyLinks.map((link) => (
                <motion.g key={`link-${link.from}-${link.to}`}>
                  <motion.path
                    d={`M ${100 + link.from * 240} 150 Q ${150 + link.from * 240} ${
                      100 + Math.sin(link.delay * Math.PI) * 30
                    } ${100 + link.to * 240} 150`}
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.6 }}
                    transition={{ delay: link.delay, duration: 0.8 }}
                    viewport={{ once: true }}
                  />
                  <motion.text
                    x={`${(100 + link.from * 240 + 100 + link.to * 240) / 2}`}
                    y="120"
                    textAnchor="middle"
                    className="text-xs font-medium fill-slate-400"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: link.delay + 0.3, duration: 0.4 }}
                    viewport={{ once: true }}
                  >
                    {link.label}
                  </motion.text>
                </motion.g>
              ))}

              <defs>
                <linearGradient
                  id="gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#10b981" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
                </linearGradient>
              </defs>

              {networkNodes.map((node, index) => (
                <motion.g
                  key={node.id}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <circle
                    cx={100 + index * 240}
                    cy="150"
                    r="35"
                    fill={`url(#gradient-${node.id})`}
                    opacity="0.2"
                  />
                  <circle
                    cx={100 + index * 240}
                    cy="150"
                    r="30"
                    fill="none"
                    stroke="#0a0e27"
                    strokeWidth="2"
                  />
                  <motion.circle
                    cx={100 + index * 240}
                    cy="150"
                    r="30"
                    fill="none"
                    stroke={`url(#gradient-${node.id})`}
                    strokeWidth="2"
                    animate={{ r: [30, 32, 30] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  />

                  <text
                    x={100 + index * 240}
                    y="152"
                    textAnchor="middle"
                    className="text-xs font-bold fill-white"
                  >
                    {node.count}
                  </text>

                  <text
                    x={100 + index * 240}
                    y="210"
                    textAnchor="middle"
                    className="text-sm font-semibold fill-slate-100"
                  >
                    {node.name}
                  </text>

                  <defs>
                    <linearGradient
                      id={`gradient-${node.id}`}
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="currentColor" />
                      <stop offset="100%" stopColor="currentColor" />
                    </linearGradient>
                  </defs>
                </motion.g>
              ))}
            </svg>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Truck,
                label: 'Active Shipments',
                value: '24,847',
                subtext: 'Real-time tracking enabled',
              },
              {
                icon: MapPin,
                label: 'Network Nodes',
                value: '1,822',
                subtext: 'Fully monitored and optimized',
              },
              {
                icon: Activity,
                label: 'System Health',
                value: '99.97%',
                subtext: 'Uptime and reliability',
              },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="card"
              >
                <div className="space-y-3">
                  <stat.icon className="h-6 w-6 text-emerald-400" />
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-emerald-400">{stat.value}</p>
                  <p className="text-xs text-slate-600">{stat.subtext}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
