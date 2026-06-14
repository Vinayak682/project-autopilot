/**
 * Feature Flags System
 * Centralized feature flag management for gradual rollouts
 */

export type Feature =
  | 'REALTIME_UPDATES'
  | 'DEMO_APIS'
  | 'ANALYTICS'
  | 'ERROR_TRACKING'
  | 'NEWSLETTER_SIGNUP'
  | 'ADVANCED_ANALYTICS'
  | 'BETA_FEATURES'

type FeatureFlagConfig = {
  [key in Feature]: {
    enabled: boolean
    description: string
    rolloutPercentage?: number
    environments: ('development' | 'staging' | 'production')[]
  }
}

const FEATURE_FLAGS: FeatureFlagConfig = {
  REALTIME_UPDATES: {
    enabled: process.env.NEXT_PUBLIC_ENABLE_REALTIME === 'true',
    description: 'Real-time Supabase subscriptions',
    environments: ['development', 'staging', 'production'],
  },
  DEMO_APIS: {
    enabled: process.env.NEXT_PUBLIC_ENABLE_DEMOS === 'true',
    description: 'Live demo API endpoints',
    environments: ['development', 'staging', 'production'],
  },
  ANALYTICS: {
    enabled: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    description: 'Google Analytics integration',
    rolloutPercentage: 100,
    environments: ['staging', 'production'],
  },
  ERROR_TRACKING: {
    enabled: process.env.NEXT_PUBLIC_ENABLE_SENTRY === 'true',
    description: 'Sentry error tracking',
    rolloutPercentage: 100,
    environments: ['staging', 'production'],
  },
  NEWSLETTER_SIGNUP: {
    enabled: true,
    description: 'Newsletter subscription form',
    rolloutPercentage: 100,
    environments: ['development', 'staging', 'production'],
  },
  ADVANCED_ANALYTICS: {
    enabled: false,
    description: 'Advanced analytics dashboard',
    rolloutPercentage: 10,
    environments: ['production'],
  },
  BETA_FEATURES: {
    enabled: process.env.NEXT_PUBLIC_ENVIRONMENT === 'development',
    description: 'Experimental beta features',
    environments: ['development'],
  },
}

/**
 * Check if a feature is enabled
 * Supports gradual rollouts via rolloutPercentage
 */
export function isFeatureEnabled(feature: Feature, userId?: string): boolean {
  const config = FEATURE_FLAGS[feature]

  if (!config.enabled) {
    return false
  }

  // If no rollout percentage specified, feature is fully enabled
  if (config.rolloutPercentage === undefined) {
    return true
  }

  // For gradual rollouts, hash user ID to get consistent rollout
  if (userId) {
    const hash = userId.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0)
    }, 0)
    const rolloutValue = (hash % 100) + 1
    return rolloutValue <= config.rolloutPercentage
  }

  // If no user ID, use random value
  return Math.random() * 100 <= config.rolloutPercentage
}

/**
 * Get all enabled features
 */
export function getEnabledFeatures(): Feature[] {
  return Object.entries(FEATURE_FLAGS)
    .filter(([_, config]) => config.enabled)
    .map(([feature]) => feature as Feature)
}

/**
 * Log feature flag state (for debugging)
 */
export function logFeatureFlags(): void {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('📋 Feature Flags:', {
      environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
      enabled: getEnabledFeatures(),
      all: FEATURE_FLAGS,
    })
  }
}

// Log on module load in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  logFeatureFlags()
}
