import { useLocation } from "react-router-dom";
import UserLayout from "../../layouts/UserLayout";

export default function Invoice() {
  const { state } = useLocation();
  const order = state?.order;
  const shipping = state?.shipping;
  const waNumber = "085155306045"; // 🔹 Ganti nomor WA admin di sini

  if (!order) {
    return (
      <UserLayout>
        <div className="text-center mt-20 text-slate-600">
          <p>Invoice tidak ditemukan 😢</p>
        </div>
      </UserLayout>
    );
  }

  const waText = encodeURIComponent(
    `Halo, saya ingin konfirmasi pesanan:\n\n🧾 ID Pesanan: ${order.orderId}\n📍 Alamat: ${order.address}\n💰 Total: Rp ${order.total.toLocaleString(
      "id-ID"
    )}\n🚚 Pengiriman: ${shipping?.service?.toUpperCase() || "REGULER"}\n\nMohon konfirmasi untuk proses selanjutnya.`
  );

  const waLink = `https://wa.me/${waNumber}?text=${waText}`;

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-8 mt-10 space-y-6">
        <h1 className="text-3xl font-bold text-[var(--coffee)] text-center mb-6">
          Invoice Pesanan
        </h1>

        <div className="border-b pb-4 space-y-2">
          <p>
            <b>ID Pesanan:</b> {order.orderId}
          </p>
          <p>
            <b>Nama Pembeli:</b> {order.customerName}
          </p>
          <p>
            <b>Alamat:</b> {order.address}
          </p>
          <p>
            <b>Status Pembayaran:</b> Belum Dibayar
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-[var(--coffee)]">
            Rincian Pesanan
          </h2>
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span>
                {item.qty}x {item.name}
              </span>
              <span>Rp {(item.price * item.qty).toLocaleString("id-ID")}</span>
            </div>
          ))}

          <div className="flex justify-between border-t pt-3 mt-2 font-semibold">
            <span>Subtotal Produk</span>
            <span>Rp {order.total.toLocaleString("id-ID")}</span>
          </div>

          {shipping && (
            <div className="border-t pt-3 mt-3 text-sm space-y-1">
              <p>
                🚚 <b>Layanan:</b> {shipping.service.toUpperCase()}
              </p>
              <p>
                📏 <b>Jarak Total:</b> {shipping.totalDistance}
              </p>
              <p>
                💰 <b>Ongkir:</b> Rp{" "}
                {shipping.totalCost.toLocaleString("id-ID")}
              </p>
              <p>
                🔁 <b>Mode:</b>{" "}
                {shipping.mode === "two_way"
                  ? "Dua Arah (Service)"
                  : "Satu Arah (Produk)"}
              </p>
            </div>
          )}

          <div className="flex justify-between border-t pt-4 mt-4 text-lg font-bold">
            <span>Total Pembayaran</span>
            <span>Rp {order.total.toLocaleString("id-ID")}</span>
          </div>
        </div>

        <div className="text-center mt-6">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Konfirmasi via WhatsApp
          </a>
        </div>
      </div>
    </UserLayout>
  );
}
