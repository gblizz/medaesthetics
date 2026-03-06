import { z } from "zod";

const serverEnvSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  // Redis
  REDIS_URL: z.string().url(),
  // Clerk (server)
  CLERK_SECRET_KEY: z.string().min(1),
  CLERK_WEBHOOK_SECRET: z.string().optional(),
  // AWS
  AWS_REGION: z.string().default("us-east-1"),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  S3_BUCKET_NAME: z.string().optional(),
  S3_BUCKET_REGION: z.string().optional(),
  // Stripe
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  // Twilio
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_FROM_NUMBER: z.string().optional(),
  // Resend
  RESEND_API_KEY: z.string().optional(),
  // Daily.co
  DAILY_API_KEY: z.string().optional(),
  // App
  NODE_ENV: z
    .enum(["development", "staging", "production"])
    .default("development"),
  NEXTAUTH_URL: z.string().url().optional(),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().default("/sign-in"),
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().default("/sign-up"),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_PATIENT_PORTAL_URL: z.string().url().optional(),
});

function validateServerEnv() {
  const result = serverEnvSchema.safeParse(process.env);
  if (!result.success) {
    console.error(
      "Invalid server environment variables:",
      result.error.flatten().fieldErrors
    );
    throw new Error("Invalid server environment variables");
  }
  return result.data;
}

function validateClientEnv() {
  const result = clientEnvSchema.safeParse(process.env);
  if (!result.success) {
    console.error(
      "Invalid client environment variables:",
      result.error.flatten().fieldErrors
    );
    throw new Error("Invalid client environment variables");
  }
  return result.data;
}

// Only validate server env on the server side
export const serverEnv =
  typeof window === "undefined" ? validateServerEnv() : ({} as never);

export const clientEnv = validateClientEnv();
