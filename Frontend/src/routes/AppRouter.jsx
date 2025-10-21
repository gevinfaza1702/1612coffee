import { Routes, Route } from "react-router-dom";

import Home from "../pages/landing/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import LoginAdmin from "../pages/auth/LoginAdmin";

import DashboardUser from "../pages/user/DashboardUser";
import Cart from "../pages/user/Cart";
import History from "../pages/user/History";
import Settings from "../pages/user/Settings";
import Invoice from "../pages/user/Invoice"; // ✅ perbaikan path ke folder pages/user
import DashboardAdmin from "../pages/admin/DashboardAdmin";

import ProtectedRoute from "./ProtectedRoute";

export default function AppRouter() {
  return (
    <Routes>
      {/* 🔹 Halaman Publik */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/login/admin" element={<LoginAdmin />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* 🔹 Halaman User */}
      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute>
            <DashboardUser />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* ✅ Halaman Invoice (setelah checkout) */}
      <Route
        path="/user/invoice/:id"
        element={
          <ProtectedRoute>
            <Invoice />
          </ProtectedRoute>
        }
      />

      {/* 🔹 Halaman Admin */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute onlyAdmin>
            <DashboardAdmin />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
