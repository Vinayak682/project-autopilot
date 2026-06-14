#!/bin/bash

# Dependency Update Script
# Checks for updates and manages security patches
# Usage: ./scripts/update-dependencies.sh

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}📦 Checking for dependency updates...${NC}"

# Check for outdated packages
echo -e "${YELLOW}Outdated packages:${NC}"
npm outdated || true

# Check for security vulnerabilities
echo -e "${YELLOW}🔒 Checking for security vulnerabilities...${NC}"
npm audit --json > audit-report.json || true

# Parse audit report
VULNERABILITIES=$(jq '.metadata.vulnerabilities.total' audit-report.json)

if [ "${VULNERABILITIES}" -gt 0 ]; then
  echo -e "${RED}❌ Found ${VULNERABILITIES} vulnerabilities!${NC}"

  # Try to fix automatically
  echo -e "${YELLOW}🔧 Attempting automatic fixes...${NC}"
  npm audit fix

  # Check remaining issues
  npm audit --json > audit-report-after.json || true
  REMAINING=$(jq '.metadata.vulnerabilities.total' audit-report-after.json)

  if [ "${REMAINING}" -eq 0 ]; then
    echo -e "${GREEN}✅ All vulnerabilities fixed!${NC}"
  else
    echo -e "${RED}⚠️  ${REMAINING} vulnerabilities remain. Manual review needed.${NC}"
  fi
else
  echo -e "${GREEN}✅ No security vulnerabilities found!${NC}"
fi

# Update minor and patch versions
echo -e "${YELLOW}Updating minor and patch versions...${NC}"
npm update

# List changes
echo -e "${YELLOW}📝 Changes made:${NC}"
git diff package.json 2>/dev/null || echo "Git not initialized"

# Cleanup
rm -f audit-report.json audit-report-after.json

echo -e "${GREEN}✅ Dependency update completed!${NC}"
echo -e "${YELLOW}📌 Remember to:${NC}"
echo "  1. Run tests: npm test"
echo "  2. Build: npm run build"
echo "  3. Commit changes"
