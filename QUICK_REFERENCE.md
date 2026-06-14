# ⚡ Project Autopilot - Quick Reference

Handy cheat sheet for common tasks and commands.

---

## 🚀 Getting Started (60 seconds)

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open browser
open http://localhost:3000
```

---

## 📝 Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Production build
npm start               # Run production server

# Testing
npm test                # Run tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report

# Code Quality
npm run lint            # Check for issues
npm run format          # Auto-format code
npm run type-check      # TypeScript check

# Maintenance
npm audit               # Check vulnerabilities
npm audit fix           # Fix vulnerabilities
npm run update:deps     # Update dependencies
npm run backup:db       # Backup database

# Analysis
npm run analyze         # Analyze bundle
npm run analyze:open    # View bundle report
```

---

## 🔧 Setup Environment

```bash
# Development (local)
cp .env.development .env.local
npm run dev

# Staging
cp .env.staging .env.staging.local
npm run build

# Production
cp .env.production .env.production.local
npm run build
npm start
```

---

## 📂 File Locations

| What | Where |
|------|-------|
| Components | `components/` |
| API Routes | `app/api/` |
| Styles | `app/globals.css` |
| Types | `lib/types.ts` |
| Config | Root folder |
| Tests | `__tests__/` |
| Documentation | Root folder |

---

## 🔑 Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Anthropic API
ANTHROPIC_API_KEY=sk-ant-v0-...

# Feature Flags
NEXT_PUBLIC_ENABLE_REALTIME=true
NEXT_PUBLIC_ENABLE_DEMOS=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

---

## 🎨 Component Locations

```
Hero                  → components/Hero.tsx
CapabilityMeter       → components/CapabilityMeter.tsx
DisruptionReplay      → components/DisruptionReplay.tsx
AgentDecisionFeed     → components/AgentDecisionFeed.tsx
ProjectCard           → components/ProjectCard.tsx
ProjectsSection       → components/ProjectsSection.tsx
DataFlowSection       → components/DataFlowSection.tsx
NetworkTopologySection → components/NetworkTopologySection.tsx
Footer                → components/Footer.tsx
```

---

## 🔌 API Endpoints

```
POST /api/demo/otif-copilot         → OTIF analysis
POST /api/demo/gcc-surge            → Demand forecast
POST /api/demo/forecast             → Model comparison
POST /api/capability-meter/evaluate → Capability eval
```

---

## 🧪 Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Run specific test
npm test Hero
```

---

## 📦 Deployment

### Vercel (1 minute)
```bash
npm i -g vercel
vercel
# Follow prompts
```

### Docker (5 minutes)
```bash
docker build -t project-autopilot .
docker run -p 3000:3000 project-autopilot
```

### Node.js with PM2 (5 minutes)
```bash
npm i -g pm2
npm run build
pm2 start npm --name "autopilot" -- start
```

---

## 🐛 Troubleshooting

```bash
# Port already in use
lsof -ti:3000 | xargs kill -9

# Clear cache
rm -rf .next && npm run dev

# Reinstall deps
rm -rf node_modules package-lock.json
npm install

# Type errors
npx tsc --noEmit

# Lint errors
npm run lint -- --fix
```

---

## 📊 Performance Tips

```bash
# Check bundle size
npm run analyze

# Check performance
npm run build
npm start
# Use Lighthouse in DevTools
```

---

## 🔐 Security

```bash
# Check vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Check TypeScript
npx tsc --noEmit
```

---

## 🚀 Before Deploying

- [ ] Tests passing: `npm test`
- [ ] TypeScript clean: `npm run type-check`
- [ ] Lint clean: `npm run lint`
- [ ] Build works: `npm run build`
- [ ] No vulnerabilities: `npm audit`
- [ ] Env vars set
- [ ] Database backed up: `npm run backup:db`

---

## 📚 Documentation

| Doc | Purpose |
|-----|---------|
| `README.md` | Project overview + full guide |
| `SETUP.md` | Setup & troubleshooting |
| `API_DOCUMENTATION.md` | All endpoints with examples |
| `SCALABILITY_PLAN.md` | Growth strategy |
| `IMPLEMENTATION_CHECKLIST.md` | Feature completeness |

---

## 🔄 Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Commit with message
git commit -m "feat: Add new feature"

# Push to remote
git push origin feature/my-feature

# Create pull request on GitHub
# (triggers CI/CD)
```

**Commit Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting
- `refactor:` - Code refactoring
- `test:` - Tests
- `chore:` - Maintenance

---

## 🔑 Feature Flags

```ts
import { isFeatureEnabled } from '@/lib/features'

// Check if feature is enabled
if (isFeatureEnabled('ANALYTICS')) {
  // Enable analytics
}

// Check per user (gradual rollout)
if (isFeatureEnabled('BETA_FEATURES', userId)) {
  // Show beta features
}
```

**Available Flags:**
- REALTIME_UPDATES
- DEMO_APIS
- ANALYTICS
- ERROR_TRACKING
- NEWSLETTER_SIGNUP
- ADVANCED_ANALYTICS
- BETA_FEATURES

---

## 📈 Monitoring Commands

```bash
# Check dependencies
npm outdated

# Update dependencies
npm run update:deps

# Audit security
npm audit

# Check bundle size
npm run analyze

# View type errors
npm run type-check

# Check code quality
npm run lint
```

---

## 💻 VS Code Extensions (Recommended)

```
ES7+ React/Redux/React-Native snippets
Prettier - Code formatter
ESLint
Tailwind CSS IntelliSense
Thunder Client (API testing)
GitLens
```

---

## 🔗 Useful Links

- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind Docs**: https://tailwindcss.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Framer Motion**: https://www.framer.com/motion/
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Jest Docs**: https://jestjs.io/docs/getting-started

---

## 🆘 Need Help?

1. Check `README.md` for overview
2. Check `SETUP.md` for setup issues
3. Check `API_DOCUMENTATION.md` for API questions
4. Run `npm run type-check` for TypeScript errors
5. Run `npm run lint -- --fix` for code issues
6. Check GitHub Actions logs for CI/CD issues

---

## ✅ Pre-Commit Checklist

Before pushing code:

```bash
npm run precommit    # Runs: lint + format + type-check
npm test             # All tests pass
npm run build        # Build succeeds
git push origin branch-name
```

---

## 📞 Contact

- **Email**: support@project-autopilot.com
- **GitHub Issues**: Open an issue
- **Documentation**: See docs in root folder

---

**Last Updated**: June 14, 2024  
**Maintained By**: Project Autopilot Team
