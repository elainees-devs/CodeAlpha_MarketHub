import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";

interface CheckoutButtonProps {
  disabled?: boolean;
  className?: string;
  label?: string;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({
  disabled = false,
  className = "",
  label = "Checkout",
}) => {
  const navigate = useNavigate();

  // AUTH STATE
  const user = useAppSelector((state) => state.auth.user);

  const handleCheckout = () => {
    if (disabled) return;

    // NOT LOGGED IN → GO LOGIN
    if (!user) {
      navigate("/login");
      return;
    }

    // LOGGED IN → GO CHECKOUT
    navigate("/checkout");
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={disabled}
      className={`
        px-4 py-2 rounded
        bg-blue-600 text-white
        hover:bg-blue-700
        disabled:bg-gray-400
        disabled:cursor-not-allowed
        transition
        ${className}
      `}
    >
      {label}
    </button>
  );
};

export default CheckoutButton;