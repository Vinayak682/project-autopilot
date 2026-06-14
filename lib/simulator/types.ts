// Al Manar Industries LLC — Simulator TypeScript Types

export interface GameState {
  id: string
  session_id: string
  current_month: number
  current_year: number
  game_speed: 'manual' | 'auto'
  status: 'active' | 'paused' | 'ended'
  share_price: number
  market_cap_aed: number
  total_revenue_ytd_aed: number
  total_ebitda_ytd_aed: number
  otif_score: number
  forecast_accuracy: number
  employee_sentiment: number
  created_at: string
  updated_at: string
}

export interface SharePricePoint {
  id: string
  session_id: string
  sim_month: number
  sim_year: number
  price: number
  eps: number
  pe_multiple: number
  revenue_aed: number
  ebitda_aed: number
  market_event: string | null
  recorded_at: string
}

export interface DecisionLog {
  id: string
  session_id: string
  sim_month: number
  decision_type: 'supply_chain' | 'marketing' | 'finance' | 'hr' | 'expansion'
  decision_key: string
  choice_made: string
  claude_recommendation: ClaudeDecisionRec | null
  cost_aed: number
  revenue_impact_aed: number
  kpi_delta: Record<string, number> | null
  share_price_before: number
  share_price_after: number
  created_at: string
}

export interface ClaudeDecisionRec {
  recommended_choice: string
  reasoning: string
  risk_level: 'low' | 'medium' | 'high'
  kpi_impact_estimate: Record<string, number>
  confidence_score: number
}

export interface SKU {
  id: string
  sku_code: string
  name: string
  category: 'Dairy' | 'Juice' | 'Water' | 'Food' | 'Bakery'
  sub_category: string | null
  unit: string
  unit_price_aed: number
  cogs_aed: number
  gross_margin_pct: number
  abc_class: 'A' | 'B' | 'C'
  shelf_life_days: number | null
  active: boolean
}

export interface DemandForecast {
  id: string
  session_id: string
  sku_id: string
  sim_month: number
  sim_year: number
  channel: 'modern_trade' | 'traditional_trade' | 'horeca' | 'export' | 'ecommerce'
  region: 'UAE' | 'KSA' | 'Kuwait' | 'Bahrain' | 'Oman' | 'Qatar'
  forecasted_units: number
  actual_units: number | null
  forecast_error_pct: number | null
  baseline_forecast: number
  promotional_uplift: number
  seasonal_factor: number
  sku?: SKU
}

export interface ProductionPlan {
  id: string
  session_id: string
  sku_id: string
  sim_month: number
  facility: 'Dubai_Plant' | 'Sharjah_Plant' | 'Riyadh_Co_Pack'
  planned_units: number
  actual_units: number | null
  capacity_utilization_pct: number | null
  downtime_hours: number
  oee_score: number | null
  sku?: SKU
}

export interface Inventory {
  id: string
  session_id: string
  sku_id: string
  warehouse: 'Dubai_DC' | 'Jebel_Ali' | 'Riyadh_DC' | 'Kuwait_DC'
  region: string
  sim_month: number
  opening_stock: number
  receipts: number
  sales_dispatched: number
  closing_stock: number
  safety_stock_level: number
  days_on_hand: number
  stockout_flag: boolean
  excess_flag: boolean
  sku?: SKU
}

export interface Supplier {
  id: string
  name: string
  category: 'Raw Material' | 'Packaging' | 'Ingredients' | 'Logistics'
  country: string
  lead_time_days: number
  reliability_score: number
  on_time_delivery_pct: number
  quality_rejection_pct: number
  contract_value_aed: number
  contract_expiry: string
  is_preferred: boolean
  is_backup: boolean
  active: boolean
}

export interface PurchaseOrder {
  id: string
  session_id: string
  supplier_id: string
  po_number: string
  raw_material: string
  quantity: number
  unit: string
  unit_price_aed: number
  total_value_aed: number
  order_date: string
  expected_delivery: string
  actual_delivery: string | null
  status: 'open' | 'in_transit' | 'received' | 'delayed'
  delay_days: number
  supplier?: Supplier
}

export interface DispatchSchedule {
  id: string
  session_id: string
  sim_month: number
  route_code: string
  origin_warehouse: string
  destination: string
  delivery_type: string
  vehicle_type: string
  planned_dispatch_date: string
  actual_dispatch_date: string | null
  planned_delivery_date: string
  actual_delivery_date: string | null
  total_skus: number
  total_cases: number
  otif_flag: boolean | null
  delay_reason: string | null
  cost_aed: number
}

export interface MonthlyFinancials {
  id: string
  session_id: string
  sim_month: number
  sim_year: number
  gross_revenue_aed: number
  trade_discounts_aed: number
  net_revenue_aed: number
  cogs_aed: number
  gross_profit_aed: number
  gross_margin_pct: number
  marketing_spend_aed: number
  distribution_cost_aed: number
  admin_cost_aed: number
  ebitda_aed: number
  ebitda_margin_pct: number
  depreciation_aed: number
  ebit_aed: number
  interest_aed: number
  tax_aed: number
  net_profit_aed: number
  net_margin_pct: number
  cash_aed: number
  receivables_aed: number
  inventory_value_aed: number
  total_debt_aed: number
  shares_outstanding: number
  eps_aed: number
}

export interface KPISnapshot {
  id: string
  session_id: string
  sim_month: number
  otif_pct: number
  forecast_accuracy_pct: number
  inventory_turnover: number
  days_inventory_outstanding: number
  fill_rate_pct: number
  perfect_order_pct: number
  oee_pct: number
  capacity_utilization_pct: number
  market_share_uae: number
  distribution_reach_pct: number
  employee_turnover_pct: number
  employee_engagement_score: number
}

export interface OrgMember {
  id: string
  employee_id: string
  name: string
  title: string
  department: string
  level: number
  reports_to: string | null
  avatar_initials: string
  nationality: string
  years_at_company: number
  is_board_member: boolean
  bio_short: string
}

export interface MarketEvent {
  id: string
  event_key: string
  title: string
  description: string
  category: 'demand' | 'supply' | 'regulatory' | 'geopolitical' | 'competitive'
  severity: 'low' | 'medium' | 'high' | 'critical'
  trigger_month: number | null
  probability: number
  duration_months: number
  kpi_impact: Record<string, number>
  is_scripted: boolean
  active: boolean
}

export interface SOPCycle {
  id: string
  session_id: string
  sim_month: number
  step: 'demand_review' | 'supply_review' | 'pre_sop' | 'exec_sop'
  status: 'pending' | 'in_progress' | 'complete'
  demand_consensus_units: number | null
  supply_commitment_units: number | null
  gap_units: number | null
  resolution: string | null
  claude_summary: string | null
  completed_at: string | null
}

export interface ExpansionOpp {
  id: string
  opp_key: string
  title: string
  type: 'new_market' | 'acquisition' | 'jv' | 'sponsorship' | 'export'
  target_country: string | null
  target_region: string | null
  investment_aed: number
  projected_revenue_aed: number
  projected_ebitda_pct: number
  lead_time_months: number
  risk_level: 'low' | 'medium' | 'high'
  status: 'available' | 'under_review' | 'approved' | 'rejected' | 'active'
  unlock_at_month: number
  description: string
  claude_analysis: string | null
}

// Decision cards presented to the player each month
export interface MonthlyDecision {
  key: string
  title: string
  context: string
  department: string
  urgency: 'low' | 'medium' | 'high' | 'critical'
  options: DecisionOption[]
  claude_rec?: ClaudeDecisionRec
  deadline_month: number
}

export interface DecisionOption {
  id: string
  label: string
  description: string
  cost_aed: number
  risk: 'low' | 'medium' | 'high'
  expected_impact: string
}

// Share price calculation input
export interface KPIWeights {
  net_revenue_growth_pct: number
  otif_pct: number
  gross_margin_pct: number
  ebitda_margin_pct: number
  forecast_accuracy_pct: number
  market_share_uae: number
  inventory_turnover: number
  employee_engagement: number
}

export interface SharePriceInput {
  kpis: Partial<KPIWeights> & { [key: string]: number }
  baselines: Partial<KPIWeights> & { [key: string]: number }
  market_event_modifier?: number
  session_id?: string
  sim_month?: number
  sim_year?: number
}

export interface SharePriceResult {
  price: number
  health_score: number
  eps: number
  pe_multiple: number
  delta_from_base: number
  delta_pct: number
}
