---
description: Run Prisma migrations safely with pre-flight checks
allowed-tools: [Bash(npx prisma:*), Bash(DATABASE_URL=* npx prisma:*), Bash(git status:*), Bash(git diff:*), Bash(git stash:*)]
---

Run Prisma database migrations for this project with safety checks.

## Steps

### 1. Check for uncommitted schema changes
```bash
git diff packages/db/prisma/schema.prisma
```
If there are uncommitted changes to the schema, confirm with the user before proceeding — they may want to commit first.

### 2. Validate the schema
```bash
cd packages/db && npx prisma validate
```
Stop and report errors if validation fails.

### 3. Generate the Prisma client
```bash
npm run db:generate
```

### 4. Run the migration
```bash
npm run db:migrate
```

If this is a production environment (`NODE_ENV=production`), **stop and ask the user to confirm** before running `db:migrate`. Production migrations should be reviewed and run manually.

### 5. Verify
After migration succeeds, report:
- Migration name(s) applied
- Any new tables or columns added
- Whether any destructive changes occurred (column drops, type changes)

## Safety rules
- Never run `prisma migrate reset` without explicit user confirmation — it drops and recreates the database
- Never run `prisma db push --force-reset` without explicit user confirmation
- If a migration involves dropping a column on `AuditLog`, refuse and explain that the AuditLog table is append-only and immutable per HIPAA policy
