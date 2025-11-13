import express from "express";
import Category from "../../models/Category.js";
import Food from "../../models/Food.js";
import { auth } from "../../middleware/auth.js";
import { isAdmin } from "../../middleware/roles.js";

const router = express.Router();

// GET /api/admin/categories
router.get("/", auth, isAdmin, async (_req, res) => {
  let items = await Category.find({}).sort({ name: 1 });
  if (!items.length) {
    const names = await Food.distinct("category");
    if (names.length) {
      const toInsert = names
        .filter(Boolean)
        .map((n) => ({ name: n, slug: n.toLowerCase().trim().replace(/\s+/g, "-") }));
      try {
        await Category.insertMany(toInsert, { ordered: false });
      } catch (_) {
        // ignore duplicate errors on concurrent inserts
      }
      items = await Category.find({}).sort({ name: 1 });
    }
  }
  res.json({ data: items });
});

// POST /api/admin/categories
router.post("/", auth, isAdmin, async (req, res) => {
  const { name, slug } = req.body || {};
  if (!name?.trim()) return res.status(400).json({ message: "Missing name" });
  const exists = await Category.findOne({ name: name.trim() });
  if (exists) return res.status(409).json({ message: "Category name already used" });
  const doc = await Category.create({ name: name.trim(), slug: slug?.trim() || undefined });
  res.json({ data: doc });
});

// PUT /api/admin/categories/:id (đổi tên => cập nhật đồng bộ Food.category)
router.put("/:id", auth, isAdmin, async (req, res) => {
  const { name, slug } = req.body || {};
  const cat = await Category.findById(req.params.id);
  if (!cat) return res.status(404).json({ message: "Not found" });

  const oldName = cat.name;
  const newName = name?.trim();
  if (newName && newName !== oldName) {
    const exists = await Category.findOne({ name: newName });
    if (exists) return res.status(409).json({ message: "Category name already used" });
    cat.name = newName;
    await Food.updateMany({ category: oldName }, { $set: { category: newName } });
  }
  if (typeof slug !== "undefined") cat.slug = slug?.trim() || undefined;

  await cat.save();
  res.json({ data: cat });
});

// DELETE /api/admin/categories/:id (chỉ xóa khi không còn món thuộc category này)
router.delete("/:id", auth, isAdmin, async (req, res) => {
  const cat = await Category.findById(req.params.id);
  if (!cat) return res.status(404).json({ message: "Not found" });

  const count = await Food.countDocuments({ category: cat.name });
  if (count > 0) {
    return res.status(400).json({ message: "Cannot delete: category is in use by foods." });
  }
  await cat.deleteOne();
  res.json({ ok: true });
});

export default router;