import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateSOPSummary } from '@/lib/simulator/claude'
import { getGameState } from '@/lib/simulator/supabase'

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { step, demand_consensus, supply_commitment, resolution, top_risk_skus = [] } = body

    const gameState = await getGameState()
    if (!gameState) return NextResponse.json({ error: 'No active game' }, { status: 404 })

    const gap_units = supply_commitment - demand_consensus

    const claudeSummary = await generateSOPSummary({
      step,
      month: gameState.current_month,
      demand_consensus,
      supply_commitment,
      gap_units,
      top_risk_skus,
      resolution,
    })

    const db = getServiceClient()
    const { data, error } = await db
      .from('sim_sop_cycles')
      .insert({
        session_id: 'default',
        sim_month: gameState.current_month,
        step,
        status: 'complete',
        demand_consensus_units: demand_consensus,
        supply_commitment_units: supply_commitment,
        gap_units,
        resolution,
        claude_summary: claudeSummary,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ cycle: data, claude_summary: claudeSummary, gap_units })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
