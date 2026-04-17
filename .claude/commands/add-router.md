---
description: Scaffold a new tRPC router with correct procedure tiers and audit log boilerplate
argument-hint: <router-name>
allowed-tools: [Read, Write, Edit, Glob]
---

Scaffold a new tRPC router named `$ARGUMENTS` in `packages/api/src/routers/`.

## Steps

### 1. Read existing routers for conventions
Read one or two existing routers (e.g. `packages/api/src/routers/clients.ts` or `packages/api/src/routers/appointments.ts`) to confirm current import paths and patterns before writing.

### 2. Create the router file
Create `packages/api/src/routers/$ARGUMENTS.ts` following this structure:

```ts
import { z } from "zod";
import {
  createTRPCRouter,
  practiceProcedure,
  // import clinicalProcedure or ownerProcedure if needed
} from "../trpc";

export const $ARGUMENTSRouter = createTRPCRouter({
  // list: read operation — use practiceProcedure minimum
  list: practiceProcedure.query(async ({ ctx }) => {
    const items = await ctx.db.$ARGUMENTS.findMany({
      where: { practiceId: ctx.practiceId }, // ALWAYS filter by practiceId
      orderBy: { createdAt: "desc" },
    });

    // Audit log for PHI reads (remove if this model is not PHI)
    await ctx.db.auditLog.create({
      data: {
        practiceId: ctx.practiceId,
        actorId: ctx.userId,
        actorRole: ctx.role,
        action: "LIST_$ARGUMENTS_UPPER",
        resourceType: "$ARGUMENTS",
        resourceId: "bulk",
      },
    });

    return items;
  }),

  // getById: single record fetch
  getById: practiceProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const item = await ctx.db.$ARGUMENTS.findFirst({
        where: { id: input.id, practiceId: ctx.practiceId },
      });

      if (!item) throw new TRPCError({ code: "NOT_FOUND" });

      await ctx.db.auditLog.create({
        data: {
          practiceId: ctx.practiceId,
          actorId: ctx.userId,
          actorRole: ctx.role,
          action: "READ_$ARGUMENTS_UPPER",
          resourceType: "$ARGUMENTS",
          resourceId: item.id,
        },
      });

      return item;
    }),

  // create: write operation
  create: practiceProcedure
    .input(z.object({
      // define fields here
    }))
    .mutation(async ({ ctx, input }) => {
      const item = await ctx.db.$ARGUMENTS.create({
        data: {
          practiceId: ctx.practiceId,
          ...input,
        },
      });

      await ctx.db.auditLog.create({
        data: {
          practiceId: ctx.practiceId,
          actorId: ctx.userId,
          actorRole: ctx.role,
          action: "CREATE_$ARGUMENTS_UPPER",
          resourceType: "$ARGUMENTS",
          resourceId: item.id,
        },
      });

      return item;
    }),
});
```

Replace `$ARGUMENTS` with the actual router name and `$ARGUMENTS_UPPER` with its uppercase form.

### 3. Register the router
Read `packages/api/src/root.ts` (or wherever routers are assembled) and add:
```ts
import { $ARGUMENTSRouter } from "./routers/$ARGUMENTS";
// add to the router map
$ARGUMENTS: $ARGUMENTSRouter,
```

### 4. Reminder checklist
After creating, confirm:
- [ ] Every query filters by `practiceId`
- [ ] Every PHI read/write has an `auditLog.create()` call
- [ ] No `publicProcedure` accesses any model with patient data
- [ ] No S3 keys are returned directly (use presigned URLs for `ClientPhoto`)
