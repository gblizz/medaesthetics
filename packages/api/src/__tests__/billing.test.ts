import { describe, it, expect } from "vitest";

// Pure business logic tests — no DB required

describe("billing calculations", () => {
  function calculateInvoiceTotal(
    items: { quantity: number; unitPrice: number }[],
    discountPercent?: number,
    taxAmount = 0
  ) {
    const subtotal = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
    const discountAmount = discountPercent
      ? Math.floor((subtotal * discountPercent) / 100)
      : 0;
    return Math.max(0, subtotal - discountAmount + taxAmount);
  }

  it("calculates subtotal correctly", () => {
    expect(
      calculateInvoiceTotal([
        { quantity: 1, unitPrice: 10000 }, // $100
        { quantity: 2, unitPrice: 5000 },  // $50 each
      ])
    ).toBe(20000); // $200
  });

  it("applies percentage discount", () => {
    const total = calculateInvoiceTotal(
      [{ quantity: 1, unitPrice: 10000 }],
      10 // 10% off
    );
    expect(total).toBe(9000); // $90
  });

  it("applies tax", () => {
    const total = calculateInvoiceTotal(
      [{ quantity: 1, unitPrice: 10000 }],
      undefined,
      800 // $8 tax
    );
    expect(total).toBe(10800);
  });

  it("total never goes below zero", () => {
    const total = calculateInvoiceTotal(
      [{ quantity: 1, unitPrice: 1000 }],
      100 // 100% off
    );
    expect(total).toBe(0);
  });
});

describe("loyalty points", () => {
  function calculatePointsEarned(amountCents: number, pointsPerDollar = 1.0) {
    return Math.floor((amountCents / 100) * pointsPerDollar);
  }

  function calculatePointValue(points: number, dollarsPerPoint = 0.01) {
    return Math.floor(points * dollarsPerPoint * 100); // returns cents
  }

  it("earns points on purchase", () => {
    expect(calculatePointsEarned(10000)).toBe(100); // $100 = 100 points
  });

  it("earns double points with 2x multiplier", () => {
    expect(calculatePointsEarned(10000, 2.0)).toBe(200);
  });

  it("calculates point redemption value", () => {
    expect(calculatePointValue(100, 0.01)).toBe(100); // 100 points = $1.00 = 100 cents
  });
});
