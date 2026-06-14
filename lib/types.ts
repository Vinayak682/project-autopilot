export interface CapabilityMetric {
  id: string
  name: string
  current: number
  target: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  lastUpdated: string
}

export interface CapabilityData {
  metrics: CapabilityMetric[]
  overallScore: number
  lastEvaluated: string
}

export interface DisruptionEvent {
  id: string
  timestamp: string
  title: string
  description: string
  impact: 'critical' | 'high' | 'medium' | 'low'
  resolution: string
  duration: number
}

export interface AgentDecision {
  id: string
  timestamp: string
  agent: string
  action: string
  reasoning: string
  confidence: number
  result?: string
  impactMetrics?: Record<string, number>
}

export interface DemoResult {
  success: boolean
  data?: Record<string, unknown>
  error?: string
  executionTime?: number
}

export interface ProjectShowcase {
  id: string
  title: string
  description: string
  capabilities: string[]
  metrics: {
    label: string
    value: string | number
    unit?: string
  }[]
  demoEndpoint: string
  icon: string
}

export interface RealTimeSubscription {
  unsubscribe: () => void
}
