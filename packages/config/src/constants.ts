export const SUBSCRIPTION_TIERS = {
  STARTER: {
    name: "Starter",
    maxProviders: 1,
    maxStorageGb: 5,
    stripePriceMonthly: "price_starter_monthly",
    stripePriceAnnual: "price_starter_annual",
  },
  GROWTH: {
    name: "Growth",
    maxProviders: 3,
    maxStorageGb: 25,
    stripePriceMonthly: "price_growth_monthly",
    stripePriceAnnual: "price_growth_annual",
  },
  PRO: {
    name: "Pro",
    maxProviders: 10,
    maxStorageGb: 100,
    stripePriceMonthly: "price_pro_monthly",
    stripePriceAnnual: "price_pro_annual",
  },
} as const;

export const SESSION_TIMEOUT_MS = 15 * 60 * 1000; // 15 min idle (HIPAA)

export const AUDIT_ACTIONS = {
  // PHI Read
  READ_CLIENT: "READ_CLIENT",
  READ_TREATMENT_RECORD: "READ_TREATMENT_RECORD",
  READ_INTAKE_FORM: "READ_INTAKE_FORM",
  READ_CONSENT_FORM: "READ_CONSENT_FORM",
  READ_PHOTO: "READ_PHOTO",
  // PHI Write
  CREATE_CLIENT: "CREATE_CLIENT",
  UPDATE_CLIENT: "UPDATE_CLIENT",
  CREATE_TREATMENT_RECORD: "CREATE_TREATMENT_RECORD",
  UPDATE_TREATMENT_RECORD: "UPDATE_TREATMENT_RECORD",
  SIGN_TREATMENT_RECORD: "SIGN_TREATMENT_RECORD",
  CREATE_INTAKE_FORM: "CREATE_INTAKE_FORM",
  CREATE_CONSENT_FORM: "CREATE_CONSENT_FORM",
  UPLOAD_PHOTO: "UPLOAD_PHOTO",
  DELETE_PHOTO: "DELETE_PHOTO",
  // Billing
  CREATE_INVOICE: "CREATE_INVOICE",
  PROCESS_PAYMENT: "PROCESS_PAYMENT",
  // Auth
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  // Admin
  INVITE_PROVIDER: "INVITE_PROVIDER",
  REMOVE_PROVIDER: "REMOVE_PROVIDER",
} as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[keyof typeof AUDIT_ACTIONS];

export const PHOTO_TYPES = ["BEFORE", "AFTER", "PROGRESS", "SIMULATION"] as const;
export type PhotoType = (typeof PHOTO_TYPES)[number];

export const S3_PRESIGNED_URL_EXPIRY_SECONDS = 3600; // 1 hour

export const APPOINTMENT_REMINDER_HOURS = [48, 24, 2]; // hours before appointment
