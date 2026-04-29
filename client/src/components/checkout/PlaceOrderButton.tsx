import React from "react";

type Props = {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
};

const PlaceOrderButton: React.FC<Props> = ({
  onClick,
  disabled = false,
  loading = false,
}) => {
  return (
    <button
      onClick={() => {
        if (disabled || loading) return; // prevents accidental clicks
        onClick();
      }}
      disabled={disabled || loading}
      className={`
        w-full py-3 rounded-md font-medium transition
        ${
          disabled || loading
            ? "bg-green-400 cursor-not-allowed opacity-60"
            : "bg-green-600 hover:bg-green-700"
        }
        text-white
      `}
    >
      {loading ? "Processing Order..." : "Place Order"}
    </button>
  );
};

export default PlaceOrderButton;