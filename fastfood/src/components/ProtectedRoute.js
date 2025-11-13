import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5 text-light">
        Đang xác thực phiên đăng nhập...
      </div>
    );
  }

  // nếu chưa đăng nhập user -> chuyển về /login
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // CHẶN: nếu lỡ có user context nhưng role là admin -> không cho vào site user
  if (user.role === "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  // nếu vô tình tài khoản có role admin nhưng đăng nhập bằng phiên user thì vẫn cho vào (vì đây là phiên user)
  return children;
}