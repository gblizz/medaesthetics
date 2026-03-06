import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Public routes that do NOT require authentication
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/api/trpc(.*)", // tRPC handles auth internally
]);

export const withAuth = clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export { clerkMiddleware, createRouteMatcher };
