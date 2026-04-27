import React, { useState } from "react";
import ProductFilters from "../components/product/ProductFilters";
import { useProducts } from "../hooks/useProducts";
import Header from "../components/shared/Header";

const ProductsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [category, setCategory] = useState("all");

  const { products, loading, error } = useProducts();

  return (
    <div className="min-h-screen bg-gray-50"> 
        {/* HEADER (REUSABLE) */}
      <Header search={search} onSearchChange={setSearch} />
      <h1 className="text-3xl font-bold text-center mt-8">All Products</h1>

      {/* STATES */}
      {loading && (
        <p className="text-center py-10">Loading products...</p>
      )}

      {error && (
        <p className="text-center py-10 text-red-500">{error}</p>
      )}

      {/* ALL PRODUCTS */}
      {!loading && !error && (
        <ProductFilters
          products={products}
          search={search}
          category={category}
          sort={sort}
          setCategory={setCategory}
          setSort={setSort}
        />
      )}
    </div>
  );
};

export default ProductsPage;