# Claude Code Guide — MedAesthetics Monorepo

## Project Overview

SaaS platform for medical aesthetics practices. Built as a Turborepo monorepo with npm workspaces.

**Practice brand (current tenant):** Refined Aesthetic — `apps/marketing/content.ts`

---

## Apps & Ports

| App | Port | Purpose |
|-----|------|---------|
| `apps/web` | 3000 | Practitioner portal (staff-facing) |
| `apps/patient-portal` | 3001 | Patient-facing portal |
| `apps/marketing` | 3002 | Public marketing site |
| `apps/saas-marketing` | 3003 | SaaS product marketing |
| `apps/getting-started` | 3004 | Onboarding flow |

---

## Dev Commands

```bash
# Start all apps
npm run dev

# Run from monorepo root — turbo fans out to all packages
npm run build
npm run lint
npm run check-types
npm run test

# Database
npm run db:generate   # prisma generate
npm run db:migrate    # prisma migrate dev
```

---

## Environment Setup

Each app has its own `.env.local`. Copy from `.env.example` before first run.

**`apps/web` required vars:** `DATABASE_URL`, `REDIS_URL`, `CLERK_*`, `STRIPE_*`

Optional (needed for full functionality): `AWS_*`, `S3_*`, `TWILIO_*`, `RESEND_API_KEY`, `DAILY_API_KEY`

**`apps/patient-portal` required vars:** `CLERK_*`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_MARKETING_URL`

---

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack), React 19, TypeScript 5.9
- **API:** tRPC v11 + TanStack Query v5
- **Database:** Prisma 5 → PostgreSQL (`packages/db/prisma/schema.prisma`)
- **Auth:** Clerk v6 (MFA, org support)
- **Payments:** Stripe (subscriptions + in-practice billing)
- **Tests:** Vitest v4
- **CI:** GitHub Actions (`.github/workflows/ci.yml`)

---

## Monorepo Structure

```
apps/
  web/                  # Practitioner portal
  patient-portal/       # Patient portal
  marketing/            # Public marketing site
  saas-marketing/       # SaaS product site
  getting-started/      # Onboarding
packages/
  db/                   # Prisma schema + client singleton
  api/                  # tRPC routers
  auth/                 # Clerk config, roles, middleware
  config/               # Env validation (Zod), constants
  ui/                   # Shared component library
  typescript-config/
  eslint-config/
```

---

## tRPC

**Routers** (`packages/api/src/routers/`):
`appointments`, `billing`, `charting`, `clients`, `forms`, `inventory`, `photos`, `practice`, `providers`, `services`, `telehealth`

**Procedure tiers** (use the most restrictive tier that applies):

| Procedure | Who can call |
|-----------|-------------|
| `publicProcedure` | Anyone |
| `protectedProcedure` | Authenticated Clerk user |
| `practiceProcedure` | User with a `practiceId` (staff) |
| `clinicalProcedure` | Clinical staff role |
| `ownerProcedure` | Practice owner role |

**Context** (`apps/web/server/context.ts`): resolves `practiceId` + role from DB by `clerkUserId`.

---

## HIPAA Rules — Do Not Violate

- **Never delete `AuditLog` rows** via Prisma or raw SQL. The table is append-only.
- **Never expose S3 URLs directly.** All photo access must use presigned URLs.
- **Every PHI read/write** in a tRPC router must fire the HIPAA audit log.
- **All PHI tables** have a `practiceId` column — always filter by it (tenant isolation).
- Session timeout is 15 min — defined in `packages/config/src/constants.ts`, do not override per-component.
- AWS (S3, RDS, ElastiCache), Clerk, Stripe, Twilio, and Daily.co all require signed HIPAA BAAs before storing real patient data.
- RDS is in a private VPC subnet — no public endpoint. S3 bucket is private with SSE-KMS.

---

## Key Conventions

- **Next.js 16 routing:** Use `proxy.ts` (not `middleware.ts`) for auth middleware in app directories.
- **Marketing content:** Hardcoded in `apps/marketing/content.ts`. Shape mirrors Prisma schema intentionally — future migration will replace with DB queries.
- **Shared UI:** Add reusable components to `packages/ui`, not inside individual apps.
- **Env validation:** Use the Zod schema in `packages/config` — do not access `process.env` directly in app code without going through it.

---

## Webhook Handlers

- Stripe: `apps/web/app/api/webhooks/stripe/route.ts`
- Clerk: `apps/web/app/api/webhooks/clerk/route.ts`

---

## Deferred Features (do not implement without discussion)

- Medical Director marketplace
- Multi-location UI (Location model exists in schema but UI is stub)
- Native mobile app
- EHR integrations (HL7/FHIR)
- AI Treatment Simulator
- AI charting assistant (voice-to-SOAP)
