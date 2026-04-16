import Decimal from "decimal.js";
/**
 * Base Entity
 */
export interface IBase {
  id: number;
  created_at: string;
  deleted_at?: string | null;
}

/**
 * User Entity (internal DB shape)
 */
export interface IUser extends IBase {
  name: string;
  email: string;
  password_hash: string;
}

/**
 * Public User Response
 */
export type UserResponse = Omit<IUser, "password_hash">;

/**
 * Register Input
 */
export interface RegisterUserInput {
  name: string;
  email: string;
  password: string; // plain password (backend hashes it)
}

export interface IRole extends IBase {
  name: string;
  description?: string | null;
}

export interface IPermission extends IBase {
  name: string;
  description?: string | null;
}

export interface IUserRole {
  user_id: number;
  role_id: number;
}

export interface IRolePermission {
  role_id: number;
  permission_id: number;
}

export interface IUserPermission {
  user_id: number;
  permission_id: number;
}

// CATEGORIES
export interface ICategory extends IBase {
  name: string;
}

export interface ISubcategory extends IBase {
  name: string;
  category_id: number | null;
}

// PRODUCTS
export interface IProduct extends IBase {
  name: string;
  description?: string | null;
  price: Decimal;
  stock: number;
  subcategory_id: number | null;
}

export interface IProductImage extends IBase {
  product_id: number | null;
  image_url: string;
  is_main: boolean;
  position: number;
}

/**
 * Product Response (with images)
 */
export interface IProductResponse extends IProduct {
  images: IProductImage[];
}

// CART
export interface ICart extends IBase {
  user_id?: number | null;
  session_id?: string | null;
}

export interface ICartItem extends IBase {
  cart_id: number;
  product_id: number;
  quantity: number;
}

/**
 * Cart Response (expanded)
 */
export interface ICartResponse extends ICart {
  items: ICartItem[];
  total_price: Decimal;
}

// ORDERS
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface IOrder extends IBase {
  user_id: number;
  total: Decimal;
  status: OrderStatus;
  shipping_address?: string | null;
  phone?: string | null;
  customer_name?: string | null;
  customer_email?: string | null;
  deleted_at?: string | null;
}

export interface IOrderItem extends IBase {
  order_id: number;
  product_id: number;
  quantity: number;
  price: Decimal;
  deleted_at?: string | null;
}

/**
 * Order Response
 */
export interface IOrderResponse extends IOrder {
  items: IOrderItem[];
}

// PAYMENTS
export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "REFUNDED"
  | "CANCELLED";

export type PaymentProvider = "STRIPE" | "MPESA" | "PAYPAL";

export interface IPayment extends IBase {
  order_id: number | null;
  provider: PaymentProvider;
  amount: Decimal;
  status: PaymentStatus;
  transaction_ref?: string | null;
  attempt_count: number;
}

export type ShipmentStatus =
  | "PENDING"
  | "SHIPPED"
  | "DELIVERED"
  | "RETURNED"
  | "CANCELLED";

// SHIPPING
export interface IShipment extends IBase {
  order_id: number | null;
  address: string;
  city?: string | null;
  phone?: string | null;
  status: ShipmentStatus;
  tracking_number?: string | null;
}

// INPUT TYPES

export type CreateUserInput = RegisterUserInput; // user input

//product input
export type CreateProductInput = Omit<
  IProduct,
  "id" | "created_at" | "deleted_at"
>;

//category input
export interface AddToCartInput {
  product_id: number;
  quantity: number;
}

// order input
export interface CreateOrderInput {
  shipping_address: string;
  phone: string;
  customer_name: string;
  customer_email: string;
}

// payment input
export interface CreatePaymentInput {
  order_id: number;
  provider: PaymentProvider;
}

// Audit Log
export interface IAuditLog {
  id: number;
  table_name: string;
  record_id: number;
  action: string;
  changed_by?: number | null;
  changed_at: string;
  old_data?: any;
  new_data?: any;
}

// Authenticated user info (from JWT)
export interface IAuthUser {
  // runtime representation of authenticated user
  user_id: number;
  roles: string[]; // e.g. ["admin", "customer"]
}
