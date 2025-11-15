import React, { useEffect, useRef, useState } from "react";                                                                                                                                                                                                                                                                                                                                                                                                                                             //design by vinh (udtmdt nhóm 11)
import { NavLink, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaShoppingCart, FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [shake, setShake] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateCartCount = () => {
      try {
        const items = JSON.parse(localStorage.getItem("cart") || "[]");
        const total = items.reduce(
          (sum, item) => sum + (item.quantity || 1),
          0
        );
        setCartCount(total);
        setShake(total > 0);
      } catch {
        setCartCount(0);
      }
    };

    updateCartCount();
    const handleCustom = () => updateCartCount();

    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cart-updated", handleCustom);
    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cart-updated", handleCustom);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCartClick = () => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: "/cart" } } });
      return;
    }
    navigate("/cart");
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cart-updated"));
    } catch (e) {
      // ignore
    }
    logout();
    setShowUserMenu(false);
    navigate("/login");
  };

  const goToProfile = () => {
    setShowUserMenu(false);
    navigate("/profile"); // tạo route /profile hoặc đổi theo ý bạn
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`navbar navbar-expand-lg fixed-top ${
        isScrolled ? "shadow-lg" : ""
      }`}
      style={{
        background: isScrolled
          ? "rgba(26,0,51,0.95)"
          : "linear-gradient(90deg, rgba(59,0,120,0.9), rgba(26,0,51,0.9))",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255,215,0,0.3)",
        boxShadow: isScrolled ? "0 0 15px rgba(255,215,0,0.2)" : "none",
        transition: "all 0.4s ease",
        zIndex: 1000,
      }}
    >
      <div className="container">
        <NavLink
          to="/"
          className="navbar-brand fw-bold d-flex align-items-center"
          style={{
            color: "#FFD700",
            textShadow: "0 0 10px rgba(255,215,0,0.5)",
            letterSpacing: "1px",
          }}
        >
          <img
            src="https://cdn-icons-png.freepik.com/512/5235/5235253.png"
            alt="logo"
            width="38"
            height="38"
            className="me-2 rounded-circle"
            style={{ boxShadow: "0 0 10px rgba(255,215,0,0.6)" }}
          />
          TL-FastFood
        </NavLink>

        <button
          className="navbar-toggler text-light border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span
            className="navbar-toggler-icon"
            style={{ filter: "invert(1)" }}
          />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className="nav-link text-light fw-semibold" to="/">
                Trang chủ
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link text-light fw-semibold" to="/menu">
                Thực đơn
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link text-light fw-semibold" to="/orders">
                Đơn hàng
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center">
            {user ? (
              <div
                ref={userMenuRef}
                className="d-flex align-items-center position-relative me-3"
                style={{ gap: "12px" }}
              >
                <div
                  className="position-relative"
                  style={{ cursor: "pointer" }}
                  onClick={handleCartClick}
                >
                  <motion.div
                    animate={
                      shake
                        ? { rotate: [0, -15, 15, -10, 10, 0] }
                        : { rotate: 0 }
                    }
                    transition={{ duration: 0.6 }}
                  >
                    <FaShoppingCart
                      className="fs-4"
                      style={{ color: "#FFD700" }}
                    />
                  </motion.div>

                  <span
                    className="badge bg-warning text-dark position-absolute top-0 start-100 translate-middle"
                    style={{
                      fontSize: "0.7rem",
                      borderRadius: "50%",
                      boxShadow: "0 0 6px rgba(255,215,0,0.4)",
                    }}
                  >
                    {cartCount}
                  </span>
                </div>

                <button
                  onClick={() => setShowUserMenu((prev) => !prev)}
                  className="btn text-white fw-semibold d-flex align-items-center"
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(255,215,0,0.4)",
                    borderRadius: "999px",
                    padding: "6px 14px",
                    gap: "8px",
                  }}
                >
                  <span>{user.name}</span>
                  <FaChevronDown
                    style={{
                      transition: "transform 0.2s",
                      transform: showUserMenu
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                  />
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="position-absolute"
                      style={{
                        top: "120%",
                        right: 0,
                        minWidth: "220px",
                        background:
                          "linear-gradient(145deg, rgba(59,0,120,0.95), rgba(26,0,51,0.95))",
                        border: "1px solid rgba(255,215,0,0.25)",
                        borderRadius: "16px",
                        boxShadow: "0 0 25px rgba(255,215,0,0.3)",
                        padding: "16px",
                        color: "#fff",
                        zIndex: 1600,
                      }}
                    >
                      <p
                        className="mb-3"
                        style={{ color: "#ffd700", fontWeight: 600 }}
                      >
                        👋 Xin chào, {user.name}
                      </p>
                      <button
                        className="btn w-100 text-start mb-2"
                        style={{
                          background: "rgba(255,255,255,0.08)",
                          border: "1px solid rgba(255,215,0,0.2)",
                          borderRadius: "12px",
                          color: "#fff",
                          fontWeight: 500,
                        }}
                        onClick={goToProfile}
                      >
                        Thông tin cá nhân
                      </button>
                      <button
                        className="btn w-100"
                        style={{
                          background: "linear-gradient(90deg,#FFD700,#FF33CC)",
                          border: "none",
                          borderRadius: "12px",
                          color: "#1a0033",
                          fontWeight: 700,
                          marginTop: "6px",
                        }}
                        onClick={handleLogout}
                      >
                        Đăng xuất
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    background: "linear-gradient(90deg,#FFD700,#FF33CC)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="btn fw-bold text-dark me-2"
                  style={{
                    background: "linear-gradient(90deg,#FFD700,#FF33CC)",
                    border: "none",
                    borderRadius: "20px",
                  }}
                  onClick={() => navigate("/login")}
                >
                  Đăng nhập
                </motion.button>

                <motion.button
                  whileHover={{
                    scale: 1.05,
                    background: "rgba(255,255,255,0.2)",
                    color: "#FFD700",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="btn text-white fw-bold"
                  style={{
                    border: "1px solid rgba(255,215,0,0.5)",
                    borderRadius: "20px",
                  }}
                  onClick={() => navigate("/register")}
                >
                  Đăng ký
                </motion.button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
