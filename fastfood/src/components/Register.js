import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Register() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); // KHÔNG bắt buộc
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  const redirectTo =
    location.state?.from?.pathname && location.state.from.pathname !== "/login"
      ? location.state.from.pathname
      : "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setSubmitting(true);
    try {
      await register({ username, name, email: email || undefined, password });
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setErr(error?.response?.data?.message || "Đăng ký thất bại");
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
          "linear-gradient(135deg, #1a0033 0%, #3b0078 60%, #000 100%)",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(20px)",
          borderRadius: "20px",
          padding: "50px",
          maxWidth: "440px",
          width: "100%",
          color: "white",
          boxShadow: "0 0 25px rgba(255, 215, 0, 0.25)",
          border: "1px solid rgba(255,215,0,0.3)",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            color: "#ffd700",
            fontSize: "1.8rem",
            fontWeight: "700",
            marginBottom: "30px",
            textShadow: "0 0 15px rgba(255, 215, 0, 0.6)",
          }}
        >
          Đăng ký tài khoản 🍟
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Tên đăng nhập"
            style={inputStyle}
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="Họ và tên"
            style={inputStyle}
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email (không bắt buộc)"
            style={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            <div style={{ color: "#ff8080", marginBottom: 10 }}>{err}</div>
          )}
          <button style={buttonStyle} disabled={submitting} type="submit">
            {submitting ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
          </button>
        </form>

        <p style={{ marginTop: "20px", color: "#d1c6ff" }}>
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            style={{ color: "#ffcc00", textDecoration: "underline" }}
          >
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  marginBottom: "15px",
  padding: "12px 15px",
  borderRadius: "12px",
  border: "1px solid rgba(255, 215, 0, 0.4)",
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
  fontWeight: "700",
  cursor: "pointer",
  transition: "0.3s",
  opacity: "1",
};