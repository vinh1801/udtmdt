import express from "express";
import Food from "../models/Food.js";

const router = express.Router();

// GET /api/foods?search=&category=&page=&limit=&special=
router.get("/", async (req, res) => {
  try {
    const { search = "", category, page = 1, limit = 50, special } = req.query;
    const q = {};
    if (search) q.name = { $regex: search, $options: "i" };
    if (category) q.category = category;

    // Nếu special=true: ưu tiên những món có discountPercent > 0
    let sort = { createdAt: -1 };
    if (String(special) === "true") {
      q.discountPercent = { $gt: 0 };
      sort = { discountPercent: -1, createdAt: -1 };
    } else if (typeof special !== "undefined") {
      // special=false -> có thể coi như không lọc theo discount, để đồng bộ tham số
    }

    const [docs, total] = await Promise.all([
      Food.find(q)
        .sort(sort)
        .skip((+page - 1) * +limit)
        .limit(+limit),
      Food.countDocuments(q)
    ]);

    // thêm finalPrice cho FE sử dụng
    const data = docs.map((f) => ({
      ...f.toObject(),
      finalPrice: Math.round(f.price * (100 - (f.discountPercent || 0)) / 100),
    }));

    res.json({ data, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// (Optional) GET /api/foods/:id
router.get("/:id", async (req, res) => {
  const f = await Food.findById(req.params.id);
  if (!f) return res.status(404).json({ message: "Not found" });
  res.json(f);
});

export default router;
