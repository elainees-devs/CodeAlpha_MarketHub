import { apiClient } from "./apiClient";

// ==============================
// TYPES
// ==============================

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
};

// payloads
export type CreateOrderPayload = {
  cartId?: string;
};

export type UpdateOrderPayload = {
  status?: Order["status"];
  items?: OrderItem[];
};

// ==============================
// ORDER API CLASS
// ==============================

class OrderApi {
  // GET ORDER BY ID
  async getOrderById(id: string): Promise<Order> {
    const res = await apiClient.get(`/orders/${id}`);
    return res.data;
  }

  // GET USER ORDERS
  async getUserOrders(userId: string) {
    const res = await apiClient.get(`/orders/user/${userId}`);
    return res.data;
  }

  // CREATE BASE ORDER
  async createBaseOrder(data: CreateOrderPayload) {
    const res = await apiClient.post("/orders", data);
    return res.data;
  }

  // PLACE ORDER (CHECKOUT)
  async placeOrder(data: CreateOrderPayload) {
    const res = await apiClient.post("/orders/checkout", data);
    return res.data;
  }

  // UPDATE ORDER (ADMIN / STAFF)
  async updateOrder(id: string, data: UpdateOrderPayload) {
    const res = await apiClient.patch(`/orders/${id}`, data);
    return res.data;
  }

  // CANCEL ORDER
  async cancelOrder(id: string) {
    const res = await apiClient.patch(`/orders/${id}/cancel`);
    return res.data;
  }

  // DELETE ORDER (ADMIN ONLY)
  async deleteOrder(id: string) {
    const res = await apiClient.delete(`/orders/${id}`);
    return res.data;
  }
}

// ==============================
// EXPORT SINGLE INSTANCE
// ==============================

export const orderApi = new OrderApi();