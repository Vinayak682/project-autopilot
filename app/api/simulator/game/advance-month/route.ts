import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getGameState, getLatestKPIs, getDecisions } from '@/lib/simulator/supabase'
import { calculateSharePrice, MARKET_EVENT_MODIFIERS } from '@/lib/simulator/sharePrice'

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Seasonal factors by month (1=Jan … 12=Dec)
const SEASONAL_REVENUE: Record<number, number> = {
  1: 0.95, 2: 0.88, 3: 1.12, 4: 1.18, 5: 0.95, 6: 0.90,
  7: 0.85, 8: 0.82, 9: 0.92, 10: 0.98, 11: 1.10, 12: 1.20,
}

export async function POST() {
  try {
    const db = getServiceClient()
    const [gameState, kpis] = await Promise.all([getGameState(), getLatestKPIs()])
    if (!gameState) return NextResponse.json({ error: 'No active game' }, { status: 404 })

    const { current_month, current_year } = gameState
    const monthDecisions = await getDecisions(current_month)

    // Aggregate KPI deltas from all decisions this month
    const aggregatedDeltas: Record<string, number> = {}
    for (const d of monthDecisions) {
      const delta = d.kpi_delta as Record<string, number> | null
      if (!delta) continue
      for (const [k, v] of Object.entries(delta)) {
        aggregatedDeltas[k] = (aggregatedDeltas[k] ?? 0) + v
      }
    }

    // Build updated KPI set
    const baseKPIs: Record<string, number> = {
      otif_pct: kpis?.otif_pct ?? 96.4,
      forecast_accuracy_pct: kpis?.forecast_accuracy_pct ?? 88.0,
      gross_margin_pct: 38.0,
      ebitda_margin_pct: 14.0,
      market_share_uae: kpis?.market_share_uae ?? 18.0,
      inventory_turnover: kpis?.inventory_turnover ?? 8.5,
      employee_engagement: kpis?.employee_engagement_score ?? 72.0,
      fill_rate_pct: kpis?.fill_rate_pct ?? 97.0,
      oee_pct: kpis?.oee_pct ?? 82.0,
      capacity_utilization_pct: kpis?.capacity_utilization_pct ?? 78.0,
    }

    const updatedKPIs: Record<string, number> = {}
    for (const [k, v] of Object.entries(baseKPIs)) {
      updatedKPIs[k] = v + (aggregatedDeltas[k] ?? 0)
    }

    // Seasonal revenue growth
    const calMonth = ((current_month - 1) % 12) + 1
    const seasonalFactor = SEASONAL_REVENUE[calMonth] ?? 1.0
    const baseMonthlyRevenue = 233_000_000 // AED 233M/month baseline
    const monthlyRevenue = Math.round(baseMonthlyRevenue * seasonalFactor)
    const netRevenue = monthlyRevenue
    const cogs = Math.round(netRevenue * (1 - updatedKPIs.gross_margin_pct / 100))
    const grossProfit = netRevenue - cogs
    const ebitda = Math.round(netRevenue * (updatedKPIs.ebitda_margin_pct / 100))
    const netProfit = Math.round(ebitda * 0.6) // simplified tax/interest
    const eps = netProfit / 390_000_000

    // Revenue growth vs prior month (simplified)
    updatedKPIs.net_revenue_growth_pct = ((seasonalFactor - 1) * 100) + 8

    // Market event check (simple random)
    const eventChance = Math.random()
    let marketEventKey = 'neutral'
    let eventModifier = 0
    if (eventChance < 0.15) {
      const events = Object.keys(MARKET_EVENT_MODIFIERS).filter(k => k !== 'neutral')
      marketEventKey = events[Math.floor(Math.random() * events.length)]
      eventModifier = MARKET_EVENT_MODIFIERS[marketEventKey]
    }

    // Calculate new share price
    const priceResult = calculateSharePrice({
      kpis: updatedKPIs,
      baselines: {},
      market_event_modifier: eventModifier,
    })

    const nextMonth = current_month + 1
    const nextYear = current_month >= 12 ? current_year + 1 : current_year
    const nextCalMonth = nextMonth > 12 ? 1 : nextMonth

    // Persist everything in parallel
    await Promise.all([
      // KPI snapshot
      db.from('sim_kpi_snapshots').insert({
        session_id: 'default',
        sim_month: current_month,
        otif_pct: updatedKPIs.otif_pct,
        forecast_accuracy_pct: updatedKPIs.forecast_accuracy_pct,
        inventory_turnover: updatedKPIs.inventory_turnover,
        days_inventory_outstanding: Math.round(365 / updatedKPIs.inventory_turnover),
        fill_rate_pct: updatedKPIs.fill_rate_pct,
        perfect_order_pct: updatedKPIs.fill_rate_pct * 0.97,
        oee_pct: updatedKPIs.oee_pct,
        capacity_utilization_pct: updatedKPIs.capacity_utilization_pct,
        market_share_uae: updatedKPIs.market_share_uae,
        distribution_reach_pct: 78 + current_month * 0.2,
        employee_turnover_pct: 8 - (updatedKPIs.employee_engagement - 70) * 0.1,
        employee_engagement_score: updatedKPIs.employee_engagement,
      }),
      // Monthly financials
      db.from('sim_financials').insert({
        session_id: 'default',
        sim_month: current_month,
        sim_year: current_year,
        gross_revenue_aed: Math.round(monthlyRevenue * 1.08),
        trade_discounts_aed: Math.round(monthlyRevenue * 0.08),
        net_revenue_aed: netRevenue,
        cogs_aed: cogs,
        gross_profit_aed: grossProfit,
        gross_margin_pct: updatedKPIs.gross_margin_pct,
        marketing_spend_aed: Math.round(netRevenue * 0.04),
        distribution_cost_aed: Math.round(netRevenue * 0.08),
        admin_cost_aed: Math.round(netRevenue * 0.03),
        ebitda_aed: ebitda,
        ebitda_margin_pct: updatedKPIs.ebitda_margin_pct,
        depreciation_aed: Math.round(netRevenue * 0.025),
        ebit_aed: Math.round(ebitda - netRevenue * 0.025),
        interest_aed: Math.round(netRevenue * 0.02),
        tax_aed: Math.round(netProfit * 0.09),
        net_profit_aed: netProfit,
        net_margin_pct: (netProfit / netRevenue) * 100,
        cash_aed: 320_000_000 + netProfit,
        receivables_aed: Math.round(netRevenue * 0.55),
        inventory_value_aed: Math.round(netRevenue * 0.18),
        total_debt_aed: 850_000_000,
        shares_outstanding: 390_000_000,
        eps_aed: eps,
      }),
      // Share price history
      db.from('sim_share_price_history').insert({
        session_id: 'default',
        sim_month: current_month,
        sim_year: current_year,
        price: priceResult.price,
        eps,
        pe_multiple: priceResult.pe_multiple,
        revenue_aed: netRevenue,
        ebitda_aed: ebitda,
        market_event: marketEventKey === 'neutral' ? null : marketEventKey,
      }),
      // Advance game state
      db.from('sim_game_state').update({
        current_month: nextCalMonth,
        current_year: nextYear,
        share_price: priceResult.price,
        market_cap_aed: Math.round(priceResult.price * 390_000_000),
        total_revenue_ytd_aed: gameState.total_revenue_ytd_aed + netRevenue,
        total_ebitda_ytd_aed: gameState.total_ebitda_ytd_aed + ebitda,
        otif_score: updatedKPIs.otif_pct,
        forecast_accuracy: updatedKPIs.forecast_accuracy_pct,
        employee_sentiment: updatedKPIs.employee_engagement,
        updated_at: new Date().toISOString(),
      }).eq('session_id', 'default'),
    ])

    return NextResponse.json({
      month_closed: current_month,
      next_month: nextCalMonth,
      financials: { net_revenue: netRevenue, ebitda, net_profit: netProfit, eps },
      price_result: priceResult,
      kpi_snapshot: updatedKPIs,
      market_event: marketEventKey === 'neutral' ? null : marketEventKey,
      decisions_applied: monthDecisions.length,
    })
  } catch (e) {
    console.error('advance-month error:', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
