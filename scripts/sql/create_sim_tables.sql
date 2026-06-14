-- Al Manar Industries LLC — Business Simulator Database Schema
-- All tables prefixed with sim_ to isolate from existing tables
-- Run this in Supabase SQL editor

-- ─────────────────────────────────────────────
-- CORE GAME STATE
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS sim_game_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL DEFAULT 'default',
  current_month INT NOT NULL DEFAULT 1,
  current_year INT NOT NULL DEFAULT 2024,
  game_speed TEXT DEFAULT 'manual',
  status TEXT DEFAULT 'active',
  share_price DECIMAL(10,4) DEFAULT 15.00,
  market_cap_aed BIGINT DEFAULT 5850000000,
  total_revenue_ytd_aed BIGINT DEFAULT 0,
  total_ebitda_ytd_aed BIGINT DEFAULT 0,
  otif_score DECIMAL(5,2) DEFAULT 96.4,
  forecast_accuracy DECIMAL(5,2) DEFAULT 88.0,
  employee_sentiment DECIMAL(5,2) DEFAULT 72.0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sim_share_price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL DEFAULT 'default',
  sim_month INT NOT NULL,
  sim_year INT NOT NULL,
  price DECIMAL(10,4) NOT NULL,
  eps DECIMAL(8,4),
  pe_multiple DECIMAL(6,2),
  revenue_aed BIGINT,
  ebitda_aed BIGINT,
  market_event TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sim_decisions_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL DEFAULT 'default',
  sim_month INT NOT NULL,
  decision_type TEXT NOT NULL,
  decision_key TEXT NOT NULL,
  choice_made TEXT NOT NULL,
  claude_recommendation TEXT,
  cost_aed BIGINT DEFAULT 0,
  revenue_impact_aed BIGINT DEFAULT 0,
  kpi_delta JSONB,
  share_price_before DECIMAL(10,4),
  share_price_after DECIMAL(10,4),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- PRODUCT & PLANNING
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS sim_skus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  sub_category TEXT,
  unit TEXT DEFAULT 'case',
  unit_price_aed DECIMAL(8,2) NOT NULL,
  cogs_aed DECIMAL(8,2) NOT NULL,
  gross_margin_pct DECIMAL(5,2),
  abc_class TEXT DEFAULT 'A',
  shelf_life_days INT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sim_demand_forecast (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL DEFAULT 'default',
  sku_id UUID REFERENCES sim_skus(id) ON DELETE CASCADE,
  sim_month INT NOT NULL,
  sim_year INT NOT NULL,
  channel TEXT NOT NULL,
  region TEXT NOT NULL,
  forecasted_units INT NOT NULL,
  actual_units INT,
  forecast_error_pct DECIMAL(6,2),
  baseline_forecast INT,
  promotional_uplift INT DEFAULT 0,
  seasonal_factor DECIMAL(5,3) DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sim_production_plan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL DEFAULT 'default',
  sku_id UUID REFERENCES sim_skus(id) ON DELETE CASCADE,
  sim_month INT NOT NULL,
  facility TEXT NOT NULL,
  planned_units INT NOT NULL,
  actual_units INT,
  capacity_utilization_pct DECIMAL(5,2),
  downtime_hours DECIMAL(6,2) DEFAULT 0,
  oee_score DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sim_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL DEFAULT 'default',
  sku_id UUID REFERENCES sim_skus(id) ON DELETE CASCADE,
  warehouse TEXT NOT NULL,
  region TEXT NOT NULL,
  sim_month INT NOT NULL,
  opening_stock INT NOT NULL,
  receipts INT DEFAULT 0,
  sales_dispatched INT DEFAULT 0,
  closing_stock INT NOT NULL,
  safety_stock_level INT NOT NULL,
  days_on_hand DECIMAL(5,1),
  stockout_flag BOOLEAN DEFAULT FALSE,
  excess_flag BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- PROCUREMENT & LOGISTICS
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS sim_suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  country TEXT DEFAULT 'UAE',
  lead_time_days INT NOT NULL,
  reliability_score DECIMAL(5,2) DEFAULT 85.0,
  on_time_delivery_pct DECIMAL(5,2),
  quality_rejection_pct DECIMAL(5,2),
  contract_value_aed BIGINT,
  contract_expiry DATE,
  is_preferred BOOLEAN DEFAULT FALSE,
  is_backup BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sim_purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL DEFAULT 'default',
  supplier_id UUID REFERENCES sim_suppliers(id),
  po_number TEXT UNIQUE NOT NULL,
  raw_material TEXT NOT NULL,
  quantity DECIMAL(12,3) NOT NULL,
  unit TEXT DEFAULT 'MT',
  unit_price_aed DECIMAL(10,4),
  total_value_aed BIGINT,
  order_date DATE NOT NULL,
  expected_delivery DATE,
  actual_delivery DATE,
  status TEXT DEFAULT 'open',
  delay_days INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sim_dispatch_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL DEFAULT 'default',
  sim_month INT NOT NULL,
  route_code TEXT NOT NULL,
  origin_warehouse TEXT NOT NULL,
  destination TEXT NOT NULL,
  delivery_type TEXT,
  vehicle_type TEXT,
  planned_dispatch_date DATE,
  actual_dispatch_date DATE,
  planned_delivery_date DATE,
  actual_delivery_date DATE,
  total_skus INT,
  total_cases INT,
  otif_flag BOOLEAN,
  delay_reason TEXT,
  cost_aed DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- FINANCE & KPIs
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS sim_financials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL DEFAULT 'default',
  sim_month INT NOT NULL,
  sim_year INT NOT NULL,
  gross_revenue_aed BIGINT,
  trade_discounts_aed BIGINT,
  net_revenue_aed BIGINT,
  cogs_aed BIGINT,
  gross_profit_aed BIGINT,
  gross_margin_pct DECIMAL(5,2),
  marketing_spend_aed BIGINT,
  distribution_cost_aed BIGINT,
  admin_cost_aed BIGINT,
  ebitda_aed BIGINT,
  ebitda_margin_pct DECIMAL(5,2),
  depreciation_aed BIGINT,
  ebit_aed BIGINT,
  interest_aed BIGINT,
  tax_aed BIGINT,
  net_profit_aed BIGINT,
  net_margin_pct DECIMAL(5,2),
  cash_aed BIGINT,
  receivables_aed BIGINT,
  inventory_value_aed BIGINT,
  total_debt_aed BIGINT,
  shares_outstanding BIGINT DEFAULT 390000000,
  eps_aed DECIMAL(8,4),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sim_kpi_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL DEFAULT 'default',
  sim_month INT NOT NULL,
  otif_pct DECIMAL(5,2),
  forecast_accuracy_pct DECIMAL(5,2),
  inventory_turnover DECIMAL(6,2),
  days_inventory_outstanding DECIMAL(6,1),
  fill_rate_pct DECIMAL(5,2),
  perfect_order_pct DECIMAL(5,2),
  oee_pct DECIMAL(5,2),
  capacity_utilization_pct DECIMAL(5,2),
  market_share_uae DECIMAL(5,2),
  distribution_reach_pct DECIMAL(5,2),
  employee_turnover_pct DECIMAL(5,2),
  employee_engagement_score DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- ORG, MARKET & EXPANSION
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS sim_org_chart (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  level INT NOT NULL,
  reports_to TEXT,
  avatar_initials TEXT,
  nationality TEXT,
  years_at_company INT,
  is_board_member BOOLEAN DEFAULT FALSE,
  bio_short TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sim_market_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  severity TEXT DEFAULT 'medium',
  trigger_month INT,
  probability DECIMAL(4,3),
  duration_months INT DEFAULT 1,
  kpi_impact JSONB,
  is_scripted BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sim_sop_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL DEFAULT 'default',
  sim_month INT NOT NULL,
  step TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  demand_consensus_units BIGINT,
  supply_commitment_units BIGINT,
  gap_units BIGINT,
  resolution TEXT,
  claude_summary TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sim_expansion_opps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opp_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  target_country TEXT,
  target_region TEXT,
  investment_aed BIGINT,
  projected_revenue_aed BIGINT,
  projected_ebitda_pct DECIMAL(5,2),
  lead_time_months INT,
  risk_level TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'available',
  unlock_at_month INT DEFAULT 1,
  description TEXT,
  claude_analysis TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- REALTIME SETUP
-- ─────────────────────────────────────────────

ALTER TABLE sim_game_state REPLICA IDENTITY FULL;
ALTER TABLE sim_share_price_history REPLICA IDENTITY FULL;
ALTER TABLE sim_decisions_log REPLICA IDENTITY FULL;
ALTER TABLE sim_kpi_snapshots REPLICA IDENTITY FULL;
ALTER TABLE sim_sop_cycles REPLICA IDENTITY FULL;

-- Allow anon reads for realtime subscriptions
GRANT SELECT ON sim_game_state TO anon;
GRANT SELECT ON sim_share_price_history TO anon;
GRANT SELECT ON sim_decisions_log TO anon;
GRANT SELECT ON sim_kpi_snapshots TO anon;
GRANT SELECT ON sim_skus TO anon;
GRANT SELECT ON sim_demand_forecast TO anon;
GRANT SELECT ON sim_production_plan TO anon;
GRANT SELECT ON sim_inventory TO anon;
GRANT SELECT ON sim_suppliers TO anon;
GRANT SELECT ON sim_purchase_orders TO anon;
GRANT SELECT ON sim_dispatch_schedule TO anon;
GRANT SELECT ON sim_financials TO anon;
GRANT SELECT ON sim_org_chart TO anon;
GRANT SELECT ON sim_market_events TO anon;
GRANT SELECT ON sim_sop_cycles TO anon;
GRANT SELECT ON sim_expansion_opps TO anon;

-- Service role can write everything
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
