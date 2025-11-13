import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// POST /api/orders  → tạo đơn hàng (mô phỏng thanh toán thành công)
router.post("/", async (req, res) => {
  try {
    const { customer, items, totalPrice, method } = req.body;
    const order = await Order.create({
      customer: { ...customer, method },
      items,
      totalPrice,
      status: "paid"
    });
    res.json({ success: true, orderId: order._id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Payment failed" });
  }
});

// GET /api/orders  (lấy tất cả đơn hàng – demo)
router.get("/", async (_req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

// GET /api/orders/:id  (lấy chi tiết 1 đơn)
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false });
    res.json(order);
  } catch (e) {
    res.status(400).json({ success: false });
  }
});

export default router;
