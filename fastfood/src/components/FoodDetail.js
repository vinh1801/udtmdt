import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { getFoodById } from "../services/foodService";

export default function FoodDetail() {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFood = async () => {
      setLoading(true);
      const result = await getFoodById(id);
      setFood(result);
      setLoading(false);
    };
    fetchFood();
  }, [id]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const ensureLoggedIn = () => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: `/food/${id}` } } });
      return false;
    }
    return true;
  };

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => {
      if (prev >= 10) {
        showToast("🔥 Tối đa 10 món mỗi lần thêm.");
        return 10;
      }
      return prev + 1;
    });
  };

  const handleQuantityInput = (value) => {
    const parsed = parseInt(value, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setQuantity(1);
      return;
    }
    if (parsed > 10) {
      showToast("🔥 Tối đa 10 món mỗi lần thêm. Đã đặt lại là 10.");
      setQuantity(10);
      return;
    }
    setQuantity(parsed);
  };

  const addToCart = () => {
    if (!ensureLoggedIn() || !food) return;

    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = storedCart.find((item) => item._id === food._id);

    if (existing) existing.quantity = (existing.quantity || 1) + quantity;
    else storedCart.push({ ...food, quantity });

    localStorage.setItem("cart", JSON.stringify(storedCart));
    window.dispatchEvent(new Event("cart-updated"));
    showToast(`✅ Đã thêm ${quantity} × ${food.name} vào giỏ hàng!`);
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-warning" role="status"></div>
        <p className="mt-3 text-light">Đang tải chi tiết món ăn...</p>
      </div>
    );

  if (!food)
    return (
      <div className="text-center mt-5 text-light">Không tìm thấy món ăn.</div>
    );

  return (
    <div
      className="container py-5"
      style={{
        color: "#fff",
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, rgba(59,0,120,0.9), rgba(26,0,51,0.95))",
        borderRadius: "20px",
        boxShadow: "0 0 40px rgba(255,215,0,0.15)",
      }}
    >
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          style={{
            position: "fixed",
            top: 80,
            right: 20,
            background: "rgba(255, 51, 204, 0.9)",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: "12px",
            boxShadow: "0 0 15px rgba(255, 51, 204, 0.4)",
            zIndex: 2000,
          }}
        >
          {toast}
        </motion.div>
      )}

      <div className="row justify-content-center align-items-center">
        <motion.div
          className="col-md-6 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.img
            src={food.image}
            alt={food.name}
            className="img-fluid rounded shadow-lg mb-4"
            style={{
              borderRadius: "18px",
              boxShadow: "0 0 25px rgba(255,215,0,0.3)",
              maxHeight: "400px",
              objectFit: "cover",
            }}
            whileHover={{ scale: 1.05 }}
          />

          <h2
            className="fw-bold mb-3"
            style={{
              color: "#FFD700",
              textShadow: "0 0 15px rgba(255,215,0,0.5)",
            }}
          >
            {food.name}
          </h2>
          <p className="text-light mb-3">{food.description}</p>

          <h4 style={{ color: "#FF33CC" }}>
            💰 Giá: {food.price?.toLocaleString()}đ
          </h4>

          <p className="mt-2">
            <strong style={{ color: "#FFD700" }}>Danh mục:</strong>{" "}
            <span style={{ color: "#d8bfff" }}>{food.category}</span>
          </p>

          <div
            className="d-inline-flex align-items-center gap-2 my-3"
            style={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: "999px",
              padding: "6px 14px",
              border: "1px solid rgba(255,215,0,0.25)",
            }}
          >
            <button
              className="btn btn-sm text-light fw-bold"
              style={{
                background: "transparent",
                border: "none",
                fontSize: "1.1rem",
                lineHeight: 1,
              }}
              onClick={handleDecrease}
            >
              –
            </button>
            <input
              type="number"
              className="form-control form-control-sm text-center"
              inputMode="numeric"
              pattern="[0-9]*"
              value={quantity}
              min={1}
              max={10}
              onChange={(e) => handleQuantityInput(e.target.value)}
              style={{
                width: "60px",
                background: "transparent",
                border: "none",
                color: "#FFD700",
                fontWeight: 600,
                fontSize: "1rem",
              }}
            />
            <button
              className="btn btn-sm text-light fw-bold"
              style={{
                background: "transparent",
                border: "none",
                fontSize: "1.1rem",
                lineHeight: 1,
              }}
              onClick={handleIncrease}
            >
              +
            </button>
          </div>

          <motion.button
            className="btn fw-bold mt-3"
            onClick={addToCart}
            whileTap={{ scale: 0.95 }}
            style={{
              background: "linear-gradient(90deg,#FFD700,#FF33CC)",
              border: "none",
              borderRadius: "30px",
              padding: "12px 40px",
              color: "#fff",
              boxShadow: "0 0 20px rgba(255,215,0,0.4)",
              transition: "0.3s",
            }}
          >
            🛒 Thêm vào giỏ hàng
          </motion.button>

          <div className="mt-4">
            <a
              href="/menu"
              style={{
                color: "#FFD700",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              ← Quay lại Thực đơn
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
