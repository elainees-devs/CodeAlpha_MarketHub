import React, { useEffect, useState } from "react";
import {
  Search,
  ShoppingCart,
  User,
  LogIn,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import ProductFilters from "../components/product/ProductFilters";
import { productApi } from "../services/productService";
import type { ApiProduct } from "../features/products/types";
import { useAppSelector } from "../app/hooks";



const Home: React.FC = () => {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<string>("newest");
  const [category, setCategory] = useState<string>("all");

  // ==============================
  // REDUX CART STATE (REAL)
  // ==============================
  const cartItems = useAppSelector((state) => state.cart.items);

  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // ==============================
  // FETCH PRODUCTS
  // ==============================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productApi.getAll();
        console.log("Raw API Products:", res);
        setProducts(res);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ============================== */}
      {/* HEADER */}
      {/* ============================== */}
      <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-50">

        {/* LOGO */}
        <Link to="/" className="font-bold text-xl">
          ShopX
        </Link>

        {/* SEARCH */}
        <div className="flex-1 mx-4 hidden md:block relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>

        {/* AUTH + CART */}
        <div className="flex items-center gap-4">

          <button className="flex items-center gap-1">
            <LogIn size={16} /> Login
          </button>

          <button className="flex items-center gap-1">
            <User size={16} /> Register
          </button>

          {/* CART (Redux-powered badge) */}
          <Link to="/cart" className="relative">
            <ShoppingCart />

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

        </div>
      </header>

      {/* ============================== */}
      {/* HERO */}
      {/* ============================== */}
      <section className="bg-black text-white text-center py-20">
        <h1 className="text-4xl font-bold">Shop Smart, Shop Fast</h1>
        <p className="mt-2 text-gray-300">
          Discover amazing products at great prices
        </p>
      </section>

      {/* ============================== */}
      {/* FILTERS */}
      {/* ============================== */}
      <section className="p-4 flex justify-between">

        <div className="flex items-center gap-2">
          <Filter size={16} />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border px-3 py-1 rounded"
          >
            <option value="all">All</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown size={16} />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border px-3 py-1 rounded"
          >
            <option value="newest">Newest</option>
            <option value="price_low">Low to High</option>
            <option value="price_high">High to Low</option>
          </select>
        </div>

      </section>

      {/* ============================== */}
      {/* PRODUCTS */}
      {/* ============================== */}
      <ProductFilters
        products={products}
        search={search}
        category={category}
        sort={sort}
      />

    </div>
  );
};

export default Home;