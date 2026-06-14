import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

const ORG_CHART = [
  // Board (level 0)
  { level: 0, title: 'Chairman', name: 'Sheikh Mohammed Al Hamdan Al Maktoum', department: 'Board', reports_to: null, is_player: false },
  { level: 0, title: 'Independent Director', name: 'Fatima Al Rashidi', department: 'Board', reports_to: null, is_player: false },
  { level: 0, title: 'Audit Committee Chair', name: 'Dr. Khalid Al Suwaidi', department: 'Board', reports_to: null, is_player: false },
  { level: 0, title: 'Independent Director', name: 'James Thornton', department: 'Board', reports_to: null, is_player: false },
  { level: 0, title: 'NRC Member', name: 'Rania Al Farsi', department: 'Board', reports_to: null, is_player: false },
  // MD/CEO (level 1 — player)
  { level: 1, title: 'MD / CEO', name: 'You', department: 'Executive', reports_to: 'Sheikh Mohammed Al Hamdan Al Maktoum', is_player: true },
  // C-Suite (level 2)
  { level: 2, title: 'CFO', name: 'Nadia Al Zahra', department: 'Finance', reports_to: 'You', is_player: false },
  { level: 2, title: 'COO', name: 'Omar Bin Rashid', department: 'Operations', reports_to: 'You', is_player: false },
  { level: 2, title: 'CMO', name: 'Leila Mansouri', department: 'Marketing', reports_to: 'You', is_player: false },
  { level: 2, title: 'CSCO', name: 'Faris Al Tamimi', department: 'Supply Chain', reports_to: 'You', is_player: false },
  { level: 2, title: 'VP Sales', name: 'Priya Nair', department: 'Sales', reports_to: 'You', is_player: false },
  { level: 2, title: 'VP HR', name: 'Mohammed Al Balushi', department: 'HR', reports_to: 'You', is_player: false },
  { level: 2, title: 'VP Legal & Compliance', name: 'Tarek Saad', department: 'Legal', reports_to: 'You', is_player: false },
  // Department Heads (level 3)
  { level: 3, title: 'Finance Controller', name: 'Aisha Al Mansouri', department: 'Finance', reports_to: 'Nadia Al Zahra', is_player: false },
  { level: 3, title: 'Head of Demand Planning', name: 'Ravi Krishnamurthy', department: 'Supply Chain', reports_to: 'Faris Al Tamimi', is_player: false },
  { level: 3, title: 'Head of Supply Planning', name: 'Sara Al Dhaheri', department: 'Supply Chain', reports_to: 'Faris Al Tamimi', is_player: false },
  { level: 3, title: 'Head of Procurement', name: 'Yusuf Al Qassimi', department: 'Supply Chain', reports_to: 'Faris Al Tamimi', is_player: false },
  { level: 3, title: 'Head of Logistics', name: 'Thomas Andersen', department: 'Supply Chain', reports_to: 'Omar Bin Rashid', is_player: false },
  { level: 3, title: 'Head of Commercial', name: 'Layla Karimi', department: 'Sales', reports_to: 'Priya Nair', is_player: false },
  { level: 3, title: 'Brand Director', name: 'Noura Al Nuaimi', department: 'Marketing', reports_to: 'Leila Mansouri', is_player: false },
  { level: 3, title: 'Key Accounts Director', name: 'Deepak Sharma', department: 'Sales', reports_to: 'Priya Nair', is_player: false },
  { level: 3, title: 'People & Culture Lead', name: 'Hana Al Marri', department: 'HR', reports_to: 'Mohammed Al Balushi', is_player: false },
]

const SKUS = [
  { sku_code: 'FMC-001', name: 'Full Cream Milk 1L', category: 'Dairy', sub_category: 'Fresh Milk', abc_class: 'A', price_aed: 4.50, cogs_aed: 2.20, moq_cases: 100, shelf_life_days: 14 },
  { sku_code: 'FMC-002', name: 'Skimmed Milk 1L', category: 'Dairy', sub_category: 'Fresh Milk', abc_class: 'A', price_aed: 4.25, cogs_aed: 2.10, moq_cases: 80, shelf_life_days: 14 },
  { sku_code: 'FMC-003', name: 'Long Life Milk 1L', category: 'Dairy', sub_category: 'UHT Milk', abc_class: 'A', price_aed: 3.75, cogs_aed: 1.80, moq_cases: 200, shelf_life_days: 270 },
  { sku_code: 'FMC-004', name: 'Yoghurt Plain 500g', category: 'Dairy', sub_category: 'Yoghurt', abc_class: 'A', price_aed: 5.50, cogs_aed: 2.80, moq_cases: 60, shelf_life_days: 21 },
  { sku_code: 'FMC-005', name: 'Orange Juice 1L', category: 'Juice', sub_category: 'Citrus', abc_class: 'A', price_aed: 7.25, cogs_aed: 3.40, moq_cases: 120, shelf_life_days: 30 },
  { sku_code: 'FMC-006', name: 'Apple Juice 1L', category: 'Juice', sub_category: 'Fruit', abc_class: 'B', price_aed: 7.00, cogs_aed: 3.20, moq_cases: 100, shelf_life_days: 30 },
  { sku_code: 'FMC-007', name: 'Mango Nectar 1L', category: 'Juice', sub_category: 'Nectar', abc_class: 'A', price_aed: 6.50, cogs_aed: 3.00, moq_cases: 100, shelf_life_days: 30 },
  { sku_code: 'FMC-008', name: 'Labneh 400g', category: 'Dairy', sub_category: 'Labneh', abc_class: 'B', price_aed: 8.50, cogs_aed: 4.20, moq_cases: 50, shelf_life_days: 30 },
  { sku_code: 'FMC-009', name: 'Cheddar Cheese 200g', category: 'Dairy', sub_category: 'Cheese', abc_class: 'B', price_aed: 12.00, cogs_aed: 6.50, moq_cases: 40, shelf_life_days: 60 },
  { sku_code: 'FMC-010', name: 'Cooking Butter 250g', category: 'Dairy', sub_category: 'Butter', abc_class: 'B', price_aed: 9.50, cogs_aed: 4.80, moq_cases: 60, shelf_life_days: 90 },
  { sku_code: 'FMC-011', name: 'Mixed Fruit Jam 400g', category: 'Grocery', sub_category: 'Preserves', abc_class: 'C', price_aed: 11.00, cogs_aed: 5.50, moq_cases: 30, shelf_life_days: 365 },
  { sku_code: 'FMC-012', name: 'Tomato Paste 400g', category: 'Grocery', sub_category: 'Condiments', abc_class: 'B', price_aed: 5.25, cogs_aed: 2.40, moq_cases: 80, shelf_life_days: 730 },
  { sku_code: 'FMC-013', name: 'Pomegranate Juice 1L', category: 'Juice', sub_category: 'Premium', abc_class: 'B', price_aed: 14.50, cogs_aed: 7.00, moq_cases: 60, shelf_life_days: 30 },
  { sku_code: 'FMC-014', name: 'Ayran 330ml', category: 'Dairy', sub_category: 'Beverages', abc_class: 'A', price_aed: 3.50, cogs_aed: 1.60, moq_cases: 120, shelf_life_days: 7 },
  { sku_code: 'FMC-015', name: 'Cream Cheese 200g', category: 'Dairy', sub_category: 'Cheese', abc_class: 'B', price_aed: 10.00, cogs_aed: 5.00, moq_cases: 50, shelf_life_days: 30 },
  { sku_code: 'FMC-016', name: 'Mixed Nuts Snack 200g', category: 'Snacks', sub_category: 'Nuts', abc_class: 'C', price_aed: 22.00, cogs_aed: 13.00, moq_cases: 30, shelf_life_days: 180 },
  { sku_code: 'FMC-017', name: 'Drinking Yoghurt 250ml', category: 'Dairy', sub_category: 'Beverages', abc_class: 'A', price_aed: 4.00, cogs_aed: 1.90, moq_cases: 100, shelf_life_days: 14 },
  { sku_code: 'FMC-018', name: 'Peach Nectar 1L', category: 'Juice', sub_category: 'Nectar', abc_class: 'B', price_aed: 6.25, cogs_aed: 2.90, moq_cases: 80, shelf_life_days: 30 },
  { sku_code: 'FMC-019', name: 'Sour Cream 200g', category: 'Dairy', sub_category: 'Cream', abc_class: 'C', price_aed: 7.00, cogs_aed: 3.30, moq_cases: 40, shelf_life_days: 21 },
  { sku_code: 'FMC-020', name: 'Energy Mix Bars 6-pack', category: 'Snacks', sub_category: 'Bars', abc_class: 'C', price_aed: 28.00, cogs_aed: 16.00, moq_cases: 24, shelf_life_days: 90 },
]

const SUPPLIERS = [
  { supplier_code: 'SUP-001', name: 'Al Rawabi Fresh Farms', country: 'UAE', category: 'Raw Milk', annual_contract_aed: 45_000_000, reliability_score: 94.0, lead_time_days: 1, payment_terms: 'Net 30', contract_status: 'active' },
  { supplier_code: 'SUP-002', name: 'Emirates Packaging Co', country: 'UAE', category: 'Packaging', annual_contract_aed: 18_000_000, reliability_score: 91.0, lead_time_days: 7, payment_terms: 'Net 45', contract_status: 'active' },
  { supplier_code: 'SUP-003', name: 'Saudi Fruit Concentrate LLC', country: 'Saudi Arabia', category: 'Fruit Concentrate', annual_contract_aed: 32_000_000, reliability_score: 88.0, lead_time_days: 14, payment_terms: 'Net 45', contract_status: 'active' },
  { supplier_code: 'SUP-004', name: 'Jordan Sugar Industries', country: 'Jordan', category: 'Sugar', annual_contract_aed: 12_000_000, reliability_score: 85.0, lead_time_days: 21, payment_terms: 'Net 60', contract_status: 'active' },
  { supplier_code: 'SUP-005', name: 'GCC Cold Chain Logistics', country: 'UAE', category: 'Refrigerated Transport', annual_contract_aed: 28_000_000, reliability_score: 92.0, lead_time_days: 0, payment_terms: 'Net 30', contract_status: 'active' },
  { supplier_code: 'SUP-006', name: 'Turkish Nuts & Dried Fruit', country: 'Turkey', category: 'Nuts', annual_contract_aed: 8_000_000, reliability_score: 79.0, lead_time_days: 28, payment_terms: 'Net 60', contract_status: 'active' },
  { supplier_code: 'SUP-007', name: 'European Dairy Cultures GmbH', country: 'Germany', category: 'Cultures & Enzymes', annual_contract_aed: 5_500_000, reliability_score: 97.0, lead_time_days: 21, payment_terms: 'Net 30', contract_status: 'active' },
  { supplier_code: 'SUP-008', name: 'Oman Salt Works', country: 'Oman', category: 'Salt & Minerals', annual_contract_aed: 2_200_000, reliability_score: 96.0, lead_time_days: 5, payment_terms: 'Net 30', contract_status: 'active' },
]

const MARKET_EVENTS = [
  { event_key: 'ramadan_surge', name: 'Ramadan Demand Surge', event_type: 'seasonal', description: 'Consumption spikes +35% during Ramadan, especially dairy and juice.', pe_modifier: 2.5, probability: 0.083 },
  { event_key: 'summer_slowdown', name: 'Summer Heat Slowdown', event_type: 'seasonal', description: 'UAE summer reduces outdoor consumption by 18%. Cold chain costs rise 12%.', pe_modifier: -1.5, probability: 0.083 },
  { event_key: 'raw_milk_shortage', name: 'Raw Milk Supply Shock', event_type: 'disruption', description: 'Foot-and-mouth outbreak in partner farms cuts supply by 30% for 6 weeks.', pe_modifier: -3.0, probability: 0.05 },
  { event_key: 'competitor_price_cut', name: 'Almarai 10% Price Cut', event_type: 'competitive', description: 'Almarai launches aggressive price promotion across UAE modern trade.', pe_modifier: -2.5, probability: 0.06 },
  { event_key: 'uae_nat_day_promo', name: 'UAE National Day Promotion', event_type: 'seasonal', description: 'Retail partners seek exclusive packaging and offers for UAE National Day.', pe_modifier: 1.5, probability: 0.083 },
  { event_key: 'fuel_surcharge', name: 'Fuel Surcharge Increase', event_type: 'macro', description: 'ADNOC revises fuel prices upward, pushing logistics costs up 8%.', pe_modifier: -1.0, probability: 0.08 },
  { event_key: 'expo_effect', name: 'Expo/Event Footfall Surge', event_type: 'opportunity', description: 'Major event at DWTC drives +22% demand from hospitality channel.', pe_modifier: 3.0, probability: 0.05 },
  { event_key: 'vat_compliance', name: 'VAT Audit & Compliance', event_type: 'regulatory', description: 'FTA audit requires documentation overhaul. Finance team distracted for 3 weeks.', pe_modifier: -0.5, probability: 0.04 },
  { event_key: 'cold_chain_breakdown', name: 'Cold Chain Breakdown', event_type: 'disruption', description: 'Primary refrigeration unit at Jebel Ali DC fails. 4 days to repair, AED 2.1M write-off.', pe_modifier: -2.0, probability: 0.04 },
  { event_key: 'new_hypermarket', name: 'New Hypermarket Opening', event_type: 'opportunity', description: 'Carrefour opens 3 new UAE hypermarkets. Shelf space opportunity + AED 8M incremental revenue.', pe_modifier: 2.0, probability: 0.06 },
]

const EXPANSION_OPPS = [
  { opp_key: 'egypt_entry', name: 'Egypt Market Entry', market: 'Egypt', category: 'geographic', capex_aed: 180_000_000, revenue_potential_aed: 320_000_000, payback_years: 4.5, risk_level: 'high', status: 'identified', description: 'Greenfield entry into Egypt dairy market. Population 105M, dairy per-capita consumption growing at 8% CAGR. Requires local JV or full subsidiary, local production plant.', requirements: ['Local JV partner', 'Regulatory approval (EFSA)', 'AED 180M plant capex', '18-month lead time'] },
  { opp_key: 'saudi_jv', name: 'Saudi Arabia JV Expansion', market: 'Saudi Arabia', category: 'geographic', capex_aed: 95_000_000, revenue_potential_aed: 220_000_000, payback_years: 3.2, risk_level: 'medium', status: 'identified', description: 'Joint venture with Al-Safi Danone for KSA distribution. Saudi Vision 2030 food security initiative provides import duty concessions for local producers.', requirements: ['JV negotiation (6 months)', 'SFDA registration', 'Shared distribution network'] },
  { opp_key: 'icc_sponsorship', name: 'ICC Cricket Sponsorship', market: 'GCC', category: 'marketing', capex_aed: 22_000_000, revenue_potential_aed: 85_000_000, payback_years: 2.1, risk_level: 'low', status: 'identified', description: 'Title sponsor of ICC Men\'s T20 matches played in Dubai & Abu Dhabi. 2.4B cricket-watching audience, 60% from South Asia (core UAE demographic).', requirements: ['3-year commitment', 'Brand activation budget', 'Approval from Board NRC'] },
  { opp_key: 'kuwait_distribution', name: 'Kuwait Distribution Expansion', market: 'Kuwait', category: 'geographic', capex_aed: 35_000_000, revenue_potential_aed: 90_000_000, payback_years: 2.8, risk_level: 'medium', status: 'identified', description: 'Expand from current 3rd-party Kuwait agent to owned distribution subsidiary. Direct retail access to 18 Hypermarket chains and 400 cooperative stores.', requirements: ['KFDA product registration', 'Warehouse lease in Shuwaikh Industrial', 'Sales team of 15'] },
  { opp_key: 'organic_range', name: 'Al Manar Organic Range Launch', market: 'UAE', category: 'product', capex_aed: 18_000_000, revenue_potential_aed: 65_000_000, payback_years: 1.8, risk_level: 'low', status: 'identified', description: 'Launch 12-SKU certified organic dairy and juice range targeting premium UAE consumers. Average 40% premium pricing. Organic market growing 22% YoY in UAE.', requirements: ['EU Organic certification (9 months)', 'Dedicated production line', 'Premium retail shelf negotiation'] },
  { opp_key: 'b2b_foodservice', name: 'B2B Foodservice Channel', market: 'UAE & KSA', category: 'channel', capex_aed: 12_000_000, revenue_potential_aed: 140_000_000, payback_years: 1.5, risk_level: 'low', status: 'identified', description: 'Dedicated B2B sales team and foodservice SKU range for hotels, restaurants, hospitals. Currently <8% of revenue from this channel vs. 30% for Almarai.', requirements: ['Foodservice SKU reformulation', 'Dedicated sales team (25 people)', 'Hospital HACCP certification'] },
  { opp_key: 'oman_entry', name: 'Oman Direct Market Entry', market: 'Oman', category: 'geographic', capex_aed: 25_000_000, revenue_potential_aed: 55_000_000, payback_years: 3.1, risk_level: 'medium', status: 'identified', description: 'Establish direct Oman subsidiary replacing current distributor. Muscat growing rapidly, current distributor under-penetrating modern trade.', requirements: ['MOCI company registration', 'Warehouse in Rusayl Industrial', 'Brand registration transfer'] },
  { opp_key: 'ecommerce_dtc', name: 'Direct-to-Consumer eCommerce', market: 'UAE', category: 'channel', capex_aed: 8_500_000, revenue_potential_aed: 40_000_000, payback_years: 1.2, risk_level: 'low', status: 'identified', description: 'Launch Al Manar DTC app and subscription box model. "Farm-to-Fridge" daily fresh delivery. Subscription economics improve margins by 12pp vs. trade.', requirements: ['App development (6 months)', 'Last-mile cold chain partner', 'Same-day delivery SLA'] },
]

export async function POST() {
  const client = db()

  // Clear existing session data
  await Promise.all([
    client.from('sim_game_state').delete().eq('session_id', 'default'),
    client.from('sim_org_chart').delete().eq('session_id', 'default'),
    client.from('sim_skus').delete().eq('session_id', 'default'),
    client.from('sim_suppliers').delete().eq('session_id', 'default'),
    client.from('sim_market_events').delete().eq('session_id', 'default'),
    client.from('sim_expansion_opps').delete().eq('session_id', 'default'),
    client.from('sim_share_price_history').delete().eq('session_id', 'default'),
    client.from('sim_financials').delete().eq('session_id', 'default'),
    client.from('sim_kpi_snapshots').delete().eq('session_id', 'default'),
  ])

  // Seed game state
  await client.from('sim_game_state').insert({
    session_id: 'default',
    company_name: 'Al Manar Industries LLC',
    ticker: 'DFM: ALMANR',
    founded_year: 1988,
    current_month: 1,
    current_year: 2024,
    share_price: 15.00,
    shares_outstanding: 390_000_000,
    market_cap_aed: 5_850_000_000,
    total_revenue_ytd_aed: 0,
    total_ebitda_ytd_aed: 0,
    headcount: 2400,
    countries_active: ['UAE', 'Kuwait', 'Qatar', 'Bahrain', 'Oman'],
    otif_score: 96.4,
    forecast_accuracy: 88.0,
    employee_sentiment: 72.0,
  })

  // Seed org chart
  await client.from('sim_org_chart').insert(
    ORG_CHART.map(m => ({ ...m, session_id: 'default' }))
  )

  // Seed SKUs
  await client.from('sim_skus').insert(
    SKUS.map(s => ({ ...s, session_id: 'default', is_active: true }))
  )

  // Seed suppliers
  await client.from('sim_suppliers').insert(
    SUPPLIERS.map(s => ({ ...s, session_id: 'default' }))
  )

  // Seed market events
  await client.from('sim_market_events').insert(
    MARKET_EVENTS.map(e => ({ ...e, session_id: 'default', triggered: false }))
  )

  // Seed expansion opps
  await client.from('sim_expansion_opps').insert(
    EXPANSION_OPPS.map(o => ({ ...o, session_id: 'default' }))
  )

  // Seed 6 months of pre-game share price history
  const priceHistory = [
    { sim_month: -5, sim_year: 2023, price: 13.20, eps: 0.600, pe_multiple: 22.0, revenue_aed: 220_000_000, ebitda_aed: 29_700_000, market_event: null },
    { sim_month: -4, sim_year: 2023, price: 13.85, eps: 0.630, pe_multiple: 22.0, revenue_aed: 226_000_000, ebitda_aed: 30_510_000, market_event: null },
    { sim_month: -3, sim_year: 2023, price: 14.40, eps: 0.655, pe_multiple: 22.0, revenue_aed: 229_000_000, ebitda_aed: 30_915_000, market_event: null },
    { sim_month: -2, sim_year: 2023, price: 14.10, eps: 0.641, pe_multiple: 22.0, revenue_aed: 224_000_000, ebitda_aed: 30_240_000, market_event: 'competitor_price_cut' },
    { sim_month: -1, sim_year: 2023, price: 14.65, eps: 0.666, pe_multiple: 22.0, revenue_aed: 231_000_000, ebitda_aed: 31_185_000, market_event: null },
    { sim_month: 0, sim_year: 2023, price: 15.00, eps: 0.682, pe_multiple: 22.0, revenue_aed: 233_000_000, ebitda_aed: 32_620_000, market_event: null },
  ]
  await client.from('sim_share_price_history').insert(
    priceHistory.map(p => ({ ...p, session_id: 'default' }))
  )

  // Seed initial KPI snapshot
  await client.from('sim_kpi_snapshots').insert({
    session_id: 'default',
    sim_month: 0,
    otif_pct: 96.4,
    forecast_accuracy_pct: 88.0,
    inventory_turnover: 8.5,
    days_inventory_outstanding: 43,
    fill_rate_pct: 97.2,
    perfect_order_pct: 94.1,
    oee_pct: 82.0,
    capacity_utilization_pct: 78.0,
    market_share_uae: 18.0,
    distribution_reach_pct: 78.0,
    employee_turnover_pct: 9.2,
    employee_engagement_score: 72.0,
  })

  return NextResponse.json({
    success: true,
    seeded: {
      org_chart: ORG_CHART.length,
      skus: SKUS.length,
      suppliers: SUPPLIERS.length,
      market_events: MARKET_EVENTS.length,
      expansion_opps: EXPANSION_OPPS.length,
      price_history: priceHistory.length,
    },
    message: 'Al Manar Industries LLC — Game ready. Month 1, January 2024. Share price: AED 15.00.',
  })
}
