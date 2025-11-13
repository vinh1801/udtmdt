import express from "express";
import Food from "../../models/Food.js";
import Category from "../../models/Category.js";
import { auth } from "../../middleware/auth.js";
import { isAdmin } from "../../middleware/roles.js";

const router = express.Router();

// GET /api/admin/foods
router.get("/", auth, isAdmin, async (req, res) => {
  const { search } = req.query;
  const query = {};
  if (search?.trim()) {
    query.name = { $regex: search.trim(), $options: "i" };
  }
  const items = await Food.find(query).sort({ createdAt: -1 });
  res.json({ data: items });
});

// POST /api/admin/foods
router.post("/", auth, isAdmin, async (req, res) => {
  const { name, price, category, description, image, isAvailable, discountPercent, isSpecial } = req.body || {};

  if (!name?.trim()) return res.status(400).json({ message: "Tên là bắt buộc" });
  if (price == null || isNaN(price) || Number(price) <= 0) return res.status(400).json({ message: "Giá phải > 0" });
  if (!description?.trim()) return res.status(400).json({ message: "Mô tả là bắt buộc" });
  if (!category?.trim()) return res.status(400).json({ message: "Danh mục là bắt buộc" });

  const cat = await Category.findOne({ name: category.trim() });
  if (!cat) return res.status(400).json({ message: "Danh mục không hợp lệ" });

  const doc = await Food.create({
    name: name.trim(),
    price: Number(price),
    category: category.trim(),
    description: description.trim(),
    image: image?.trim(),
    isAvailable: typeof isAvailable === "boolean" ? isAvailable : true,
    discountPercent: discountPercent != null ? Number(discountPercent) : 0,
    isSpecial: !!isSpecial,
  });
  res.json({ data: doc });
});

// PUT /api/admin/foods/:id
router.put("/:id", auth, isAdmin, async (req, res) => {
  const { name, price, category, description, image, isAvailable, discountPercent, isSpecial } = req.body || {};
  const food = await Food.findById(req.params.id);
  if (!food) return res.status(404).json({ message: "Không tìm thấy món" });

  if (name != null) {
    if (!name.toString().trim()) return res.status(400).json({ message: "Tên không hợp lệ" });
    food.name = name.toString().trim();
  }
  if (price != null) {
    const p = Number(price);
    if (isNaN(p) || p <= 0) return res.status(400).json({ message: "Giá không hợp lệ" });
    food.price = p;
  }
  if (description != null) {
    if (!description.toString().trim()) return res.status(400).json({ message: "Mô tả không hợp lệ" });
    food.description = description.toString().trim();
  }
  if (category != null) {
    const catName = category.toString().trim();
    if (!catName) return res.status(400).json({ message: "Danh mục không hợp lệ" });
    const cat = await Category.findOne({ name: catName });
    if (!cat) return res.status(400).json({ message: "Danh mục không tồn tại" });
    food.category = catName;
  }
  if (image != null) food.image = image?.toString().trim();
  if (typeof isAvailable === "boolean") food.isAvailable = isAvailable;
  if (discountPercent != null) {
    const d = Number(discountPercent);
    if (isNaN(d) || d < 0 || d > 100) return res.status(400).json({ message: "% giảm không hợp lệ" });
    food.discountPercent = d;
  }
  if (isSpecial != null) food.isSpecial = !!isSpecial;

  await food.save();
  res.json({ data: food });
});

// DELETE /api/admin/foods/:id
router.delete("/:id", auth, isAdmin, async (req, res) => {
  const food = await Food.findById(req.params.id);
  if (!food) return res.status(404).json({ message: "Không tìm thấy món" });

  // Xóa món ăn không ảnh hưởng lịch sử đơn hàng (Order lưu snapshot thông tin).
  await food.deleteOne();
  res.json({ ok: true });
});

export default router;