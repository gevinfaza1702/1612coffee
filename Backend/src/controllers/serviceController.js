import Service from "../models/Service.js";

// Tambah jasa roasting
export const addService = async (req, res) => {
  try {
    const { name, description, beanType, roastProfiles, pricePerKg, imageUrl } = req.body;

    const newService = new Service({
      name,
      description,
      beanType,
      roastProfiles,
      pricePerKg,
      imageUrl,
    });

    await newService.save();
    res.status(201).json({ message: "Jasa roasting berhasil ditambahkan", service: newService });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Ambil semua jasa
export const getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Hitung harga total berdasarkan berat dan validasi input berat
export const calculateRoastingCost = async (req, res) => {
  try {
    const { serviceId, weight, beanType, roastProfile } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: "Jasa tidak ditemukan" });

    // Validasi berat
    const min = service.minWeight || 1;
    const max = service.maxWeight || 50;
    if (weight < min || weight > max) {
      return res.status(400).json({ message: `Berat harus antara ${min}kg - ${max}kg` });
    }

    // Hanya kelipatan 0.5 yang valid
    if (weight * 10 % 5 !== 0) {
      return res.status(400).json({ message: "Berat hanya bisa kelipatan 0.5kg (contoh: 1, 1.5, 2, 2.5)" });
    }

    // Validasi pilihan biji kopi & profil roasting
    if (!service.beanType.includes(beanType)) {
      return res.status(400).json({ message: `Jenis kopi '${beanType}' tidak tersedia.` });
    }
    if (!service.roastProfiles.includes(roastProfile)) {
      return res.status(400).json({ message: `Profil roasting '${roastProfile}' tidak tersedia.` });
    }

    // Hitung total harga
    const totalCost = service.pricePerKg * weight;

    res.status(200).json({
      message: "Perhitungan berhasil",
      data: {
        serviceName: service.name,
        beanType,
        roastProfile,
        weight,
        pricePerKg: service.pricePerKg,
        totalCost,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
