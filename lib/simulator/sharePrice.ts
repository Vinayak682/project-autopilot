import type { SharePriceInput, SharePriceResult } from './types'

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const BASE_PRICE = 15.00        // AED — DFM listing price
const BASE_EPS = 0.682          // AED — derived: revenue 2.8B, net margin 5.3%, 390M shares
const BASE_PE = 22              // GCC FMCG sector average
const PRICE_MIN = 5.00
const PRICE_MAX = 60.00

// KPI weights must sum to 1.0
const KPI_WEIGHTS: Record<string, number> = {
  net_revenue_growth_pct:  0.20,
  otif_pct:                0.18,
  gross_margin_pct:        0.15,
  ebitda_margin_pct:       0.15,
  forecast_accuracy_pct:   0.10,
  market_share_uae:        0.10,
  inventory_turnover:      0.06,
  employee_engagement:     0.06,
}

// Baseline KPI values (what "neutral/50" looks like)
export const KPI_BASELINES: Record<string, number> = {
  net_revenue_growth_pct:  8.0,   // 8% YoY growth = neutral
  otif_pct:                95.0,  // 95% OTIF = industry standard
  gross_margin_pct:        38.0,  // 38% gross margin
  ebitda_margin_pct:       14.0,  // 14% EBITDA
  forecast_accuracy_pct:   88.0,  // 88% forecast accuracy
  market_share_uae:        18.0,  // 18% market share in UAE
  inventory_turnover:      8.5,   // 8.5x annual turnover
  employee_engagement:     72.0,  // 72/100 engagement score
}

// How much each KPI can move the health score per unit of deviation
const KPI_SENSITIVITY: Record<string, number> = {
  net_revenue_growth_pct:  2.0,   // ±2 health pts per 1% revenue growth deviation
  otif_pct:                3.0,   // ±3 pts per 1% OTIF deviation (high sensitivity)
  gross_margin_pct:        2.5,
  ebitda_margin_pct:       2.5,
  forecast_accuracy_pct:   1.5,
  market_share_uae:        1.5,
  inventory_turnover:      1.0,
  employee_engagement:     0.5,
}

// ─────────────────────────────────────────────
// CORE CALCULATION
// ─────────────────────────────────────────────

export function calculateSharePrice(input: SharePriceInput): SharePriceResult {
  const { kpis, baselines, market_event_modifier = 0 } = input
  const effectiveBaselines = { ...KPI_BASELINES, ...baselines }

  // Step 1: Compute weighted health score (0–100, base = 50)
  let healthDelta = 0
  for (const [key, weight] of Object.entries(KPI_WEIGHTS)) {
    const actual = kpis[key]
    if (actual === undefined) continue
    const baseline = effectiveBaselines[key] ?? KPI_BASELINES[key]
    const sensitivity = KPI_SENSITIVITY[key] ?? 1.0
    const deviation = actual - baseline
    healthDelta += weight * deviation * sensitivity
  }

  // Clamp health score to [0, 100]
  const healthScore = Math.max(0, Math.min(100, 50 + healthDelta))

  // Step 2: EPS adjustment based on health score deviation from 50
  // At health=50: EPS = base. At health=100: EPS × 1.4. At health=0: EPS × 0.6
  const epsMultiplier = 1 + ((healthScore - 50) / 100) * 0.8
  const adjustedEPS = BASE_EPS * epsMultiplier

  // Step 3: P/E adjustment
  // Base P/E = 22. Market events can move ±4-6x
  const adjustedPE = Math.max(8, Math.min(35, BASE_PE + market_event_modifier))

  // Step 4: Compute price
  const rawPrice = adjustedEPS * adjustedPE
  const price = Math.max(PRICE_MIN, Math.min(PRICE_MAX, rawPrice))

  return {
    price: Math.round(price * 100) / 100,
    health_score: Math.round(healthScore * 10) / 10,
    eps: Math.round(adjustedEPS * 1000) / 1000,
    pe_multiple: adjustedPE,
    delta_from_base: Math.round((price - BASE_PRICE) * 100) / 100,
    delta_pct: Math.round(((price - BASE_PRICE) / BASE_PRICE) * 10000) / 100,
  }
}

// ─────────────────────────────────────────────
// MARKET EVENT MODIFIERS
// ─────────────────────────────────────────────

export const MARKET_EVENT_MODIFIERS: Record<string, number> = {
  ramadan_surge:          +2.5,
  summer_heat_logistics:  -1.5,
  raw_material_spike:     -3.0,
  competitor_price_war:   -2.0,
  strong_earnings:        +4.0,
  supply_disruption:      -3.5,
  new_export_deal:        +3.0,
  regulatory_fine:        -2.5,
  expansion_announced:    +3.5,
  icc_sponsorship:        +1.5,
  otif_crisis:            -4.0,
  debt_downgrade:         -3.0,
  uae_vision_alignment:   +2.0,
  neutral:                0,
}

// ─────────────────────────────────────────────
// DECISION IMPACT TEMPLATES
// ─────────────────────────────────────────────

export const DECISION_IMPACTS: Record<string, Record<string, number>> = {
  increase_safety_stock: {
    otif_pct: +1.5,
    inventory_turnover: -0.8,
    ebitda_margin_pct: -0.3,
  },
  reduce_safety_stock: {
    otif_pct: -2.0,
    inventory_turnover: +1.2,
    ebitda_margin_pct: +0.4,
  },
  launch_promotion: {
    net_revenue_growth_pct: +3.0,
    gross_margin_pct: -2.0,
    market_share_uae: +0.5,
  },
  add_supplier: {
    otif_pct: +0.8,
    gross_margin_pct: +0.5,
    forecast_accuracy_pct: +1.0,
  },
  expand_distribution: {
    net_revenue_growth_pct: +2.5,
    distribution_reach_pct: +3.0,
    ebitda_margin_pct: -1.0,
  },
  hire_demand_planner: {
    forecast_accuracy_pct: +3.0,
    employee_engagement: +2.0,
    ebitda_margin_pct: -0.5,
  },
  upgrade_fleet: {
    otif_pct: +2.0,
    ebitda_margin_pct: -1.5,
    employee_engagement: +1.0,
  },
  defer_capex: {
    ebitda_margin_pct: +1.0,
    oee_pct: -2.0,
    otif_pct: -0.5,
  },
}

// ─────────────────────────────────────────────
// FORMATTING UTILITIES
// ─────────────────────────────────────────────

export function formatAED(value: number, compact = false): string {
  if (compact) {
    if (value >= 1_000_000_000) return `AED ${(value / 1_000_000_000).toFixed(1)}B`
    if (value >= 1_000_000) return `AED ${(value / 1_000_000).toFixed(0)}M`
    if (value >= 1_000) return `AED ${(value / 1_000).toFixed(0)}K`
  }
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatPrice(price: number): string {
  return `AED ${price.toFixed(2)}`
}

export function priceColor(delta: number): string {
  if (delta > 0.5) return 'text-emerald-400'
  if (delta < -0.5) return 'text-red-400'
  return 'text-slate-400'
}
