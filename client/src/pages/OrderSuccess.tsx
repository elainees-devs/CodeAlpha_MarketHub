import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { orderApi, type Order } from "../services/orderService";
import HomeButton from "../components/shared/HomeButton";
import { useAppDispatch } from "../app/hooks";
import { logout } from "../features/auth/authSlice";

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
// NORMALIZER
// ==============================
const normalizeOrderItems = (items: unknown): RawOrderItem[] => {
  if (!items) return [];

  if (isOrderItemArray(items)) {
    return items;
  }

  if (typeof items === "object") {
    return [items as RawOrderItem];
  }

  return [];
};

const OrderSuccess: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ==============================
  // LOGOUT
  // ==============================
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

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
    <div className="min-h-screen flex items-center justify-center p-6 relative">

      {/* LOGOUT LINK (TOP RIGHT) */}
      <button
        onClick={handleLogout}
        className="absolute top-4 right-6 flex items-center gap-2 text-red-600 hover:text-red-700 transition"
      >
        <LogOut size={18} />
        Logout
      </button>

      <div className="w-full max-w-5xl text-center">
        <h1 className="text-2xl font-bold text-green-600">
          Order Successful 🎉
        </h1>

        <p className="mt-2">Order ID: #{order.id}</p>
        <p>Status: {order.status}</p>
        <p>Total: KES {order.total.toLocaleString()}</p>

        <h2 className="mt-4 font-semibold">Items</h2>

        <ul className="mt-2 space-y-2 text-center">
          {items.length === 0 ? (
            <p className="text-gray-500">No items found</p>
          ) : (
            items.map((item) => (
              <li
                key={item.id ?? item.product_id}
                className="border p-3 rounded flex items-center justify-between"
              >
                <div>
                  Product ID: {item.product_id} × {item.quantity} — KES{" "}
                  {item.price.toLocaleString()}
                </div>

                <Link
                  to="/products"
                  className="ml-4 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  View Products
                </Link>
              </li>
            ))
          )}
        </ul>

        <HomeButton to="/" label="Back to Home" />
      </div>
    </div>
  );
};

export default OrderSuccess;