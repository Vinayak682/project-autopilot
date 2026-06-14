'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import {
  LayoutDashboard, Users, TrendingUp, BarChart2, ShoppingCart,
  Megaphone, DollarSign, Truck, Globe, Briefcase, ChevronRight,
  Building2, ArrowUpRight, ArrowDownRight, Menu, X,
} from 'lucide-react'
import { ClaudeAdvisorPanel } from '@/components/simulator/ClaudeAdvisorPanel'

const NAV = [
  { label: 'Overview', href: '/simulator/overview', icon: LayoutDashboard },
  { label: 'Org & Board', href: '/simulator/org', icon: Users },
  { label: 'Supply Chain', href: '/simulator/supply', icon: Truck },
  { label: 'S&OP', href: '/simulator/sop', icon: BarChart2 },
  { label: 'Finance', href: '/simulator/finance', icon: DollarSign },
  { label: 'Sales', href: '/simulator/sales', icon: TrendingUp },
  { label: 'Marketing', href: '/simulator/marketing', icon: Megaphone },
  { label: 'Commercials', href: '/simulator/commercials', icon: ShoppingCart },
  { label: 'HR', href: '/simulator/hr', icon: Briefcase },
  { label: 'Expansion', href: '/simulator/expansion', icon: Globe },
  { label: 'Board Room', href: '/simulator/board', icon: Building2 },
  { label: 'Decisions', href: '/simulator/decisions', icon: ChevronRight },
]

function PriceTicker({ price, prevPrice }: { price: number; prevPrice: number }) {
  const delta = price - prevPrice
  const pct = prevPrice > 0 ? (delta / prevPrice) * 100 : 0
  const up = delta >= 0

  return (
    <div className="flex items-center gap-2">
      <motion.span
        key={price}
        initial={{ opacity: 0, y: up ? -8 : 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-mono font-bold text-white"
      >
        AED {price.toFixed(2)}
      </motion.span>
      <span className={`flex items-center gap-0.5 text-sm font-mono font-medium ${up ? 'text-emerald-400' : 'text-red-400'}`}>
        {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {pct > 0 ? '+' : ''}{pct.toFixed(2)}%
      </span>
    </div>
  )
}

export default function SimulatorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sharePrice, setSharePrice] = useState(15.00)
  const [prevPrice, setPrevPrice] = useState(15.00)
  const [month, setMonth] = useState(1)
  const [year, setYear] = useState(2024)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const fetchGameState = useCallback(async () => {
    try {
      const res = await fetch('/api/simulator/game/state')
      if (!res.ok) return
      const data = await res.json()
      if (data.gameState) {
        setPrevPrice(sharePrice)
        setSharePrice(data.gameState.share_price ?? 15.00)
        setMonth(data.gameState.current_month ?? 1)
        setYear(data.gameState.current_year ?? 2024)
      }
    } catch {
      // Supabase not configured yet — keep default values
    }
  }, [sharePrice])

  useEffect(() => {
    fetchGameState()
    const interval = setInterval(fetchGameState, 30_000)
    return () => clearInterval(interval)
  }, [fetchGameState])

  const calMonth = ((month - 1) % 12) + 1

  return (
    <div className="min-h-screen bg-[#0a0e27] flex">
      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen) && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-60 bg-[#0d1230] border-r border-white/8 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-white/8">
          <Link href="/simulator" className="block">
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest">DFM: ALMANR</div>
            <div className="text-sm font-semibold text-white mt-0.5">Al Manar Industries</div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-all ${
                  active
                    ? 'text-white bg-emerald-500/12 border-r-2 border-emerald-400'
                    : 'text-slate-400 hover:text-white hover:bg-white/4'
                }`}
              >
                <Icon size={15} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Footer: role badge */}
        <div className="p-4 border-t border-white/8">
          <div className="text-xs text-slate-500 mb-1">Logged in as</div>
          <div className="text-sm font-medium text-white">MD / CEO</div>
          <div className="text-xs text-slate-500">Al Manar Industries LLC</div>
        </div>
      </motion.aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="sticky top-0 z-30 h-14 bg-[#0a0e27]/95 backdrop-blur border-b border-white/8 flex items-center gap-4 px-4 lg:px-6">
          <button
            className="lg:hidden text-slate-400 hover:text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* Month indicator */}
          <div className="text-xs font-mono text-slate-500 uppercase tracking-widest hidden sm:block">
            {MONTH_NAMES[calMonth - 1]} {year}
          </div>

          <div className="flex-1" />

          {/* Share price ticker */}
          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-500 hidden sm:block">Share Price</div>
            <PriceTicker price={sharePrice} prevPrice={prevPrice} />
          </div>

          {/* Quick advance month */}
          <button
            onClick={async () => {
              await fetch('/api/simulator/game/advance-month', { method: 'POST' })
              fetchGameState()
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/16 text-emerald-400 text-xs font-medium hover:bg-emerald-500/24 transition-colors"
          >
            Advance Month →
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Claude Advisor (global) */}
      <ClaudeAdvisorPanel department={getDepartmentFromPath(pathname)} />
    </div>
  )
}

function getDepartmentFromPath(pathname: string): string {
  if (pathname.includes('/supply')) return 'Supply Chain'
  if (pathname.includes('/sales')) return 'Sales'
  if (pathname.includes('/marketing')) return 'Marketing'
  if (pathname.includes('/commercials')) return 'Commercials'
  if (pathname.includes('/finance')) return 'Finance'
  if (pathname.includes('/hr')) return 'Human Resources'
  if (pathname.includes('/sop')) return 'Supply & Operations Planning'
  if (pathname.includes('/expansion')) return 'Strategy & Expansion'
  return 'Al Manar Industries'
}
