import { describe, it, expect } from "vitest";
import { hasPermission, canAccessClinical, canManageBilling } from "@repo/auth";
import type { UserRole } from "@repo/auth";

describe("role-based access control", () => {
  it("platform admin has full access", () => {
    expect(canAccessClinical("PLATFORM_ADMIN")).toBe(true);
    expect(canManageBilling("PLATFORM_ADMIN")).toBe(true);
  });

  it("provider can access clinical but not billing", () => {
    expect(canAccessClinical("PROVIDER")).toBe(true);
    expect(canManageBilling("PROVIDER")).toBe(false);
  });

  it("front desk can manage billing but not clinical", () => {
    expect(canAccessClinical("FRONT_DESK")).toBe(false);
    expect(canManageBilling("FRONT_DESK")).toBe(true);
  });

  it("client cannot access clinical or billing management", () => {
    expect(canAccessClinical("CLIENT")).toBe(false);
    expect(canManageBilling("CLIENT")).toBe(false);
  });

  it("client can view own record", () => {
    expect(hasPermission("CLIENT", "view:own_record")).toBe(true);
  });

  it("provider cannot manage practice settings", () => {
    expect(hasPermission("PROVIDER", "manage:practice")).toBe(false);
  });

  it("practice owner can manage providers", () => {
    expect(hasPermission("PRACTICE_OWNER", "manage:providers")).toBe(true);
  });
});

describe("tenant isolation", () => {
  // Simulates what our tRPC procedures do: always filter by practiceId
  function queryWithPracticeScope<T extends { practiceId: string }>(
    records: T[],
    practiceId: string
  ): T[] {
    return records.filter((r) => r.practiceId === practiceId);
  }

  it("only returns records for the authenticated practice", () => {
    const records = [
      { id: "1", practiceId: "practice-a", data: "secret" },
      { id: "2", practiceId: "practice-b", data: "other" },
      { id: "3", practiceId: "practice-a", data: "mine" },
    ];

    const result = queryWithPracticeScope(records, "practice-a");
    expect(result).toHaveLength(2);
    expect(result.every((r) => r.practiceId === "practice-a")).toBe(true);
    expect(result.find((r) => r.practiceId === "practice-b")).toBeUndefined();
  });
});
