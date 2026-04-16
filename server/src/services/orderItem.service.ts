import { prisma } from "../utils";
import { IOrderItem } from "../types/interfaces.types";
import { Decimal } from "@prisma/client/runtime/library";
import { mapOrderItem, OrderItemEntity } from "../mappers";

class OrderItemService {
  // =====================================================
  // CREATE ORDER ITEM
  // =====================================================
  async createOrderItem(data: {
    order_id: number;
    product_id: number;
    quantity: number;
    price: number;
  }): Promise<IOrderItem> {
    const orderItem = await prisma.order_items.create({
      data: {
        order_id: data.order_id,
        product_id: data.product_id,
        quantity: data.quantity,
        price: new Decimal(data.price),
      },
    });

    return mapOrderItem(orderItem as OrderItemEntity);
  }

  // =====================================================
  // GET ORDER ITEM BY ID
  // =====================================================
  async getOrderItemById(id: number): Promise<IOrderItem> {
    const orderItem = await prisma.order_items.findUnique({
      where: { id },
    });

    if (!orderItem) {
      throw new Error("Order item not found");
    }

    return mapOrderItem(orderItem as OrderItemEntity);
  }

  // =====================================================
  // GET ALL ORDER ITEMS
  // =====================================================
  async getAllOrderItems(): Promise<IOrderItem[]> {
    const orderItems = await prisma.order_items.findMany({
      orderBy: { created_at: "desc" },
    });

    return orderItems.map((item) =>
      mapOrderItem(item as OrderItemEntity)
    );
  }

  // =====================================================
  // GET ITEMS BY ORDER ID
  // =====================================================
  async getItemsByOrderId(order_id: number): Promise<IOrderItem[]> {
    const orderItems = await prisma.order_items.findMany({
      where: { order_id },
      orderBy: { created_at: "desc" },
    });

    return orderItems.map((item) =>
      mapOrderItem(item as OrderItemEntity)
    );
  }

  // =====================================================
  // UPDATE ORDER ITEM
  // =====================================================
  async updateOrderItem(
    id: number,
    data: {
      quantity?: number;
      price?: number;
    }
  ): Promise<IOrderItem> {
    const orderItem = await prisma.order_items.update({
      where: { id },
      data: {
        ...(data.quantity !== undefined && { quantity: data.quantity }),
        ...(data.price !== undefined && {
          price: new Decimal(data.price),
        }),
      },
    });

    return mapOrderItem(orderItem as OrderItemEntity);
  }

  // =====================================================
  // SOFT DELETE ORDER ITEM
  // =====================================================
  async deleteOrderItem(id: number): Promise<{ message: string }> {
    await prisma.order_items.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });

    return { message: "Order item deleted successfully" };
  }
}

export const orderItemService = new OrderItemService();