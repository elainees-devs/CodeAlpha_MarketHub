import React from "react";
import { useNavigate } from "react-router-dom";

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

  const handleCheckout = () => {
    if (disabled) return;
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