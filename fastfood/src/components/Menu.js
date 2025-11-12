import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getAllFoods } from "../services/foodService";

export default function Menu() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState(["Tất cả"]);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchFoods = async () => {
      setLoading(true);
      try {
        const res = await getAllFoods();
        const data = res?.data || [];
        setFoods(data);

        const uniqueCats = Array.from(
          new Set(data.map((item) => item.category))
        );
        setCategories(["Tất cả", ...uniqueCats]);
      } catch (err) {
        console.error("❌ Lỗi khi gọi API:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  const filteredFoods =
    selectedCategory === "Tất cả"
      ? foods
      : foods.filter((item) => item.category === selectedCategory);

  const ensureLoggedIn = (redirectPath) => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: redirectPath } } });
      return false;
    }
    return true;
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleDecrease = (id) => {
    const current = quantities[id] ?? 1;
    const next = Math.max(current - 1, 1);
    setQuantities((prev) => ({ ...prev, [id]: next }));
  };

  const handleIncrease = (id) => {
    const current = quantities[id] ?? 1;
    if (current >= 10) {
      showToast("🔥 Tối đa 10 món mỗi lần thêm.");
      return;
    }
    const next = Math.min(current + 1, 10);
    setQuantities((prev) => ({ ...prev, [id]: next }));
  };

  const handleQuantityInput = (id, value) => {
    const parsed = parseInt(value, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setQuantities((prev) => ({ ...prev, [id]: 1 }));
      return;
    }
    if (parsed > 10) {
      showToast("🔥 Tối đa 10 món mỗi lần thêm. Đã đặt lại là 10.");
      setQuantities((prev) => ({ ...prev, [id]: 10 }));
      return;
    }
    setQuantities((prev) => ({ ...prev, [id]: parsed }));
  };

  const handleAddToCart = (item) => {
    if (!ensureLoggedIn("/menu")) return;

    const quantity = quantities[item._id] ?? 1;
    const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cartData.find((f) => f._id === item._id);

    if (existing) existing.quantity = (existing.quantity || 1) + quantity;
    else cartData.push({ ...item, quantity });

    localStorage.setItem("cart", JSON.stringify(cartData));
    window.dispatchEvent(new Event("cart-updated"));
    showToast(`✅ Đã thêm ${quantity} × ${item.name} vào giỏ hàng!`);
  };

  const handleBuyNow = (item) => {
    if (!ensureLoggedIn("/payment")) return;
    const checkoutItem = { ...item, quantity: 1 };
    navigate("/payment", {
      state: { cart: [checkoutItem], source: "buy-now" },
    });
  };

  const handleViewDetail = (id) => navigate(`/food/${id}`);

  if (loading)
    return (
      <div className="text-center mt-5 text-light">
        <div className="spinner-border text-warning" role="status"></div>
        <p className="mt-3">Đang tải menu...</p>
      </div>
    );

  return (
    <div
      className="container py-5"
      style={{
        color: "#fff",
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

      <h2
        className="text-center fw-bold mb-2"
        style={{
          color: "#FFD700",
          textShadow: "0 0 10px rgba(255,215,0,0.5)",
        }}
      >
        🍔 Thực Đơn
      </h2>
      <p className="text-center mb-4" style={{ color: "#d1c6ff" }}>
        Chọn món bạn thích — bấm{" "}
        <strong style={{ color: "#FF33CC" }}>Thêm</strong> để đặt nhanh
      </p>

      <div className="d-flex justify-content-center flex-wrap mb-5 gap-2">
        {categories.map((cat) => (
          <motion.button
            key={cat}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => setSelectedCategory(cat)}
            className={`btn ${
              selectedCategory === cat
                ? "text-dark"
                : "text-warning border-warning"
            } fw-semibold rounded-pill px-3 py-1`}
            style={{
              background:
                selectedCategory === cat
                  ? "linear-gradient(90deg,#FFD700,#FF33CC)"
                  : "transparent",
              border:
                selectedCategory === cat
                  ? "none"
                  : "1px solid rgba(255,215,0,0.5)",
              boxShadow:
                selectedCategory === cat
                  ? "0 0 15px rgba(255,215,0,0.4)"
                  : "none",
            }}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      <div className="row justify-content-center">
        <AnimatePresence mode="wait">
          {filteredFoods.length > 0 ? (
            filteredFoods.map((item) => {
              const qty = quantities[item._id] ?? 1;
              return (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.3 }}
                  className="col-10 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center"
                >
                  <motion.div
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 0 25px rgba(255,215,0,0.2)",
                    }}
                    className="card text-center"
                    style={{
                      background:
                        "linear-gradient(145deg, rgba(59,0,120,0.95), rgba(26,0,51,0.95))",
                      borderRadius: "18px",
                      border: "1px solid rgba(255,215,0,0.15)",
                      color: "#fff",
                      cursor: "pointer",
                      overflow: "hidden",
                      width: "100%",
                      maxWidth: "260px",
                    }}
                  >
                    <motion.img
                      src={`http://localhost:5000${item.image}`}
                      alt={item.name}
                      className="card-img-top"
                      style={{
                        height: "180px",
                        objectFit: "cover",
                        borderTopLeftRadius: "18px",
                        borderTopRightRadius: "18px",
                        transition: "0.3s",
                      }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleViewDetail(item._id)}
                      onError={(e) => {
                        e.target.src =
                          "https://cdn-icons-png.flaticon.com/512/3595/3595455.png";
                      }}
                    />
                    <div className="card-body">
                      <h6
                        className="fw-bold"
                        style={{ color: "#FFD700", fontSize: "1.1rem" }}
                      >
                        {item.name}
                      </h6>

                      <div
                        className="mb-2"
                        style={{
                          fontSize: "0.85rem",
                          color: "#ffb3ff",
                          minHeight: "40px",
                        }}
                      >
                        {item.description?.length > 45
                          ? item.description.slice(0, 45) + "..."
                          : item.description}
                      </div>

                      <p className="text-light mb-3 fw-semibold">
                        💰 {item.price?.toLocaleString()}đ
                      </p>

                      <div
                        className="d-flex justify-content-center align-items-center gap-2 mb-3"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          borderRadius: "999px",
                          padding: "4px 10px",
                          border: "1px solid rgba(255,215,0,0.25)",
                        }}
                      >
                        <button
                          className="btn btn-sm text-light fw-bold"
                          style={{
                            background: "transparent",
                            border: "none",
                            fontSize: "1rem",
                            lineHeight: 1,
                          }}
                          onClick={() => handleDecrease(item._id)}
                        >
                          –
                        </button>
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          className="form-control form-control-sm text-center"
                          value={qty}
                          min={1}
                          max={10}
                          onChange={(e) =>
                            handleQuantityInput(item._id, e.target.value)
                          }
                          style={{
                            width: "48px",
                            background: "transparent",
                            border: "none",
                            color: "#FFD700",
                            fontWeight: 600,
                          }}
                        />
                        <button
                          className="btn btn-sm text-light fw-bold"
                          style={{
                            background: "transparent",
                            border: "none",
                            fontSize: "1rem",
                            lineHeight: 1,
                          }}
                          onClick={() => handleIncrease(item._id)}
                        >
                          +
                        </button>
                      </div>

                      <div className="d-flex justify-content-center gap-2">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          whileHover={{
                            scale: 1.05,
                            background:
                              "linear-gradient(90deg,#FFD700,#FF33CC,#FF33CC)",
                            color: "#fff",
                          }}
                          className="btn btn-outline-warning btn-sm rounded-pill px-3 fw-semibold"
                          onClick={() => handleAddToCart(item)}
                        >
                          🛒 Thêm
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          whileHover={{
                            scale: 1.05,
                            background:
                              "linear-gradient(90deg,#FF33CC,#FFD700)",
                            color: "#fff",
                          }}
                          className="btn btn-outline-warning btn-sm rounded-pill px-3 fw-semibold"
                          onClick={() => handleBuyNow(item)}
                        >
                          💳 Mua ngay
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })
          ) : (
            <p className="text-center text-light fs-5">
              🍽 Không có món nào trong danh mục này!
            </p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
