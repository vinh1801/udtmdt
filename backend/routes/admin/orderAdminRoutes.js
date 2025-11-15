import express from "express";
import Order from "../../models/Order.js";
import { auth } from "../../middleware/auth.js";
import { isAdmin } from "../../middleware/roles.js";

const router = express.Router();
const ALLOWED_STATUS = ["pending", "processing", "shipping", "completed"];

// PUT /api/admin/orders/:id/refund
router.put("/:id/refund", auth, isAdmin, async (req, res) => {
  try {
    const doc = await Order.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Không tìm thấy đơn" });

    if (doc.status !== "failed") {
      return res.status(400).json({ message: "Chỉ xác nhận hoàn tiền cho đơn đã hủy" });
    }
    if (!doc.isPaid) {
      return res.status(400).json({ message: "Đơn chưa thanh toán, không cần hoàn tiền" });
    }
    if (doc.isRefunded) {
      return res.status(400).json({ message: "Đơn đã được hoàn tiền trước đó" });
    }

    doc.isRefunded = true;
    doc.refundedAt = new Date();
    await doc.save();

    res.json({ data: doc });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Xác nhận hoàn tiền thất bại" });
  }
});

// GET /api/admin/orders?status=&q=&history=true
router.get("/", auth, isAdmin, async (req, res) => {
  const { status, q, history } = req.query || {};
  let filter = {};

  if (history === "true") {
    // Lịch sử: tất cả đơn đã hoàn thành hoặc đã hủy
    filter = {
      status: { $in: ["completed", "failed"] },
    };
  } else {
    if (status && ALLOWED_STATUS.includes(status)) filter.status = status;
  }

  if (q?.trim()) {
    const keyword = q.trim();
    const or = [
      { "customer.phone": { $regex: keyword, $options: "i" } },
      { "customer.name": { $regex: keyword, $options: "i" } },
    ];

    // Chỉ thêm điều kiện tìm theo _id nếu chuỗi giống ObjectId để tránh CastError
    if (/^[0-9a-fA-F]{24}$/.test(keyword)) {
      or.push({ _id: keyword });
    }

    filter = Object.keys(filter).length ? { $and: [filter, { $or: or }] } : { $or: or };
  }

  const items = await Order.find(filter).sort({ createdAt: -1 });
  res.json({ data: items });
});

// GET /api/admin/orders/:id
router.get("/:id", auth, isAdmin, async (req, res) => {
  const doc = await Order.findById(req.params.id).populate({ path: "userId", select: "username name email" });
  if (!doc) return res.status(404).json({ message: "Không tìm thấy đơn" });
  res.json({ data: doc });
});

// GET /api/admin/orders/stats/today
// Đơn hàng hôm nay (completed) + doanh thu hôm nay
router.get("/stats/today", auth, isAdmin, async (req, res) => {
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const orders = await Order.find({
    status: "completed",
    createdAt: { $gte: startOfDay, $lte: now },
  }).select("totalPrice");

  const ordersCount = orders.length;
  const revenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  res.json({ data: { ordersCount, revenue } });
});

// GET /api/admin/orders/stats/by-day?days=7
// Thống kê theo ngày (chỉ đơn completed)
router.get("/stats/by-day", auth, isAdmin, async (req, res) => {
  const days = Number(req.query.days) || 7;
  const now = new Date();
  const from = new Date(now);
  from.setDate(from.getDate() - days + 1);
  from.setHours(0, 0, 0, 0);

  const stats = await Order.aggregate([
    {
      $match: {
        status: "completed",
        createdAt: { $gte: from, $lte: now },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
            timezone: "Asia/Ho_Chi_Minh",
          },
        },
        ordersCount: { $sum: 1 },
        revenue: { $sum: "$totalPrice" },
      },
    },
    { $sort: { _id: -1 } },
  ]);

  res.json({ data: stats });
});

// GET /api/admin/orders/stats/day-orders?date=YYYY-MM-DD
// Danh sách đơn hoàn thành trong một ngày cụ thể (dùng cho trang thống kê)
router.get("/stats/day-orders", auth, isAdmin, async (req, res) => {
  const { date } = req.query || {};
  if (!date) return res.status(400).json({ message: "Thiếu tham số date" });

  const [year, month, day] = String(date).split("-").map((v) => Number(v));
  if (!year || !month || !day) {
    return res.status(400).json({ message: "Định dạng date không hợp lệ" });
  }

  const start = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  const end = new Date(Date.UTC(year, month - 1, day, 23, 59, 59));

  const orders = await Order.find({
    status: "completed",
    createdAt: { $gte: start, $lte: end },
  })
    .sort({ createdAt: -1 })
    .select("customer totalPrice status isPaid createdAt");

  res.json({ data: orders });
});

// PUT /api/admin/orders/:id/status
router.put("/:id/status", auth, isAdmin, async (req, res) => {
  const { status } = req.body || {};
  if (!ALLOWED_STATUS.includes(status)) {
    return res.status(400).json({ message: "Trạng thái không hợp lệ" });
  }
  const doc = await Order.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: "Không tìm thấy đơn" });
  if (doc.status === "completed" || doc.status === "failed") {
    return res.status(400).json({ message: "Đơn đã ở trạng thái cuối, không thể đổi" });
  }
  doc.status = status;
  await doc.save();
  res.json({ data: doc });
});

// PUT /api/admin/orders/:id/payment
router.put("/:id/payment", auth, isAdmin, async (req, res) => {
  const { isPaid } = req.body || {};
  const doc = await Order.findByIdAndUpdate(
    req.params.id,
    { isPaid: !!isPaid },
    { new: true }
  );
  if (!doc) return res.status(404).json({ message: "Không tìm thấy đơn" });
  res.json({ data: doc });
});

// PUT /api/admin/orders/:id/cancel
router.put("/:id/cancel", auth, isAdmin, async (req, res) => {
  try {
    const doc = await Order.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Không tìm thấy đơn" });
    if (doc.status === "completed") {
      return res.status(400).json({ message: "Đơn đã hoàn thành, không thể hủy" });
    }
    if (doc.status === "failed") {
      return res.status(400).json({ message: "Đơn đã bị hủy trước đó" });
    }
    doc.status = "failed";
    await doc.save();
    res.json({ data: doc });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Hủy đơn thất bại" });
  }
});

export default router;