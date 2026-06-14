'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import gsap from 'gsap'
import { ChevronLeft, ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react'
import type { DisruptionEvent } from '@/lib/types'

const mockDisruptionEvents: DisruptionEvent[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    title: 'Port Congestion Alert',
    description: 'Port of Los Angeles experiencing 48-hour delays. Automated rerouting initiated.',
    impact: 'high',
    resolution: 'Alternative logistics via Oakland Port implemented. ETA adjusted by 24 hours.',
    duration: 120,
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    title: 'Supplier Capacity Override',
    description: 'Shanghai manufacturing facility operating at 120% capacity due to surge demand.',
    impact: 'critical',
    resolution: 'Distributed 35% of orders to secondary suppliers in Vietnam and Thailand.',
    duration: 240,
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    title: 'Weather-Induced Route Disruption',
    description: 'Severe storms blocking primary distribution route in Midwest region.',
    impact: 'medium',
    resolution: 'Rerouted 42 shipments through northern corridor. Minimal delivery impact.',
    duration: 180,
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    title: 'Demand Spike Detected',
    description: '340% surge in demand for Product A detected across South American region.',
    impact: 'high',
    resolution: 'Surge forecasting algorithm activated. Additional inventory allocated.',
    duration: 480,
  },
]

const ImpactBadge = ({ impact }: { impact: string }) => {
  const config = {
    critical: { color: 'bg-red-500/20 text-red-300 border-red-500/30', label: 'Critical' },
    high: { color: 'bg-orange-500/20 text-orange-300 border-orange-500/30', label: 'High' },
    medium: { color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', label: 'Medium' },
    low: { color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', label: 'Low' },
  }

  const cfg = config[impact as keyof typeof config] || config.low
  return (
    <div className={`badge border ${cfg.color}`}>{cfg.label}</div>
  )
}

export default function DisruptionReplay() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  const currentEvent = mockDisruptionEvents[currentIndex]

  useEffect(() => {
    if (!isAutoPlay) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mockDisruptionEvents.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [isAutoPlay])

  useEffect(() => {
    if (!containerRef.current) return

    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
      }
    )
  }, [currentIndex])

  useEffect(() => {
    if (!timelineRef.current) return

    const children = timelineRef.current.querySelectorAll('[data-timeline-item]')
    gsap.to(children, {
      opacity: (i) => (i === currentIndex ? 1 : 0.3),
      y: (i) => (i === currentIndex ? 0 : 5),
      duration: 0.4,
      stagger: 0,
      ease: 'power2.out',
    })
  }, [currentIndex])

  const nextEvent = () => {
    setCurrentIndex((prev) => (prev + 1) % mockDisruptionEvents.length)
    setIsAutoPlay(false)
  }

  const prevEvent = () => {
    setCurrentIndex((prev) => (prev - 1 + mockDisruptionEvents.length) % mockDisruptionEvents.length)
    setIsAutoPlay(false)
  }

  return (
    <section className="relative py-20 sm:py-32 bg-gradient-to-b from-slate-900 via-off-black to-off-black overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-red-500/10 blur-3xl opacity-20" />
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
              Disruption Replay
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl">
              Real-time incident detection and automated resolution across your supply chain.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <motion.div
                ref={containerRef}
                key={currentEvent.id}
                className="card"
              >
                <div className="space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <h3 className="text-2xl font-bold text-slate-100">{currentEvent.title}</h3>
                      <p className="text-sm text-slate-500">
                        {new Date(currentEvent.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <ImpactBadge impact={currentEvent.impact} />
                  </div>

                  <div className="border-l-2 border-emerald-500/30 pl-4 space-y-3">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">
                        Incident
                      </p>
                      <p className="text-slate-300">{currentEvent.description}</p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">
                        Resolution
                      </p>
                      <div className="flex gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <p className="text-slate-300">{currentEvent.resolution}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Duration</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {currentEvent.duration} min
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="flex items-center justify-between mt-8">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={prevEvent}
                  className="button-secondary p-3"
                  aria-label="Previous incident"
                >
                  <ChevronLeft className="h-5 w-5" />
                </motion.button>

                <div className="text-sm text-slate-400">
                  <span className="font-bold text-emerald-400">{currentIndex + 1}</span>
                  {' '}
                  of
                  {' '}
                  <span className="font-bold text-emerald-400">{mockDisruptionEvents.length}</span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextEvent}
                  className="button-secondary p-3"
                  aria-label="Next incident"
                >
                  <ChevronRight className="h-5 w-5" />
                </motion.button>
              </div>
            </div>

            <div className="space-y-2" ref={timelineRef}>
              <p className="text-xs uppercase tracking-wider text-slate-500 px-2">Timeline</p>
              {mockDisruptionEvents.map((event, idx) => (
                <motion.button
                  key={event.id}
                  data-timeline-item
                  onClick={() => {
                    setCurrentIndex(idx)
                    setIsAutoPlay(false)
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    idx === currentIndex
                      ? 'bg-emerald-500/20 border border-emerald-500/50'
                      : 'bg-slate-800/30 border border-slate-700/30 hover:border-slate-700'
                  }`}
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: idx === currentIndex ? 1 : 0.3 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start gap-2">
                    <AlertTriangle
                      className={`h-4 w-4 flex-shrink-0 mt-0.5 ${
                        idx === currentIndex ? 'text-emerald-400' : 'text-slate-500'
                      }`}
                    />
                    <div className="space-y-1 min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${
                          idx === currentIndex ? 'text-slate-100' : 'text-slate-400'
                        }`}
                      >
                        {event.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
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
