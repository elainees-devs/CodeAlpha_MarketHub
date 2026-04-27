import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { clearCart } from "../features/cart/cartSlice";
import type { RootState } from "../app/store";

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux cart state
  const cart = useSelector((state: RootState) => state.cart.items);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const shipping = subtotal > 0 ? 5 : 0;
  const total = subtotal + shipping;

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;

    // Clear Redux cart
    dispatch(clearCart());

    alert("Order placed successfully!");

    navigate("/");
  };

  const handleBack = () => {
    navigate("/cart");
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {cart.length === 0 ? (
        <div className="text-gray-600">
          Your cart is empty.
          <div className="mt-4">
            <button
              onClick={() => navigate("/products")}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {/* CART ITEMS */}
          <div className="md:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between border p-4 rounded"
              >
                <div>
                  <h2 className="font-medium">{item.name}</h2>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>

                <div className="font-semibold">
                  KES {(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* SUMMARY */}
          <div className="border p-4 rounded h-fit">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>KES {subtotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>KES {shipping.toLocaleString()}</span>
            </div>

            <hr className="my-3" />

            <div className="flex justify-between font-bold mb-4">
              <span>Total</span>
              <span>KES {total.toLocaleString()}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="w-full bg-green-600 text-white py-2 rounded mb-2"
            >
              Place Order
            </button>

            <button onClick={handleBack} className="w-full border py-2 rounded">
              Back to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
