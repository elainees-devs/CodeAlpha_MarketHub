import { prisma, ApiError } from "../utils";
import { ICartItem } from "../types/interfaces.types";
import { mapCartItem, CartItemEntity } from "../mappers";
import {
  CreateCartItemInput,
  UpdateCartItemInput,
} from "../schemas";

class CartItemService {
  // =====================================================
  // ADD ITEM TO CART
  // =====================================================
  async addItem(data: CreateCartItemInput): Promise<ICartItem> {
    const { cart_id, product_id, quantity } = data;

    const existingItem = await prisma.cart_items.findFirst({
      where: {
        cart_id: cart_id ?? undefined,
        product_id,
      },
    });

    if (existingItem) {
      const updated = await prisma.cart_items.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      });

      return mapCartItem(updated as CartItemEntity);
    }

    const cartItem = await prisma.cart_items.create({
      data: {
        cart_id: cart_id ?? null,
        product_id,
        quantity,
      },
    });

    return mapCartItem(cartItem as CartItemEntity);
  }

  // =====================================================
  // GET ALL ITEMS IN CART
  // =====================================================
  async getCartItems(cart_id: number): Promise<ICartItem[]> {
    const items = await prisma.cart_items.findMany({
      where: { cart_id },
      orderBy: { created_at: "desc" },
    });

    return items.map((item) => mapCartItem(item as CartItemEntity));
  }

  // =====================================================
  // UPDATE ITEM QUANTITY
  // =====================================================
  async updateQuantity(
    item_id: number,
    data: UpdateCartItemInput
  ): Promise<ICartItem> {
    const { quantity } = data;

    const existing = await prisma.cart_items.findUnique({
      where: { id: item_id },
    });

    if (!existing) {
      throw new ApiError(404, "Cart item not found");
    }

    const updated = await prisma.cart_items.update({
      where: { id: item_id },
      data: { quantity },
    });

    return mapCartItem(updated as CartItemEntity);
  }

  // =====================================================
  // REMOVE ITEM FROM CART
  // =====================================================
  async removeItem(item_id: number): Promise<void> {
    const existing = await prisma.cart_items.findUnique({
      where: { id: item_id },
    });

    if (!existing) {
      throw new ApiError(404, "Cart item not found");
    }

    await prisma.cart_items.delete({
      where: { id: item_id },
    });
  }

  // =====================================================
  // CLEAR CART ITEMS BY CART ID
  // =====================================================
  async clearCart(cart_id: number): Promise<void> {
    await prisma.cart_items.deleteMany({
      where: { cart_id },
    });
  }

  // =====================================================
  // GET CART ITEM BY ID
  // =====================================================
  async getCartItemById(item_id: number): Promise<ICartItem | null> {
    const item = await prisma.cart_items.findUnique({
      where: { id: item_id },
    });

    if (!item) return null;

    return mapCartItem(item as CartItemEntity);
  }
}

export const cartItemService = new CartItemService();