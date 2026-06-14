import { createClient } from '@supabase/supabase-js'
import type { RealTimeSubscription, AgentDecision, CapabilityData } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function subscribeToDecisions(
  onData: (decision: AgentDecision) => void,
  onError?: (error: Error) => void
): Promise<RealTimeSubscription> {
  const channel = supabase
    .channel('agent-decisions')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'agent_decisions',
      },
      (payload) => {
        try {
          onData(payload.new as AgentDecision)
        } catch (error) {
          onError?.(error instanceof Error ? error : new Error('Unknown error'))
        }
      }
    )
    .subscribe()

  return {
    unsubscribe: () => {
      supabase.removeChannel(channel)
    },
  }
}

export async function subscribeToCapabilityMetrics(
  onData: (data: CapabilityData) => void,
  onError?: (error: Error) => void
): Promise<RealTimeSubscription> {
  const channel = supabase
    .channel('capability-metrics')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'capability_metrics',
      },
      (payload) => {
        try {
          onData(payload.new as CapabilityData)
        } catch (error) {
          onError?.(error instanceof Error ? error : new Error('Unknown error'))
        }
      }
    )
    .subscribe()

  return {
    unsubscribe: () => {
      supabase.removeChannel(channel)
    },
  }
}

export async function fetchCapabilityMetrics(): Promise<CapabilityData | null> {
  try {
    const { data, error } = await supabase
      .from('capability_metrics')
      .select('*')
      .single()

    if (error) throw error
    return data as CapabilityData
  } catch (error) {
    console.error('Failed to fetch capability metrics:', error)
    return null
  }
}

export async function fetchRecentDecisions(limit: number = 10): Promise<AgentDecision[]> {
  try {
    const { data, error } = await supabase
      .from('agent_decisions')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data as AgentDecision[]
  } catch (error) {
    console.error('Failed to fetch decisions:', error)
    return []
  }
}
