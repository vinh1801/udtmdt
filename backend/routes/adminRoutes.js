import express from "express";
import { auth } from "../middleware/auth.js";
import { isAdmin } from "../middleware/roles.js";

const router = express.Router();

// Placeholder trang quản trị (API)
router.get("/", auth, isAdmin, (_req, res) => {
  res.json({ ok: true, message: "Admin API ready" });
});

export default router;