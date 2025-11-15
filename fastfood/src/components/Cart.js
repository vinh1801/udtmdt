import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [confirmRemove, setConfirmRemove] = useState({
    open: false,
    index: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  const syncCart = (items) => {
    setCartItems(items);
    localStorage.setItem("cart", JSON.stringify(items));
    window.dispatchEvent(new Event("cart-updated"));
  };

  const removeItem = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    syncCart(updatedCart);
  };

  const increaseQuantity = (index) => {
    const updated = cartItems.map((item, i) =>
      i === index ? { ...item, quantity: (item.quantity || 1) + 1 } : item
    );
    syncCart(updated);
  };

  const decreaseQuantity = (index) => {
    const currentQty = cartItems[index].quantity || 1;
    if (currentQty <= 1) {
      setConfirmRemove({ open: true, index });
      return;
    }
    const updated = cartItems.map((item, i) =>
      i === index ? { ...item, quantity: currentQty - 1 } : item
    );
    syncCart(updated);
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  const goToPayment = () => {
    if (cartItems.length === 0) {
      // Giỏ hàng trống đã có giao diện riêng hiển thị, không dùng alert
      return;
    }
    navigate("/payment", { state: { cart: cartItems, source: "cart" } });
  };

  const confirmDelete = () => {
    if (confirmRemove.index !== null) removeItem(confirmRemove.index);
    setConfirmRemove({ open: false, index: null });
  };

  const cancelDelete = () => setConfirmRemove({ open: false, index: null });

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "100px 40px 80px",
        background:
          "linear-gradient(135deg, rgba(26,0,51,0.95), rgba(59,0,120,0.9))",
        display: "flex",
        justifyContent: "center",
        fontFamily: "'Be Vietnam Pro','Poppins','Segoe UI',sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "950px",
          background:
            "linear-gradient(150deg, rgba(59,0,120,0.92), rgba(26,0,51,0.9))",
          borderRadius: "26px",
          padding: "48px 42px",
          color: "#fff",
          boxShadow: "0 30px 60px rgba(0,0,0,0.35)",
          border: "1px solid rgba(255,215,0,0.15)",
        }}
      >
        <motion.h2
          style={{
            color: "#FFD700",
            textShadow: "0 0 18px rgba(255,215,0,0.45)",
            fontWeight: 800,
            fontSize: "2.2rem",
            textAlign: "center",
            marginBottom: "38px",
            letterSpacing: "0.5px",
          }}
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
        >
          🛒 Giỏ hàng của bạn
        </motion.h2>

        <AnimatePresence>
          {cartItems.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              style={{
                textAlign: "center",
                background: "rgba(255,255,255,0.08)",
                borderRadius: "18px",
                padding: "45px 30px",
                border: "1px solid rgba(255,215,0,0.25)",
                color: "#FFD700",
              }}
            >
              Giỏ hàng của bạn đang trống 😢
              <br />
              <a
                href="/menu"
                style={{
                  color: "#FF33CC",
                  textDecoration: "underline",
                  marginTop: "12px",
                  display: "inline-block",
                }}
              >
                ➜ Quay lại thực đơn
              </a>
            </motion.div>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {cartItems.map((item, index) => (
                  <motion.div
                    key={`${item._id}-${index}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "18px",
                      padding: "18px 22px",
                      borderRadius: "18px",
                      background:
                        "linear-gradient(145deg, rgba(255,215,0,0.12), rgba(255,51,204,0.15))",
                      border: "1px solid rgba(255,215,0,0.18)",
                      boxShadow: "0 18px 30px rgba(0,0,0,0.25)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                      }}
                    >
                      <span
                        style={{
                          background: "rgba(255,215,0,0.2)",
                          borderRadius: "12px",
                          padding: "6px 12px",
                          fontWeight: 600,
                          color: "#FFD700",
                          minWidth: "36px",
                          textAlign: "center",
                        }}
                      >
                        #{index + 1}
                      </span>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: "1.05rem",
                            color: "#FFDDEE",
                          }}
                        >
                          {item.name}
                        </span>
                        <span style={{ fontSize: "0.9rem", color: "#d8c4ff" }}>
                          Giá:{" "}
                          <strong style={{ color: "#FF33CC" }}>
                            {item.price.toLocaleString()}đ
                          </strong>
                        </span>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "24px",
                        fontSize: "0.95rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          background: "rgba(255,255,255,0.08)",
                          padding: "6px 14px",
                          borderRadius: "999px",
                          border: "1px solid rgba(255,215,0,0.18)",
                        }}
                      >
                        <button
                          onClick={() => decreaseQuantity(index)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#FFD700",
                            fontSize: "1rem",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          –
                        </button>
                        <span
                          style={{
                            minWidth: "24px",
                            textAlign: "center",
                            color: "#FFD700",
                          }}
                        >
                          {item.quantity || 1}
                        </span>
                        <button
                          onClick={() => increaseQuantity(index)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#FFD700",
                            fontSize: "1rem",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          +
                        </button>
                      </div>

                      <div style={{ color: "#d8c4ff" }}>
                        Thành tiền:{" "}
                        <strong
                          style={{ color: "#FFD700", fontSize: "1.05rem" }}
                        >
                          {(item.price * (item.quantity || 1)).toLocaleString()}
                          đ
                        </strong>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  marginTop: "36px",
                  background: "rgba(0,0,0,0.15)",
                  borderRadius: "18px",
                  padding: "22px 28px",
                  border: "1px solid rgba(255,215,0,0.25)",
                  boxShadow: "0 18px 36px rgba(0,0,0,0.25)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    fontSize: "1.15rem",
                    color: "#FFD700",
                    fontWeight: 700,
                  }}
                >
                  Tổng cộng:{" "}
                  <span style={{ color: "#FF33CC" }}>
                    {totalPrice.toLocaleString()}đ
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={goToPayment}
                  style={{
                    background: "linear-gradient(90deg,#FFD700,#FF33CC)",
                    border: "none",
                    color: "#1a0033",
                    fontWeight: 700,
                    borderRadius: "999px",
                    padding: "12px 36px",
                    boxShadow: "0 12px 24px rgba(255,215,0,0.3)",
                    cursor: "pointer",
                  }}
                >
                  💳 Thanh toán
                </motion.button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {confirmRemove.open && confirmRemove.index !== null && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
        >
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(59,0,120,0.95), rgba(26,0,51,0.95))",
              borderRadius: "20px",
              padding: "32px 36px",
              color: "#fff",
              textAlign: "center",
              maxWidth: "360px",
              width: "100%",
              border: "1px solid rgba(255,215,0,0.25)",
              boxShadow: "0 25px 55px rgba(0,0,0,0.4)",
            }}
          >
            <h4 style={{ color: "#FFD700", marginBottom: "16px" }}>Xác nhận</h4>
            <p style={{ marginBottom: "24px", lineHeight: 1.5 }}>
              Số lượng món{" "}
              <strong>{cartItems[confirmRemove.index]?.name || ""}</strong> đã
              về 0. Bạn có chắc muốn xoá món này khỏi giỏ hàng?
            </p>
            <div
              style={{ display: "flex", justifyContent: "center", gap: "16px" }}
            >
              <button
                onClick={confirmDelete}
                style={{
                  background: "linear-gradient(90deg,#FF4D4D,#FF33CC)",
                  border: "none",
                  color: "#fff",
                  fontWeight: 700,
                  borderRadius: "999px",
                  padding: "10px 24px",
                  cursor: "pointer",
                  minWidth: "110px",
                }}
              >
                Đồng ý
              </button>
              <button
                onClick={cancelDelete}
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,215,0,0.3)",
                  color: "#FFD700",
                  fontWeight: 700,
                  borderRadius: "999px",
                  padding: "10px 24px",
                  cursor: "pointer",
                  minWidth: "110px",
                }}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
