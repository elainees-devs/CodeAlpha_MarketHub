import React, { useState } from "react";
import { ShoppingCart, User, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import ProductFilters from "../components/product/ProductFilters";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/auth/authSlice";
import Searchbar from "../components/shared/Searchbar";
import { useProducts } from "../hooks/useProducts";

const Home: React.FC = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [category, setCategory] = useState("all");

  const dispatch = useAppDispatch();
  const { products, loading, error } = useProducts();

  const cartItems = useAppSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => dispatch(logout());

  // LIMIT TO 8 PRODUCTS ONLY
  const featuredProducts = products.slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* HEADER */}
      <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <Link to="/" className="font-bold text-xl">
          ShopX
        </Link>

        <Searchbar value={search} onChange={setSearch} />

        <div className="flex items-center gap-4">
          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-red-600"
            >
              <LogIn size={16} />
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="flex items-center gap-1">
                <LogIn size={16} /> Login
              </Link>

              <Link to="/register" className="flex items-center gap-1">
                <User size={16} /> Register
              </Link>
            </>
          )}

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

      {/* PRODUCTS (ONLY 8) */}
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

          {/* VIEW ALL BUTTON */}
          <div className="flex justify-center mt-6 mb-10">
            <Link
              to="/products"
              className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              View All Products
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;