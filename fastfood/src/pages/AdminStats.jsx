import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAdminAuth } from "../hooks/useAdminAuth";
import { adminGetTodayStats, adminGetDailyStats, adminGetDayOrders } from "../services/adminOrderService";

export default function AdminStats() {
  const { admin, logout } = useAdminAuth();
  const [todayStats, setTodayStats] = useState({ ordersCount: 0, revenue: 0 });
  const [dailyStats, setDailyStats] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [dayOrders, setDayOrders] = useState([]);
  const [loadingDayOrders, setLoadingDayOrders] = useState(false);
  const [err, setErr] = useState("");
  const [showModal, setShowModal] = useState(false);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [y, m, d] = String(dateStr).split("-");
    if (!y || !m || !d) return dateStr;
    return `${d}/${m}/${y}`;
  };

  useEffect(() => {
    const loadStats = async () => {
      try {
        setErr("");
        const todayRes = await adminGetTodayStats();
        setTodayStats(todayRes.data || { ordersCount: 0, revenue: 0 });

        const dailyRes = await adminGetDailyStats({ days: 30 });
        const list = dailyRes.data || [];
        setDailyStats(list);
        if (list.length > 0) {
          setSelectedDate(list[0]._id);
        }
      } catch (e) {
        setErr(e?.response?.data?.message || "Lỗi tải thống kê");
      }
    };
    loadStats();
  }, []);

  const handleOpenDayOrders = async (date) => {
    setSelectedDate(date);
    setShowModal(true);
    setLoadingDayOrders(true);
    try {
      setErr("");
      const res = await adminGetDayOrders(date);
      setDayOrders(res.data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Lỗi tải đơn của ngày");
    } finally {
      setLoadingDayOrders(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0b22 0%, #140a33 60%, #000 100%)", color: "#fff" }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 28px",
          borderBottom: "1px solid rgba(255,215,0,0.15)",
          background:
            "linear-gradient(180deg, rgba(20,8,60,0.98), rgba(10,6,28,0.95))",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,215,0,0.1)",
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
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(255,215,0,0.3)";
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
                letterSpacing: "0.01em",
              }}
            >

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
              Thống kê hệ thống
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
            <div style={{ opacity: 0.75, fontSize: 12 }}>{admin?.username}</div>
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
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(255,215,0,0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,51,204,0.2))";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(255,215,0,0.15)";
            }}
          >
            Đăng xuất
          </button>
        </div>
      </header>

      <main style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
        {err && <div className="alert alert-danger">{err}</div>}

        {/* Hôm nay */}
        <section style={{ marginBottom: 20 }}>
          <div style={{ padding: 20, borderRadius: 14, background: "linear-gradient(145deg, rgba(30,130,90,0.3), rgba(10,40,30,0.3))", border: "1px solid rgba(0,255,170,0.15)" }}>
            <h5 style={{ color: "#66ffd1", marginBottom: 8 }}>Thống kê hiện tại</h5>
            <div style={{ fontSize: 14, color: "#c9ffef" }}>
              <div>Đơn hoàn thành: <strong>{todayStats.ordersCount}</strong></div>
              <div>Doanh thu: <strong>{todayStats.revenue.toLocaleString("vi-VN")} đ</strong></div>
            </div>
          </div>
        </section>

        {/* Bảng ngày */}
        <section style={{ marginBottom: 24 }}>
          <h5 style={{ color: "#FFD700", marginBottom: 8 }}>Thống kê theo ngày (đơn hoàn thành)</h5>
          <div style={{ padding: 16, borderRadius: 14, background: "linear-gradient(145deg, rgba(255,255,255,0.03), rgba(0,0,0,0.2))", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="table-responsive" style={{ maxHeight: 360, overflowY: "auto" }}>
              <table className="table table-dark table-striped align-middle mb-0">
                <thead>
                  <tr>
                    <th>Ngày</th>
                    <th>Số đơn</th>
                    <th>Doanh thu</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {dailyStats.map((d) => (
                    <tr key={d._id}>
                      <td>{formatDate(d._id)}</td>
                      <td>{d.ordersCount}</td>
                      <td>{(d.revenue || 0).toLocaleString("vi-VN")} đ</td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-warning"
                          onClick={() => handleOpenDayOrders(d._id)}
                        >
                          Xem đơn
                        </button>
                      </td>
                    </tr>
                  ))}
                  {dailyStats.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center">Chưa có dữ liệu.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {/* Modal danh sách đơn theo ngày */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: "#141022",
              borderRadius: 12,
              padding: 16,
              minWidth: 420,
              maxWidth: "90vw",
              maxHeight: "80vh",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <h6 style={{ margin: 0, color: "#FFD700" }}>Đơn hoàn thành ngày: {selectedDate}</h6>
              <button className="btn btn-sm btn-outline-light" onClick={() => setShowModal(false)}>
                Đóng
              </button>
            </div>

            {loadingDayOrders ? (
              <div>Đang tải danh sách đơn...</div>
            ) : (
              <div className="table-responsive" style={{ maxHeight: "60vh", overflowY: "auto" }}>
                <table className="table table-dark table-striped align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Mã đơn</th>
                      <th className="text-end">Tổng giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dayOrders.map((o) => (
                      <tr key={o._id}>
                        <td>{o._id}</td>
                        <td className="text-end">{(o.totalPrice || 0).toLocaleString("vi-VN")} đ</td>
                      </tr>
                    ))}
                    {dayOrders.length === 0 && (
                      <tr>
                        <td colSpan={2} className="text-center">Chưa có đơn trong ngày này.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
