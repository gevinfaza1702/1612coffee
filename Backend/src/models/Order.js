import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  customerName: { type: String, required: true },
  address: { type: String, required: true },
  items: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      qty: { type: Number, required: true },
      type: { type: String, enum: ["product", "service"], default: "product" },
    },
  ],
  total: { type: Number, required: true },
  shipping: {
    totalDistance: String,
    totalCost: Number,
    service: String,
    weight: Number,
    mode: String,
  },
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
