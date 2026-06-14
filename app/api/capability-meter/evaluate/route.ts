import type { DemoResult, CapabilityData } from '@/lib/types'

export async function POST(): Promise<Response> {
  const startTime = Date.now()

  try {
    const capabilityData: CapabilityData = {
      overallScore: 87,
      lastEvaluated: new Date().toISOString(),
      metrics: [
        {
          id: '1',
          name: 'Demand Forecasting',
          current: 94,
          target: 95,
          unit: '%',
          trend: 'up',
          lastUpdated: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'OTIF Score',
          current: 99.7,
          target: 99.8,
          unit: '%',
          trend: 'stable',
          lastUpdated: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Disruption Detection',
          current: 87,
          target: 90,
          unit: '%',
          trend: 'up',
          lastUpdated: new Date().toISOString(),
        },
        {
          id: '4',
          name: 'Cost Optimization',
          current: 76,
          target: 85,
          unit: '%',
          trend: 'down',
          lastUpdated: new Date().toISOString(),
        },
        {
          id: '5',
          name: 'Inventory Turnover',
          current: 82,
          target: 88,
          unit: '%',
          trend: 'up',
          lastUpdated: new Date().toISOString(),
        },
        {
          id: '6',
          name: 'Supplier Quality',
          current: 91,
          target: 93,
          unit: '%',
          trend: 'stable',
          lastUpdated: new Date().toISOString(),
        },
      ],
    }

    const analysisResult: DemoResult = {
      success: true,
      data: {
        evaluation: capabilityData,
        improvementAreas: [
          {
            metric: 'Cost Optimization',
            current: 76,
            target: 85,
            gap: 9,
            recommendations: [
              'Implement dynamic pricing strategy',
              'Optimize carrier selection',
              'Consolidate shipments',
            ],
            estimatedGain: 2340000,
          },
          {
            metric: 'Disruption Detection',
            current: 87,
            target: 90,
            gap: 3,
            recommendations: [
              'Enhance real-time data feeds',
              'Improve anomaly detection model',
              'Add more monitoring points',
            ],
            estimatedGain: 450000,
          },
        ],
        executionStats: {
          metricsEvaluated: 6,
          dataPointsProcessed: 2400000,
          averageAccuracy: 92.5,
          outliers: 47,
        },
        nextRecommendedActions: [
          'Launch cost optimization pilot in North America',
          'Upgrade disruption detection model',
          'Increase supplier quality audits',
        ],
      },
      executionTime: Date.now() - startTime,
    }

    return Response.json(analysisResult, { status: 200 })
  } catch (error) {
    const errorResult: DemoResult = {
      success: false,
      error: error instanceof Error ? error.message : 'Evaluation failed',
      executionTime: Date.now() - startTime,
    }
    return Response.json(errorResult, { status: 500 })
  }
}
