import express from "express";
import Food from "../models/Food.js";

const router = express.Router();

// GET /api/foods?search=&category=&page=&limit=
router.get("/", async (req, res) => {
  try {
    const { search = "", category, page = 1, limit = 50 } = req.query;
    const q = {};
    if (search) q.name = { $regex: search, $options: "i" };
    if (category) q.category = category;

    const [data, total] = await Promise.all([
      Food.find(q)
        .sort({ createdAt: -1 })
        .skip((+page - 1) * +limit)
        .limit(+limit),
      Food.countDocuments(q)
    ]);

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
