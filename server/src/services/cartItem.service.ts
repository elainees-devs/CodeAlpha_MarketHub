import { prisma, ApiError } from "../utils";
import { ICartItem } from "../types/interfaces.types";
import { mapCartItem, CartItemEntity } from "../mappers";
import {
  CreateCartItemInput,
  UpdateCartItemInput,
  RemoveCartItemInput,
  DeleteCartItemInput,
} from "../schemas";
import { auditLogService } from "./auditLog.service";

class CartItemService {
  // =====================================================
  // ADD ITEM TO CART
  // =====================================================
  async addItem(
  data: CreateCartItemInput,
  changed_by?: number,
  session_id?: string
): Promise<ICartItem> {
  const { cart_id, product_id, quantity } = data;

  // =====================================================
  // GET PRODUCT STOCK
  // =====================================================
  const product = await prisma.products.findUnique({
    where: { id: product_id },
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const existingItem = await prisma.cart_items.findFirst({
    where: { cart_id, product_id },
  });

  // =====================================================
  // CALCULATE TOTAL QUANTITY (IMPORTANT FIX)
  // =====================================================
  const currentQty = existingItem?.quantity ?? 0;
  const newTotal = currentQty + quantity;

  // =====================================================
  // STOCK VALIDATION (THIS FIXES YOUR TEST)
  // =====================================================
  if (newTotal > product.stock) {
    throw new ApiError(400, "Stock limit exceeded");
  }

  // ========================
  // UPDATE EXISTING ITEM
  // ========================
  if (existingItem) {
    const updated = await prisma.cart_items.update({
      where: { id: existingItem.id },
      data: {
        quantity: newTotal,
      },
    });

    await auditLogService.createAuditLog({
      table_name: "cart_items",
      record_id: updated.id,
      action: "UPDATE",
      changed_by,
      session_id,
      old_data: existingItem,
      new_data: updated,
    });

    return mapCartItem(updated as CartItemEntity);
  }

  // ========================
  // CREATE NEW ITEM
  // ========================
  const cartItem = await prisma.cart_items.create({
    data: {
      cart_id,
      product_id,
      quantity,
    },
  });

  await auditLogService.createAuditLog({
    table_name: "cart_items",
    record_id: cartItem.id,
    action: "CREATE",
    changed_by,
    session_id,
    old_data: null,
    new_data: cartItem,
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
    data: UpdateCartItemInput,
    changed_by?: number,
    session_id?: string
  ): Promise<ICartItem> {
    const existing = await prisma.cart_items.findUnique({
      where: { id: item_id },
    });

    if (!existing) {
      throw new ApiError(404, "Cart item not found");
    }

    const updated = await prisma.cart_items.update({
      where: { id: item_id },
      data: {
        quantity: data.quantity,
      },
    });

    await auditLogService.createAuditLog({
      table_name: "cart_items",
      record_id: updated.id,
      action: "UPDATE",
      changed_by,
      session_id,
      old_data: existing,
      new_data: updated,
    });

    return mapCartItem(updated as CartItemEntity);
  }

  // =====================================================
  // REMOVE ITEM (cart_id + product_id)
  // =====================================================
  async removeItem(
    data: RemoveCartItemInput,
    changed_by?: number,
    session_id?: string
  ): Promise<void> {
    const existing = await prisma.cart_items.findFirst({
      where: {
        cart_id: data.cart_id,
        product_id: data.product_id,
      },
    });

    if (!existing) {
      throw new ApiError(404, "Cart item not found");
    }

    await prisma.cart_items.delete({
      where: { id: existing.id },
    });

    await auditLogService.createAuditLog({
      table_name: "cart_items",
      record_id: existing.id,
      action: "DELETE",
      changed_by,
      session_id,
      old_data: existing,
      new_data: null,
    });
  }

  // =====================================================
  // DELETE ITEM BY ID
  // =====================================================
  async deleteItem(
    data: DeleteCartItemInput,
    changed_by?: number,
    session_id?: string
  ): Promise<void> {
    const existing = await prisma.cart_items.findUnique({
      where: { id: data.id },
    });

    if (!existing) {
      throw new ApiError(404, "Cart item not found");
    }

    await prisma.cart_items.delete({
      where: { id: data.id },
    });

    await auditLogService.createAuditLog({
      table_name: "cart_items",
      record_id: data.id,
      action: "DELETE",
      changed_by,
      session_id,
      old_data: existing,
      new_data: null,
    });
  }

  // =====================================================
  // CLEAR CART
  // =====================================================
  async clearCart(cart_id: number): Promise<void> {
    const existingItems = await prisma.cart_items.findMany({
      where: { cart_id },
    });

    await prisma.cart_items.deleteMany({
      where: { cart_id },
    });

    // log each deletion (optional but correct for audit)
    for (const item of existingItems) {
      await auditLogService.createAuditLog({
        table_name: "cart_items",
        record_id: item.id,
        action: "DELETE",
        old_data: item,
        new_data: null,
      });
    }
  }

  // =====================================================
  // GET ITEM BY ID
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