import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdminApi } from "../../services/authApi";
import LandingLayout from "../../layouts/LandingLayout";

export default function LoginAdmin() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const res = await loginAdminApi(form);
      localStorage.setItem("token", res.data.token);
      nav("/admin/dashboard");
    } catch (e) {
      setErr(e?.response?.data?.message || "Login gagal");
    }
  };

  return (
    <LandingLayout>
      <div className="mx-auto max-w-md px-6 py-20">
        <h1 className="text-4xl font-extrabold mb-6 text-[var(--coffee)]">
          Masuk Admin
        </h1>

        <form onSubmit={submit} className="space-y-4">
          <input
            type="email"
            placeholder="Email Admin"
            className="w-full rounded border p-3"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Kata sandi"
            className="w-full rounded border p-3"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {err && <div className="text-red-600 text-sm">{err}</div>}

          <button className="w-full rounded bg-[var(--coffee)] py-3 text-white hover:bg-[#5c3217] transition">
            Masuk Admin
          </button>
        </form>
      </div>
    </LandingLayout>
  );
}
