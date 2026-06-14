import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateExpansionMemo } from '@/lib/simulator/claude'

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function POST(_req: Request, { params }: { params: Promise<{ key: string }> }) {
  try {
    const { key } = await params
    const db = getServiceClient()

    const { data: opp, error } = await db
      .from('sim_expansion_opps')
      .select('*')
      .eq('opp_key', key)
      .single()

    if (error || !opp) return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 })

    const memo = await generateExpansionMemo(opp)

    // Cache memo on the record
    await db
      .from('sim_expansion_opps')
      .update({ claude_analysis: memo, status: 'under_review' })
      .eq('opp_key', key)

    return NextResponse.json({ memo, opportunity: opp })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
