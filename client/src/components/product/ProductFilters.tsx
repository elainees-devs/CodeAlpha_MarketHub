// src/components/product/ProductFilters.tsx
import React, { useMemo } from "react";
import type { Product } from "../../features/products/types";
import { ProductCard } from "./ProductCard";

type Props = {
  products: Product[];
  search: string;
  category: string;
  sort: string;
};

const ProductFilters: React.FC<Props> = ({
  products,
  search,
  category,
  sort,
}) => {
  // ==============================
  // FILTER + SEARCH + SORT
  // ==============================
  const filteredProducts = useMemo(() => {
    let data = [...products];

    // SEARCH
    if (search.trim()) {
      data = data.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // CATEGORY
    if (category !== "all") {
      data = data.filter((p) => p.categories === category);
    }

    // SORT
    switch (sort) {
      case "price_low":
        data.sort((a, b) => a.price - b.price);
        break;

      case "price_high":
        data.sort((a, b) => b.price - a.price);
        break;

      case "newest":
      default:
        data.sort(
          (a, b) =>
            new Date(b.createdAt ?? 0).getTime() -
            new Date(a.createdAt ?? 0).getTime()
        );
    }

    return data;
  }, [products, search, category, sort]);

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductFilters;