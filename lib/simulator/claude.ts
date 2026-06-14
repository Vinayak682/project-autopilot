import Anthropic from '@anthropic-ai/sdk'
import type { ClaudeDecisionRec, MonthlyDecision, KPISnapshot } from './types'

const MODEL = 'claude-opus-4-6'

const ADVISOR_PERSONA = `You are Tariq Al Rashidi, Chief Strategy Advisor at Al Manar Industries LLC — a leading Dubai-listed FMCG company (DFM: ALMANR) operating across GCC with AED 2.8B annual revenue. You advise the MD/CEO directly.

Your expertise spans supply chain optimization, GCC market dynamics, DFM investor relations, VAT compliance, and UAE Vision 2030 alignment. You are precise, data-driven, and direct. You always:
- Reference specific numbers and KPI thresholds
- Consider Ramadan seasonal patterns, summer logistics stress, and GCC cross-border trade nuances
- Give 2-3 concrete options with risk/reward tradeoffs
- Flag DFM listing sensitivities (share price impact, disclosure obligations)
- Speak as a trusted C-suite advisor, not a consultant with caveats

When asked for recommendations, structure your response as: SITUATION ASSESSMENT → OPTIONS (numbered) → RECOMMENDATION → WATCH POINTS`

function getClient(): Anthropic {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
}

// ─────────────────────────────────────────────
// MODE A: Department Advisor (streaming)
// ─────────────────────────────────────────────

export async function streamAdvisorResponse(
  question: string,
  context: {
    department: string
    kpis?: Partial<KPISnapshot>
    month?: number
    additionalContext?: string
  }
): Promise<ReadableStream<Uint8Array>> {
  const client = getClient()

  const systemPrompt = ADVISOR_PERSONA

  const userContent = `DEPARTMENT: ${context.department.toUpperCase()}
CURRENT MONTH: Month ${context.month ?? 'N/A'}, 2024
${context.kpis ? `KEY KPIs:
- OTIF: ${context.kpis.otif_pct ?? 'N/A'}%
- Forecast Accuracy: ${context.kpis.forecast_accuracy_pct ?? 'N/A'}%
- Fill Rate: ${context.kpis.fill_rate_pct ?? 'N/A'}%
- OEE: ${context.kpis.oee_pct ?? 'N/A'}%
- Employee Engagement: ${context.kpis.employee_engagement_score ?? 'N/A'}/100` : ''}
${context.additionalContext ? `\nADDITIONAL CONTEXT:\n${context.additionalContext}` : ''}

MD QUESTION: ${question}`

  const stream = await client.messages.stream({
    model: MODEL,
    max_tokens: 1024,
    thinking: { type: 'adaptive' },
    system: systemPrompt,
    messages: [{ role: 'user', content: userContent }],
  })

  const encoder = new TextEncoder()
  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          controller.enqueue(encoder.encode(chunk.delta.text))
        }
      }
      controller.close()
    },
  })
}

// ─────────────────────────────────────────────
// MODE B: Decision Recommendation (structured)
// ─────────────────────────────────────────────

export async function getDecisionRecommendation(
  decision: MonthlyDecision,
  currentKPIs: Partial<KPISnapshot>
): Promise<ClaudeDecisionRec> {
  const client = getClient()

  const prompt = `You are advising the MD of Al Manar Industries on a critical business decision.

DECISION: ${decision.title}
CONTEXT: ${decision.context}
DEPARTMENT: ${decision.department}
URGENCY: ${decision.urgency}

OPTIONS:
${decision.options.map((o, i) => `${i + 1}. ${o.label}: ${o.description} (Cost: AED ${o.cost_aed.toLocaleString()}, Risk: ${o.risk})`).join('\n')}

CURRENT KPIs:
- OTIF: ${currentKPIs.otif_pct ?? 'N/A'}%
- Forecast Accuracy: ${currentKPIs.forecast_accuracy_pct ?? 'N/A'}%
- Market Share UAE: ${currentKPIs.market_share_uae ?? 'N/A'}%

Return ONLY valid JSON (no markdown):
{
  "recommended_choice": "<option id>",
  "reasoning": "<2-3 sentence GCC-context reasoning>",
  "risk_level": "<low|medium|high>",
  "kpi_impact_estimate": { "<kpi_name>": <delta_value> },
  "confidence_score": <0.0-1.0>
}`

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 512,
    thinking: { type: 'adaptive' },
    system: ADVISOR_PERSONA,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = response.content.find(b => b.type === 'text')?.text ?? '{}'
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}') + 1
  return JSON.parse(text.slice(start, end)) as ClaudeDecisionRec
}

// ─────────────────────────────────────────────
// MODE C: S&OP Summary (board-ready prose)
// ─────────────────────────────────────────────

export async function generateSOPSummary(data: {
  step: string
  month: number
  demand_consensus: number
  supply_commitment: number
  gap_units: number
  top_risk_skus: string[]
  resolution: string
}): Promise<string> {
  const client = getClient()

  const prompt = `Generate a 120-word executive summary for the Al Manar Industries S&OP ${data.step.replace('_', ' ')} — Month ${data.month}.

DATA:
- Demand Consensus: ${data.demand_consensus.toLocaleString()} cases
- Supply Commitment: ${data.supply_commitment.toLocaleString()} cases
- Gap: ${Math.abs(data.gap_units).toLocaleString()} cases (${data.gap_units > 0 ? 'supply SHORT' : 'supply LONG'})
- Top Risk SKUs: ${data.top_risk_skus.join(', ')}
- Resolution: ${data.resolution}

Write a crisp, board-ready summary in professional GCC business English. Use specific numbers. End with one clear action item for the MD. No bullet points — flowing paragraphs only.`

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 300,
    system: ADVISOR_PERSONA,
    messages: [{ role: 'user', content: prompt }],
  })

  return response.content.find(b => b.type === 'text')?.text ?? ''
}

// ─────────────────────────────────────────────
// MODE D: Expansion Investment Memo
// ─────────────────────────────────────────────

export async function generateExpansionMemo(opp: {
  title: string
  type: string
  target_country: string | null
  target_region: string | null
  investment_aed: number
  projected_revenue_aed: number
  projected_ebitda_pct: number
  lead_time_months: number
  risk_level: string
  description: string
}): Promise<string> {
  const client = getClient()

  const prompt = `Write a 400-word investment memo for the Al Manar Industries Board on this expansion opportunity.

OPPORTUNITY: ${opp.title}
TYPE: ${opp.type}
MARKET: ${opp.target_country ?? opp.target_region ?? 'GCC'}
INVESTMENT: AED ${opp.investment_aed.toLocaleString()}
PROJECTED REVENUE: AED ${opp.projected_revenue_aed.toLocaleString()}/year
PROJECTED EBITDA MARGIN: ${opp.projected_ebitda_pct}%
TIMELINE: ${opp.lead_time_months} months to first revenue
RISK: ${opp.risk_level}
DESCRIPTION: ${opp.description}

Structure:
1. EXECUTIVE SUMMARY (2 sentences)
2. MARKET OPPORTUNITY (GCC context, why now)
3. FINANCIAL CASE (payback period, IRR estimate, capital efficiency)
4. KEY RISKS & MITIGATIONS (3 bullets)
5. MD RECOMMENDATION (approve / conditional / decline)

Professional board memo tone. Specific numbers. GCC business context throughout.`

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 800,
    thinking: { type: 'adaptive' },
    system: ADVISOR_PERSONA,
    messages: [{ role: 'user', content: prompt }],
  })

  return response.content.find(b => b.type === 'text')?.text ?? ''
}
