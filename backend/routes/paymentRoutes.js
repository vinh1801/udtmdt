import express from "express";
import Order from "../models/Order.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

const { VNPay, ignoreLogger, VnpLocale, ProductCode, dateFormat } = await import("vnpay");

router.post("/vnpay/create", auth, async (req, res) => {
  const { orderId, customer, items, totalPrice, method } = req.body || {};
  let order = null;
  let createdNew = false;

  try {
    if (orderId) {
      order = await Order.findById(orderId);
      if (!order) return res.status(404).json({ success: false });
    } else {
      if (!customer || !items || !totalPrice) {
        return res.status(400).json({ success: false, message: "Thiếu dữ liệu đơn hàng" });
      }
      order = await Order.create({
        userId: req.user.id,
        customer: { ...customer, method: method || "VNPAY" },
        items,
        totalPrice,
        status: "pending",
      });
      createdNew = true;
    }

    const vnpay = new VNPay({
      tmnCode: process.env.VNP_TMN_CODE,
      secureSecret: process.env.VNP_HASH_SECRET,
      vnpayHost: process.env.VNP_HOST || "https://sandbox.vnpayment.vn",
      testMode: process.env.VNP_TEST_MODE !== "false",
      hashAlgorithm: process.env.VNP_HASH_ALG || "SHA512",
      loggerFn: ignoreLogger,
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const amount = Number(order.totalPrice || 0);

    const paymentUrl = await vnpay.buildPaymentUrl({
      vnp_Amount: Math.round(amount),
      vnp_IpAddr:
        req.headers["x-forwarded-for"] ||
        req.socket.remoteAddress ||
        "127.0.0.1",
      vnp_TxnRef: String(order._id),
      vnp_OrderInfo: `Thanh toan don hang ${order._id}`,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: process.env.VNP_RETURN_URL,
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(new Date()),
      vnp_ExpireDate: dateFormat(tomorrow),
    });

    return res.json({ success: true, orderId: order._id, paymentUrl });
  } catch {
    // Nếu tạo đơn mới trong request này và lỗi, xóa luôn đơn pending
    if (createdNew && order?._id) {
      try {
        await Order.findByIdAndDelete(order._id);
      } catch {
        // ignore cleanup error
      }
    }
    return res.status(500).json({ success: false, message: "Tạo thanh toán VNPay thất bại" });
  }
});

router.get("/vnpay/return", async (req, res) => {
  try {
    const { vnp_TxnRef, vnp_ResponseCode } = req.query;
    if (!vnp_TxnRef) return res.status(400).send("Missing");

    const success = vnp_ResponseCode === "00";
    const feBase = process.env.FRONTEND_URL || "http://localhost:3000";

    if (success) {
      await Order.findByIdAndUpdate(vnp_TxnRef, { isPaid: true });
      return res.redirect(
        `${feBase}/order-success?orderId=${encodeURIComponent(vnp_TxnRef)}&status=success`
      );
    } else {
      // người dùng hủy/ thất bại: xóa đơn pending để không lưu trong lịch sử
      try { await Order.findByIdAndDelete(vnp_TxnRef); } catch {}
      return res.redirect(`${feBase}/order-success?status=failed`);
    }
  } catch {
    return res.status(500).send("Error");
  }
});

router.get("/vnpay/ipn", async (req, res) => {
  try {
    const { vnp_TxnRef, vnp_ResponseCode } = req.query;
    if (!vnp_TxnRef) return res.status(400).send("Missing");
    if (vnp_ResponseCode === "00") {
      await Order.findByIdAndUpdate(vnp_TxnRef, { isPaid: true });
      return res.send("OK");
    } else {
      // thất bại: xóa đơn pending
      try { await Order.findByIdAndDelete(vnp_TxnRef); } catch {}
      return res.send("FAILED");
    }
  } catch {
    return res.status(500).send("ERROR");
  }
});

export default router;