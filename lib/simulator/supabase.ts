import { createClient } from '@supabase/supabase-js'
import type {
  GameState, SharePricePoint, DecisionLog, SKU, DemandForecast,
  ProductionPlan, Inventory, Supplier, PurchaseOrder, DispatchSchedule,
  MonthlyFinancials, KPISnapshot, OrgMember, MarketEvent, SOPCycle, ExpansionOpp
} from './types'

const SESSION_ID = 'default'

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(url, key)
}

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(url, key)
}

// ── Game State ────────────────────────────────────────────────

export async function getGameState(): Promise<GameState | null> {
  const { data } = await getClient()
    .from('sim_game_state')
    .select('*')
    .eq('session_id', SESSION_ID)
    .single()
  return data
}

export async function updateGameState(updates: Partial<GameState>): Promise<GameState> {
  const { data, error } = await getServiceClient()
    .from('sim_game_state')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('session_id', SESSION_ID)
    .select()
    .single()
  if (error) throw error
  return data
}

// ── Share Price ───────────────────────────────────────────────

export async function getSharePriceHistory(limit = 12): Promise<SharePricePoint[]> {
  const { data } = await getClient()
    .from('sim_share_price_history')
    .select('*')
    .eq('session_id', SESSION_ID)
    .order('sim_year', { ascending: true })
    .order('sim_month', { ascending: true })
    .limit(limit)
  return data ?? []
}

export async function insertSharePricePoint(point: Omit<SharePricePoint, 'id' | 'recorded_at'>): Promise<SharePricePoint> {
  const { data, error } = await getServiceClient()
    .from('sim_share_price_history')
    .insert(point)
    .select()
    .single()
  if (error) throw error
  return data
}

// ── SKUs ──────────────────────────────────────────────────────

export async function getAllSKUs(): Promise<SKU[]> {
  const { data } = await getClient()
    .from('sim_skus')
    .select('*')
    .eq('active', true)
    .order('abc_class')
    .order('name')
  return data ?? []
}

export async function getSKUsByCategory(category: string): Promise<SKU[]> {
  const { data } = await getClient()
    .from('sim_skus')
    .select('*')
    .eq('category', category)
    .eq('active', true)
  return data ?? []
}

// ── Demand Forecast ───────────────────────────────────────────

export async function getDemandForecast(month: number, year: number): Promise<DemandForecast[]> {
  const { data } = await getClient()
    .from('sim_demand_forecast')
    .select('*, sku:sim_skus(*)')
    .eq('session_id', SESSION_ID)
    .eq('sim_month', month)
    .eq('sim_year', year)
  return data ?? []
}

export async function getDemandForecastRange(months: number = 12): Promise<DemandForecast[]> {
  const { data } = await getClient()
    .from('sim_demand_forecast')
    .select('*, sku:sim_skus(*)')
    .eq('session_id', SESSION_ID)
    .order('sim_year')
    .order('sim_month')
    .limit(months * 50)
  return data ?? []
}

// ── Production Plan ───────────────────────────────────────────

export async function getProductionPlan(month: number): Promise<ProductionPlan[]> {
  const { data } = await getClient()
    .from('sim_production_plan')
    .select('*, sku:sim_skus(*)')
    .eq('session_id', SESSION_ID)
    .eq('sim_month', month)
  return data ?? []
}

// ── Inventory ─────────────────────────────────────────────────

export async function getInventory(month: number): Promise<Inventory[]> {
  const { data } = await getClient()
    .from('sim_inventory')
    .select('*, sku:sim_skus(*)')
    .eq('session_id', SESSION_ID)
    .eq('sim_month', month)
    .order('stockout_flag', { ascending: false })
  return data ?? []
}

export async function getStockoutAlerts(month: number): Promise<Inventory[]> {
  const { data } = await getClient()
    .from('sim_inventory')
    .select('*, sku:sim_skus(*)')
    .eq('session_id', SESSION_ID)
    .eq('sim_month', month)
    .eq('stockout_flag', true)
  return data ?? []
}

// ── Suppliers & POs ───────────────────────────────────────────

export async function getSuppliers(): Promise<Supplier[]> {
  const { data } = await getClient()
    .from('sim_suppliers')
    .select('*')
    .eq('active', true)
    .order('reliability_score', { ascending: false })
  return data ?? []
}

export async function getPurchaseOrders(status?: string): Promise<PurchaseOrder[]> {
  let query = getClient()
    .from('sim_purchase_orders')
    .select('*, supplier:sim_suppliers(*)')
    .eq('session_id', SESSION_ID)
  if (status) query = query.eq('status', status)
  const { data } = await query.order('order_date', { ascending: false })
  return data ?? []
}

// ── Dispatch ──────────────────────────────────────────────────

export async function getDispatchSchedule(month: number): Promise<DispatchSchedule[]> {
  const { data } = await getClient()
    .from('sim_dispatch_schedule')
    .select('*')
    .eq('session_id', SESSION_ID)
    .eq('sim_month', month)
    .order('planned_dispatch_date')
  return data ?? []
}

// ── Financials ────────────────────────────────────────────────

export async function getFinancials(limit = 12): Promise<MonthlyFinancials[]> {
  const { data } = await getClient()
    .from('sim_financials')
    .select('*')
    .eq('session_id', SESSION_ID)
    .order('sim_year')
    .order('sim_month')
    .limit(limit)
  return data ?? []
}

export async function getLatestFinancials(): Promise<MonthlyFinancials | null> {
  const { data } = await getClient()
    .from('sim_financials')
    .select('*')
    .eq('session_id', SESSION_ID)
    .order('sim_year', { ascending: false })
    .order('sim_month', { ascending: false })
    .limit(1)
    .single()
  return data
}

// ── KPI Snapshots ─────────────────────────────────────────────

export async function getKPIHistory(limit = 12): Promise<KPISnapshot[]> {
  const { data } = await getClient()
    .from('sim_kpi_snapshots')
    .select('*')
    .eq('session_id', SESSION_ID)
    .order('sim_month')
    .limit(limit)
  return data ?? []
}

export async function getLatestKPIs(): Promise<KPISnapshot | null> {
  const { data } = await getClient()
    .from('sim_kpi_snapshots')
    .select('*')
    .eq('session_id', SESSION_ID)
    .order('sim_month', { ascending: false })
    .limit(1)
    .single()
  return data
}

// ── Org Chart ─────────────────────────────────────────────────

export async function getOrgChart(): Promise<OrgMember[]> {
  const { data } = await getClient()
    .from('sim_org_chart')
    .select('*')
    .order('level')
    .order('name')
  return data ?? []
}

// ── Market Events ─────────────────────────────────────────────

export async function getActiveEvents(): Promise<MarketEvent[]> {
  const { data } = await getClient()
    .from('sim_market_events')
    .select('*')
    .eq('active', true)
  return data ?? []
}

// ── S&OP Cycles ───────────────────────────────────────────────

export async function getSOPCycles(month: number): Promise<SOPCycle[]> {
  const { data } = await getClient()
    .from('sim_sop_cycles')
    .select('*')
    .eq('session_id', SESSION_ID)
    .eq('sim_month', month)
    .order('created_at')
  return data ?? []
}

export async function updateSOPCycle(id: string, updates: Partial<SOPCycle>): Promise<SOPCycle> {
  const { data, error } = await getServiceClient()
    .from('sim_sop_cycles')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

// ── Decisions ─────────────────────────────────────────────────

export async function getDecisions(month?: number): Promise<DecisionLog[]> {
  let query = getClient()
    .from('sim_decisions_log')
    .select('*')
    .eq('session_id', SESSION_ID)
  if (month !== undefined) query = query.eq('sim_month', month)
  const { data } = await query.order('created_at', { ascending: false })
  return data ?? []
}

// ── Expansion ─────────────────────────────────────────────────

export async function getExpansionOpps(currentMonth: number): Promise<ExpansionOpp[]> {
  const { data } = await getClient()
    .from('sim_expansion_opps')
    .select('*')
    .lte('unlock_at_month', currentMonth)
    .order('risk_level')
  return data ?? []
}
