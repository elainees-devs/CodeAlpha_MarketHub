import { ICartItem } from "../types/interfaces.types";

/**
 * DB Entity (Prisma / raw DB type)
 */
export type CartItemEntity = {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  created_at: Date;
  deleted_at: Date | null;
};

/**
 * Map DB CartItem → API CartItem (ICartItem)
 */
export const mapCartItem = (item: CartItemEntity): ICartItem => {
  return {
    id: item.id,
    cart_id: item.cart_id,
    product_id: item.product_id,
    quantity: item.quantity,
    created_at: item.created_at ? new Date(item.created_at) : new Date(),
    deleted_at: item.deleted_at ? new Date(item.deleted_at) : null,
  };
};