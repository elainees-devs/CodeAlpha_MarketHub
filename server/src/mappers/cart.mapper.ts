import { ICart } from "../types/interfaces.types";

/**
 * DB Entity (Prisma / raw DB type)
 */
export type CartEntity = {
  id: number;
  user_id: number | null;
  session_id: string | null;
  created_at: Date | null;
  deleted_at: Date | null;
};

/**
 * Map DB Cart → API Cart (ICart)
 */
export const mapCart = (cart: CartEntity): ICart => {
  return {
    id: cart.id,
    user_id: cart.user_id ?? null,
    session_id: cart.session_id ?? null,
    created_at: cart.created_at?.toISOString() ?? "",
    deleted_at: cart.deleted_at ? cart.deleted_at.toISOString() : null,
  };
};