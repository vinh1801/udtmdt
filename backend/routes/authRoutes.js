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
// Yêu cầu: username, name, phone, password; email KHÔNG bắt buộc
router.post("/register", async (req, res) => {
  try {
    const { username, name, phone, email, password } = req.body || {};
    if (!username || !name || !phone || !password)
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ thông tin bắt buộc" });

    const uname = String(username).trim().toLowerCase();
    const existsUser = await User.findOne({ username: uname });
    if (existsUser)
      return res
        .status(409)
        .json({ message: "Tên đăng nhập đã được sử dụng" });

    if (email) {
      const existsEmail = await User.findOne({ email: String(email).toLowerCase() });
      if (existsEmail)
        return res
          .status(409)
          .json({ message: "Email này đã được sử dụng" });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: uname,
      name,
      phone: String(phone).trim(),
      email: email ? String(email).toLowerCase() : undefined,
      password: hash
    });

    const token = sign(user);
    res.json({
      token,
      user: { id: user._id, name: user.name, username: user.username, email: user.email, phone: user.phone, role: user.role }
    });
  } catch (e) {
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
});

// POST /api/auth/login
// Cho phép đăng nhập bằng username hoặc email (identifier)
router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body || {};
    if (!identifier || !password)
      return res
        .status(400)
        .json({ message: "Vui lòng nhập tên đăng nhập/email và mật khẩu" });

    const id = String(identifier).trim().toLowerCase();
    const user = await User.findOne({
      $or: [{ username: id }, { email: id }]
    });
    if (!user)
      return res
        .status(401)
        .json({ message: "Sai thông tin đăng nhập" });

    if (user.isRestricted) {
      return res.status(403).json({ message: "Tài khoản đã bị hạn chế, liên hệ quản trị viên." });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res
        .status(401)
        .json({ message: "Sai thông tin đăng nhập" });

    const token = sign(user);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch {
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
});

// GET /api/auth/me
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("_id name username email phone role isRestricted");
  res.json({ user });
});

// PUT /api/auth/me
// Cập nhật thông tin cá nhân (không cho đổi username, role)
router.put("/me", auth, async (req, res) => {
  try {
    const { name, phone, email } = req.body || {};

    if (!name || !phone) {
      return res.status(400).json({ message: "Thiếu họ tên hoặc số điện thoại" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    // Kiểm tra trùng email nếu có gửi lên và khác email hiện tại
    if (email && email !== user.email) {
      const existsEmail = await User.findOne({ email: String(email).toLowerCase() });
      if (existsEmail) {
        return res.status(409).json({ message: "Email đã được sử dụng" });
      }
      user.email = String(email).toLowerCase();
    } else if (email === "" || email === null) {
      user.email = undefined;
    }

    user.name = name;
    user.phone = String(phone).trim();

    await user.save();

    res.json({
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Cập nhật thông tin thất bại" });
  }
});

// PUT /api/auth/change-password
// Đổi mật khẩu: yêu cầu mật khẩu cũ và mật khẩu mới
router.put("/change-password", auth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body || {};
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Thiếu mật khẩu" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Mật khẩu mới phải từ 6 ký tự" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    const ok = await bcrypt.compare(oldPassword, user.password);
    if (!ok) {
      return res.status(400).json({ message: "Mật khẩu cũ không đúng" });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    await user.save();

    res.json({ message: "Đổi mật khẩu thành công" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Đổi mật khẩu thất bại" });
  }
});

// DELETE /api/auth/me
// Xóa tài khoản của chính mình
router.delete("/me", auth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    return res.status(200).json({ message: "Đã xóa tài khoản" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Xóa tài khoản thất bại" });
  }
});

export default router;