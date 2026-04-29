import Decimal from "decimal.js";
import { discount_type, OrderStatus, PaymentProvider, PaymentStatus, Role, ShipmentStatus } from "../utils/constants";

export interface IUser {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
  deleted_at: Date | null;
}

export interface IRefreshToken {
  id: number;
  token: string;
  user_id: number;
  expires_at: Date;
  created_at: Date;
}

export interface IRole {
  id: number;
  name: string;
  description: string | null;
  created_at: Date;
}

export interface IPermission {
  id: number;
  name: string;
  description: string | null;
  created_at: Date;
}

export interface IVendor {
  id: number;
  user_id: number;
  business_name: string | null;
  description: string | null;
  created_at: Date;
  deleted_at: Date | null;
}

export interface ICategory {
  id: number;
  name: string;
  created_at: Date;
  deleted_at: Date | null;
}

export interface ISubcategory {
  id: number;
  name: string;
  category_id: number | null;
  created_at: Date;
  deleted_at: Date | null;
}

export interface IProduct {
  id: number;
  name: string;
  description: string | null;
  price: Decimal;
  stock: number;
  category_id: number;
  product_images: IProductImage[];
  category: ICategory;
  subcategory_id: number | null;
  subcategory: ISubcategory | null;
  created_at: Date;
  deleted_at: Date | null;
}

export interface IDiscount {
  id: number;
  product_id: number;
  vendor_id: number;
  code: string | null;
  discount_type: discount_type;
  value: number;
  start_date: Date;
  end_date: Date;
  is_active: boolean;
  created_at: Date;
}

export interface ICart {
  id: number;
  user_id: number | null;
  session_id: string | null;
  created_at: Date | null;
  deleted_at: Date | null;
}

export interface ICartItem {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  created_at: Date;
  deleted_at: Date | null;
}

export interface IOrder {
  id: number;
  user_id: number;
  total: number;
  status: OrderStatus;
  shipping_address: string;
  phone: string;
  order_items: IOrderItem[];
  customer_name: string;
  customer_email: string;
  created_at: Date;
  deleted_at: Date | null;
}

export interface IOrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  created_at: Date;
  deleted_at: Date | null;
}

export interface IPayment {
  id: number;
  order_id: number;
  provider: PaymentProvider;
  amount: number;
  status: PaymentStatus
  transaction_ref: string;
  attempt_count: number;
  created_at: Date;
}

export interface IShipment {
  id: number;
  order_id: number;
  address: string;
  city: string;
  phone: string;
  status: ShipmentStatus;
  tracking_number: string;
  created_at: Date;
}

export interface IProductImage {
  id: number;
  product_id: number;
  image_url: string;
  is_main: boolean;
  position: number;
  created_at: Date;
  deleted_at: Date | null;
}

export interface IAuditLog {
  id: number;
  table_name: string;
  record_id: number;
  action: string;
  changed_by: number | null;
  changed_at: Date;
  old_data: any; // Json type
  new_data: any; // Json type
}


// Join Tables (Many-to-Many)
export interface IUserRole {
  user_id: number;
  role_id: number;
}

export interface IUserPermission {
  user_id: number;
  permission_id: number;
}

export interface IRolePermission {
  role_id: number;
  permission_id: number;
}

export interface IAuthUser {
  id: number;
  name: string;
  email: string;
  roles: IRole[] // Optional roles array for authorization checks
}