import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  try {
    let { orderId, customerName, address, items, total, shipping } = req.body;

    // 🛠️ Perbaikan: jika items dikirim sebagai string JSON → ubah jadi array
    if (typeof items === "string") {
      try {
        items = JSON.parse(items);
      } catch (err) {
        console.error("❌ Gagal parsing items:", err.message);
        return res.status(400).json({ message: "Format items tidak valid" });
      }
    }

    // Validasi dasar
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Daftar items tidak valid" });
    }

    const newOrder = new Order({
      orderId,
      customerName,
      address,
      items, // ✅ sekarang pasti array
      total,
      shipping,
    });

    await newOrder.save();

    res.json({
      message: "✅ Pesanan berhasil dibuat",
      order: newOrder,
    });
  } catch (err) {
    console.error("❌ Error createOrder:", err);
    res.status(500).json({
      message: "Gagal membuat pesanan",
      error: err.message,
    });
  }
};
