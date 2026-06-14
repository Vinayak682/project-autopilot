import type { DemoResult } from '@/lib/types'

export async function POST(request: Request): Promise<Response> {
  const startTime = Date.now()

  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>
    const demandMultiplier = (body.demandMultiplier as number) || 1.5

    const baselineDemand = 50000
    const projectedDemand = Math.round(baselineDemand * demandMultiplier)
    const demandIncrease = projectedDemand - baselineDemand

    const analysisResult = {
      success: true,
      data: {
        region: 'APAC',
        currentDemand: baselineDemand,
        projectedDemand,
        demandIncrease,
        percentageIncrease: Math.round(((demandIncrease / baselineDemand) * 100) * 10) / 10,
        forecastConfidence: 94,
        peakWindow: '7-14 days',
        seasonalFactor: 1.8,
        eventFactors: ['Ramadan', 'Festival Season', 'Flash Sale Campaign'],
        inventoryRecommendations: {
          additionalUnits: Math.round(demandIncrease * 0.3),
          warehousesToActivate: Math.ceil(demandIncrease / 10000),
          emergencySourcesNeeded: Math.ceil(demandIncrease / 50000),
        },
        supplyChainAdjustments: [
          {
            action: 'Increase supplier order volume',
            percentage: 35,
            lead_time: '3 days',
          },
          {
            action: 'Activate secondary suppliers',
            percentage: 25,
            lead_time: '5 days',
          },
          {
            action: 'Expedite air freight',
            percentage: 40,
            lead_time: '1 day',
          },
        ],
        riskAssessment: {
          stockoutRisk: 'LOW',
          supplyShortfall: 'MINIMAL',
          costImpact: Math.round(demandIncrease * 2.5),
        },
      },
      executionTime: Date.now() - startTime,
    } as DemoResult

    return Response.json(analysisResult, { status: 200 })
  } catch (error) {
    const errorResult: DemoResult = {
      success: false,
      error: error instanceof Error ? error.message : 'Forecast failed',
      executionTime: Date.now() - startTime,
    }
    return Response.json(errorResult, { status: 500 })
  }
}
