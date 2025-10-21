import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    // Nama jasa, misal "Jasa Roasting Kopi 1612"
    name: { type: String, required: true },

    // Deskripsi jasa
    description: { type: String },

    // Jenis biji kopi yang bisa dipilih: Arabika atau Robusta
    beanType: {
      type: [String],
      enum: ["arabika", "robusta"],
      default: ["arabika", "robusta"], // bisa dua-duanya tersedia
    },

    // Profil roasting
    roastProfiles: {
      type: [String],
      enum: ["lite", "medium", "dark"],
      default: ["lite", "medium", "dark"],
    },

    // Harga per kg (misal 35.000)
    pricePerKg: { type: Number, required: true },

    // Berat minimal dan maksimal (batas sistem)
    minWeight: { type: Number, default: 1 },
    maxWeight: { type: Number, default: 50 },

    imageUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);