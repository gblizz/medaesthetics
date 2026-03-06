import "server-only";
import { createCallerFactory, createTRPCRouter } from "@repo/api";
import { appRouter } from "@repo/api/router";
import { createTRPCContext } from "../server/context";
import { cache } from "react";

const createCaller = createCallerFactory(appRouter);

export const createServerCaller = cache(async () => {
  const ctx = await createTRPCContext({
    headers: new Headers(),
  });
  return createCaller(ctx);
});
