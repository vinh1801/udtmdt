import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { createVnpayPayment } from "../services/paymentService";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });

  const source = location.state?.source || "cart";

  useEffect(() => {
    const stateCart = location.state?.cart;
    if (stateCart && stateCart.length > 0) {
      setCart(stateCart);
    } else {
      const stored = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(stored);
    }
  }, [location.state]);

  const total = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validateContactInfo = () => {
    if (!form.name || !form.phone || !form.address) {
      alert("Vui lòng nhập họ tên, số điện thoại và địa chỉ giao hàng.");
      return false;
    }
    return true;
  };

  const resetCartIfNeeded = () => {
    if (source === "cart") {
      localStorage.removeItem("cart");
    }
    window.dispatchEvent(new Event("cart-updated"));
  };

  const handleCashPayment = () => {
    if (cart.length === 0) {
      alert("Giỏ hàng đang trống! Quay lại chọn món nhé 🍔");
      return navigate("/menu");
    }
    if (!validateContactInfo()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      resetCartIfNeeded();
      navigate("/order-success", {
        replace: true,
        state: {
          order: {
            items: cart,
            total,
            customer: {
              name: form.name,
              phone: form.phone,
              address: form.address,
              note: form.note || "",
            },
            method: "Thanh toán khi nhận hàng",
            createdAt: new Date().toISOString(),
          },
        },
      });
    }, 1200);
  };

  const handleVnpayPayment = async () => {
    if (cart.length === 0) {
      alert("Giỏ hàng đang trống! Quay lại chọn món nhé 🍔");
      return;
    }
    if (!validateContactInfo()) return;

    try {
      setLoading(true);

      const items = cart.map((i) => ({
        foodId: i._id || i.foodId, // giữ tương thích khi item có _id hoặc foodId
        name: i.name,
        price: i.price,
        quantity: i.quantity || 1,
      }));

      const payload = {
        customer: {
          name: form.name,
          phone: form.phone,
          address: form.address,
          note: form.note || "",
        },
        items,
        totalPrice: total,
        method: "CARD",
      };

      const result = await createVnpayPayment(payload);
      if (result?.success && result?.paymentUrl) {
        // chuyển hướng sang cổng VNPay
        window.location.href = result.paymentUrl;
      } else {
        setLoading(false);
        alert("Không tạo được link thanh toán. Vui lòng thử lại.");
      }
    } catch (e) {
      console.error("Create VNPay payment error:", e);
      setLoading(false);
      alert("Có lỗi khi tạo thanh toán VNPay. Thử lại sau.");
    }
  };

  if (cart.length === 0 && !loading) {
    return (
      <div className="text-center text-light py-5">
        <h3>😢 Không có sản phẩm nào để thanh toán.</h3>
        <button
          onClick={() => navigate("/menu")}
          className="btn mt-3"
          style={{
            background: "linear-gradient(90deg,#FFD700,#FF33CC)",
            color: "#1a0033",
            borderRadius: "10px",
            border: "none",
          }}
        >
          ➜ Quay lại thực đơn
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        style={{
          height: "80vh",
          color: "#FFD700",
          background:
            "linear-gradient(135deg, rgba(26,0,51,0.95), rgba(59,0,120,0.9))",
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          style={{
            width: "70px",
            height: "70px",
            border: "6px solid rgba(255,215,0,0.3)",
            borderTopColor: "#FF33CC",
            borderRadius: "50%",
            marginBottom: "20px",
          }}
        ></motion.div>
        <h4 className="fw-bold">Đang xử lý thanh toán...</h4>
      </div>
    );
  }

  return (
    <div className="container py-5 text-light">
      <motion.h2
        className="fw-bold text-center mb-4"
        style={{ color: "#FFD700", textShadow: "0 0 10px rgba(255,215,0,0.5)" }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        💳 Xác nhận thanh toán
      </motion.h2>

      <div className="row justify-content-center">
        <motion.div
          className="col-md-5 mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div
            className="p-4 rounded"
            style={{
              background:
                "linear-gradient(145deg, rgba(59,0,120,0.9), rgba(26,0,51,0.9))",
              border: "1px solid rgba(255,215,0,0.3)",
              boxShadow: "0 0 20px rgba(255,215,0,0.3)",
            }}
          >
            <h5 className="text-warning mb-3">🛍️ Đơn hàng của bạn</h5>
            {cart.map((item, i) => (
              <div
                key={i}
                className="d-flex justify-content-between mb-2"
                style={{ fontSize: "0.95rem" }}
              >
                <span>
                  {item.name} × {item.quantity || 1}
                </span>
                <span>
                  {(item.price * (item.quantity || 1)).toLocaleString()}đ
                </span>
              </div>
            ))}
            <hr style={{ borderColor: "rgba(255,215,0,0.3)" }} />
            <h5 className="text-end text-warning">
              Tổng cộng: {total.toLocaleString()}đ
            </h5>
          </div>

          <div
            className="p-4 rounded mt-4"
            style={{
              background:
                "linear-gradient(145deg, rgba(59,0,120,0.9), rgba(26,0,51,0.9))",
              border: "1px solid rgba(255,215,0,0.3)",
              boxShadow: "0 0 20px rgba(255,215,0,0.3)",
            }}
          >
            <h5 className="text-warning mb-3">🚚 Phương thức thanh toán</h5>
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="radio"
                name="paymentMethod"
                id="methodCod"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              <label className="form-check-label" htmlFor="methodCod">
                Thanh toán khi nhận hàng (COD)
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="paymentMethod"
                id="methodVnpay"
                value="vnpay"
                checked={paymentMethod === "vnpay"}
                onChange={() => setPaymentMethod("vnpay")}
              />
              <label className="form-check-label" htmlFor="methodVnpay">
                Thanh toán qua VNPay
              </label>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="col-md-5"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div
            className="p-4 rounded"
            style={{
              background:
                "linear-gradient(145deg, rgba(59,0,120,0.9), rgba(26,0,51,0.9))",
              border: "1px solid rgba(255,215,0,0.3)",
              boxShadow: "0 0 20px rgba(255,215,0,0.3)",
            }}
          >
            <h5 className="text-warning mb-3">📮 Thông tin giao hàng</h5>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-3">
                <label className="form-label">Họ và tên</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Số điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  placeholder="0912 345 678"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Địa chỉ giao hàng</label>
                <textarea
                  name="address"
                  className="form-control"
                  rows={2}
                  value={form.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Ghi chú cho tài xế (tuỳ chọn)
                </label>
                <textarea
                  name="note"
                  className="form-control"
                  rows={2}
                  placeholder="Ví dụ: gọi trước khi giao, gửi thêm nước chấm..."
                  value={form.note}
                  onChange={handleChange}
                />
              </div>

              <motion.button
                type="button"
                className="btn fw-bold w-100 mt-3"
                style={{
                  background: "linear-gradient(90deg,#FFD700,#FF33CC)",
                  color: "#1a0033",
                  borderRadius: "10px",
                  border: "none",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
                onClick={
                  paymentMethod === "cod"
                    ? handleCashPayment
                    : handleVnpayPayment
                }
              >
                {paymentMethod === "cod"
                  ? "Xác nhận thanh toán khi nhận hàng"
                  : "Thanh toán qua VNPay"}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}