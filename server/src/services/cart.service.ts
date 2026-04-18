import { prisma, ApiError } from "../utils";
import { ICart } from "../types/interfaces.types";
import { mapCart, CartEntity } from "../mappers";

import {
  CreateCartInput,
  DeleteCartInput,
  UpdateCartInput,
} from "../schemas/cart.schema";

import { auditLogService } from "./auditLog.service";

type CartTotalsResponse = {
  cart_id: number;
  items: {
    id: number;
    product_id: number;
    quantity: number;
    discount: number;
    itemSubtotal: number;
  }[];
  subtotal: number;
  discount: number;
  total: number;
};

class CartService {
  // =====================================================
  // GET CART BY USER ID
  // =====================================================
  async getCartByUserId(user_id: number): Promise<ICart | null> {
    const cart = await prisma.carts.findFirst({
      where: { user_id },
      include: { cart_items: true },
    });

    if (!cart) return null;

    return mapCart(cart as unknown as CartEntity);
  }

  // =====================================================
  // CREATE CART
  // =====================================================
  async createCart(data: CreateCartInput): Promise<ICart> {
    const cart = await prisma.carts.create({
      data: {
        user_id: data.user_id ?? null,
        session_id: data.session_id ?? null,
      },
    });

    // FIXED AUDIT LOG
    await auditLogService.createAuditLog({
      table_name: "carts",
      record_id: cart.id,
      action: "CREATE",
      changed_by: data.user_id ?? undefined,
      session_id: data.session_id ?? undefined,
      old_data: null,
      new_data: cart,
    });

    return mapCart(cart as unknown as CartEntity);
  }

  // =====================================================
  // UPDATE CART
  // =====================================================
  async updateCart(id: number, data: UpdateCartInput): Promise<ICart> {
    const exists = await prisma.carts.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new ApiError(404, "Cart not found");
    }

    const cart = await prisma.carts.update({
      where: { id },
      data: {
        ...(data.user_id !== undefined && { user_id: data.user_id }),
        ...(data.session_id !== undefined && { session_id: data.session_id }),
      },
      include: { cart_items: true },
    });

    await auditLogService.createAuditLog({
      table_name: "carts",
      record_id: id,
      action: "UPDATE",
      changed_by: data.user_id ?? undefined,
      session_id: data.session_id ?? undefined,
      old_data: exists,
      new_data: cart,
    });

    return mapCart(cart as unknown as CartEntity);
  }

  // =====================================================
  // DELETE CART
  // =====================================================
  async deleteCart(data: DeleteCartInput): Promise<void> {
    const exists = await prisma.carts.findUnique({
      where: { id: data.id },
    });

    if (!exists) {
      throw new ApiError(404, "Cart not found");
    }

    await prisma.carts.delete({
      where: { id: data.id },
    });

    await auditLogService.createAuditLog({
      table_name: "carts",
      record_id: data.id,
      action: "DELETE",
      changed_by: exists.user_id ?? undefined,
      session_id: exists.session_id ?? undefined,
      old_data: exists,
      new_data: null,
    });
  }

  // =====================================================
  // CALCULATE CART TOTALS
  // =====================================================
  async calculateCartTotals(user_id: number): Promise<CartTotalsResponse> {
    const now = new Date();

    const cart = await prisma.carts.findFirst({
      where: { user_id },
      include: {
        cart_items: {
          include: {
            products: {
              include: {
                discounts: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }

    const activeDiscounts = await prisma.discounts.findMany({
      where: {
        is_active: true,
        start_date: { lte: now },
        end_date: { gte: now },
      },
    });

    let subtotal = 0;
    let totalDiscount = 0;

    const items = cart.cart_items.map((item) => {
      const itemSubtotal =
        Number(item.products.price) * item.quantity;

      subtotal += itemSubtotal;

      let itemDiscount = 0;

      const applicableDiscount = item.products.discounts.find((d) =>
        activeDiscounts.some((ad) => ad.id === d.id)
      );

      if (applicableDiscount) {
        if (applicableDiscount.discount_type === "PERCENTAGE") {
          itemDiscount =
            (itemSubtotal * Number(applicableDiscount.value)) / 100;
        }

        if (applicableDiscount.discount_type === "FIXED") {
          itemDiscount = Number(applicableDiscount.value);
        }

        totalDiscount += itemDiscount;
      }

      return {
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        discount: itemDiscount,
        itemSubtotal,
      };
    });

    return {
      cart_id: cart.id,
      items,
      subtotal,
      discount: totalDiscount,
      total: subtotal - totalDiscount,
    };
  }

  // =====================================================
  // CLEAR USER CART
  // =====================================================
  async clearCart(user_id: number): Promise<void> {
    await prisma.cart_items.deleteMany({
      where: {
        carts: { user_id },
      },
    });
  }

  // =====================================================
  // MERGE GUEST CART INTO USER CART
  // =====================================================
  async mergeGuestCart(session_id: string, user_id: number): Promise<void> {
    const guestCart = await prisma.carts.findFirst({
      where: { session_id },
      include: { cart_items: true },
    });

    if (!guestCart || guestCart.cart_items.length === 0) {
      return;
    }

    let userCart = await prisma.carts.findFirst({
      where: { user_id },
      include: { cart_items: true },
    });

    if (!userCart) {
      userCart = await prisma.carts.create({
        data: {
          user_id,
          session_id: null,
        },
        include: { cart_items: true },
      });
    }

    for (const guestItem of guestCart.cart_items) {
      const existingItem = userCart.cart_items.find(
        (i) => i.product_id === guestItem.product_id
      );

      if (existingItem) {
        await prisma.cart_items.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity + guestItem.quantity,
          },
        });
      } else {
        await prisma.cart_items.create({
          data: {
            cart_id: userCart.id,
            product_id: guestItem.product_id,
            quantity: guestItem.quantity,
          },
        });
      }
    }

    await prisma.cart_items.deleteMany({
      where: { cart_id: guestCart.id },
    });

    await prisma.carts.delete({
      where: { id: guestCart.id },
    });

    // optional audit
    await auditLogService.createAuditLog({
      table_name: "carts",
      record_id: userCart.id,
      action: "MERGE",
      changed_by: user_id,
      old_data: guestCart,
      new_data: userCart,
    });
  }
}

export const cartService = new CartService();