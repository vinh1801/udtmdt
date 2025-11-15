import express from "express";
import Order from "../models/Order.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// POST /api/orders → tạo đơn hàng (yêu cầu đăng nhập) và mặc định trạng thái 'pending'
router.post("/", auth, async (req, res) => {
  try {
    const { customer, items, totalPrice, method } = req.body || {};
    if (!Array.isArray(items) || items.length === 0)
      return res.status(400).json({ success: false, message: "Thiếu items" });
    if (!customer?.name || !customer?.phone)
      return res.status(400).json({ success: false, message: "Thiếu thông tin khách hàng" });

    // Giới hạn: mỗi user chỉ được tối đa 3 đơn đang xử lý
    if (req.user?.id) {
      const activeCount = await Order.countDocuments({
        userId: req.user.id,
        status: { $in: ["pending", "processing", "shipping"] },
      });
      if (activeCount >= 3) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Bạn chỉ được tạo tối đa 3 đơn đang xử lý cùng lúc. Vui lòng hoàn tất hoặc hủy bớt đơn trước.",
          });
      }
    }

    const order = await Order.create({
      userId: req.user?.id,
      customer: { ...customer, method },
      items,
      totalPrice,
      status: "pending",
    });
    res.json({ success: true, orderId: order._id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Tạo đơn thất bại" });
  }
});

// GET /api/my/orders → lịch sử đơn của user hiện tại
router.get("/my", auth, async (req, res) => {
  const list = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json({ data: list });
});

// GET /api/orders (admin/demo) – giữ tạm cho tương thích cũ
router.get("/", async (_req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

// GET /api/orders/:id (chỉ chủ đơn mới xem – nếu đã đăng nhập) hoặc công khai tạm thời
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false });
    res.json(order);
  } catch (e) {
    res.status(400).json({ success: false });
  }
});

// PUT /api/orders/:id/cancel – user hủy đơn: chỉ khi là chủ đơn và trạng thái pending
router.put("/:id/cancel", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Không tìm thấy đơn" });
    if (!order.userId || String(order.userId) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: "Không có quyền hủy đơn này" });
    }
    if (order.status !== "pending") {
      return res.status(400).json({ success: false, message: "Chỉ hủy khi đơn đang chờ xác nhận" });
    }
    order.status = "failed";
    await order.save();
    res.json({ success: true, data: order });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Hủy đơn thất bại" });
  }
});

export default router;
