import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/luxury.css";
import "../styles/custom.css";

export default function Menu() {
  const [foods, setFoods] = useState([]);
  const [category, setCategory] = useState("Tất cả");
  const navigate = useNavigate();

  // Lấy dữ liệu món ăn từ backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/foods")
      .then((res) => setFoods(res.data.data)) // ✅ FIX: res.data.data vì API trả object {data: [...]}
      .catch((err) => console.error("Lỗi tải món ăn:", err));
  }, []);

  // Lọc món theo danh mục
  const filteredFoods =
    category === "Tất cả"
      ? foods
      : foods.filter((f) => f.category === category);

  // Thêm vào giỏ hàng
  const addToCart = (food) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((i) => i._id === food._id);
    if (existing) existing.quantity += 1;
    else cart.push({ ...food, quantity: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`✅ Đã thêm ${food.name} vào giỏ hàng!`);
  };

  // Mua ngay
  const buyNow = (food) => {
    localStorage.setItem("checkoutItem", JSON.stringify(food));
    navigate("/checkout");
  };

  return (
    <div className="menu-page luxury-bg">
      <div className="menu-header fade-in">
        <h2 className="luxury-gold-glow">🍔 Thực Đơn Sang Trọng</h2>
        <p>
          Chọn món bạn thích — bấm <span>Thêm</span> hoặc <span>Mua ngay</span>
        </p>

        <div className="category-bar">
          {["Tất cả", "Burger", "Chicken", "Rice", "Side", "Drink", "Combo"].map(
            (cat) => (
              <button
                key={cat}
                className={category === cat ? "active" : ""}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            )
          )}
        </div>
      </div>

      <div className="menu-grid">
        {filteredFoods.length > 0 ? (
          filteredFoods.map((food) => (
            <motion.div
              className="food-card neon-border"
              key={food._id}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="food-img"
                onClick={() => navigate(`/product/${food._id}`)}
              >
                <img
                  src={`http://localhost:5000${food.image}`}
                  alt={food.name}
                  onError={(e) => {
                    e.target.src =
                      "https://cdn-icons-png.flaticon.com/512/3595/3595455.png";
                  }}
                />
              </div>
              <h3>{food.name}</h3>
              <p className="desc">
                {food.description?.length > 60
                  ? food.description.slice(0, 60) + "..."
                  : food.description}
              </p>
              <p className="price">{food.price.toLocaleString()}₫</p>

              <div className="food-actions">
                <button onClick={() => addToCart(food)} className="btn-add">
                  <FaShoppingCart /> Thêm
                </button>
                <button onClick={() => buyNow(food)} className="btn-buy">
                  Mua ngay
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="no-food">🍽 Không có món nào trong danh mục này!</p>
        )}
      </div>
    </div>
  );
}
