import { apiClient } from "./apiClient";

// ==============================
// TYPES
// ==============================

// ==============================
// ORDER ITEM TYPE
// ==============================

export type OrderItem = {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  created_at?: string;
  deleted_at?: string | null;
};

// ==============================
// ORDER TYPE
// ==============================

export type Order = {
  id: string;
  userId: string;
  total: number;

  status:
    | "pending"
    | "paid"
    | "shipped"
    | "delivered"
    | "cancelled";

  createdAt: string;

  order_items: OrderItem[];
};

// PAYLOAD TYPES
export type CreateOrderPayload = {
  shipping_address: string;
  phone: string;
  customer_name: string;
  customer_email: string;
  city: string; 

  cartItems: {
    product_id: number;
    quantity: number;
    price: number;
  }[];
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
    return res.data.data;
  }

  // GET USER ORDERS
  async getUserOrders(userId: string) {
    const res = await apiClient.get(`/orders/user/${userId}`);
    return res.data.data;
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