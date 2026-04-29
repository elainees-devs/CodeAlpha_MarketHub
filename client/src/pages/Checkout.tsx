import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../features/cart/cartSlice";
import type { RootState } from "../app/store";
import { orderApi } from "../services/orderService";
import ShipmentForm from "../components/checkout/ShipmentForm";
import BackButton from "../components/shared/BackButton";
import PlaceOrderButton from "../components/checkout/PlaceOrderButton";
import type { ShipmentFormData } from "../features/shipment/types";

type Step = "review" | "details" | "confirm";

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart.items);

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>("review");

  const [shipmentData, setShipmentData] = useState<ShipmentFormData | null>(null);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const shipping = subtotal > 0 ? 5 : 0;
  const total = subtotal + shipping;

  // ==============================
  // PLACE ORDER
  // ==============================
  const handlePlaceOrder = async () => {
    try {
      setLoading(true);

      if (!shipmentData) {
        alert("Missing shipping details");
        return;
      }

      const response = await orderApi.placeOrder({
        shipping_address: shipmentData.address,
        phone: shipmentData.phone,
        customer_name: shipmentData.customer_name,
        customer_email: shipmentData.customer_email,
        city: shipmentData.city,

        cartItems: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      dispatch(clearCart());

      const orderId = response?.data?.id;

      if (!orderId) {
        throw new Error("Order ID not returned from server");
      }

      navigate(`/order-success/${orderId}`);
    } catch (error) {
      console.error(error);
      alert("Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return <p className="p-6">Your cart is empty</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <BackButton />
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {/* ===================== */}
      {/* STEPS */}
      {/* ===================== */}
      <div className="flex gap-6 border-b mb-6">
        <button
          onClick={() => setStep("review")}
          className={step === "review" ? "font-bold" : ""}
        >
          1. Review
        </button>

        <button
          onClick={() => setStep("details")}
          className={step === "details" ? "font-bold" : ""}
        >
          2. Details
        </button>

        <button
          onClick={() => {
            if (!shipmentData) {
              alert("Fill shipping details first");
              return;
            }
            setStep("confirm");
          }}
          className={step === "confirm" ? "font-bold" : ""}
        >
          3. Confirm
        </button>
      </div>

      {/* ===================== */}
      {/* REVIEW */}
      {/* ===================== */}
      {step === "review" && (
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between border p-4">
              <div>
                <h2>{item.name}</h2>
                <p>Qty: {item.quantity}</p>
              </div>
              <div>KES {(item.price * item.quantity).toLocaleString()}</div>
            </div>
          ))}

          <button
            onClick={() => setStep("details")}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Continue
          </button>
        </div>
      )}

      {/* ===================== */}
      {/* DETAILS */}
      {/* ===================== */}
      {step === "details" && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Shipping Details</h2>

          <ShipmentForm
            onSubmit={(data) => setShipmentData(data)}
            loading={loading}
          />

          <button
            onClick={() => {
              if (!shipmentData) {
                alert("Please fill shipping form first");
                return;
              }
              setStep("confirm");
            }}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Continue
          </button>
        </div>
      )}

      {/* ===================== */}
      {/* CONFIRM */}
      {/* ===================== */}
      {step === "confirm" && (
        <div className="border p-4 space-y-3">
          <h2 className="text-lg font-semibold">Order Summary</h2>

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>KES {subtotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>KES {shipping}</span>
          </div>

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>KES {total.toLocaleString()}</span>
          </div>

          <PlaceOrderButton
            onClick={handlePlaceOrder}
            loading={loading}
            disabled={loading}
          />
        </div>
      )}
    </div>
  );
};

export default Checkout;
