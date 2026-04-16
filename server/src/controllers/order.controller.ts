import { prisma, ApiError, generateUUID } from "../utils";
import { IOrder } from "../types/interfaces.types";
import { mapOrder, OrderEntity } from "../mappers";
import { order_status } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { generateShortId } from "../utils/generateId";

class OrderService {
  // =====================================================
  // GET ORDER BY ID
  // =====================================================
  async getOrderById(id: number): Promise<IOrder> {
    const order = await prisma.orders.findUnique({
      where: { id },
    });

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    return mapOrder(order as OrderEntity);
  }

  // =====================================================
  // GET USER ORDERS
  // =====================================================
  async getUserOrders(user_id: number): Promise<IOrder[]> {
    const orders = await prisma.orders.findMany({
      where: { user_id },
      orderBy: { created_at: "desc" },
    });

    return orders.map((order) => mapOrder(order as OrderEntity));
  }

  // =====================================================
  // CREATE BASE ORDER
  // =====================================================
  async createBaseOrder(data: {
    user_id: number;
    total: Decimal;
    status?: order_status;
    shipping_address?: string;
    phone?: string;
    customer_name?: string;
    customer_email?: string;
  }): Promise<IOrder> {
    const order = await prisma.orders.create({
      data: {
        user_id: data.user_id,
        total: data.total,
        status: data.status ?? order_status.PENDING,
        shipping_address: data.shipping_address ?? null,
        phone: data.phone ?? null,
        customer_name: data.customer_name ?? null,
        customer_email: data.customer_email ?? null,

        // ✅ NEW IDS
        uuid: generateUUID(),
        order_ref: generateShortId(10),
      },
    });

    return mapOrder(order as OrderEntity);
  }

  // =====================================================
  // UPDATE ORDER STATUS
  // =====================================================
  async updateOrderStatus(id: number, status: order_status): Promise<IOrder> {
    const exists = await prisma.orders.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new ApiError(404, "Order not found");
    }

    const order = await prisma.orders.update({
      where: { id },
      data: { status },
    });

    return mapOrder(order as OrderEntity);
  }

  // =====================================================
  // CANCEL ORDER
  // =====================================================
  async cancelOrder(id: number): Promise<IOrder> {
    const order = await prisma.orders.findUnique({
      where: { id },
    });

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    if (
      order.status === order_status.SHIPPED ||
      order.status === order_status.DELIVERED
    ) {
      throw new ApiError(
        400,
        "Cannot cancel an order that has already been shipped or delivered"
      );
    }

    if (order.status === order_status.CANCELLED) {
      throw new ApiError(400, "Order is already cancelled");
    }

    const updatedOrder = await prisma.orders.update({
      where: { id },
      data: {
        status: order_status.CANCELLED,
      },
    });

    return mapOrder(updatedOrder as OrderEntity);
  }

  // =====================================================
  // DELETE ORDER
  // =====================================================
  async deleteOrder(id: number): Promise<void> {
    const exists = await prisma.orders.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new ApiError(404, "Order not found");
    }

    await prisma.orders.delete({
      where: { id },
    });
  }

  // =====================================================
  // PLACE ORDER (CHECKOUT)
  // =====================================================
  async placeOrder(data: {
    user_id: number;
    shipping_address?: string;
    phone?: string;
    customer_name?: string;
    customer_email?: string;
  }): Promise<IOrder> {
    return await prisma.$transaction(async (tx) => {
      const cart = await tx.carts.findFirst({
        where: { user_id: data.user_id },
        include: { cart_items: true },
      });

      if (!cart || cart.cart_items.length === 0) {
        throw new ApiError(400, "Cart is empty");
      }

      const productIds = cart.cart_items.map((item) => item.product_id);

      const products = await tx.products.findMany({
        where: { id: { in: productIds } },
      });

      const productMap = new Map(products.map((p) => [p.id, p]));

      let total = new Decimal(0);
      const orderItemsData = [];

      for (const item of cart.cart_items) {
        const product = productMap.get(item.product_id);

        if (!product) {
          throw new ApiError(404, "Product not found");
        }

        if (product.stock < item.quantity) {
          throw new ApiError(
            400,
            `Insufficient stock for product ${product.id}`
          );
        }

        const price = new Decimal(product.price);
        const subtotal = price.mul(item.quantity);

        total = total.add(subtotal);

        await tx.products.update({
          where: { id: product.id },
          data: {
            stock: { decrement: item.quantity },
          },
        });

        orderItemsData.push({
          product_id: item.product_id,
          quantity: item.quantity,
          price: product.price,
        });
      }

      // CREATE ORDER WITH IDS
      const order = await tx.orders.create({
        data: {
          user_id: data.user_id,
          total,
          status: order_status.PENDING,
          shipping_address: data.shipping_address ?? null,
          phone: data.phone ?? null,
          customer_name: data.customer_name ?? null,
          customer_email: data.customer_email ?? null,

          uuid: generateUUID(),
          order_ref: generateShortId(10),
        },
      });

      await tx.order_items.createMany({
        data: orderItemsData.map((item) => ({
          ...item,
          order_id: order.id,
        })),
      });

      await tx.cart_items.deleteMany({
        where: { cart_id: cart.id },
      });

      return mapOrder(order as OrderEntity);
    });
  }
}

export const orderService = new OrderService();