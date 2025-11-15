import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAdminAuth } from "../hooks/useAdminAuth";
import { adminGetTodayStats } from "../services/adminOrderService";

export default function Admin() {
  const { admin, logout } = useAdminAuth();

  const [todayStats, setTodayStats] = useState({ ordersCount: 0, revenue: 0 });
  const [statsError, setStatsError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      try {
        setStatsError("");
        const todayRes = await adminGetTodayStats();
        setTodayStats(todayRes.data || { ordersCount: 0, revenue: 0 });
      } catch (e) {
        setStatsError(e?.response?.data?.message || "Lỗi tải thống kê");
      }
    };
    loadStats();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f0b22 0%, #140a33 60%, #000 100%)",
        color: "#fff",
      }}
    >
      {/* Top bar admin */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.18)",
          background:
            "linear-gradient(180deg, rgba(20,8,60,0.95), rgba(10,6,28,0.9))",
          boxShadow: "0 10px 25px rgba(0,0,0,0.45)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              display: "inline-flex",
              width: 36,
              height: 36,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              background:
                "linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,51,204,0.25))",
              border: "1px solid rgba(255,215,0,0.35)",
              color: "#FFD700",
              fontWeight: 800,
            }}
          >
            A
          </span>
          <div>
            <div
              style={{
                fontSize: 13,
                color: "#b9b2ff",
                marginBottom: 2,
                letterSpacing: 0.5,
              }}
            >
              Khu vực quản trị
            </div>
            <h4
              style={{
                margin: 0,
                color: "#FFD700",
                fontWeight: 800,
                letterSpacing: 0.3,
              }}
            >
              Bảng điều khiển Admin
            </h4>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              textAlign: "right",
              fontSize: 13,
              lineHeight: 1.2,
              color: "#d9d6ff",
            }}
          >
            <div style={{ fontWeight: 700 }}>{admin?.name || "Administrator"}</div>
            <div style={{ opacity: 0.8 }}>
              {admin?.username} • {admin?.email || "no-email"}
            </div>
          </div>
          <button
            onClick={logout}
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: "1px solid rgba(255,215,0,0.4)",
              background:
                "linear-gradient(90deg, rgba(255,215,0,0.15), rgba(255,51,204,0.15))",
              color: "#FFD700",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Đăng xuất
          </button>
        </div>
      </header>

      {/* Nội dung chính */}
      <main style={{ padding: 32, maxWidth: 1200, margin: "0 auto" }}>
        {/* Hộp thông tin admin + tình trạng */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              padding: 22,
              borderRadius: 14,
              background:
                "linear-gradient(145deg, rgba(59,0,120,0.35), rgba(26,0,51,0.35))",
              border: "1px solid rgba(255,215,0,0.25)",
              boxShadow: "0 18px 35px rgba(0,0,0,0.45)",
            }}
          >
            <h5
              style={{
                color: "#FFD700",
                marginBottom: 10,
                fontWeight: 700,
              }}
            >
              Thông tin quản trị
            </h5>
            <div
              style={{
                fontSize: 14,
                color: "#e8e4ff",
                lineHeight: 1.7,
              }}
            >
              <div>Họ tên: {admin?.name}</div>
              <div>Tên đăng nhập: {admin?.username}</div>
              <div>Email: {admin?.email || "—"}</div>
              <div>Vai trò: {admin?.role}</div>
            </div>
          </div>

          <div
            style={{
              padding: 22,
              borderRadius: 14,
              background:
                "linear-gradient(145deg, rgba(30,130,90,0.3), rgba(10,40,30,0.3))",
              border: "1px solid rgba(0,255,170,0.2)",
              boxShadow: "0 18px 35px rgba(0,0,0,0.4)",
            }}
          >
            <h5
              style={{
                color: "#66ffd1",
                marginBottom: 10,
                fontWeight: 700,
              }}
            >
              Tình trạng hệ thống (hôm nay)
            </h5>
            <div style={{ fontSize: 14, color: "#c9ffef", lineHeight: 1.7 }}>
              {statsError && (
                <div style={{ color: "#ff8080", marginBottom: 6 }}>{statsError}</div>
              )}
              <div>
                Đơn hàng hôm nay:{" "}
                <strong>{todayStats.ordersCount}</strong>
              </div>
              <div>
                Doanh thu hôm nay:{" "}
                <strong>{todayStats.revenue.toLocaleString("vi-VN")} đ</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Ô điều hướng module quản trị */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {/* Các card chức năng quản trị */}
          {[
            { title: "Quản lý đơn hàng", color: "#FF33CC", to: "/admin/orders" },
            { title: "Quản lý món ăn", color: "#FFD700", to: "/admin/foods" },
            { title: "Quản lý người dùng", color: "#66ffd1", to: "/admin/users" },
            { title: "Quản lý danh mục", color: "#9bff66", to: "/admin/categories" },
            { title: "Lịch sử đơn hàng", color: "#66ffd1", to: "/admin/orders/history" },
            { title: "Thống kê", color: "#ff9f66", to: "/admin/stats" },
          ].map((box, idx) => (
            <div
              key={idx}
              style={{
                padding: 22,
                borderRadius: 14,
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.03), rgba(0,0,0,0.2))",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                style={{
                  fontWeight: 800,
                  color: box.color,
                  marginBottom: 8,
                }}
              >
                {box.title}
              </div>
              <div style={{ color: "#cfc9ff", fontSize: 13 }}>
                {box.to ? "Đi tới trang quản lý." : "Chức năng sẽ được bổ sung sau."}
              </div>
              {box.to && (
                <div style={{ marginTop: 10 }}>
                  <Link to={box.to} className="btn btn-sm btn-warning">
                    Mở
                  </Link>
                </div>
              )}
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}