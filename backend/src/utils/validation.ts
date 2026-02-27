// Shared validation utilities

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^[\d\s\-+()]{7,20}$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function isValidPhone(phone: string): boolean {
  return PHONE_REGEX.test(phone);
}

export function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

export function isValidDiscountPercent(value: unknown): value is number {
  return typeof value === "number" && value >= 1 && value <= 100;
}

export function isWithinLength(str: string, max: number): boolean {
  return str.trim().length <= max;
}

export function sanitizeSearchQuery(query: string, maxLength = 100): string {
  return query.trim().slice(0, maxLength);
}

export const VALID_ORDER_STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;
export const VALID_RETURN_STATUSES = ["pending", "approved", "rejected", "refunded"] as const;

export type OrderStatus = (typeof VALID_ORDER_STATUSES)[number];
export type ReturnStatus = (typeof VALID_RETURN_STATUSES)[number];
