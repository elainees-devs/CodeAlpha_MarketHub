import React from "react";
import { ShoppingCart, User, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import Searchbar from "../shared/Searchbar";
import { useAppSelector } from "../../app/hooks";
import { useLogout } from "../../hooks/useLogout";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
};

const Header: React.FC<Props> = ({ search, onSearchChange }) => {
  const logout = useLogout();

  const cartItems = useAppSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const user = useAppSelector((state) => state.auth.user);

  return (
    <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-50">

      {/* LOGO */}
      <Link to="/" className="font-bold text-xl">
        ShopX
      </Link>

      {/* SEARCH */}
      <Searchbar value={search} onChange={onSearchChange} />

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-4">

        {/* AUTH */}
        {user ? (
          <button
            onClick={logout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 transition"
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

        {/* CART */}
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
  );
};

export default Header;