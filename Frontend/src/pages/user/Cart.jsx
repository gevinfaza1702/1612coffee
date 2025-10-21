import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserLayout from "../../layouts/UserLayout";
import { useCart } from "../../context/CartContext";
import api from "../../services/api";

export default function Cart() {
  const { items, removeItem, clear } = useCart();
  const navigate = useNavigate();

  const [destination, setDestination] = useState("");
  const [type, setType] = useState("regular");
  const [shipping, setShipping] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pisahkan antara jasa & produk
  const jasaItems = items.filter((i) => i.type === "service");
  const produkItems = items.filter((i) => i.type !== "service");

  const subtotalJasa = jasaItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const subtotalProduk = produkItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const subtotal = subtotalJasa + subtotalProduk;
  const total = shipping ? subtotal + shipping.summary.totalCost : subtotal;

  // 🔹 Hitung ongkir berdasarkan alamat & jenis pengiriman
  const hitungOngkir = async () => {
    if (!destination.trim()) return alert("Masukkan alamat atau koordinat pembeli dulu");

    setLoading(true);
    setShipping(null);
    try {
      const hasService = items.some((i) => i.type === "service");

      const res = await api.post("/shipping/calculate", {
        orderId: `ORD-${Date.now()}`,
        customerAddress: destination,
        weight: items.length > 0 ? items.length * 10 : 10, // asumsi berat
        type,
        hasService,
      });

      setShipping(res.data);
    } catch (err) {
      console.error("❌ Gagal menghitung ongkir:", err);
      alert("❌ Gagal menghitung ongkir, periksa koneksi backend.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Checkout → buat invoice & arahkan ke halaman invoice
  const handleCheckout = async () => {
    if (!shipping) {
      alert("Hitung ongkir dulu sebelum checkout!");
      return;
    }

    if (items.length === 0) {
      alert("Keranjang Anda masih kosong!");
      return;
    }

    setLoading(true);
    try {
      // Pastikan items dikirim sebagai array (bukan string)
      const cleanItems = items.map((item) => ({
        name: item.name,
        price: item.price,
        qty: item.qty,
        type: item.type || "product",
      }));

      const payload = {
        orderId: shipping.shipments?.[0]?.orderId || `ORD-${Date.now()}`,
        customerName: "Guest Buyer", // bisa diganti dari auth user
        address: destination,
        items: cleanItems, // ✅ array of object
        total: total,
        shipping: shipping.summary,
      };

      const res = await api.post("/order/create", payload);

      clear();
      navigate(`/user/invoice/${res.data.order.orderId}`, { state: res.data });
    } catch (err) {
      console.error("❌ Gagal membuat pesanan:", err);
      alert("❌ Gagal membuat pesanan. Periksa koneksi backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayout>
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        <h1 className="text-3xl font-extrabold text-[var(--coffee)]">Keranjang</h1>

        {items.length === 0 ? (
          <p className="text-slate-600">Keranjang Anda masih kosong.</p>
        ) : (
          <>
            {/* 🧾 Daftar Item */}
            <div className="rounded-lg border bg-white p-4 space-y-4">
              {items.map((item) => (
                <div
                  key={item.key}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-slate-600">
                      {item.qty}x @Rp {item.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.key)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>

            {/* 💰 Ringkasan Pembelian */}
            <div className="rounded-lg border bg-[#fffaf5] p-6">
              <h2 className="text-lg font-semibold mb-4">Ringkasan Pembelian</h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal Jasa</span>
                  <span>Rp {subtotalJasa.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal Produk</span>
                  <span>Rp {subtotalProduk.toLocaleString("id-ID")}</span>
                </div>

                {/* 📍 Input Alamat */}
                <div className="mt-4 space-y-2">
                  <label className="block text-sm">Alamat / Koordinat Pembeli</label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Contoh: Jl. Tomang Raya No.11, Jakarta Barat"
                    className="border p-2 rounded w-full text-sm"
                  />

                  <label className="block text-sm mt-2">Jenis Pengiriman</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="border p-2 rounded w-full text-sm"
                  >
                    <option value="regular">JNE Reguler</option>
                    <option value="cargo">JNE Cargo</option>
                  </select>

                  <button
                    onClick={hitungOngkir}
                    disabled={loading}
                    className="mt-2 w-full bg-[var(--coffee)] text-white py-2 rounded hover:bg-[#5c3217] transition"
                  >
                    {loading ? "Menghitung..." : "Hitung Ongkir"}
                  </button>
                </div>

                {/* 🚚 Hasil Ongkir */}
                {shipping && (
                  <div className="mt-3 text-sm bg-white p-3 rounded border">
                    <p>
                      🔁 Mode Pengiriman:{" "}
                      <b>
                        {shipping.summary.mode === "two_way"
                          ? "Dua Arah (Service)"
                          : "Satu Arah (Produk)"}
                      </b>
                    </p>
                    <p>
                      🚚 Layanan: <b>{shipping.summary.service.toUpperCase()}</b>
                    </p>
                    <p>
                      📏 Total Jarak: <b>{shipping.summary.totalDistance}</b>
                    </p>
                    <p>
                      💰 Ongkir Total:{" "}
                      <b>
                        Rp {shipping.summary.totalCost.toLocaleString("id-ID")}
                      </b>
                    </p>
                  </div>
                )}

                {/* 🧮 Total Akhir */}
                <div className="flex justify-between border-t pt-3 font-semibold text-lg mt-4">
                  <span>Total</span>
                  <span>Rp {total.toLocaleString("id-ID")}</span>
                </div>
              </div>

              {/* ⚙️ Tombol Aksi */}
              <div className="mt-6 flex flex-wrap justify-end gap-3">
                <button
                  onClick={() => navigate("/user/dashboard")}
                  className="border border-[var(--coffee)] text-[var(--coffee)] px-4 py-2 rounded hover:bg-[var(--coffee)] hover:text-white transition"
                >
                  Lanjutkan Belanja
                </button>

                <button
                  onClick={clear}
                  className="border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition"
                >
                  Kosongkan
                </button>

                <button
                  disabled={items.length === 0 || !shipping || loading}
                  onClick={handleCheckout}
                  className="bg-[var(--coffee)] text-white px-4 py-2 rounded hover:bg-[#5c3217] transition"
                >
                  {loading ? "Memproses..." : "Checkout Sekarang"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </UserLayout>
  );
}
