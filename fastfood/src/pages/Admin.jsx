import React from "react";
import { Link } from "react-router-dom";
import { useAdminAuth } from "../hooks/useAdminAuth";

export default function Admin() {
  const { admin, logout } = useAdminAuth();

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
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          background:
            "linear-gradient(180deg, rgba(20,8,60,0.9), rgba(10,6,28,0.9))",
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
          <h4 style={{ margin: 0, color: "#FFD700" }}>Bảng điều khiển Admin</h4>
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
      <main style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
        {/* Hộp thông tin admin */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              padding: 20,
              borderRadius: 14,
              background:
                "linear-gradient(145deg, rgba(59,0,120,0.35), rgba(26,0,51,0.35))",
              border: "1px solid rgba(255,215,0,0.25)",
            }}
          >
            <h5 style={{ color: "#FFD700", marginBottom: 8 }}>Thông tin quản trị</h5>
            <div style={{ fontSize: 14, color: "#e8e4ff" }}>
              <div>Họ tên: {admin?.name}</div>
              <div>Tên đăng nhập: {admin?.username}</div>
              <div>Email: {admin?.email || "—"}</div>
              <div>Vai trò: {admin?.role}</div>
            </div>
          </div>

          <div
            style={{
              padding: 20,
              borderRadius: 14,
              background:
                "linear-gradient(145deg, rgba(30,130,90,0.3), rgba(10,40,30,0.3))",
              border: "1px solid rgba(0,255,170,0.15)",
            }}
          >
            <h5 style={{ color: "#66ffd1", marginBottom: 8 }}>Tình trạng hệ thống</h5>
            <div style={{ fontSize: 14, color: "#c9ffef" }}>
              <div>Đơn hàng hôm nay: —</div>
              <div>Doanh thu dự kiến: —</div>
              <div>Người dùng online: —</div>
            </div>
          </div>
        </section>

        {/* Placeholder cho module quản trị */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {[
            { title: "Quản lý đơn hàng", color: "#FF33CC" },
            { title: "Quản lý món ăn", color: "#FFD700", to: "/admin/foods" },
            { title: "Quản lý người dùng", color: "#66ffd1" },
            { title: "Quản lý danh mục", color: "#9bff66", to: "/admin/categories" },
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