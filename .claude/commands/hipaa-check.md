---
description: Review a file or tRPC router for HIPAA compliance issues
argument-hint: <file-path>
allowed-tools: [Read, Grep]
---

Review the file at `$ARGUMENTS` for HIPAA compliance issues specific to this codebase.

## What to check

### 1. Audit logging
- Every procedure that reads or writes PHI must call the audit log
- PHI models: `Client`, `TreatmentRecord`, `ClientPhoto`, `ConsentFormSubmission`, `IntakeFormSubmission`, `AuditLog`
- Look for `db.treatmentRecord`, `db.client`, `db.clientPhoto`, etc. without a corresponding `db.auditLog.create()`
- The audit log entry must include: `practiceId`, `actorId`, `action`, `resourceType`, `resourceId`

### 2. Tenant isolation
- Every Prisma query against a PHI table must include a `practiceId` filter
- A `findMany` or `findFirst` without `where: { practiceId }` is a multi-tenant data leak
- Check: `db.client.findMany()`, `db.appointment.findMany()`, etc.

### 3. S3 / photo access
- `ClientPhoto` rows store `s3Key` and `s3Bucket` — never return these directly to the client
- Photo access must go through a presigned URL generator
- Flag any procedure that returns `s3Key` or `s3Bucket` in its output

### 4. Procedure tier
- Procedures touching PHI must use `clinicalProcedure` or `practiceProcedure` at minimum
- `publicProcedure` must never access PHI tables
- `protectedProcedure` should not access PHI unless it also verifies `practiceId` membership

### 5. AuditLog immutability
- No `db.auditLog.update()`, `db.auditLog.delete()`, or `db.auditLog.deleteMany()` — ever
- Flag any such call immediately

### 6. Sensitive fields in responses
- Flag if `dateOfBirth`, `notes`, `signatureData`, `injectionMap`, or `pdfS3Key` are returned without clear clinical necessity

## Output format

For each issue found, report:
- **Severity**: Critical / High / Medium
- **Line(s)**: approximate location
- **Issue**: what the problem is
- **Fix**: what to do instead

If no issues are found, say so explicitly.
