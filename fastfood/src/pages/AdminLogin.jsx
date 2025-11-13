import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../hooks/useAdminAuth";

export default function AdminLogin() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/admin";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setSubmitting(true);
    try {
      const data = await login({ identifier, password });
      if (data?.user?.role !== "admin") {
        logout();
        setErr("Tài khoản không có quyền quản trị.");
        setSubmitting(false);
        return;
      }
      navigate(from.startsWith("/admin") ? from : "/admin", { replace: true });
    } catch (error) {
      setErr(error?.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #0f0b22 0%, #140a33 60%, #000 100%)",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(155deg, rgba(255,255,255,0.05), rgba(160,130,255,0.07))",
          backdropFilter: "blur(20px)",
          borderRadius: "16px",
          padding: "40px 36px",
          maxWidth: "420px",
          width: "100%",
          color: "white",
          boxShadow: "0 0 26px rgba(255, 215, 0, 0.18)",
          border: "1px solid rgba(255,215,0,0.25)",
          textAlign: "center",
        }}
      >
        <div style={{ marginBottom: 14 }}>
          <span
            style={{
              display: "inline-flex",
              width: 42,
              height: 42,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              background:
                "linear-gradient(135deg, rgba(255,215,0,0.25), rgba(255,51,204,0.35))",
              border: "1px solid rgba(255,215,0,0.35)",
              color: "#FFD700",
              fontWeight: 800,
            }}
          >
            A
          </span>
        </div>
        <h2
          style={{
            color: "#ffd700",
            fontSize: "1.6rem",
            fontWeight: "800",
            marginBottom: "22px",
            textShadow: "0 0 15px rgba(255, 215, 0, 0.45)",
          }}
        >
          Đăng nhập Quản trị
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Tên đăng nhập hoặc Email"
            style={inputStyle}
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            style={inputStyle}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {err && (
            <div style={{ color: "#ff9b9b", marginBottom: 10 }}>{err}</div>
          )}
          <button style={buttonStyle} disabled={submitting} type="submit">
            {submitting ? "Đang đăng nhập..." : "Đăng nhập admin"}
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  marginBottom: "12px",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid rgba(255, 215, 0, 0.35)",
  background: "rgba(255,255,255,0.07)",
  color: "#fff",
  outline: "none",
  fontSize: "0.95rem",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  background: "linear-gradient(90deg, #ffd700 0%, #ff33cc 50%, #ffd700 100%)",
  border: "none",
  borderRadius: "12px",
  color: "#1a0033",
  fontWeight: "800",
  cursor: "pointer",
  transition: "0.3s",
  opacity: "1",
};