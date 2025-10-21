import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    beanType: {
      type: String,
      enum: ["arabika", "robusta"],
      required: true,
    },
    process: {
      type: String,
      enum: ["Natural", "Fullwash", "Honey", "Eksperimental"],
      required: true,
    },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    imageUrl: { type: String },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
