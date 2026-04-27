import React, { useState } from "react";
import ProductFilters from "../components/product/ProductFilters";
import { useProducts } from "../hooks/useProducts";
import SearchBar from "../components/shared/Searchbar";

const ProductsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [category, setCategory] = useState("all");

  const { products, loading, error } = useProducts();

  return (
    <div className="min-h-screen bg-gray-50"> 
      <SearchBar value={search} onChange={setSearch} className="max-w-2xl mx-auto py-6" />

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