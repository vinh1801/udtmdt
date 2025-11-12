import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Header() {
  return (
    <motion.nav
      className="navbar navbar-expand-lg fixed-top"
      style={{
        background: "rgba(26, 0, 51, 0.8)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255,215,0,0.3)",
        boxShadow: "0 0 20px rgba(255,215,0,0.15)",
      }}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        {/* Logo */}
        <Link
          to="/"
          className="navbar-brand d-flex align-items-center fw-bold"
          style={{
            color: "#FFD700",
            textShadow: "0 0 10px rgba(255,215,0,0.4)",
            fontSize: "1.3rem",
            letterSpacing: "1px",
          }}
        >
          <img
            src="https://i.imgur.com/7b1xwZP.png"
            alt="logo"
            width="40"
            height="40"
            className="me-2 rounded-circle"
            style={{
              boxShadow: "0 0 10px rgba(255,215,0,0.5)",
            }}
          />
          TL-FastFood
        </Link>

        {/* Toggle button */}
        <button
          className="navbar-toggler text-white border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span
            className="navbar-toggler-icon"
            style={{
              filter: "invert(1)",
            }}
          ></span>
        </button>

        {/* Nav links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link
                to="/"
                className="nav-link fw-semibold"
                style={{ color: "#FFD700" }}
              >
                Trang chủ
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/menu"
                className="nav-link fw-semibold text-white"
              >
                Thực đơn
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/cart"
                className="nav-link fw-semibold text-white"
              >
                Giỏ hàng
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/login"
                className="nav-link fw-semibold text-white"
              >
                Đăng nhập
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/register"
                className="nav-link fw-semibold text-white"
              >
                Đăng ký
              </Link>
            </li>
          </ul>

          {/* Cart Icon */}
          <Link to="/cart" className="ms-3 position-relative">
            <motion.div
              whileHover={{ scale: 1.2 }}
              style={{
                background: "linear-gradient(90deg,#FFD700,#FF33CC)",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 15px rgba(255,215,0,0.3)",
              }}
            >
              <i className="bi bi-cart4" style={{ color: "#fff", fontSize: "1.2rem" }}></i>
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
