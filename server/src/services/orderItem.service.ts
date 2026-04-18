import { prisma, ApiError } from "../utils";
import { Decimal } from "@prisma/client/runtime/library";
import { 
  OrderItemResponse, 
  CreateOrderItemInput, 
  UpdateOrderItemInput 
} from "../schemas/orderItem.schema";
import { mapOrderItem, OrderItemEntity } from "../mappers";

class OrderItemService {
  // =====================================================
  // CREATE ORDER ITEM
  // =====================================================
  async createOrderItem(data: CreateOrderItemInput): Promise<OrderItemResponse> {
    const orderItem = await prisma.order_items.create({
      data: {
        order_id: data.order_id ?? 0, // Fallback if order_id is optional in schema
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
  async getOrderItemById(id: number): Promise<OrderItemResponse> {
    const orderItem = await prisma.order_items.findUnique({
      where: { id },
    });

    if (!orderItem) {
      throw new ApiError(404, "Order item not found");
    }

    return mapOrderItem(orderItem as OrderItemEntity);
  }

  // =====================================================
  // GET ALL ORDER ITEMS
  // =====================================================
  async getAllOrderItems(): Promise<OrderItemResponse[]> {
    const orderItems = await prisma.order_items.findMany({
      where: { deleted_at: null },
      orderBy: { created_at: "desc" },
    });

    return orderItems.map((item) => mapOrderItem(item as OrderItemEntity));
  }

  // =====================================================
  // GET ITEMS BY ORDER ID
  // =====================================================
  async getItemsByOrderId(order_id: number): Promise<OrderItemResponse[]> {
    const orderItems = await prisma.order_items.findMany({
      where: { 
        order_id,
        deleted_at: null 
      },
      orderBy: { created_at: "desc" },
    });

    return orderItems.map((item) => mapOrderItem(item as OrderItemEntity));
  }

  // =====================================================
  // UPDATE ORDER ITEM
  // =====================================================
  async updateOrderItem(
    id: number,
    data: UpdateOrderItemInput
  ): Promise<OrderItemResponse> {
    const exists = await prisma.order_items.findUnique({ where: { id } });

    if (!exists) {
      throw new ApiError(404, "Order item not found");
    }

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
    const exists = await prisma.order_items.findUnique({ where: { id } });

    if (!exists) {
      throw new ApiError(404, "Order item not found");
    }

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