import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: "text" },
    price: { type: Number, required: true },
    category: { type: String, required: true, index: true },
    image: { type: String },
    description: { type: String },
    isAvailable: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Food", foodSchema);
