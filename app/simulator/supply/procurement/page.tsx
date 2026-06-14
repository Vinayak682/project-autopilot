'use client'

import { motion } from 'motion/react'
import { CheckCircle2, AlertTriangle, Clock } from 'lucide-react'

const SUPPLIERS = [
  { code: 'SUP-001', name: 'Al Rawabi Fresh Farms', country: 'UAE', category: 'Raw Milk', contract: 45, reliability: 94.0, lead: 1, status: 'active', risk: 'low' },
  { code: 'SUP-002', name: 'Emirates Packaging Co', country: 'UAE', category: 'Packaging', contract: 18, reliability: 91.0, lead: 7, status: 'active', risk: 'low' },
  { code: 'SUP-003', name: 'Saudi Fruit Concentrate LLC', country: 'KSA', category: 'Fruit Concentrate', contract: 32, reliability: 88.0, lead: 14, status: 'active', risk: 'medium' },
  { code: 'SUP-004', name: 'Jordan Sugar Industries', country: 'Jordan', category: 'Sugar', contract: 12, reliability: 85.0, lead: 21, status: 'active', risk: 'medium' },
  { code: 'SUP-005', name: 'GCC Cold Chain Logistics', country: 'UAE', category: 'Cold Chain Transport', contract: 28, reliability: 92.0, lead: 0, status: 'active', risk: 'low' },
  { code: 'SUP-006', name: 'Turkish Nuts & Dried Fruit', country: 'Turkey', category: 'Nuts', contract: 8, reliability: 79.0, lead: 28, status: 'active', risk: 'high' },
  { code: 'SUP-007', name: 'European Dairy Cultures GmbH', country: 'Germany', category: 'Cultures & Enzymes', contract: 5.5, reliability: 97.0, lead: 21, status: 'active', risk: 'low' },
  { code: 'SUP-008', name: 'Oman Salt Works', country: 'Oman', category: 'Salt & Minerals', contract: 2.2, reliability: 96.0, lead: 5, status: 'active', risk: 'low' },
]

const POS = [
  { po: 'PO-2024-0001', supplier: 'Al Rawabi Fresh Farms', value: 3800000, status: 'delivered', delay: 0, due: 'Jan 2' },
  { po: 'PO-2024-0010', supplier: 'Emirates Packaging Co', value: 1200000, status: 'delivered', delay: 0, due: 'Jan 5' },
  { po: 'PO-2024-0020', supplier: 'Saudi Fruit Concentrate LLC', value: 4500000, status: 'in_transit', delay: 5, due: 'Jan 12' },
  { po: 'PO-2024-0030', supplier: 'Jordan Sugar Industries', value: 890000, status: 'ordered', delay: 0, due: 'Jan 22' },
  { po: 'PO-2024-0040', supplier: 'Turkish Nuts & Dried Fruit', value: 620000, status: 'pending', delay: 0, due: 'Feb 1' },
]

const RISK_CLS: Record<string, string> = {
  low: 'text-emerald-400 bg-emerald-400/12',
  medium: 'text-amber-400 bg-amber-400/12',
  high: 'text-red-400 bg-red-400/12',
}

export default function ProcurementPage() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Procurement</h1>
        <p className="text-slate-400 text-sm mt-1">Owner: Yusuf Al Qassimi · 8 suppliers · AED 151M annual spend</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Active Suppliers', value: '8' },
          { label: 'Annual Spend', value: 'AED 151M' },
          { label: 'Avg Reliability', value: '90.5%' },
          { label: 'Open POs', value: '3' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white/4 border border-white/8 rounded-xl p-4">
            <div className="text-xl font-bold font-mono text-white">{value}</div>
            <div className="text-xs text-slate-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Supplier table */}
      <div className="bg-white/4 border border-white/8 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/8">
          <h2 className="text-sm font-semibold text-white">Supplier Scorecard</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                {['Code', 'Supplier', 'Country', 'Category', 'Contract (AEDm)', 'Reliability', 'Lead Time', 'Risk'].map(h => (
                  <th key={h} className="text-left p-3 text-xs text-slate-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SUPPLIERS.map((s, i) => (
                <motion.tr
                  key={s.code}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.04 }}
                  className="border-b border-white/4 hover:bg-white/3"
                >
                  <td className="p-3 font-mono text-xs text-slate-400">{s.code}</td>
                  <td className="p-3 text-white font-medium">{s.name}</td>
                  <td className="p-3 text-xs text-slate-400">{s.country}</td>
                  <td className="p-3 text-xs text-slate-300">{s.category}</td>
                  <td className="p-3 font-mono text-sm text-white">{s.contract}</td>
                  <td className="p-3">
                    <span className={`font-mono text-sm ${s.reliability >= 92 ? 'text-emerald-400' : s.reliability >= 85 ? 'text-amber-400' : 'text-red-400'}`}>
                      {s.reliability}%
                    </span>
                  </td>
                  <td className="p-3 font-mono text-sm text-slate-300">{s.lead}d</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${RISK_CLS[s.risk]}`}>{s.risk}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Open POs */}
      <div className="bg-white/4 border border-white/8 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/8">
          <h2 className="text-sm font-semibold text-white">Purchase Order Tracker</h2>
        </div>
        <div className="divide-y divide-white/4">
          {POS.map((po, i) => (
            <motion.div
              key={po.po}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.04 }}
              className="flex items-center gap-4 p-4"
            >
              <div className="flex-shrink-0">
                {po.status === 'delivered' && <CheckCircle2 size={14} className="text-emerald-400" />}
                {(po.status === 'in_transit' || po.status === 'ordered' || po.status === 'pending') && <Clock size={14} className={po.status === 'in_transit' ? 'text-amber-400' : po.status === 'ordered' ? 'text-blue-400' : 'text-slate-400'} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white font-medium">{po.po}</div>
                <div className="text-xs text-slate-400">{po.supplier}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-mono text-white">AED {(po.value / 1e6).toFixed(1)}M</div>
                <div className="text-xs text-slate-500">Due {po.due}</div>
              </div>
              {po.delay > 0 && (
                <div className="flex items-center gap-1 text-xs text-amber-400">
                  <AlertTriangle size={12} />
                  +{po.delay}d delay
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
