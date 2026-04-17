import Decimal from "decimal.js";

/**
 * =========================
 * ROLES
 * =========================
 */
export const ROLES = ["ADMIN", "CUSTOMER", "STAFF"] as const;
export type Role = (typeof ROLES)[number];

/**
 * =========================
 * PERMISSIONS
 * =========================
 */
export const PERMISSIONS = [
  "CREATE_PRODUCT",
  "DELETE_PRODUCT",
  "VIEW_ORDERS",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

/**
 * DISCOUNT TYPES
 */
export const DISCOUNT_TYPES = ["PERCENTAGE", "FIXED"] as const;

export type discount_type = (typeof DISCOUNT_TYPES)[number];
 

/**
 * =========================
 * ORDER STATUS
 * =========================
 */
export const ORDER_STATUS = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

export type OrderStatus = (typeof ORDER_STATUS)[number];

/**
 * =========================
 * PAYMENT STATUS
 * =========================
 */
export const PAYMENT_STATUS = [
  "PENDING",
  "PROCESSING",
  "COMPLETED",
  "FAILED",
  "REFUNDED",
  "CANCELLED",
] as const;

export type PaymentStatus = (typeof PAYMENT_STATUS)[number];

/**
 * =========================
 * PAYMENT PROVIDERS
 * =========================
 */
export const PAYMENT_PROVIDERS = [
  "MPESA",
  "STRIPE",
  "PAYPAL",
] as const;

export type PaymentProvider = (typeof PAYMENT_PROVIDERS)[number];

/**
 * =========================
 * SHIPMENT STATUS
 * =========================
 */
export const SHIPMENT_STATUS = [
  "PENDING",
  "SHIPPED",
  "DELIVERED",
  "RETURNED",
] as const;

export type ShipmentStatus = (typeof SHIPMENT_STATUS)[number];

/**
 * =========================
 * HELPER: ROLE PERMISSIONS MAP
 * (Optional but VERY useful for RBAC)
 * =========================
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  ADMIN: ["CREATE_PRODUCT", "DELETE_PRODUCT", "VIEW_ORDERS"],
  STAFF: ["VIEW_ORDERS"],
  CUSTOMER: [],
};