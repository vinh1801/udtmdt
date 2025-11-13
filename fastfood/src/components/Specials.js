import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getAllFoods } from "../services/foodService";

export default function Specials() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 900 });
  }, []);

  useEffect(() => {
    (async () => {
      try {
        // Lấy món có discountPercent > 0, sắp xếp giảm dần
        const res = await getAllFoods({ special: true, limit: 12 });
        setItems(res?.data || []);
      } catch (e) {
        setItems([]);
      }
    })();
  }, []);

  const goToMenuWithFocus = (foodId) => {
    navigate("/menu", { state: { focusId: foodId } });
  };

  return (
    <section
      id="specials"
      className="py-5"
      style={{
        background:
          "linear-gradient(145deg, rgba(59,0,120,0.9), rgba(26,0,51,0.95))",
        color: "#fff",
      }}
    >
      <div className="container text-center" data-aos="fade-up">
        <h2
          className="fw-bold mb-3"
          style={{
            color: "#FFD700",
            textShadow: "0 0 10px rgba(255,215,0,0.5)",
          }}
        >
          🌟 Ưu Đãi Nổi Bật
        </h2>
        <p className="mb-5 text-light">
          Những combo có khuyến mãi cao nhất hôm nay!
        </p>

        <div className="row justify-content-center">
          {items.map((item) => (
            <motion.div
              key={item._id}
              className="col-10 col-sm-6 col-md-4 mb-4"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 25px rgba(255,215,0,0.3)",
              }}
              transition={{ duration: 0.3 }}
              data-aos="zoom-in"
            >
              <div
                className="card text-light border-0 shadow position-relative"
                style={{
                  borderRadius: "18px",
                  background:
                    "linear-gradient(145deg, rgba(80,0,150,0.95), rgba(30,0,60,0.95))",
                  overflow: "hidden",
                }}
              >
                {item.discountPercent > 0 && (
                  <div
                    className="position-absolute"
                    style={{
                      top: 10,
                      left: 10,
                      background: "rgba(255, 51, 204, 0.9)",
                      padding: "6px 10px",
                      borderRadius: 10,
                      fontWeight: 800,
                      fontSize: 12,
                    }}
                  >
                    -{item.discountPercent}%
                  </div>
                )}

                <motion.img
                  src={`http://localhost:5000${item.image}`}
                  alt={item.name}
                  className="card-img-top"
                  style={{
                    height: "200px",
                    objectFit: "cover",
                    borderTopLeftRadius: "18px",
                    borderTopRightRadius: "18px",
                    transition: "0.3s",
                  }}
                  whileHover={{ scale: 1.08 }}
                  onError={(e) => {
                    e.target.src =
                      "https://cdn-icons-png.flaticon.com/512/3595/3595455.png";
                  }}
                />
                <div className="card-body">
                  <h6
                    className="fw-bold mb-2"
                    style={{ color: "#FFD700", fontSize: "1.1rem" }}
                  >
                    {item.name}
                  </h6>

                  <div className="mb-2">
                    {item.discountPercent > 0 ? (
                      <>
                        <span
                          className="me-2"
                          style={{ textDecoration: "line-through", opacity: 0.7 }}
                        >
                          {item.price?.toLocaleString()}đ
                        </span>
                        <span className="fw-bold" style={{ color: "#FF33CC" }}>
                          {item.finalPrice?.toLocaleString()}đ
                        </span>
                      </>
                    ) : (
                      <span className="fw-semibold">
                        {item.price?.toLocaleString()}đ
                      </span>
                    )}
                  </div>

                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      background:
                        "linear-gradient(90deg,#FFD700,#FF33CC,#FF33CC)",
                    }}
                    whileTap={{ scale: 0.9 }}
                    className="btn btn-sm fw-bold text-dark"
                    style={{
                      background: "linear-gradient(90deg,#FFD700,#FF33CC)",
                      border: "none",
                      borderRadius: "25px",
                      padding: "8px 20px",
                    }}
                    onClick={() => goToMenuWithFocus(item._id)}
                  >
                    🛒 Đặt ngay
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
          {items.length === 0 && (
            <div className="text-light">Chưa có món ưu đãi.</div>
          )}
        </div>
      </div>
    </section>
  );
}
