import React, { useMemo, useState } from "react";
import type { ApiProduct } from "../../features/products/types";
import { ProductCard } from "./ProductCard";
import { Filter, ArrowUpDown } from "lucide-react";
import Pagination from "./Pagination";

type Props = {
  products: ApiProduct[];
  search: string;
  category: string;
  sort: string;
  setCategory: (value: string) => void;
  setSort: (value: string) => void;
};

const PRODUCTS_PER_PAGE = 8;

const ProductFilters: React.FC<Props> = ({
  products,
  search,
  category,
  sort,
  setCategory,
  setSort,
}) => {
  const [page, setPage] = useState(1);

  // ==============================
  // UNIQUE CATEGORIES
  // ==============================
  const categories = useMemo(() => {
    if (!Array.isArray(products)) return [];

    return Array.from(
      new Set(
        products
          .map((p) => p.category?.name)
          .filter(Boolean)
      )
    );
  }, [products]);

  // ==============================
  // FILTER + SORT
  // ==============================
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    let data = [...products];

    // SEARCH
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter((p) =>
        p.name.toLowerCase().includes(q)
      );
    }

    // CATEGORY
    if (category !== "all") {
      data = data.filter(
        (p) => p.category?.name === category
      );
    }

    // SORT
    switch (sort) {
      case "price_low":
        data.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price_high":
        data.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      default:
        data.sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        );
    }

    return data;
  }, [products, search, category, sort]);

  // ==============================
  // PAGINATION LOGIC
  // ==============================
  const totalPages = Math.ceil(
    filteredProducts.length / PRODUCTS_PER_PAGE
  );

  const safePage = Math.min(page, totalPages || 1);

  const paginatedProducts = filteredProducts.slice(
    (safePage - 1) * PRODUCTS_PER_PAGE,
    safePage * PRODUCTS_PER_PAGE
  );

  return (
    <div className="p-4">

      {/* FILTER BAR */}
      <div className="flex justify-between mb-4">

        {/* CATEGORY */}
        <div className="flex items-center gap-2">
          <Filter size={16} />

          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1); // reset page
            }}
            className="border px-3 py-1 rounded"
          >
            <option value="all">All</option>

            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* SORT */}
        <div className="flex items-center gap-2">
          <ArrowUpDown size={16} />

          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1); // reset page
            }}
            className="border px-3 py-1 rounded"
          >
            <option value="newest">Newest</option>
            <option value="price_low">Low to High</option>
            <option value="price_high">High to Low</option>
          </select>
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No products found
          </p>
        )}
      </div>

      {/* PAGINATION */}
      <Pagination
        currentPage={safePage}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};

export default ProductFilters;