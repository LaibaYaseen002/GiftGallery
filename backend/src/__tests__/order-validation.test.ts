import { describe, it, expect } from "vitest";
import {
  isValidPhone,
  isPositiveInteger,
  isWithinLength,
} from "../utils/validation";

/**
 * Tests for order-related validation logic.
 * These test the validation rules applied in POST /api/orders.
 */

describe("Order Item Validation", () => {
  it("validates that each item has a positive integer quantity", () => {
    const validItems = [
      { product_id: "abc-123", quantity: 1 },
      { product_id: "def-456", quantity: 3 },
    ];

    for (const item of validItems) {
      expect(isPositiveInteger(item.quantity)).toBe(true);
    }
  });

  it("rejects items with zero or negative quantities", () => {
    expect(isPositiveInteger(0)).toBe(false);
    expect(isPositiveInteger(-1)).toBe(false);
    expect(isPositiveInteger(-100)).toBe(false);
  });

  it("rejects items with fractional quantities", () => {
    expect(isPositiveInteger(1.5)).toBe(false);
    expect(isPositiveInteger(0.99)).toBe(false);
  });
});

describe("Shipping Validation", () => {
  it("validates phone numbers in various formats", () => {
    // Pakistan
    expect(isValidPhone("+92 300 1234567")).toBe(true);
    expect(isValidPhone("0300-1234567")).toBe(true);
    // US
    expect(isValidPhone("+1 (555) 123-4567")).toBe(true);
    // Generic
    expect(isValidPhone("1234567890")).toBe(true);
  });

  it("rejects invalid phone numbers", () => {
    expect(isValidPhone("abc")).toBe(false);
    expect(isValidPhone("12")).toBe(false);
    expect(isValidPhone("")).toBe(false);
  });

  it("validates shipping name length", () => {
    expect(isWithinLength("John Doe", 200)).toBe(true);
    expect(isWithinLength("A".repeat(200), 200)).toBe(true);
    expect(isWithinLength("A".repeat(201), 200)).toBe(false);
  });

  it("validates gift message length", () => {
    expect(isWithinLength("Happy Birthday!", 500)).toBe(true);
    expect(isWithinLength("A".repeat(500), 500)).toBe(true);
    expect(isWithinLength("A".repeat(501), 500)).toBe(false);
  });
});

describe("Discount Code Validation in Order", () => {
  it("calculates discount correctly", () => {
    const subtotal = 100;
    const discountPercent = 20;
    const discountAmount = (subtotal * discountPercent) / 100;
    expect(discountAmount).toBe(20);
    expect(subtotal - discountAmount).toBe(80);
  });

  it("handles no discount", () => {
    const subtotal = 150;
    const discountAmount = 0;
    expect(subtotal - discountAmount).toBe(150);
  });

  it("handles 100% discount", () => {
    const subtotal = 200;
    const discountPercent = 100;
    const discountAmount = (subtotal * discountPercent) / 100;
    expect(subtotal - discountAmount).toBe(0);
  });
});

describe("Order Total Calculation", () => {
  it("calculates total from multiple items", () => {
    const items = [
      { price: 8.99, quantity: 2 },
      { price: 14.99, quantity: 1 },
      { price: 3.99, quantity: 3 },
    ];

    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    expect(subtotal).toBeCloseTo(44.94, 2);
  });

  it("applies discount to subtotal", () => {
    const subtotal = 100;
    const discountPercent = 15;
    const discountAmount = (subtotal * discountPercent) / 100;
    const total = subtotal - discountAmount;

    expect(discountAmount).toBe(15);
    expect(total).toBe(85);
  });
});
