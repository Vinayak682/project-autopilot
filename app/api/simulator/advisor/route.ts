import { streamAdvisorResponse } from '@/lib/simulator/claude'
import { getLatestKPIs } from '@/lib/simulator/supabase'

export async function POST(req: Request) {
  try {
    const { question, department, month, additionalContext } = await req.json()

    const kpis = await getLatestKPIs()

    const stream = await streamAdvisorResponse(question, {
      department,
      kpis: kpis ?? {},
      month,
      additionalContext,
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
