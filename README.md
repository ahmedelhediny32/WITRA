# WITRA Marketing Solutions — Platform

## Overview

WITRA is a comprehensive marketing agency management platform built for managing clients, subscriptions, service catalogues, content operations, performance reports, and team collaboration.

### Tech Stack
- **Backend:** Hono (TypeScript) on Cloudflare Workers
- **Database:** Cloudflare D1 (SQLite-compatible)
- **Frontend:** Vanilla JavaScript SPA + CSS
- **Content Ops:** Standalone HTML calendar/tracker (embedded via iframe)
- **Hosting:** Cloudflare Pages

---

## Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Create local D1 database and run migrations
npx wrangler d1 migrations apply witra-marketing-production --local

# 3. Start development server
npm run dev
```

The app will be available at `http://localhost:8787`

### Default Login
After running migrations, a Super Admin account is created:
- **Email:** `admin@witra.agency`
- **Password:** `WitraAdmin@2026`

---

## Project Structure

```
├── src/
│   ├── index.tsx          # Main entry point (Hono app)
│   ├── types.ts           # TypeScript type definitions
│   ├── routes/
│   │   ├── auth.ts        # Authentication (login/logout/impersonation)
│   │   ├── clients.ts     # Client CRUD + archive/resubscribe
│   │   ├── portal.ts      # Client portal (business profile, brand, social)
│   │   ├── reports.ts     # Performance reports (create/edit/publish)
│   │   ├── content-ops.ts # Content Ops Tracker API
│   │   ├── team.ts        # Team management (WITRA + client teams)
│   │   ├── services.ts    # Service catalogue
│   │   ├── settings.ts    # Platform settings (WITRA + client scope)
│   │   └── ...
│   └── lib/
│       ├── auth.ts        # Session management + password hashing
│       ├── middleware.ts   # Auth middleware helpers
│       ├── serialize.ts   # DB row → API response serializers
│       ├── health.ts      # Client health calculation + subscription expiry
│       ├── reportNarrative.ts # Auto-generated report narratives
│       └── util.ts        # Shared utilities
├── public/
│   └── static/
│       ├── app.js         # Main SPA frontend logic
│       ├── style.css      # Complete stylesheet
│       ├── content-ops.html # Content Ops Tracker (embedded calendar)
│       └── img/           # Logo and brand assets
├── migrations/            # D1 database migrations (ordered)
├── wrangler.jsonc         # Cloudflare Workers configuration
└── package.json
```

---

## Deployment to Cloudflare

See [DEPLOY.md](DEPLOY.md) for step-by-step deployment instructions.

### Quick Deploy

```bash
# 1. Build the project
npm run build

# 2. Create D1 database (first time only)
npx wrangler d1 create witra-marketing-production

# 3. Update database_id in wrangler.jsonc with the ID from step 2

# 4. Run migrations on production
npx wrangler d1 migrations apply witra-marketing-production --remote

# 5. Deploy
npm run deploy
```

---

## Key Features

### Admin (WITRA) Side
- **Dashboard:** Real-time client health overview, MRR tracking, renewal alerts
- **Client Management:** Create, archive, resubscribe clients with portal access
- **Service Catalogue:** Configurable services with plan-based entitlements
- **Subscription Plans:** Starter → Core → Growth with automatic entitlement gating
- **Content Ops Tracker:** Agency-wide content calendar (WITRA's own tracker)
- **Reports & Performance:** Create monthly reports from raw metrics, auto-generated narratives
- **Team Management:** WITRA staff + client team request approval workflow
- **Settings:** Company profile, notification preferences, email templates, security

### Client Portal Side
- **Dashboard:** KPIs, active services, content tracker preview, activity feed
- **Business Profile:** Edit business info, social links, brand colors, logo upload
- **Content Ops Tracker:** Full interactive content calendar (if entitled)
- **My Services:** Active services + explore/request locked services
- **Reports & Performance:** View published monthly reports with trend charts
- **Subscription:** Current plan details + upgrade request
- **Team:** Request team member additions (WITRA-approved workflow)

### System Features
- **Bilingual:** English/Arabic language toggle (stored in localStorage)
- **Role-Based Access:** Super Admin, Team Member, Client Owner/Manager/Editor/Viewer
- **Impersonation:** WITRA admins can preview any client's portal
- **Auto Health Scoring:** Client health calculated from Content Ops execution rates
- **Subscription Expiry:** Automatic suspension of expired subscriptions
- **Notification System:** In-app + email notification framework
- **Audit Log:** Immutable activity trail for all platform actions

---

## Environment Variables

Configured in `wrangler.jsonc`:
- `DB` — D1 database binding (name: `witra-marketing-production`)

---

## License

Proprietary — WITRA Marketing Solutions © 2026
