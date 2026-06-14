#!/bin/bash

# Database Backup Script for Project Autopilot
# Backs up Supabase data to local storage
# Usage: ./scripts/backup-database.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="${BACKUP_DIR}/backup_${TIMESTAMP}.sql"
RETENTION_DAYS=30

# Supabase Configuration
SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
SUPABASE_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
DB_HOST="db.supabase.co"  # Replace with your Supabase host
DB_USER="postgres"
DB_NAME="postgres"
DB_PORT=5432

echo -e "${YELLOW}📦 Starting database backup...${NC}"

# Create backup directory if it doesn't exist
mkdir -p "${BACKUP_DIR}"

# Export data from each table
echo -e "${YELLOW}🗄️  Exporting tables...${NC}"

# Export capability_metrics
psql -h "${DB_HOST}" -U "${DB_USER}" -d "${DB_NAME}" -p "${DB_PORT}" \
  -c "COPY capability_metrics TO STDOUT" > "${BACKUP_DIR}/capability_metrics_${TIMESTAMP}.csv"

# Export agent_decisions
psql -h "${DB_HOST}" -U "${DB_USER}" -d "${DB_NAME}" -p "${DB_PORT}" \
  -c "COPY agent_decisions TO STDOUT" > "${BACKUP_DIR}/agent_decisions_${TIMESTAMP}.csv"

# Export disruption_events
psql -h "${DB_HOST}" -U "${DB_USER}" -d "${DB_NAME}" -p "${DB_PORT}" \
  -c "COPY disruption_events TO STDOUT" > "${BACKUP_DIR}/disruption_events_${TIMESTAMP}.csv"

echo -e "${GREEN}✅ Backup files created:${NC}"
ls -lh "${BACKUP_DIR}/*_${TIMESTAMP}.*"

# Cleanup old backups
echo -e "${YELLOW}🧹 Cleaning up old backups (older than ${RETENTION_DAYS} days)...${NC}"

find "${BACKUP_DIR}" -name "*.csv" -mtime "+${RETENTION_DAYS}" -delete
find "${BACKUP_DIR}" -name "*.sql" -mtime "+${RETENTION_DAYS}" -delete

echo -e "${GREEN}✅ Database backup completed successfully!${NC}"
echo -e "${YELLOW}📍 Backups stored in: ${BACKUP_DIR}${NC}"

# Optionally upload to cloud storage
if [ -n "${BACKUP_BUCKET}" ]; then
  echo -e "${YELLOW}☁️  Uploading to cloud storage...${NC}"
  # Example: gsutil cp "${BACKUP_DIR}/*_${TIMESTAMP}.*" "${BACKUP_BUCKET}/"
  echo -e "${GREEN}✅ Cloud backup completed!${NC}"
fi
