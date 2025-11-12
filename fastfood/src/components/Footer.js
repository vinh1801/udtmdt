import React from "react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      className="text-center py-4 mt-5"
      style={{
        background: "linear-gradient(135deg, #1a0033, #3b0078)",
        borderTop: "1px solid rgba(255,215,0,0.3)",
        color: "#fff",
        boxShadow: "0 -2px 15px rgba(255,215,0,0.15)",
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h6
        style={{
          color: "#FFD700",
          fontWeight: "600",
          marginBottom: "8px",
          textShadow: "0 0 10px rgba(255,215,0,0.4)",
        }}
      >
        © 2025 TL-FastFood — Luxury Edition ✨
      </h6>

      <p
        style={{
          fontSize: "0.9rem",
          color: "#d1c6ff",
          margin: 0,
        }}
      >
        Designed & Developed by{" "}
        <span style={{ color: "#FF33CC", fontWeight: "600" }}>VINH :))</span> •
        All Rights Reserved 🍔
      </p>
    </motion.footer>
  );
}
