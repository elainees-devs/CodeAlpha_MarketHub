import Decimal from "decimal.js";
import {
  OrderStatus,
  PaymentProvider,
  PaymentStatus,
  ShipmentStatus,
  discount_type,
} from "../utils/constants";
/**
 * Base Entity
 */
export interface IBase {
  id: number;
  created_at: Date;
  deleted_at?: Date | null;
}

/**
 * User Entity (internal DB shape)
 */
export interface IUser extends IBase {
  name: string;
  email: string;
  password_hash: string;
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

export interface IDiscount extends IBase {
  code: string;
  product_id?: number | null;
  vendor_id?: number | null;
  discount_type: discount_type;
  start_date?: string | null;
  end_date?: string | null;
  is_active: boolean;
  value: Decimal;
}

export interface IOrder extends IBase {
  user_id: number;
  total: Decimal;
  status: OrderStatus;
  shipping_address?: string | null;
  phone?: string | null;
  customer_name?: string | null;
  customer_email?: string | null;
}

export interface IOrderItem extends IBase {
  order_id: number;
  product_id: number;
  quantity: number;
  price: Decimal;
}

export interface IPayment extends IBase {
  order_id: number | null;
  provider: PaymentProvider;
  amount: Decimal;
  status: PaymentStatus;
  transaction_ref?: string | null;
  attempt_count: number;
}

export interface IShipment extends IBase {
  order_id: number | null;
  address: string;
  city?: string | null;
  phone?: string | null;
  status: ShipmentStatus;
  tracking_number?: string | null;
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
  id: number;
  user_id: number;
  roles: string[]; // e.g. ["admin", "customer"]
}
