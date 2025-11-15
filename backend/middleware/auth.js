import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // lấy user từ DB để kiểm tra hạn chế
    const user = await User.findById(decoded.id).select("isRestricted role");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (user.isRestricted) {
      return res.status(403).json({ message: "Tài khoản đã bị hạn chế, liên hệ quản trị viên." });
    }

    req.user = decoded; // { id, email, role... }
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}