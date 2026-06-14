'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Mail, Github, Linkedin, Twitter, Send, AlertCircle } from 'lucide-react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      setMessage({ type: 'error', text: 'Please enter a valid email' })
      return
    }

    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setMessage({ type: 'success', text: 'Thanks for subscribing! Check your email.' })
      setEmail('')
    } catch {
      setMessage({ type: 'error', text: 'Subscription failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const links = {
    product: [
      { label: 'Features', href: '#' },
      { label: 'Pricing', href: '#' },
      { label: 'Demo', href: '#' },
      { label: 'Case Studies', href: '#' },
    ],
    company: [
      { label: 'About Us', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' },
    ],
    resources: [
      { label: 'Documentation', href: '#' },
      { label: 'API Reference', href: '#' },
      { label: 'Community', href: '#' },
      { label: 'Support', href: '#' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Security', href: '#' },
      { label: 'Compliance', href: '#' },
    ],
  }

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Mail, href: '#', label: 'Email' },
  ]

  return (
    <footer className="relative bg-off-black border-t border-slate-800 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl opacity-20 -translate-x-1/2" />
      </div>

      <div className="container-max relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="py-20 space-y-16"
        >
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <h3 className="text-lg font-bold text-slate-100 mb-6">Project Autopilot</h3>
              <p className="text-sm text-slate-400 mb-6">
                AI-powered supply chain optimization for the modern enterprise.
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="h-10 w-10 rounded-lg bg-slate-800/50 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-colors"
                      aria-label={social.label}
                    >
                      <Icon className="h-4 w-4" />
                    </motion.a>
                  )
                })}
              </div>
            </motion.div>

            {Object.entries(links).map(([category, items], idx) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + (idx + 1) * 0.05 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                  {category.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <ul className="space-y-2">
                  {items.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="pt-12 border-t border-slate-800"
          >
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                  Newsletter
                </h4>
                <p className="text-sm text-slate-400">
                  Get weekly updates on supply chain AI innovations and optimization tips.
                </p>
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors"
                    disabled={loading}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {loading ? (
                      <span className="h-4 w-4 rounded-full border-2 border-emerald-300 border-t-emerald-600 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </motion.button>
                </form>
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-sm flex items-center gap-2 ${
                      message.type === 'success'
                        ? 'text-emerald-400'
                        : 'text-red-400'
                    }`}
                  >
                    {message.type === 'error' && <AlertCircle className="h-4 w-4" />}
                    {message.text}
                  </motion.div>
                )}
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                  Contact
                </h4>
                <div className="space-y-2 text-sm text-slate-400">
                  <p>
                    <span className="text-slate-500">Email:</span>
                    {' '}
                    <a
                      href="mailto:hello@project-autopilot.com"
                      className="text-emerald-400 hover:underline"
                    >
                      hello@project-autopilot.com
                    </a>
                  </p>
                  <p>
                    <span className="text-slate-500">Sales:</span>
                    {' '}
                    <a
                      href="mailto:sales@project-autopilot.com"
                      className="text-emerald-400 hover:underline"
                    >
                      sales@project-autopilot.com
                    </a>
                  </p>
                  <p>
                    <span className="text-slate-500">Support:</span>
                    {' '}
                    <a
                      href="mailto:support@project-autopilot.com"
                      className="text-emerald-400 hover:underline"
                    >
                      support@project-autopilot.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            viewport={{ once: true }}
            className="pt-12 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500"
          >
            <p>&copy; 2024 Project Autopilot. All rights reserved.</p>
            <p>
              Powered by
              {' '}
              <a
                href="https://anthropic.com"
                className="text-emerald-400 hover:underline"
              >
                Anthropic Claude
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  )
}
