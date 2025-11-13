import express from "express";
import Category from "../models/Category.js";
import Food from "../models/Food.js";

const router = express.Router();

// Public: GET /api/categories
router.get("/", async (_req, res) => {
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
        // ignore duplicate errors
      }
      items = await Category.find({}).sort({ name: 1 });
    }
  }
  res.json({ data: items });
});

export default router;