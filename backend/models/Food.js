import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: "text" },
    price: { type: Number, required: true },
    category: { type: String, required: true, index: true },
    image: { type: String },
    description: { type: String },
    isAvailable: { type: Boolean, default: true },
    isSpecial: { type: Boolean, default: false },
    discountPercent: { type: Number, default: 0, min: 0, max: 100 }
  },
  { timestamps: true }
);

export default mongoose.model("Food", foodSchema);