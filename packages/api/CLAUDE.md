# API Package — CLAUDE.md

tRPC v11 routers. Entry point: `src/root.ts`. Procedure tiers and context: `src/trpc.ts`.

---

## Context Shape (`TRPCContext`)

```ts
{
  db: PrismaClient        // always available
  clerkUserId: string | null
  practiceId:  string | null
  role:        UserRole | null
  ipAddress:   string | null
  userAgent:   string | null
}
```

After passing through a middleware, non-null fields are narrowed — e.g. `practiceProcedure` guarantees `ctx.clerkUserId` and `ctx.practiceId` are `string`.

---

## Procedure Tiers

Use the **most restrictive** tier that applies. Never loosen a tier without a deliberate reason.

| Procedure | Guarantees | Use for |
|-----------|-----------|---------|
| `publicProcedure` | nothing | Public-facing data only — never PHI |
| `protectedProcedure` | `clerkUserId` | Auth-gated but not practice-scoped |
| `practiceProcedure` | `clerkUserId` + `practiceId` | Most staff operations |
| `clinicalProcedure` | above + role in `[PLATFORM_ADMIN, PRACTICE_OWNER, PROVIDER]` | Charting, photos, clinical reads |
| `ownerProcedure` | above + role in `[PLATFORM_ADMIN, PRACTICE_OWNER]` | Settings, billing mgmt, provider removal |

**Current router tiers at a glance:**

| Router | Tiers used |
|--------|-----------|
| `practice` | — |
| `providers` | `practiceProcedure`, `ownerProcedure` |
| `clients` | `practiceProcedure` |
| `appointments` | `practiceProcedure`, `clinicalProcedure` |
| `charting` | `clinicalProcedure` |
| `photos` | `clinicalProcedure` |
| `billing` | `practiceProcedure`, `ownerProcedure` |
| `inventory` | `practiceProcedure`, `ownerProcedure` |
| `forms` | `publicProcedure`, `practiceProcedure`, `ownerProcedure` |
| `services` | `practiceProcedure`, `ownerProcedure` |
| `telehealth` | `practiceProcedure`, `clinicalProcedure` |

---

## Audit Log Pattern

Import actions from the constants package — never use raw strings:

```ts
import { AUDIT_ACTIONS } from "@repo/config/constants";
```

Always include `ipAddress` and `userAgent` from context:

```ts
await ctx.db.auditLog.create({
  data: {
    practiceId: ctx.practiceId!,
    actorId:    ctx.clerkUserId!,
    actorRole:  ctx.role ?? undefined,
    action:     AUDIT_ACTIONS.READ_CLIENT,
    resourceType: "Client",
    resourceId:   client.id,
    ipAddress:  ctx.ipAddress,
    userAgent:  ctx.userAgent,
  },
});
```

**When to audit:**
- Every individual PHI record read (`getById`, not bulk `list`)
- Every PHI write (create, update, delete, sign)
- Photo upload and delete
- Payment processing
- Provider invite/remove

**Available `AUDIT_ACTIONS`:**
`READ_CLIENT`, `READ_TREATMENT_RECORD`, `READ_INTAKE_FORM`, `READ_CONSENT_FORM`, `READ_PHOTO`,
`CREATE_CLIENT`, `UPDATE_CLIENT`, `CREATE_TREATMENT_RECORD`, `UPDATE_TREATMENT_RECORD`, `SIGN_TREATMENT_RECORD`,
`CREATE_INTAKE_FORM`, `CREATE_CONSENT_FORM`, `UPLOAD_PHOTO`, `DELETE_PHOTO`,
`CREATE_INVOICE`, `PROCESS_PAYMENT`, `LOGIN`, `LOGOUT`, `INVITE_PROVIDER`, `REMOVE_PROVIDER`

If you need a new action, add it to `packages/config/src/constants.ts` — do not use an ad-hoc string.

---

## Tenant Isolation

Every Prisma query against a practice-scoped model must include `practiceId`:

```ts
// CORRECT
ctx.db.client.findFirst({ where: { id, practiceId: ctx.practiceId! } })

// WRONG — cross-tenant data leak
ctx.db.client.findFirst({ where: { id } })
```

When checking ownership before a write/delete, always do a `findFirst` with `practiceId` first — never trust the client-supplied ID alone.

---

## Photos / S3

- Never return `s3Key` or `s3Bucket` to the client directly.
- Use `S3_PRESIGNED_URL_EXPIRY_SECONDS` (3600s) from `@repo/config/constants` for URL expiry.
- `getUploadUrl` and `getViewUrl` in `photos.ts` are the reference implementations.

---

## Adding a New Router

1. Create `src/routers/<name>.ts`
2. Export `<name>Router` from it
3. Register in `src/root.ts` under `appRouter`
4. Run `/add-router` slash command for scaffolding boilerplate

---

## Tests

`src/__tests__/rbac.test.ts` — role permission assertions
`src/__tests__/billing.test.ts` — billing logic unit tests

Run with: `npm run test` from the monorepo root (or `turbo run test --filter=@repo/api`).
