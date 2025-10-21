import Cart from "../models/Cart.js";

// 🔹 Get cart by user ID
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.json({ items: [], totalAmount: 0 });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil keranjang", error: err.message });
  }
};

// 🔹 Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { itemId, name, price, qty, type } = req.body;

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [], totalAmount: 0 });
    }

    const existing = cart.items.find((i) => i.itemId.toString() === itemId);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.items.push({ itemId, name, price, qty, type });
    }

    cart.totalAmount = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);
    await cart.save();

    res.json({ message: "✅ Produk ditambahkan ke keranjang", cart });
  } catch (err) {
    res.status(500).json({ message: "Gagal menambah item", error: err.message });
  }
};

// 🔹 Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.body;

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Keranjang tidak ditemukan" });

    cart.items = cart.items.filter((i) => i.itemId.toString() !== itemId);
    cart.totalAmount = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);

    await cart.save();
    res.json({ message: "Item dihapus dari keranjang", cart });
  } catch (err) {
    res.status(500).json({ message: "Gagal menghapus item", error: err.message });
  }
};
