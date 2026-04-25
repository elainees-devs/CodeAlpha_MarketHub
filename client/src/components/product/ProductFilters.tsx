import React, { useMemo, useState } from "react";
import type { ApiProduct } from "../../features/products/types";
import { ProductCard } from "./ProductCard";

type Props = {
  products: ApiProduct[];
  search: string;
  category: string;
  sort: string;
};

const PRODUCTS_PER_PAGE = 8;

const ProductFilters: React.FC<Props> = ({
  products,
  search,
  category,
  sort,
}) => {
  const [page, setPage] = useState(1);

  // ==============================
  // 1. FILTER + SORT LOGIC
  // ==============================
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    let data = [...products];

    if (search.trim()) {
      const query = search.toLowerCase();
      data = data.filter((p) =>
        p.name.toLowerCase().includes(query)
      );
    }

    if (category !== "all") {
      data = data.filter(
        (p) => p.category?.name === category
      );
    }

    switch (sort) {
      case "price_low":
        data.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price_high":
        data.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "newest":
      default:
        data.sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        );
        break;
    }

    return data;
  }, [products, search, category, sort]);

  // ==============================
  // 2. DERIVED PAGINATION STATE
  // ==============================
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  /**
   * ✅ THE FIX:
   * Instead of an Effect, we calculate the 'effective' page.
   * If the current page state is higher than the total pages (e.g., user was on page 5, 
   * but a filter reduced results to 1 page), we default to 1 for the calculation.
   */
  const actualPage = page > totalPages ? 1 : page;

  const paginatedProducts = useMemo(() => {
    const start = (actualPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, actualPage]);

  /**
   * To keep the 'page' state in sync for future clicks, 
   * we update it during render if it's invalid. 
   * React allows this specifically for adjusting state from props.
   */
  if (page > totalPages && totalPages > 0) {
    setPage(1);
  }

  return (
    <div className="p-4">
      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-10">
            No products found
          </div>
        )}
      </div>

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={actualPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                actualPage === i + 1 ? "bg-black text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={actualPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;