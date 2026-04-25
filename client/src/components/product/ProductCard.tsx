import React from "react";
import type { ApiProduct } from "../../features/products/types";

// ==============================
// PRODUCT CARD
// ==============================
export const ProductCard: React.FC<{ product: ApiProduct }> = ({ product }) => {
  const mainImage =
    product.product_images?.find((img) => img.is_main)?.image_url ||
    product.product_images?.[0]?.image_url ||
    "https://via.placeholder.com/300";

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden group">
      {/* ============================== */}
      {/* IMAGE */}
      {/* ============================== */}
      <div className="h-48 overflow-hidden bg-gray-100">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://via.placeholder.com/300";
          }}
        />
      </div>

      {/* ============================== */}
      {/* CONTENT */}
      {/* ============================== */}
      <div className="p-4 space-y-1">
        <h3 className="font-semibold text-gray-800 line-clamp-1">
          {product.name}
        </h3>

        {/* ============================== */}
        {/* CATEGORY DISPLAY */}
        {/* ============================== */}
        <p className="text-sm text-gray-500">
          {product.category.name || "Uncategorized"}
          {product.subcategory?.name ? ` • ${product.subcategory.name}` : ""}
        </p>

        {/* ============================== */}
        {/* STOCK BADGES */}
        {/* ============================== */}
        <div className="flex items-center gap-2 mt-1">
          {product.stock > 20 && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              In Stock
            </span>
          )}

          {product.stock <= 20 && product.stock > 5 && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              Available
            </span>
          )}

          {product.stock <= 5 && product.stock > 0 && (
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
              Low Stock
            </span>
          )}

          {product.stock === 0 && (
            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
              Out of Stock
            </span>
          )}
        </div>

        {/* ============================== */}
        {/* PRICE + ACTION */}
        {/* ============================== */}
        <div className="flex items-center justify-between mt-3">
          <span className="font-bold text-gray-900">
            KSh {(Number(product.price) || 0).toLocaleString()}
          </span>

          <button
            className="bg-black text-white px-3 py-1 rounded-lg text-sm hover:bg-gray-800 transition"
            onClick={() => console.log("Add to cart:", product.id)}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
