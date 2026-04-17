import { prisma, ApiError } from "../utils";
import { ICart } from "../types/interfaces.types";
import { mapCart, CartEntity } from "../mappers/cart.mapper";

class CartService {
  // =====================================================
  // GET CART BY USER ID
  // =====================================================
  async getCartByUserId(user_id: number): Promise<ICart | null> {
    const cart = await prisma.carts.findFirst({
      where: { user_id },
    });

    if (!cart) return null;

    return mapCart(cart as CartEntity);
  }

  // =====================================================
  // CREATE CART
  // =====================================================
  async createCart(user_id?: number, session_id?: string): Promise<ICart> {
    const cart = await prisma.carts.create({
      data: {
        user_id: user_id ?? null,
        session_id: session_id ?? null,
      },
    });

    return mapCart(cart as CartEntity);
  }

async calculateCartTotals(user_id: number) {
  const now = new Date();

  const cart = await prisma.carts.findFirst({
    where: { user_id },
    include: {
      cart_items: {
        include: {
          products: {
            include: {
              discounts: true,
              subcategories: true,
            },
          },
        },
      },
    },
  });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const discounts = await prisma.discounts.findMany({
    where: {
      is_active: true,
      start_date: { lte: now },
      end_date: { gte: now },
    },
  });

  let subtotal = 0;
  let totalDiscount = 0;
  const enrichedItems = cart.cart_items.map((item) => {
    const itemSubtotal =
  Number(item.products.price) * item.quantity;

    subtotal += itemSubtotal; // Accumulate subtotal
    let itemDiscount = 0;

const applicableDiscount = item.products.discounts.find(
  (d) => discounts.some((ad) => ad.id === d.id)
);

if (applicableDiscount) {
  if (applicableDiscount.type === "PERCENTAGE") {
    itemDiscount =
      (itemSubtotal * Number(applicableDiscount.value)) / 100;
  }

  if (applicableDiscount.type === "FIXED") {
    itemDiscount = Number(applicableDiscount.value);
  }

  totalDiscount += itemDiscount;
}

    return {
      ...item,
      discount: itemDiscount,
      itemSubtotal, // Add item subtotal for frontend display
    };
  });

  const total = subtotal - totalDiscount;

  return {
    cart_id: cart.id,
    items: enrichedItems,
    subtotal,
    discount: totalDiscount,
    total,
  };
}

  // =====================================================
  // DELETE CART
  // =====================================================
  async deleteCart(id: number): Promise<void> {
    const exists = await prisma.carts.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new ApiError(404, "Cart not found");
    }

    await prisma.carts.delete({
      where: { id },
    });
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

    // Find or create user cart
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

    // Merge items
    for (const guestItem of guestCart.cart_items) {
      const existingItem = userCart.cart_items.find(
        (i) => i.product_id === guestItem.product_id
      );

      if (existingItem) {
        // Increase quantity if product already exists
        await prisma.cart_items.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity + guestItem.quantity,
          },
        });
      } else {
        // Move item to user cart
        await prisma.cart_items.create({
          data: {
            cart_id: userCart.id,
            product_id: guestItem.product_id,
            quantity: guestItem.quantity,
          },
        });
      }
    }

    // Delete guest cart after merge
    await prisma.cart_items.deleteMany({
      where: { cart_id: guestCart.id },
    });

    await prisma.carts.delete({
      where: { id: guestCart.id },
    });
  }
}

export const cartService = new CartService();