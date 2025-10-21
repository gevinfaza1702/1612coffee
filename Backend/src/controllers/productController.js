import Product from "../models/Product.js";

// Tambah produk baru
export const addProduct = async (req, res) => {
  try {
    const { name, description, beanType, process, price, stock, imageUrl } = req.body;
    const newProduct = new Product({ name, description, beanType, process, price, stock, imageUrl });
    await newProduct.save();
    res.status(201).json({ message: "Produk berhasil ditambahkan", product: newProduct });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tambah banyak produk sekaligus
export const addMultipleProducts = async (req, res) => {
  try {
    const products = req.body; // harus array of object
    const newProducts = await Product.insertMany(products);
    res.status(201).json({ message: "Beberapa produk berhasil ditambahkan", products: newProducts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Ambil semua produk
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ available: true });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Ambil satu produk by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Produk tidak ditemukan" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Hapus produk
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Produk berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
