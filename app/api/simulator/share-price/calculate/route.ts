import { NextResponse } from 'next/server'
import { calculateSharePrice, KPI_BASELINES } from '@/lib/simulator/sharePrice'
import { insertSharePricePoint, updateGameState, getGameState } from '@/lib/simulator/supabase'
import type { SharePriceInput } from '@/lib/simulator/types'

export async function POST(req: Request) {
  try {
    const body: SharePriceInput = await req.json()
    const result = calculateSharePrice(body)

    const gameState = await getGameState()
    if (gameState) {
      await Promise.all([
        updateGameState({ share_price: result.price, market_cap_aed: Math.round(result.price * 390_000_000) }),
        insertSharePricePoint({
          session_id: body.session_id ?? 'default',
          sim_month: body.sim_month ?? gameState.current_month,
          sim_year: body.sim_year ?? gameState.current_year,
          price: result.price,
          eps: result.eps,
          pe_multiple: result.pe_multiple,
          revenue_aed: (body.kpis as Record<string, unknown>).net_revenue_aed as number ?? null,
          ebitda_aed: (body.kpis as Record<string, unknown>).ebitda_aed as number ?? null,
          market_event: null,
        }),
      ])
    }

    return NextResponse.json({ result, baselines: KPI_BASELINES })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
