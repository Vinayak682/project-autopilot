# 🚀 Project Autopilot

**AI-Powered Supply Chain Intelligence Platform**

A production-ready Next.js B2B portfolio with real-time metrics, live demos, and autonomous AI agent decision-making.

![Status](https://img.shields.io/badge/status-production--ready-green?style=flat-square)
![Node](https://img.shields.io/badge/node-18+-blue?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![Build](https://github.com/your-org/project-autopilot/workflows/CI/badge.svg)

---

## ✨ Features

- 🌙 **Dark Mode Only** - Premium dark theme with emerald accents
- ⚡ **Real-Time Updates** - Supabase real-time subscriptions for live metrics
- 🤖 **AI Agent Feed** - Twitter-style autonomous agent decision tracking
- 📊 **Live Analytics** - 4 interactive demo projects with instant execution
- 🎬 **Advanced Animations** - Framer Motion + GSAP for smooth 60fps animations
- 📱 **Fully Responsive** - Mobile-first design with all breakpoints
- 🔐 **Production Grade** - TypeScript strict mode, security headers, error handling
- ✅ **Tested** - Jest unit tests + GitHub Actions CI/CD
- 📈 **Scalable** - Designed for 1M+ users with sharding & caching strategies

---

## 🎯 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/your-org/project-autopilot.git
cd project-autopilot

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📋 Environment Setup

### Development
```bash
cp .env.development .env.local
npm run dev
```

### Staging
```bash
cp .env.staging .env.staging.local
npm run build
npm start
```

### Production
```bash
cp .env.production .env.production.local
npm run build
npm start
```

---

## 📚 Available Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload

# Building
npm run build        # Build for production
npm start            # Start production server
npm run analyze      # Analyze bundle size

# Testing
npm test             # Run Jest tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run type-check   # Check TypeScript types

# Maintenance
npm run audit        # Check for vulnerabilities
npm audit:fix        # Attempt automatic fixes
npm run update:deps  # Update dependencies safely
npm run backup:db    # Backup database

# Pre-commit
npm run precommit    # Run all checks before commit
```

---

## 🗂️ Project Structure

```
project-autopilot/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes (demo endpoints)
│   │   ├── demo/
│   │   │   ├── otif-copilot/
│   │   │   ├── gcc-surge/
│   │   │   └── forecast/
│   │   └── capability-meter/
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/                   # React components (9 total)
│   ├── Hero.tsx
│   ├── CapabilityMeter.tsx
│   ├── DisruptionReplay.tsx
│   ├── AgentDecisionFeed.tsx
│   ├── ProjectCard.tsx
│   ├── ProjectsSection.tsx
│   ├── DataFlowSection.tsx
│   ├── NetworkTopologySection.tsx
│   └── Footer.tsx
├── lib/                          # Utilities & types
│   ├── types.ts                  # TypeScript interfaces
│   ├── supabase.ts               # Supabase client & helpers
│   └── features.ts               # Feature flags
├── __tests__/                    # Jest tests
├── scripts/                      # Utility scripts
│   ├── backup-database.sh
│   └── update-dependencies.sh
├── .github/                      # GitHub Actions
│   └── workflows/
│       └── ci.yml
├── public/                       # Static assets
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Tailwind theme
├── next.config.js                # Next.js config
├── jest.config.js                # Jest config
├── .eslintrc.json                # ESLint rules
├── .prettierrc                   # Prettier config
├── API_DOCUMENTATION.md          # API reference
├── SETUP.md                      # Setup guide
└── SCALABILITY_PLAN.md           # Scalability strategy
```

---

## 🔧 Configuration

### Environment Variables

**Development (`.env.development`):**
```env
NEXT_PUBLIC_ENVIRONMENT=development
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=test-key
NEXT_PUBLIC_ENABLE_REALTIME=true
NEXT_PUBLIC_ENABLE_DEMOS=true
```

**Staging (`.env.staging`):**
```env
NEXT_PUBLIC_ENVIRONMENT=staging
NEXT_PUBLIC_SUPABASE_URL=https://your-staging.supabase.co
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_SENTRY=true
```

**Production (`.env.production`):**
```env
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_SUPABASE_URL=https://your-production.supabase.co
NEXT_PUBLIC_ENABLE_REALTIME=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_SENTRY=true
```

### Tailwind Theme

Custom colors in `tailwind.config.ts`:
- **Off-Black**: `#0a0e27` (background)
- **Emerald**: `#22c55e` (accent)
- **Slate**: Gray scale for text

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15, React 19, TypeScript |
| **Styling** | Tailwind CSS, custom design tokens |
| **Animation** | Framer Motion, GSAP |
| **Database** | Supabase (PostgreSQL) |
| **Real-time** | Supabase Real-time subscriptions |
| **Hosting** | Vercel |
| **AI** | Anthropic Claude API |
| **Testing** | Jest, React Testing Library |
| **CI/CD** | GitHub Actions |

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# With environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add ANTHROPIC_API_KEY
```

### Docker

```bash
# Build image
docker build -t project-autopilot .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=... \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
  project-autopilot
```

### Node.js with PM2

```bash
npm i -g pm2
npm run build
pm2 start npm --name "autopilot" -- start
pm2 save
```

---

## 🧪 Testing

### Run Tests
```bash
npm test                    # Run all tests once
npm run test:watch         # Watch mode
npm run test:coverage      # Generate coverage report
```

### Test Structure
```
__tests__/
├── components/
│   ├── Hero.test.tsx
│   ├── CapabilityMeter.test.tsx
│   └── ...
├── lib/
│   └── features.test.ts
└── api/
    └── otif-copilot.test.ts
```

### Coverage Targets
- **Branches**: 70%+
- **Functions**: 70%+
- **Lines**: 70%+
- **Statements**: 70%+

---

## 📈 Performance

### Metrics (Target)
- **First Contentful Paint**: <800ms
- **Time to Interactive**: <3s
- **Largest Contentful Paint**: <1.5s
- **Lighthouse Score**: 92+
- **Bundle Size**: <240KB (initial)

### Optimization Tips
1. Use `next/image` for all images
2. Implement code splitting with `dynamic()`
3. Enable automatic static optimization
4. Use Vercel's edge caching
5. Minimize bundle size with `analyze` command

```bash
npm run analyze
npm run analyze:open
```

---

## 🔐 Security

### Built-In
- ✅ TypeScript strict mode
- ✅ Security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)
- ✅ Environment variables for secrets
- ✅ Input validation on forms
- ✅ CORS configuration

### Recommended
- [ ] Enable WAF (CloudFlare)
- [ ] Set up Sentry error tracking
- [ ] Enable rate limiting
- [ ] Regular dependency audits
- [ ] Penetration testing
- [ ] Security policy headers (CSP)

```bash
npm audit
npm audit fix
```

---

## 📝 Git Workflow

### Branch Strategy
```
main (production)
  └── staging (staging environment)
      └── develop (development)
          ├── feature/feature-name
          ├── bugfix/bug-name
          └── ...
```

### Commit Convention
```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Code style changes
refactor: Refactor code
perf: Performance improvements
test: Add tests
chore: Maintenance tasks
```

### Pre-commit Hooks
Automatically runs linting, formatting, and type checks:
```bash
npm run precommit
```

---

## 🔄 Continuous Integration

GitHub Actions workflow (`.github/workflows/ci.yml`):
- ✅ Lint & type checking
- ✅ Unit tests with coverage
- ✅ Build verification
- ✅ Auto-deploy to staging/production

---

## 📊 Feature Flags

Toggle features without redeploying:

```ts
import { isFeatureEnabled } from '@/lib/features'

if (isFeatureEnabled('ADVANCED_ANALYTICS')) {
  // Show advanced features
}
```

**Available Flags:**
- `REALTIME_UPDATES` - Real-time subscriptions
- `DEMO_APIS` - Live demo endpoints
- `ANALYTICS` - Google Analytics
- `ERROR_TRACKING` - Sentry
- `ADVANCED_ANALYTICS` - Beta features

---

## 📚 Documentation

- [API Documentation](./API_DOCUMENTATION.md) - All endpoints with examples
- [Setup Guide](./SETUP.md) - Detailed setup instructions
- [Scalability Plan](./SCALABILITY_PLAN.md) - Growth strategy & architecture
- [Component Docs](./COMPONENTS.md) - Component API reference

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
npm run dev
```

### Clear Cache
```bash
rm -rf .next
npm run dev
```

### Rebuild Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Check TypeScript Errors
```bash
npx tsc --noEmit
```

---

## 📋 Maintenance

### Weekly
- [ ] Check dependency updates: `npm outdated`
- [ ] Review error logs
- [ ] Monitor performance metrics

### Monthly
- [ ] Update dependencies: `npm run update:deps`
- [ ] Run security audit: `npm audit`
- [ ] Backup database: `npm run backup:db`
- [ ] Review analytics

### Quarterly
- [ ] Penetration testing
- [ ] Performance optimization
- [ ] Code review process
- [ ] Update documentation

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: Add amazing feature'`)
4. Push branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

MIT License - see LICENSE file for details

---

## 📞 Support

- **Documentation**: [SETUP.md](./SETUP.md)
- **Issues**: GitHub Issues
- **Email**: support@project-autopilot.com
- **Website**: https://project-autopilot.com

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Animated with [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://gsap.com/)
- Real-time powered by [Supabase](https://supabase.com/)
- AI-driven by [Anthropic Claude](https://anthropic.com/)

---

**Last Updated**: June 14, 2024  
**Version**: 0.1.0  
**Maintainer**: Project Autopilot Team
