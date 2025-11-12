import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  const formattedDate = useMemo(() => {
    if (!order?.createdAt) return "";
    return new Date(order.createdAt).toLocaleString("vi-VN");
  }, [order]);

  if (!order) {
    return (
      <div className="text-center text-light py-5">
        <h3>Không tìm thấy đơn hàng.</h3>
        <button
          className="btn mt-3"
          style={{
            background: "linear-gradient(90deg,#FFD700,#FF33CC)",
            color: "#1a0033",
            borderRadius: "10px",
            border: "none",
          }}
          onClick={() => navigate("/menu")}
        >
          ➜ Quay lại thực đơn
        </button>
      </div>
    );
  }

  return (
    <div
      className="container py-5 text-light"
      style={{
        minHeight: "70vh",
      }}
    >
      <motion.div
        className="mx-auto p-4 rounded"
        style={{
          maxWidth: "640px",
          background:
            "linear-gradient(145deg, rgba(59,0,120,0.9), rgba(26,0,51,0.9))",
          border: "1px solid rgba(255,215,0,0.3)",
          boxShadow: "0 0 25px rgba(255,215,0,0.3)",
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2
          className="text-center fw-bold mb-3"
          style={{
            color: "#FFD700",
            textShadow: "0 0 10px rgba(255,215,0,0.5)",
          }}
        >
          🎉 Đặt hàng thành công!
        </h2>
        <p className="text-center mb-4">
          Cảm ơn <strong>{order.customer.name}</strong> đã đặt hàng tại
          TL-FastFood.
        </p>

        <div className="mb-4">
          <h5 className="text-warning">📦 Thông tin đơn hàng</h5>
          <ul className="list-unstyled mt-3">
            {order.items.map((item, idx) => (
              <li
                key={idx}
                className="d-flex justify-content-between mb-2"
                style={{ borderBottom: "1px dashed rgba(255,215,0,0.3)" }}
              >
                <span>
                  {item.name} × {item.quantity || 1}
                </span>
                <span>
                  {(item.price * (item.quantity || 1)).toLocaleString()}đ
                </span>
              </li>
            ))}
          </ul>
          <div className="d-flex justify-content-between fw-bold mt-2">
            <span>Tổng cộng:</span>
            <span style={{ color: "#FF33CC" }}>
              {order.total.toLocaleString()}đ
            </span>
          </div>
        </div>

        <div className="mb-4">
          <h5 className="text-warning">🚚 Giao tới</h5>
          <p>
            Địa chỉ: {order.customer.address}
            <br />
            Số điện thoại: {order.customer.phone}
            <br />
            {order.customer.note && (
              <>
                Ghi chú: {order.customer.note}
                <br />
              </>
            )}
            Phương thức: {order.method}
            <br />
            Thời gian: {formattedDate}
          </p>
        </div>

        <div className="d-flex justify-content-center gap-3">
          <button
            className="btn"
            style={{
              background: "linear-gradient(90deg,#FFD700,#FF33CC)",
              color: "#1a0033",
              borderRadius: "10px",
              border: "none",
            }}
            onClick={() => navigate("/menu")}
          >
            ➜ Tiếp tục đặt món
          </button>
          <button
            className="btn btn-outline-light"
            style={{
              borderRadius: "10px",
              border: "1px solid rgba(255,215,0,0.5)",
            }}
            onClick={() => navigate("/")}
          >
            Về trang chủ
          </button>
        </div>
      </motion.div>
    </div>
  );
}
