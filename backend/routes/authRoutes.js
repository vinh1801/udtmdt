import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

function sign(u) {
  return jwt.sign(
    { id: u._id, email: u.email, role: u.role || "user" },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || "7d" }
  );
}

// POST /api/auth/register
// Yêu cầu: username, name, password; email KHÔNG bắt buộc
router.post("/register", async (req, res) => {
  try {
    const { username, name, email, password } = req.body || {};
    if (!username || !name || !password)
      return res.status(400).json({ message: "Missing fields" });

    const uname = String(username).trim().toLowerCase();
    const existsUser = await User.findOne({ username: uname });
    if (existsUser) return res.status(409).json({ message: "Username already used" });

    if (email) {
      const existsEmail = await User.findOne({ email: String(email).toLowerCase() });
      if (existsEmail) return res.status(409).json({ message: "Email already used" });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: uname,
      name,
      email: email ? String(email).toLowerCase() : undefined,
      password: hash
    });

    const token = sign(user);
    res.json({
      token,
      user: { id: user._id, name: user.name, username: user.username, email: user.email, role: user.role }
    });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/login
// Cho phép đăng nhập bằng username hoặc email (identifier)
router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body || {};
    if (!identifier || !password) return res.status(400).json({ message: "Missing fields" });

    const id = String(identifier).trim().toLowerCase();
    const user = await User.findOne({
      $or: [{ username: id }, { email: id }]
    });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = sign(user);
    res.json({
      token,
      user: { id: user._id, name: user.name, username: user.username, email: user.email, role: user.role }
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/auth/me
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("_id name username email role");
  res.json({ user });
});

export default router;