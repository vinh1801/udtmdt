import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";

const specials = [
  {
    id: 1,
    name: "Combo Burger Bò Phô Mai",
    price: "89.000đ",
    image: "https://i.imgur.com/UKZ4Hsd.jpeg",
  },
  {
    id: 2,
    name: "Gà Rán Giòn Cay + Nước",
    price: "75.000đ",
    image: "https://i.imgur.com/XzLtrnU.jpeg",
  },
  {
    id: 3,
    name: "Khoai Tây + Gà Viên + Pepsi",
    price: "65.000đ",
    image: "https://i.imgur.com/hDnHKxT.jpeg",
  },
];

export default function Specials() {
  useEffect(() => {
    AOS.init({ duration: 900 });
  }, []);

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
          Những combo được yêu thích nhất hôm nay — đặt liền tay kẻo hết!
        </p>

        <div className="row justify-content-center">
          {specials.map((item) => (
            <motion.div
              key={item.id}
              className="col-10 col-sm-6 col-md-4 mb-4"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 25px rgba(255,215,0,0.3)",
              }}
              transition={{ duration: 0.3 }}
              data-aos="zoom-in"
            >
              <div
                className="card text-light border-0 shadow"
                style={{
                  borderRadius: "18px",
                  background:
                    "linear-gradient(145deg, rgba(80,0,150,0.95), rgba(30,0,60,0.95))",
                  overflow: "hidden",
                }}
              >
                <motion.img
                  src={item.image}
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
                />
                <div className="card-body">
                  <h6
                    className="fw-bold mb-2"
                    style={{ color: "#FFD700", fontSize: "1.1rem" }}
                  >
                    {item.name}
                  </h6>
                  <p className="text-light fw-semibold mb-2">
                    💰 {item.price}
                  </p>
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
                  >
                    🛒 Đặt ngay
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
