# Project Autopilot - Setup Guide

A production-ready Next.js B2B supply-chain AI portfolio with live demos, real-time metrics, and AI agent decision feeds.

## Project Structure

```
project-autopilot/
├── app/
│   ├── api/
│   │   ├── demo/
│   │   │   ├── otif-copilot/
│   │   │   ├── gcc-surge/
│   │   │   └── forecast/
│   │   └── capability-meter/
│   │       └── evaluate/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── favicon.ico
├── components/
│   ├── Hero.tsx
│   ├── CapabilityMeter.tsx
│   ├── DisruptionReplay.tsx
│   ├── AgentDecisionFeed.tsx
│   ├── ProjectCard.tsx
│   ├── ProjectsSection.tsx
│   ├── DataFlowSection.tsx
│   ├── NetworkTopologySection.tsx
│   └── Footer.tsx
├── lib/
│   ├── types.ts
│   └── supabase.ts
├── package.json
├── tsconfig.json
├── next.config.js
├── postcss.config.js
├── tailwind.config.ts
└── .env.local
```

## Quick Start

### 1. Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account (for real-time updates)
- Anthropic API key (for Claude models)

### 2. Installation

```bash
cd project-autopilot
npm install
# or
yarn install
```

### 3. Environment Setup

Create `.env.local` and fill in your credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Anthropic API
ANTHROPIC_API_KEY=your-anthropic-api-key

# Environment
NEXT_PUBLIC_ENVIRONMENT=development
```

### 4. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

### 📊 Sections

1. **Hero** - Asymmetric hero with animated capability meter visualization
2. **Capability Meter** - Real-time supply chain metrics with Supabase integration
3. **Disruption Replay** - GSAP-powered incident carousel with scroll animations
4. **Projects Section** - Live demo cards with "Run Demo" functionality
5. **Agent Decision Feed** - Twitter-style real-time agent decisions
6. **Data Flow Section** - Architecture visualization of data pipeline
7. **Network Topology** - Supply chain network visualization
8. **Footer** - Contact, newsletter signup, and resource links

### 🤖 API Routes

All API routes are in `app/api/` and return standardized `DemoResult` JSON:

- **POST `/api/demo/otif-copilot`** - OTIF analysis and route optimization
- **POST `/api/demo/gcc-surge`** - Demand surge forecasting with regional analysis
- **POST `/api/demo/forecast`** - Multi-model forecasting comparison engine
- **POST `/api/capability-meter/evaluate`** - Daily capability evaluation

### 🎨 Dark Mode

- Off-black background: `#0a0e27`
- Emerald accent: `#22c55e` (emerald-500)
- Slate text: shades of gray for contrast
- All components use Tailwind CSS with custom design tokens

### 🔄 Real-Time Features

Components subscribe to Supabase channels for live updates:
- `CapabilityMeter` - Subscribes to `capability_metrics` table
- `AgentDecisionFeed` - Subscribes to `agent_decisions` table

Mock data is used when Supabase is unavailable.

## Supabase Schema (Required Tables)

### `capability_metrics` Table

```sql
CREATE TABLE capability_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  overall_score INT,
  metrics JSONB,
  last_evaluated TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### `agent_decisions` Table

```sql
CREATE TABLE agent_decisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMP,
  agent VARCHAR,
  action TEXT,
  reasoning TEXT,
  confidence FLOAT,
  result TEXT,
  impact_metrics JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Customization

### Colors & Branding

Edit `tailwind.config.ts` to change the color scheme:

```ts
theme: {
  extend: {
    colors: {
      'off-black': '#0a0e27',
      'emerald': { /* ... */ },
      // Add your colors
    }
  }
}
```

### Content & Copy

- Hero text: `components/Hero.tsx`
- Section titles: Each component file
- Footer links: `components/Footer.tsx`

### Demo Data

Replace mock data in each component to connect real APIs:

```ts
// Replace mockCapabilityData with actual Supabase fetch
const [data, setData] = useState<CapabilityData>(mockCapabilityData)
```

## Performance

- **Code splitting**: Next.js automatic route-based splitting
- **Image optimization**: Use `next/image` for images
- **Bundle size**: ~200KB gzipped (without external libraries)
- **Animations**: Framer Motion + GSAP for smooth 60fps
- **Dark mode**: CSS-only, no JavaScript overhead

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables

Set these in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ANTHROPIC_API_KEY`

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

Core:
- `next` - React framework
- `react` & `react-dom` - UI library
- `framer-motion` - Animation library
- `gsap` - Advanced animations
- `tailwindcss` - Utility-first CSS
- `@supabase/supabase-js` - Real-time database
- `lucide-react` - Icon library

Development:
- `typescript` - Type safety
- Type definitions for all libraries

## Troubleshooting

### Components Not Updating

Check that Supabase credentials are correct in `.env.local`.

### Animations Janky

- Disable hardware acceleration temporarily
- Check browser DevTools Performance tab
- GSAP is configured for smooth 60fps

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

## Production Checklist

- [ ] Set `NEXT_PUBLIC_ENVIRONMENT=production`
- [ ] Configure Supabase production database
- [ ] Set up API key rotation
- [ ] Enable HTTPS only
- [ ] Configure CORS headers (see next.config.js)
- [ ] Test all demo API endpoints
- [ ] Monitor real-time subscriptions
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Configure analytics
- [ ] Test on all target browsers

## License

Proprietary - Project Autopilot

## Support

- Documentation: `/docs`
- Email: support@project-autopilot.com
- Issues: GitHub Issues
