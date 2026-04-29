import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { orderApi, type Order } from "../services/orderService";

// ==============================
// SAFE NORMALIZER TYPE
// ==============================
type RawOrderItem = {
  id?: number;
  order_id?: number;
  product_id: number;
  quantity: number;
  price: number;
};

// ==============================
// TYPE GUARD
// ==============================
const isOrderItemArray = (data: unknown): data is RawOrderItem[] => {
  return Array.isArray(data);
};

// ==============================
// NORMALIZER (NO ANY)
// ==============================
const normalizeOrderItems = (items: unknown): RawOrderItem[] => {
  if (!items) return [];

  if (isOrderItemArray(items)) {
    return items;
  }

  // single object fallback (backend inconsistency safe handling)
  if (typeof items === "object") {
    return [items as RawOrderItem];
  }

  return [];
};

const OrderSuccess: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ==============================
  // FETCH ORDER
  // ==============================
  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);

        const data = await orderApi.getOrderById(id);

        console.log("ORDER API RESPONSE:", data);

        setOrder(data);
      } catch {
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  // ==============================
  // GUARDS
  // ==============================
  if (!id) return <p className="p-6 text-red-500">Invalid order ID</p>;
  if (loading) return <p className="p-6">Loading order...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!order) return <p className="p-6">Order not found</p>;

  const items = normalizeOrderItems(order.order_items);

 return (
  <div className="min-h-screen flex items-center justify-center p-6">
    <div className="w-full max-w-5xl text-center">
      <h1 className="text-2xl font-bold text-green-600">
        Order Successful 🎉
      </h1>

      <p className="mt-2">Order ID: #{order.id}</p>
      <p>Status: {order.status}</p>
      <p>Total: KES {order.totalAmount}</p>

      <h2 className="mt-4 font-semibold">Items</h2>

      <ul className="mt-2 space-y-2 text-center">
        {items.length === 0 ? (
          <p className="text-gray-500">No items found</p>
        ) : (
          items.map((item) => (
            <li
              key={item.id ?? item.product_id}
              className="border p-2 rounded"
            >
              Product ID: {item.product_id} × {item.quantity} — KES{" "}
              {item.price.toLocaleString()}
            </li>
          ))
        )}
      </ul>
    </div>
  </div>
);
};

export default OrderSuccess;