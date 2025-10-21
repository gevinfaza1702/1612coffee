import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiLogOut, FiSettings, FiUser, FiShoppingCart, FiClock } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import Logo from "../assets/Logo.jpg";

export default function UserNavbar() {
  const { user, logout } = useAuth();
  const { items } = useCart(); // ✅ pakai items, bukan cart
  const nav = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [animateCart, setAnimateCart] = useState(false);

  const handleLogout = () => {
    logout();
    nav("/login", { replace: true });
  };

  // Animasi bounce ketika items berubah
  useEffect(() => {
    if (items?.length > 0) {
      setAnimateCart(true);
      const timer = setTimeout(() => setAnimateCart(false), 500);
      return () => clearTimeout(timer);
    }
  }, [items]);

  return (
    <nav className="flex items-center justify-between px-10 py-4 bg-[#fffaf5] border-b border-[#e5ded5] shadow-sm relative">
      {/* LEFT: Logo */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => nav("/user/dashboard")}>
        <img
          src={Logo}
          alt="1612 Coffee"
          className="h-9 w-9 rounded-full object-cover"
        />
        <span className="text-2xl font-bold text-[var(--coffee)]">1612 Coffee</span>
      </div>

      {/* RIGHT: Icons */}
      <div className="flex items-center gap-6 text-[var(--coffee)] relative">
        {/* Cart Icon */}
        <button
          onClick={() => nav("/user/cart")}
          className={`p-2 border rounded-lg hover:bg-[var(--coffee)] hover:text-white transition relative ${
            animateCart ? "animate-bounce" : ""
          }`}
        >
          <FiShoppingCart size={18} />
          {items?.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-[var(--coffee)] text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              {items.length}
            </span>
          )}
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="p-2 border rounded-lg hover:bg-[var(--coffee)] hover:text-white transition flex items-center justify-center"
          >
            <FiUser size={18} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-[#e5ded5] rounded-lg shadow-lg z-50">
              <div className="flex flex-col text-[var(--coffee)]">
                <Link
                  to="/user/settings"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-[#f4ede7] transition"
                  onClick={() => setDropdownOpen(false)}
                >
                  <FiSettings size={16} /> Pengaturan
                </Link>

                <Link
                  to="/user/history"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-[#f4ede7] transition"
                  onClick={() => setDropdownOpen(false)}
                >
                  <FiClock size={16} /> Riwayat Pembelian
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-left hover:bg-[#f4ede7] transition"
                >
                  <FiLogOut size={16} /> Keluar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
