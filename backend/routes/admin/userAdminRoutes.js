import express from "express";
import User from "../../models/User.js";
import { auth } from "../../middleware/auth.js";
import { isAdmin } from "../../middleware/roles.js";
import Order from "../../models/Order.js";

const router = express.Router();

// GET /api/admin/users/restricted  – danh sách user bị hạn chế
router.get("/restricted", auth, isAdmin, async (req, res) => {
  const { q } = req.query || {};
  const filter = { isRestricted: true };

  if (q?.trim()) {
    const keyword = q.trim().toLowerCase();
    filter.username = { $regex: keyword, $options: "i" };
  }

  const users = await User.find(filter)
    .select("username name email phone role isRestricted createdAt")
    .sort({ createdAt: -1 });

  res.json({ data: users });
});

// GET /api/admin/users/search?q= – tìm theo username gần giống
router.get("/search", auth, isAdmin, async (req, res) => {
  const { q } = req.query || {};
  if (!q?.trim()) return res.json({ data: [] });

  const keyword = q.trim().toLowerCase();

  const users = await User.find({
    username: { $regex: keyword, $options: "i" }
  })
    .select("username name email phone role isRestricted createdAt")
    .limit(50);

  res.json({ data: users });
});


// GET /api/admin/users/:id – chi tiết user
router.get("/:id", auth, isAdmin, async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("username name email phone role isRestricted createdAt updatedAt");
  if (!user) return res.status(404).json({ message: "Không tìm thấy user" });
  res.json({ data: user });
});

// PUT /api/admin/users/:id/restrict – hạn chế / bỏ hạn chế
router.put("/:id/restrict", auth, isAdmin, async (req, res) => {
  const { isRestricted } = req.body || {};
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

  const nextRestricted = !!isRestricted;
  user.isRestricted = nextRestricted;
  await user.save();

  if (nextRestricted) {
    // Hủy tất cả đơn chưa completed/failed của user này
    await Order.updateMany(
      { userId: user._id, status: { $nin: ["completed", "failed"] } },
      { $set: { status: "failed" } }
    );
  }

  res.json({ data: user });
});

// DELETE /api/admin/users/:id – xóa tài khoản
router.delete("/:id", auth, isAdmin, async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: "Không tìm thấy user" });
  res.json({ success: true });
});

export default router;