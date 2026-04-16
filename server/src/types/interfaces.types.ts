/**
 * Base Entity
 */
export interface IBase {
  id: number;
  created_at: string;
}

/**
 * User Entity (internal DB shape)
 */
export interface IUser extends IBase {
  name: string;
  email: string;
  password_hash: string;
  deleted_at?: string | null;
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
  deleted_at?: string | null;
}

export interface ISubcategory extends IBase {
  name: string;
  category_id: number;
  deleted_at?: string | null;
}

// PRODUCTS
export interface IProduct extends IBase {
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  subcategory_id: number;
  deleted_at?: string | null;
}

export interface IProductImage extends IBase {
  product_id: number;
  image_url: string;
  is_main: boolean;
  position: number;
  deleted_at?: string | null;
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
  deleted_at?: string | null;
}

export interface ICartItem extends IBase {
  cart_id: number;
  product_id: number;
  quantity: number;
  deleted_at?: string | null;
}

/**
 * Cart Response (expanded)
 */
export interface ICartResponse extends ICart {
  items: ICartItem[];
  total_price: number;
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
  total: number;
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
  price: number;
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

export type PaymentProvider =
  | "STRIPE"
  | "MPESA"
  | "PAYPAL";

export interface IPayment extends IBase {
  order_id: number;
  provider: PaymentProvider;
  amount: number;
  status: PaymentStatus;
  transaction_ref?: string | null;
  attempt_count: number;
}

// SHIPPING
export interface IShipment extends IBase {
  order_id: number;
  address: string;
  city?: string | null;
  phone?: string | null;
  status: string;
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
// Authenticated user info (from JWT)
export interface IAuthUser { // runtime representation of authenticated user
  user_id: number;
}
