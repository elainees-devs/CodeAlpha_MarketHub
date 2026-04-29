import React, { useState } from "react";
import type { ShipmentFormData } from "../../features/shipment/types";

type Props = {
  onSubmit: (data: ShipmentFormData) => void;
  loading?: boolean;
};

const ShipmentForm: React.FC<Props> = ({
  onSubmit,
  loading = false,
}) => {
  const [form, setForm] = useState<ShipmentFormData>({
    customer_name: "",
    address: "",
    customer_email: "",
    city: "",
    phone: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return; // prevents double submit

    // optional safety check
    if (
      !form.customer_name ||
      !form.address ||
      !form.customer_email
    ) {
      alert("Please fill required fields");
      return;
    }

    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg bg-white p-6 rounded-xl shadow-md space-y-4"
    >
      {/* TITLE */}
      <h4 className="font-bold text-center text-text-heading text-lg">
        Add Shipping Details
      </h4>

      {/* CUSTOMER NAME */}
      <input
        type="text"
        name="customer_name"
        placeholder="Full Names"
        value={form.customer_name}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none"
      />

      {/* ADDRESS */}
      <input
        type="text"
        name="address"
        placeholder="Full Address"
        value={form.address}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none"
      />

      {/* EMAIL */}
      <input
        type="email"
        name="customer_email"
        placeholder="Email"
        value={form.customer_email}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none"
      />

      {/* CITY */}
      <input
        type="text"
        name="city"
        placeholder="City"
        value={form.city}
        onChange={handleChange}
        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none"
      />

      {/* PHONE */}
      <input
        type="text"
        name="phone"
        placeholder="Phone Number"
        value={form.phone}
        onChange={handleChange}
        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none"
      />

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded-md transition text-white ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-black hover:opacity-90"
        }`}
      >
        {loading ? "Saving..." : "Confirm Shipment"}
      </button>
    </form>
  );
};

export default ShipmentForm;