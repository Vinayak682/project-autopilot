import { NextResponse } from 'next/server'
import { getSharePriceHistory } from '@/lib/simulator/supabase'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get('limit') ?? '24')
  const history = await getSharePriceHistory(limit)
  return NextResponse.json({ history })
}
