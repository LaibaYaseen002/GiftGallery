import { describe, it, expect } from "vitest";
import {
  isValidEmail,
  isValidPhone,
  isPositiveInteger,
  isValidDiscountPercent,
  isWithinLength,
  sanitizeSearchQuery,
  VALID_ORDER_STATUSES,
  VALID_RETURN_STATUSES,
} from "../utils/validation";

describe("Email Validation", () => {
  it("accepts valid emails", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
    expect(isValidEmail("test.user@domain.co")).toBe(true);
    expect(isValidEmail("name+tag@gmail.com")).toBe(true);
  });

  it("rejects invalid emails", () => {
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail("notanemail")).toBe(false);
    expect(isValidEmail("@domain.com")).toBe(false);
    expect(isValidEmail("user@")).toBe(false);
    expect(isValidEmail("user @domain.com")).toBe(false);
  });
});

describe("Phone Validation", () => {
  it("accepts valid phone numbers", () => {
    expect(isValidPhone("1234567890")).toBe(true);
    expect(isValidPhone("+1 234-567-8900")).toBe(true);
    expect(isValidPhone("(123) 456-7890")).toBe(true);
    expect(isValidPhone("+92 300 1234567")).toBe(true);
  });

  it("rejects invalid phone numbers", () => {
    expect(isValidPhone("")).toBe(false);
    expect(isValidPhone("123")).toBe(false);
    expect(isValidPhone("abcdefghij")).toBe(false);
    expect(isValidPhone("123456789012345678901")).toBe(false); // too long
  });
});

describe("Positive Integer Validation", () => {
  it("accepts positive integers", () => {
    expect(isPositiveInteger(1)).toBe(true);
    expect(isPositiveInteger(100)).toBe(true);
    expect(isPositiveInteger(999)).toBe(true);
  });

  it("rejects non-positive or non-integer values", () => {
    expect(isPositiveInteger(0)).toBe(false);
    expect(isPositiveInteger(-1)).toBe(false);
    expect(isPositiveInteger(1.5)).toBe(false);
    expect(isPositiveInteger("1")).toBe(false);
    expect(isPositiveInteger(null)).toBe(false);
    expect(isPositiveInteger(undefined)).toBe(false);
  });
});

describe("Discount Percent Validation", () => {
  it("accepts valid percentages (1-100)", () => {
    expect(isValidDiscountPercent(1)).toBe(true);
    expect(isValidDiscountPercent(50)).toBe(true);
    expect(isValidDiscountPercent(100)).toBe(true);
  });

  it("rejects out-of-range values", () => {
    expect(isValidDiscountPercent(0)).toBe(false);
    expect(isValidDiscountPercent(-10)).toBe(false);
    expect(isValidDiscountPercent(101)).toBe(false);
    expect(isValidDiscountPercent(200)).toBe(false);
  });

  it("rejects non-number values", () => {
    expect(isValidDiscountPercent("50")).toBe(false);
    expect(isValidDiscountPercent(null)).toBe(false);
    expect(isValidDiscountPercent(undefined)).toBe(false);
  });
});

describe("String Length Validation", () => {
  it("accepts strings within limit", () => {
    expect(isWithinLength("hello", 10)).toBe(true);
    expect(isWithinLength("", 10)).toBe(true);
    expect(isWithinLength("a".repeat(200), 200)).toBe(true);
  });

  it("rejects strings exceeding limit", () => {
    expect(isWithinLength("a".repeat(201), 200)).toBe(false);
    expect(isWithinLength("a".repeat(301), 300)).toBe(false);
  });

  it("trims whitespace before checking", () => {
    expect(isWithinLength("  hello  ", 5)).toBe(true);
    expect(isWithinLength("  " + "a".repeat(6) + "  ", 5)).toBe(false);
  });
});

describe("Search Query Sanitization", () => {
  it("trims whitespace", () => {
    expect(sanitizeSearchQuery("  hello  ")).toBe("hello");
  });

  it("truncates long queries", () => {
    const longQuery = "a".repeat(200);
    expect(sanitizeSearchQuery(longQuery)).toHaveLength(100);
    expect(sanitizeSearchQuery(longQuery, 50)).toHaveLength(50);
  });

  it("preserves short queries", () => {
    expect(sanitizeSearchQuery("gift")).toBe("gift");
    expect(sanitizeSearchQuery("rose gold necklace")).toBe("rose gold necklace");
  });
});

describe("Status Constants", () => {
  it("has correct order statuses", () => {
    expect(VALID_ORDER_STATUSES).toEqual([
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ]);
  });

  it("has correct return statuses", () => {
    expect(VALID_RETURN_STATUSES).toEqual([
      "pending",
      "approved",
      "rejected",
      "refunded",
    ]);
  });
});
