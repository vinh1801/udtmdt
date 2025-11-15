import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    customer: {
      name: String,
      address: String,
      phone: String,
      note: String,
      method: { type: String, default: "VNPAY" } // VNPAY | COD
    },
    items: [
      {
        foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
        name: String,
        price: Number,
        quantity: Number
      }
    ],
    totalPrice: Number,
    isPaid: { type: Boolean, default: false },
    isRefunded: { type: Boolean, default: false },
    refundedAt: { type: Date },
    status: {
      type: String,
      enum: ["pending", "processing", "shipping", "completed", "failed"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
