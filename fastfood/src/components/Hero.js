import React, { useEffect } from "react";
import heroImage from "../assets/logo.webp";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 900 });
  }, []);

  return (
    <motion.section
      id="hero"
      className="container-fluid d-flex align-items-center justify-content-center text-light"
      style={{
        minHeight: "90vh",
        background:
          "linear-gradient(135deg, rgba(59,0,120,0.95), rgba(26,0,51,0.95)), url('https://images.unsplash.com/photo-1600891963931-96053a50d1d5?auto=format&fit=crop&w=1600&q=80') center/cover no-repeat",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255,215,0,0.2)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      <div className="container py-5">
        <div className="row align-items-center text-center text-md-start">
          {/* Left Text Section */}
          <motion.div
            className="col-md-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <h1
              className="fw-bold mb-3"
              style={{
                fontSize: "2.8rem",
                color: "#FFD700",
                textShadow: "0 0 15px rgba(255,215,0,0.4)",
              }}
            >
              Ăn ngon mỗi ngày 🍗  
              <br /> Giao nhanh tận nơi 🚀
            </h1>

            <p
              style={{
                color: "#d1c6ff",
                fontSize: "1.1rem",
                lineHeight: "1.7",
                maxWidth: "90%",
              }}
            >
              Thưởng thức combo hấp dẫn, gà rán giòn rụm, khoai tây vàng giòn —
              đặt ngay để tận hưởng hương vị tuyệt vời từ TL-FastFood!
            </p>

            {/* Buttons */}
            <div className="mt-4 d-flex flex-wrap justify-content-center justify-content-md-start">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(255,215,0,0.5)",
                }}
                whileTap={{ scale: 0.95 }}
                className="btn fw-bold me-3 mb-3"
                style={{
                  background: "linear-gradient(90deg,#FFD700,#FF33CC)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "30px",
                  padding: "12px 28px",
                }}
                onClick={() => navigate("/menu")}
              >
                🍔 Xem Thực Đơn
              </motion.button>

              <motion.button
                whileHover={{
                  scale: 1.05,
                  background: "rgba(255,215,0,0.2)",
                  color: "#FFD700",
                }}
                whileTap={{ scale: 0.95 }}
                className="btn fw-bold border-warning text-light mb-3"
                style={{
                  borderRadius: "30px",
                  padding: "12px 28px",
                  borderWidth: "2px",
                }}
                onClick={() => {
                  const specials = document.getElementById("specials");
                  if (specials)
                    specials.scrollIntoView({ behavior: "smooth" });
                }}
              >
                🌟 Món Nổi Bật
              </motion.button>
            </div>
          </motion.div>

          {/* Right Image Section */}
          <motion.div
            className="col-md-6 text-center mt-5 mt-md-0"
            data-aos="fade-left"
          >
            <motion.img
              src={heroImage}
              alt="hero food"
              className="img-fluid"
              style={{
                maxHeight: "360px",
                borderRadius: "25px",
                boxShadow: "0 0 25px rgba(255,215,0,0.3)",
                background: "rgba(255,255,255,0.05)",
                padding: "10px",
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              whileHover={{ scale: 1.08, rotate: 2 }}
            />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
