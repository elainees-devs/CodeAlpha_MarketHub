import React, { useState } from "react";
import ProductFilters from "../components/product/ProductFilters";
import { useProducts } from "../hooks/useProducts";
import Header from "../components/shared/Header";

const Home: React.FC = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [category, setCategory] = useState("all");

  const { products, loading, error } = useProducts();

  // LIMIT TO 8 PRODUCTS ONLY
  const featuredProducts = products.slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* HEADER (REUSABLE) */}
      <Header search={search} onSearchChange={setSearch} />

      {/* HERO */}
      <section className="bg-black text-white text-center py-20">
        <h1 className="text-4xl font-bold">Shop Smart, Shop Fast</h1>
        <p className="mt-2 text-gray-300">
          Discover amazing products at great prices
        </p>
      </section>

      {/* STATES */}
      {loading && (
        <p className="text-center py-10 text-gray-600">
          Loading products...
        </p>
      )}

      {error && (
        <p className="text-center py-10 text-red-500">{error}</p>
      )}

      {/* PRODUCTS */}
      {!loading && !error && featuredProducts.length > 0 && (
        <>
          <ProductFilters
            products={featuredProducts}
            search={search}
            category={category}
            sort={sort}
            setCategory={setCategory}
            setSort={setSort}
          />

          {/* VIEW ALL */}
          <div className="flex justify-center mt-6 mb-10">
            <a
              href="/products"
              className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              View All Products
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;