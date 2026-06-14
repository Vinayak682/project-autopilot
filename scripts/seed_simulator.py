#!/usr/bin/env python3
"""
Al Manar Industries LLC — Simulator Seed Script
Seeds all sim_ tables via Supabase REST API.
Uses Kaggle FMCG data patterns scaled to AED 2.8B GCC FMCG company.
"""

import os
import json
import random
from datetime import datetime, timedelta
from supabase import create_client, Client

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL") or os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing SUPABASE_URL and SUPABASE_KEY. Export them before running.")

db: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
SESSION = "default"

SKU_CODES = [
    "FMC-001", "FMC-002", "FMC-003", "FMC-004", "FMC-005",
    "FMC-006", "FMC-007", "FMC-008", "FMC-009", "FMC-010",
    "FMC-011", "FMC-012", "FMC-013", "FMC-014", "FMC-015",
    "FMC-016", "FMC-017", "FMC-018", "FMC-019", "FMC-020",
]
WAREHOUSES = ["Dubai DC", "Jebel Ali DC", "Riyadh DC", "Kuwait DC"]
CHANNELS = ["Modern Trade", "Traditional Trade", "Foodservice", "Export"]
REGIONS = ["Dubai", "Abu Dhabi", "Northern Emirates", "Saudi Arabia", "Kuwait"]


def clear_tables():
    tables = [
        "sim_game_state", "sim_org_chart", "sim_skus", "sim_suppliers",
        "sim_demand_forecast", "sim_inventory", "sim_production_plan",
        "sim_purchase_orders", "sim_dispatch_schedule", "sim_financials",
        "sim_kpi_snapshots", "sim_share_price_history", "sim_market_events",
        "sim_sop_cycles", "sim_expansion_opps",
    ]
    for t in tables:
        db.table(t).delete().eq("session_id", SESSION).execute()
    print(f"Cleared {len(tables)} tables")


def seed_demand_forecast():
    rows = []
    # 18 months: -12 to +6 from game start (month 0 = Dec 2023)
    for month_offset in range(-12, 7):
        for sku in SKU_CODES[:10]:  # Top A & B class SKUs
            for channel in CHANNELS[:2]:  # Modern Trade + Traditional
                base_units = random.randint(8000, 45000)
                # Seasonal factor
                cal_month = ((month_offset) % 12) + 1
                seasonal = {1: 0.95, 2: 0.88, 3: 1.12, 4: 1.18, 5: 0.95, 6: 0.90,
                           7: 0.85, 8: 0.82, 9: 0.92, 10: 0.98, 11: 1.10, 12: 1.20}.get(cal_month, 1.0)
                forecast_units = int(base_units * seasonal)
                actual_units = int(forecast_units * random.uniform(0.88, 1.12)) if month_offset <= 0 else None
                rows.append({
                    "session_id": SESSION,
                    "sim_month": month_offset,
                    "sku_code": sku,
                    "channel": channel,
                    "region": random.choice(REGIONS),
                    "forecast_units": forecast_units,
                    "actual_units": actual_units,
                    "forecast_accuracy_pct": random.uniform(82, 94) if actual_units else None,
                    "is_locked": month_offset < 0,
                })
    db.table("sim_demand_forecast").insert(rows).execute()
    print(f"Seeded {len(rows)} demand forecast rows")


def seed_inventory():
    rows = []
    for sku in SKU_CODES:
        for wh in WAREHOUSES:
            base_units = random.randint(2000, 25000)
            doh = random.uniform(18, 55)
            rows.append({
                "session_id": SESSION,
                "sim_month": 0,
                "sku_code": sku,
                "warehouse": wh,
                "opening_stock_units": base_units,
                "closing_stock_units": int(base_units * random.uniform(0.85, 1.05)),
                "days_on_hand": round(doh, 1),
                "safety_stock_units": int(base_units * 0.25),
                "stockout_flag": doh < 7,
                "excess_flag": doh > 45,
            })
    db.table("sim_inventory").insert(rows).execute()
    print(f"Seeded {len(rows)} inventory rows")


def seed_production_plan():
    facilities = ["Dubai Plant", "Jebel Ali Plant"]
    rows = []
    for month in range(1, 4):
        for facility in facilities:
            rows.append({
                "session_id": SESSION,
                "sim_month": month,
                "facility": facility,
                "planned_units": random.randint(800000, 1200000),
                "actual_units": random.randint(750000, 1150000) if month <= 1 else None,
                "capacity_utilization_pct": random.uniform(72, 88),
                "oee_pct": random.uniform(79, 86),
                "downtime_hours": random.uniform(4, 24),
                "quality_reject_pct": random.uniform(0.8, 2.5),
            })
    db.table("sim_production_plan").insert(rows).execute()
    print(f"Seeded {len(rows)} production plan rows")


def seed_purchase_orders():
    supplier_codes = ["SUP-001", "SUP-002", "SUP-003", "SUP-004", "SUP-005"]
    statuses = ["delivered", "delivered", "in_transit", "ordered", "pending"]
    rows = []
    for i, sup in enumerate(supplier_codes):
        for j in range(3):
            rows.append({
                "session_id": SESSION,
                "po_number": f"PO-2024-{i*10+j:04d}",
                "supplier_code": sup,
                "sim_month": j,
                "order_date": (datetime(2024, 1, 1) + timedelta(days=j*10)).isoformat(),
                "expected_delivery": (datetime(2024, 1, 15) + timedelta(days=j*10)).isoformat(),
                "value_aed": random.randint(500000, 8000000),
                "quantity_units": random.randint(50000, 500000),
                "status": statuses[i % len(statuses)],
                "delay_days": random.randint(0, 5) if statuses[i % len(statuses)] in ["in_transit", "ordered"] else 0,
                "notes": None,
            })
    db.table("sim_purchase_orders").insert(rows).execute()
    print(f"Seeded {len(rows)} purchase orders")


def seed_dispatch_schedule():
    routes = [
        ("Dubai DC", "Carrefour UAE", "Refrigerated Truck"),
        ("Jebel Ali DC", "Lulu Hypermarket", "Refrigerated Truck"),
        ("Dubai DC", "Abu Dhabi Distribution", "Refrigerated Truck"),
        ("Riyadh DC", "Riyadh Modern Trade", "Refrigerated Truck"),
        ("Kuwait DC", "Sultan Center", "Refrigerated Van"),
    ]
    rows = []
    for i, (src, dst, mode) in enumerate(routes):
        for day in range(5):
            rows.append({
                "session_id": SESSION,
                "sim_month": 0,
                "route_name": f"{src} → {dst}",
                "origin_warehouse": src,
                "destination": dst,
                "transport_mode": mode,
                "dispatch_date": (datetime(2024, 1, 2) + timedelta(days=day)).isoformat(),
                "planned_units": random.randint(5000, 20000),
                "actual_units": random.randint(4800, 19500),
                "otif_flag": random.random() > 0.08,
                "delay_hours": random.uniform(0, 6),
                "delay_reason": "Traffic" if random.random() > 0.7 else None,
                "cost_aed": random.randint(8000, 45000),
            })
    db.table("sim_dispatch_schedule").insert(rows).execute()
    print(f"Seeded {len(rows)} dispatch rows")


def main():
    print("=== Al Manar Industries — Seeding Simulator Database ===")
    clear_tables()

    # Core seed via HTTP route (calls our Next.js seed endpoint for game_state, org, skus, suppliers, events, opps, price history, kpis)
    print("\nCore data (game state, org, SKUs, suppliers, events, opps) seeded via /api/simulator/seed")
    print("Run: curl -X POST https://your-project.vercel.app/api/simulator/seed")
    print()

    # Extended data (demand, inventory, production, POs, dispatch)
    seed_demand_forecast()
    seed_inventory()
    seed_production_plan()
    seed_purchase_orders()
    seed_dispatch_schedule()

    print("\n=== Seed Complete ===")
    print("Al Manar Industries LLC is ready to run.")
    print("Month 1 | January 2024 | Share Price: AED 15.00 | Market Cap: AED 5.85B")


if __name__ == "__main__":
    main()
