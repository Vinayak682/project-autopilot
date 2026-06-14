# Project Autopilot - API Documentation

Complete API reference for all demo endpoints and their contracts.

## Base URL

```
Development:  http://localhost:3000
Staging:      https://staging.project-autopilot.com
Production:   https://project-autopilot.com
```

## Authentication

Currently, all endpoints are public. For future enhancement, add Bearer token:

```
Authorization: Bearer <your-token>
```

---

## Endpoints

### 1. POST `/api/demo/otif-copilot`

**Purpose:** On-Time In-Full (OTIF) analysis with route optimization

**Request:**
```bash
curl -X POST http://localhost:3000/api/demo/otif-copilot \
  -H "Content-Type: application/json"
```

**Request Body:** (Optional)
```json
{}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "currentOTIF": 99.7,
    "projectedOTIF": 99.84,
    "improvement": 2.4,
    "affectedShipments": 1247,
    "optimizedRoutes": 342,
    "estimatedTimeSavings": 24,
    "costSavings": 184500,
    "routeOptimizations": [
      {
        "shipmentId": "SHP-2024-001847",
        "originalRoute": "Los Angeles → Memphis → Dallas → Customer",
        "optimizedRoute": "Los Angeles → Phoenix → Customer",
        "timeSaved": 18,
        "costReduction": 2400
      }
    ],
    "riskMitigation": {
      "weatherDisruptions": 23,
      "capacityIssues": 8,
      "supplierDelays": 5
    }
  },
  "executionTime": 145
}
```

**Error Response (500):**
```json
{
  "success": false,
  "error": "Analysis failed",
  "executionTime": 45
}
```

**Metrics:**
- **Response Time:** ~100-200ms
- **Accuracy:** 98%+
- **Cache:** No (real-time)

---

### 2. POST `/api/demo/gcc-surge`

**Purpose:** Demand surge forecasting with regional analysis

**Request:**
```bash
curl -X POST http://localhost:3000/api/demo/gcc-surge \
  -H "Content-Type: application/json" \
  -d '{"demandMultiplier": 1.5}'
```

**Request Body:**
```typescript
interface GCCSurgeRequest {
  demandMultiplier?: number  // Default: 1.5 (50% increase)
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "region": "APAC",
    "currentDemand": 50000,
    "projectedDemand": 75000,
    "demandIncrease": 25000,
    "percentageIncrease": 50.0,
    "forecastConfidence": 94,
    "peakWindow": "7-14 days",
    "seasonalFactor": 1.8,
    "eventFactors": [
      "Ramadan",
      "Festival Season",
      "Flash Sale Campaign"
    ],
    "inventoryRecommendations": {
      "additionalUnits": 7500,
      "warehousesToActivate": 2,
      "emergencySourcesNeeded": 1
    },
    "supplyChainAdjustments": [
      {
        "action": "Increase supplier order volume",
        "percentage": 35,
        "lead_time": "3 days"
      },
      {
        "action": "Activate secondary suppliers",
        "percentage": 25,
        "lead_time": "5 days"
      }
    ],
    "riskAssessment": {
      "stockoutRisk": "LOW",
      "supplyShortfall": "MINIMAL",
      "costImpact": 62500
    }
  },
  "executionTime": 234
}
```

**Parameters:**
| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| demandMultiplier | number | 1.5 | 1.0-5.0 | Demand surge multiplier |

**Metrics:**
- **Response Time:** ~200-300ms
- **Forecast Accuracy:** 94%
- **Confidence Score:** 85-96%

---

### 3. POST `/api/demo/forecast`

**Purpose:** Compare 47 forecasting models and recommend optimal one

**Request:**
```bash
curl -X POST http://localhost:3000/api/demo/forecast \
  -H "Content-Type: application/json"
```

**Request Body:** (Optional)
```json
{}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "evaluationDate": "2024-06-14T14:30:00Z",
    "modelsEvaluated": 47,
    "topPerformers": [
      {
        "rank": 1,
        "model": "Ensemble (Transformer + XGBoost)",
        "accuracy": 94.8,
        "latency": 42,
        "resourceUsage": "Moderate",
        "recommendation": "PRIMARY",
        "rmse": 2.1,
        "mae": 1.4
      },
      {
        "rank": 2,
        "model": "Temporal Fusion Transformer",
        "accuracy": 92.3,
        "latency": 38,
        "resourceUsage": "Low",
        "recommendation": "SECONDARY",
        "rmse": 2.8,
        "mae": 1.9
      }
    ],
    "performanceComparison": {
      "bestAccuracy": "Ensemble (Transformer + XGBoost)",
      "fastestLatency": "ARIMA with Seasonal Adjustment",
      "mostEfficient": "Temporal Fusion Transformer"
    },
    "recommendations": {
      "primaryModel": "Ensemble (Transformer + XGBoost)",
      "fallbackModel": "Temporal Fusion Transformer",
      "useCase": "Multi-region demand forecasting",
      "expectedImprovement": "+8.3% accuracy over baseline"
    },
    "scenarioAnalysis": {
      "normalDemand": { "accuracy": 96.2, "latency": 45 },
      "volatileDemand": { "accuracy": 93.1, "latency": 48 },
      "seasonalPeak": { "accuracy": 94.8, "latency": 42 },
      "crisis": { "accuracy": 88.9, "latency": 52 }
    }
  },
  "executionTime": 512
}
```

**Metrics:**
- **Response Time:** ~400-600ms
- **Models Evaluated:** 47
- **Accuracy Range:** 85-96%

---

### 4. POST `/api/capability-meter/evaluate`

**Purpose:** Daily capability assessment and gap analysis

**Request:**
```bash
curl -X POST http://localhost:3000/api/capability-meter/evaluate \
  -H "Content-Type: application/json"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "evaluation": {
      "overallScore": 87,
      "lastEvaluated": "2024-06-14T14:30:00Z",
      "metrics": [
        {
          "id": "1",
          "name": "Demand Forecasting",
          "current": 94,
          "target": 95,
          "unit": "%",
          "trend": "up",
          "lastUpdated": "2024-06-14T14:30:00Z"
        }
      ]
    },
    "improvementAreas": [
      {
        "metric": "Cost Optimization",
        "current": 76,
        "target": 85,
        "gap": 9,
        "recommendations": [
          "Implement dynamic pricing strategy",
          "Optimize carrier selection",
          "Consolidate shipments"
        ],
        "estimatedGain": 2340000
      }
    ],
    "executionStats": {
      "metricsEvaluated": 6,
      "dataPointsProcessed": 2400000,
      "averageAccuracy": 92.5,
      "outliers": 47
    },
    "nextRecommendedActions": [
      "Launch cost optimization pilot in North America",
      "Upgrade disruption detection model",
      "Increase supplier quality audits"
    ]
  },
  "executionTime": 1250
}
```

**Metrics:**
- **Response Time:** ~1000-1500ms
- **Metrics Tracked:** 24
- **Update Frequency:** Daily

---

## Response Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Demo executed successfully |
| 400 | Bad Request | Invalid parameters |
| 500 | Server Error | Analysis failed |
| 503 | Service Unavailable | Database offline |

---

## Error Handling

All endpoints follow this error format:

```json
{
  "success": false,
  "error": "Descriptive error message",
  "executionTime": 45
}
```

---

## Rate Limiting

Currently unlimited. Future implementation:
- **Demo endpoints:** 100 requests/minute per IP
- **Capability meter:** 10 requests/minute per IP

---

## Data Structures

### DemoResult
```typescript
interface DemoResult {
  success: boolean
  data?: Record<string, unknown>
  error?: string
  executionTime?: number
}
```

### CapabilityMetric
```typescript
interface CapabilityMetric {
  id: string
  name: string
  current: number
  target: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  lastUpdated: string
}
```

### AgentDecision
```typescript
interface AgentDecision {
  id: string
  timestamp: string
  agent: string
  action: string
  reasoning: string
  confidence: number
  result?: string
  impactMetrics?: Record<string, number>
}
```

---

## Testing API Endpoints

### Using cURL

```bash
# Test OTIF Copilot
curl -X POST http://localhost:3000/api/demo/otif-copilot

# Test GCC Surge with multiplier
curl -X POST http://localhost:3000/api/demo/gcc-surge \
  -H "Content-Type: application/json" \
  -d '{"demandMultiplier": 2.0}'

# Test Forecast Comparison
curl -X POST http://localhost:3000/api/demo/forecast

# Test Capability Evaluation
curl -X POST http://localhost:3000/api/capability-meter/evaluate
```

### Using Postman

1. Import as JSON
2. Create POST requests for each endpoint
3. Set headers: `Content-Type: application/json`
4. Execute and verify responses

### Using JavaScript

```javascript
const response = await fetch('/api/demo/otif-copilot', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
})

const result = await response.json()
console.log(result)
```

---

## Future Enhancements

- [ ] Pagination for large datasets
- [ ] Filtering and sorting parameters
- [ ] WebSocket subscriptions
- [ ] GraphQL API layer
- [ ] API versioning (v1, v2)
- [ ] OpenAPI/Swagger documentation
- [ ] Authentication & authorization
- [ ] Rate limiting & throttling
- [ ] Request validation schemas
- [ ] Response compression (gzip)

---

**Last Updated:** June 14, 2024  
**API Version:** 1.0.0  
**Maintainer:** Project Autopilot Team
