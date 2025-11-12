import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customer: {
      name: String,
      address: String,
      phone: String,
      method: { type: String, default: "CARD" } // CARD | COD | WALLET
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
    status: { type: String, default: "pending" } // pending | paid | failed
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
