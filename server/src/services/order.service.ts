import { prisma, ApiError } from "../utils";
import { order_status } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

import {
  OrderResponse,
  CreateOrderInput,
  UpdateOrderInput,
} from "../schemas/order.schema";

import { mapOrder, OrderEntity } from "../mappers/order.mapper";
import { auditLogService } from "./auditLog.service";

class OrderService {
  // =====================================================
  // GET ORDER BY ID
  // =====================================================
  async getOrderById(id: number): Promise<OrderResponse> {
  if (!id || isNaN(id)) {
    throw new ApiError(400, "Valid Order ID is required");
  }

  const order = await prisma.orders.findUnique({
    where: {
      id,
    },
    include: {
      order_items: {
        include: {
          products: true,
        },
      },
    },
  });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return mapOrder(order as OrderEntity);
}
  // =====================================================
  // GET USER ORDERS
  // =====================================================
  async getUserOrders(
    user_id: number,
    page = 1,
    limit = 10
  ): Promise<{
    data: OrderResponse[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.orders.findMany({
        where: { user_id },
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
        include: { order_items: true },
      }),
      prisma.orders.count({ where: { user_id } }),
    ]);

    return {
      data: orders.map((o) => mapOrder(o as OrderEntity)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // =====================================================
  // CREATE BASE ORDER
  // =====================================================
  async createBaseOrder(
    data: {
      user_id?: number;
      total: Decimal;
      status?: order_status;
      shipping_address?: string;
      phone?: string;
      customer_name?: string;
      customer_email?: string;
    },
    changed_by?: number,
    session_id?: string
  ): Promise<OrderResponse> {
    const order = await prisma.orders.create({
      data: {
        user_id: data.user_id ?? null,
        total: data.total,
        status: data.status ?? order_status.PENDING,
        shipping_address: data.shipping_address ?? null,
        phone: data.phone ?? null,
        customer_name: data.customer_name ?? null,
        customer_email: data.customer_email ?? null,
      },
      include: { order_items: true },
    });

    await auditLogService.createAuditLog({
      table_name: "orders",
      record_id: order.id,
      action: "CREATE",
      changed_by,
      session_id,
      old_data: null,
      new_data: order,
    });

    return mapOrder(order as OrderEntity);
  }

  // =====================================================
  // UPDATE ORDER
  // =====================================================
  async updateOrder(
    id: number,
    data: UpdateOrderInput,
    changed_by?: number,
    session_id?: string
  ): Promise<OrderResponse> {
    const exists = await prisma.orders.findUnique({ where: { id } });

    if (!exists) {
      throw new ApiError(404, "Order not found");
    }

    const order = await prisma.orders.update({
      where: { id },
      data: {
        ...(data.status && { status: data.status as order_status }),
        ...(data.shipping_address !== undefined && {
          shipping_address: data.shipping_address,
        }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.customer_name !== undefined && {
          customer_name: data.customer_name,
        }),
        ...(data.customer_email !== undefined && {
          customer_email: data.customer_email,
        }),
      },
      include: { order_items: true },
    });

    await auditLogService.createAuditLog({
      table_name: "orders",
      record_id: id,
      action: "UPDATE",
      changed_by,
      session_id,
      old_data: exists,
      new_data: order,
    });

    return mapOrder(order as OrderEntity);
  }

  // =====================================================
  // CANCEL ORDER
  // =====================================================
  async cancelOrder(
    id: number,
    changed_by?: number,
    session_id?: string
  ): Promise<OrderResponse> {
    const order = await prisma.orders.findUnique({ where: { id } });

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    if (
      order.status === order_status.SHIPPED ||
      order.status === order_status.DELIVERED
    ) {
      throw new ApiError(400, "Cannot cancel shipped/delivered order");
    }

    const updated = await prisma.orders.update({
      where: { id },
      data: { status: order_status.CANCELLED },
      include: { order_items: true },
    });

    await auditLogService.createAuditLog({
      table_name: "orders",
      record_id: id,
      action: "UPDATE",
      changed_by,
      session_id,
      old_data: order,
      new_data: updated,
    });

    return mapOrder(updated as OrderEntity);
  }

  // =====================================================
  // DELETE ORDER
  // =====================================================
  async deleteOrder(
    id: number,
    changed_by?: number,
    session_id?: string
  ): Promise<void> {
    const exists = await prisma.orders.findUnique({ where: { id } });

    if (!exists) {
      throw new ApiError(404, "Order not found");
    }

    await prisma.orders.delete({ where: { id } });

    await auditLogService.createAuditLog({
      table_name: "orders",
      record_id: id,
      action: "DELETE",
      changed_by,
      session_id,
      old_data: exists,
      new_data: null,
    });
  }

  // =====================================================
  // PLACE ORDER (CHECKOUT)
  // =====================================================
 async placeOrder(data: CreateOrderInput): Promise<OrderResponse> {
  return prisma.$transaction(async (tx) => {

    const cartItems = data.cartItems;

    // ==============================
    // VALIDATION
    // ==============================
    if (!cartItems || cartItems.length === 0) {
      throw new ApiError(400, "Cart is empty");
    }

    // ==============================
    // FETCH PRODUCTS
    // ==============================
    const productIds = cartItems.map((i) => i.product_id);

    const products = await tx.products.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    let total = new Decimal(0);

    const orderItems: {
      product_id: number;
      quantity: number;
      price: Decimal;
    }[] = [];

    // ==============================
    // PROCESS CART ITEMS
    // ==============================
    for (const item of cartItems) {
      const product = productMap.get(item.product_id);

      if (!product) {
        throw new ApiError(404, `Product ${item.product_id} not found`);
      }

      if (product.stock < item.quantity) {
        throw new ApiError(
          400,
          `Insufficient stock for ${product.name}`
        );
      }

      const price = new Decimal(product.price);
      total = total.add(price.mul(item.quantity));

      // decrement stock
      await tx.products.update({
        where: { id: product.id },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });

      orderItems.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // ==============================
    // CREATE ORDER
    // ==============================
    const order = await tx.orders.create({
      data: {
        user_id: data.user_id ?? null,
        total,
        status: order_status.PENDING,
        shipping_address: data.shipping_address ?? null,
        phone: data.phone ?? null,
        customer_name: data.customer_name ?? null,
        customer_email: data.customer_email ?? null,
      },
    });

    // ==============================
    // CREATE ORDER ITEMS
    // ==============================
    await tx.order_items.createMany({
      data: orderItems.map((i) => ({
        ...i,
        order_id: order.id,
      })),
    });

    // ==============================
    // OPTIONAL: CLEAN DB CART (safe fallback)
    // ==============================
    if (data.user_id) {
      const cart = await tx.carts.findFirst({
        where: { user_id: data.user_id },
      });

      if (cart) {
        await tx.cart_items.deleteMany({
          where: { cart_id: cart.id },
        });
      }
    }

    // ==============================
    // FINAL ORDER FETCH
    // ==============================
    const finalOrder = await tx.orders.findUnique({
      where: { id: order.id },
      include: { order_items: true },
    })

    return mapOrder(finalOrder as OrderEntity);
  });
}
}

export const orderService = new OrderService();