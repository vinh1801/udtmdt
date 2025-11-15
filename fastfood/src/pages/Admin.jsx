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
        background:
          "linear-gradient(135deg, #0f0b22 0%, #140a33 60%, #000 100%)",
        color: "#fff",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    >
      {/* Top bar admin */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 28px",
          borderBottom: "1px solid rgba(255,215,0,0.15)",
          background:
            "linear-gradient(180deg, rgba(20,8,60,0.98), rgba(10,6,28,0.95))",
          boxShadow:
            "0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,215,0,0.1)",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backdropFilter: "blur(10px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link
            to="/admin"
            style={{
              display: "inline-flex",
              width: 42,
              height: 42,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              background:
                "linear-gradient(135deg, rgba(255,215,0,0.25), rgba(255,51,204,0.3))",
              border: "1px solid rgba(255,215,0,0.4)",
              color: "#FFD700",
              fontWeight: 800,
              fontSize: "1.2rem",
              textDecoration: "none",
              transition: "all 0.2s",
              boxShadow: "0 2px 8px rgba(255,215,0,0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(255,215,0,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(255,215,0,0.2)";
            }}
          >
            A
          </Link>
          <div>
            <div
              style={{
                fontSize: 12,
                color: "#b9b2ff",
                marginBottom: 4,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              Khu vực quản trị
            </div>
            <h4
              style={{
                margin: 0,
                color: "#FFD700",
                fontWeight: 700,
                fontSize: "1.5rem",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              Bảng điều khiển Admin
            </h4>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              textAlign: "right",
              fontSize: 13,
              lineHeight: 1.4,
              color: "#d9d6ff",
              paddingRight: 16,
              borderRight: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div style={{ fontWeight: 700, color: "#fff" }}>
              {admin?.name || "Administrator"}
            </div>
            <div style={{ opacity: 0.75, fontSize: 12 }}>
              {admin?.username} • {admin?.email || "no-email"}
            </div>
          </div>
          <button
            onClick={logout}
            style={{
              padding: "10px 18px",
              borderRadius: 8,
              border: "1px solid rgba(255,215,0,0.4)",
              background:
                "linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,51,204,0.2))",
              color: "#FFD700",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.9rem",
              transition: "all 0.2s",
              boxShadow: "0 2px 8px rgba(255,215,0,0.15)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, rgba(255,215,0,0.3), rgba(255,51,204,0.3))";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(255,215,0,0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,51,204,0.2))";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 2px 8px rgba(255,215,0,0.15)";
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
                fontSize: "1.1rem",
                letterSpacing: "-0.01em",
              }}
            >
              Thông tin quản trị
            </h5>
            <div
              style={{
                fontSize: 14,
                color: "#e8e4ff",
                lineHeight: 1.7,
                letterSpacing: "0.01em",
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
                fontSize: "1.1rem",
                letterSpacing: "-0.01em",
              }}
            >
              Tình trạng hệ thống (hôm nay)
            </h5>
            <div
              style={{
                fontSize: 14,
                color: "#c9ffef",
                lineHeight: 1.7,
                letterSpacing: "0.01em",
              }}
            >
              {statsError && (
                <div style={{ color: "#ff8080", marginBottom: 6 }}>
                  {statsError}
                </div>
              )}
              <div>
                Đơn hàng hôm nay: <strong>{todayStats.ordersCount}</strong>
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
            {
              title: "Quản lý đơn hàng",
              color: "#FF33CC",
              to: "/admin/orders",
              desc: "Xem và xử lý các đơn đang chờ, cập nhật trạng thái và hủy đơn khi cần.",
            },
            {
              title: "Quản lý món ăn",
              color: "#FFD700",
              to: "/admin/foods",
              desc: "Thêm, sửa, ẩn/hiện món ăn và cấu hình giá, giảm giá cho từng món.",
            },
            {
              title: "Quản lý người dùng",
              color: "#66ffd1",
              to: "/admin/users",
              desc: "Tìm kiếm tài khoản, hạn chế hoặc xóa user vi phạm.",
            },
            {
              title: "Quản lý danh mục",
              color: "#9bff66",
              to: "/admin/categories",
              desc: "Tạo và chỉnh sửa các danh mục món để nhóm thực đơn rõ ràng hơn.",
            },
            {
              title: "Lịch sử đơn hàng",
              color: "#66ffd1",
              to: "/admin/orders/history",
              desc: "Xem toàn bộ lịch sử đơn, lọc theo trạng thái và thời gian.",
            },
            {
              title: "Thống kê",
              color: "#ff9f66",
              to: "/admin/stats",
              desc: "Theo dõi doanh thu, số đơn và các chỉ số quan trọng theo ngày.",
            },
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
                  fontWeight: 700,
                  color: box.color,
                  marginBottom: 8,
                  fontSize: "1.05rem",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.3,
                }}
              >
                {box.title}
              </div>
              <div
                style={{
                  color: "#cfc9ff",
                  fontSize: 13,
                  lineHeight: 1.6,
                  letterSpacing: "0.01em",
                }}
              >
                {box.desc ||
                  (box.to
                    ? "Đi tới trang quản lý."
                    : "Chức năng sẽ được bổ sung sau.")}
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
