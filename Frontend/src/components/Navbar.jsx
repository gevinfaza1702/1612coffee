import { Link, useLocation } from "react-router-dom";
import { FiUser } from "react-icons/fi"; // ✅ ganti dari FiLogIn ke FiUser
import Logo from "../assets/Logo.jpg";

export default function Navbar() {
  const location = useLocation();

  // deteksi apakah halaman auth (login/register/forgot/admin login)
  const isAuthPage = ["/login", "/register", "/forgot-password", "/login/admin"].includes(
    location.pathname
  );

  return (
    <nav className="flex items-center justify-between px-10 py-4 bg-[#fffaf5] border-b border-[#e5ded5] shadow-sm">
      {/* LEFT: Logo + Brand */}
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={Logo}
            alt="1612 Coffee"
            className="h-9 w-9 rounded-full object-cover"
          />
          <span className="text-2xl font-bold text-[var(--coffee)]">
            1612 Coffee
          </span>
        </Link>
      </div>

      {/* CENTER: Menu navigasi */}
      {!isAuthPage && (
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-8 text-sm font-medium text-[var(--coffee)]">
            <a href="#about" className="hover:text-[#5c3217] transition">
              Tentang
            </a>
            <a href="#services" className="hover:text-[#5c3217] transition">
              Jasa
            </a>
            <a href="#products" className="hover:text-[#5c3217] transition">
              Produk
            </a>
            <a href="#social" className="hover:text-[#5c3217] transition">
              Sosial
            </a>
          </div>
        </div>
      )}

      {/* RIGHT: Tombol Login */}
      {!isAuthPage && (
        <div className="flex items-center">
          <Link
            to="/login"
            className="flex items-center gap-2 border border-[var(--coffee)] text-[var(--coffee)] px-4 py-2 rounded-lg hover:bg-[var(--coffee)] hover:text-white transition-all"
          >
            <FiUser className="text-lg" /> {/* 🔹 Ganti icon jadi user */}
            <span className="font-medium">Get Started</span>
          </Link>
        </div>
      )}
    </nav>
  );
}
