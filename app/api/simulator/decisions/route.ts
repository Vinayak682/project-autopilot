import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getGameState, getLatestKPIs } from '@/lib/simulator/supabase'
import { calculateSharePrice } from '@/lib/simulator/sharePrice'
import { DECISION_IMPACTS } from '@/lib/simulator/sharePrice'
import { getDecisions } from '@/lib/simulator/supabase'

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const month = searchParams.get('month')
  const decisions = await getDecisions(month ? parseInt(month) : undefined)
  return NextResponse.json({ decisions })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { decision_key, choice_made, decision_type, claude_recommendation } = body

    const [gameState, kpis] = await Promise.all([getGameState(), getLatestKPIs()])
    if (!gameState) return NextResponse.json({ error: 'No active game' }, { status: 404 })

    const kpiDelta = DECISION_IMPACTS[decision_key] ?? {}
    const sharePriceBefore = gameState.share_price

    // Apply KPI deltas
    const kpisRecord = (kpis ?? {}) as Record<string, number>
    const updatedKPIs = { ...kpisRecord, ...Object.fromEntries(
      Object.entries(kpiDelta).map(([k, v]) => [k, (kpisRecord?.[k] ?? 0) + v])
    )}

    const priceResult = calculateSharePrice({
      kpis: updatedKPIs as Record<string, number>,
      baselines: {},
    })

    // Persist decision
    const db = getServiceClient()
    const { data: decision, error } = await db
      .from('sim_decisions_log')
      .insert({
        session_id: 'default',
        sim_month: gameState.current_month,
        decision_type,
        decision_key,
        choice_made,
        claude_recommendation: claude_recommendation ? JSON.stringify(claude_recommendation) : null,
        cost_aed: body.cost_aed ?? 0,
        revenue_impact_aed: body.revenue_impact_aed ?? 0,
        kpi_delta: kpiDelta,
        share_price_before: sharePriceBefore,
        share_price_after: priceResult.price,
      })
      .select()
      .single()

    if (error) throw error

    // Update game state with new price
    await db
      .from('sim_game_state')
      .update({ share_price: priceResult.price, updated_at: new Date().toISOString() })
      .eq('session_id', 'default')

    return NextResponse.json({
      decision,
      priceResult,
      kpiDelta,
      message: `Decision recorded. Share price moved from AED ${sharePriceBefore.toFixed(2)} → AED ${priceResult.price.toFixed(2)}`,
    })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
