# Database Package — CLAUDE.md

Schema: `packages/db/prisma/schema.prisma`
Client singleton: `packages/db/src/index.ts`

---

## PHI Tables (require audit log on every read/write)

| Table | Sensitive fields |
|-------|-----------------|
| `Client` | `dateOfBirth`, `gender`, `phone`, `notes`, `addressLine1` |
| `TreatmentRecord` | `subjective`, `objective`, `assessment`, `plan`, `injectionMap` |
| `ClientPhoto` | `s3Key`, `s3Bucket` (never return directly — use presigned URLs) |
| `ConsentFormSubmission` | `signatureData`, `pdfS3Key` |
| `IntakeFormSubmission` | `responses`, `pdfS3Key` |
| `AuditLog` | the log itself — **never delete or update rows** |

---

## AuditLog

- **Append-only.** No `update`, `delete`, or `deleteMany` — ever.
- Required fields on every create: `practiceId`, `actorId`, `action`, `resourceType`, `resourceId`
- `actorId` is the Clerk `userId` (or `"system"` for automated actions)
- `action` naming convention: `VERB_MODEL` in screaming snake case, e.g. `READ_TREATMENT_RECORD`, `CREATE_APPOINTMENT`, `DELETE_PHOTO`

---

## Multi-tenancy

Every PHI table has a `practiceId` column. **All Prisma queries must filter by `practiceId`.**

```ts
// CORRECT
db.client.findMany({ where: { practiceId: ctx.practiceId } })

// WRONG — leaks data across tenants
db.client.findMany()
```

The only tables without `practiceId` are join/pivot tables (`PackageService`, `InvoiceItem`, `Payment`) — these are reached through parent relations that are already scoped.

---

## Money

All monetary values are stored in **cents** (integers). Never store floats for money.

```ts
// schema: price Int  // cents
// display: (price / 100).toFixed(2)
```

---

## Model Overview

```
Practice          — top-level tenant
  Location        — physical locations (multi-location ready, UI is v1.x)
  Provider        — clinical staff (clerkUserId required)
  StaffMember     — non-clinical staff (clerkUserId required)
  Client          — patients (clerkUserId optional — can be staff-created)
  Service         — treatment menu
  Appointment     — scheduling
  TreatmentRecord — SOAP charting, 1:1 with Appointment
  ClientPhoto     — before/after, S3 references only
  Invoice         — billing document
  InvoiceItem     — line items on an invoice
  Payment         — payment records
  ServicePackage  — bundled service packages
  PackagePurchase — client package ownership
  DiscountCode    — promo codes
  InventoryItem   — product/supply stock
  LoyaltySettings — points config per practice
  LoyaltyPointLog — points ledger (positive = earned, negative = redeemed)
  ConsentFormTemplate / ConsentFormSubmission
  IntakeFormTemplate  / IntakeFormSubmission
  MarketingCampaign   — email/SMS campaigns
  ProviderCredential  — licenses, DEA, certifications
  ProviderAvailability — weekly schedule blocks
  BlockedTime         — provider time-off
  AuditLog            — HIPAA audit trail (append-only)
```

---

## Enums

- `UserRole`: `PLATFORM_ADMIN | PRACTICE_OWNER | PROVIDER | FRONT_DESK | CLIENT`
- `AppointmentStatus`: `SCHEDULED | CONFIRMED | IN_PROGRESS | COMPLETED | CANCELLED | NO_SHOW`
- `InvoiceStatus`: `DRAFT | SENT | PAID | PARTIALLY_PAID | OVERDUE | CANCELLED`
- `SubscriptionTier`: `STARTER | GROWTH | PRO`
- `SubscriptionStatus`: `ACTIVE | PAST_DUE | CANCELLED | TRIALING`
