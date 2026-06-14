import { NextResponse } from 'next/server'
import { getGameState, getLatestKPIs, getSharePriceHistory } from '@/lib/simulator/supabase'

export async function GET() {
  try {
    const [gameState, kpis, priceHistory] = await Promise.all([
      getGameState(),
      getLatestKPIs(),
      getSharePriceHistory(12),
    ])

    if (!gameState) {
      return NextResponse.json({ error: 'No active game session. Run /api/simulator/seed first.' }, { status: 404 })
    }

    return NextResponse.json({ gameState, kpis, priceHistory })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
