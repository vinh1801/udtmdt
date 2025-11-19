import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAdminAuth } from "../hooks/useAdminAuth";
import dayjs from "dayjs";
import { adminListOrderHistory, adminGetOrder, adminConfirmRefund } from "../services/adminOrderService";

const VN_STATUS = {
  completed: "Hoàn thành",
  failed: "Đã hủy",
};

export default function AdminOrderHistory() {
  const { admin, logout } = useAdminAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");
  const [appliedQ, setAppliedQ] = useState("");
  const [detail, setDetail] = useState(null);
  const [page, setPage] = useState(1);
  const [showUnrefundedOnly, setShowUnrefundedOnly] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await adminListOrderHistory();
      setItems(res.data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Lỗi tải lịch sử đơn hàng");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const keyword = appliedQ.trim().toLowerCase();
  const filteredItems = items.filter((o) => {
    const matchesKeyword = keyword
      ? (o._id || "")
          .toString()
          .toLowerCase()
          .includes(keyword)
      : true;

    const matchesRefundFilter = !showUnrefundedOnly
      ? true
      : o.customer?.method !== "COD" &&
        o.status === "failed" &&
        o.isPaid &&
        !o.isRefunded;

    return matchesKeyword && matchesRefundFilter;
  });

  useEffect(() => {
    setPage(1);
  }, [appliedQ, items.length, showUnrefundedOnly]);

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedItems = filteredItems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const openDetail = async (id) => {
    try {
      const res = await adminGetOrder(id);
      setDetail(res.data);
    } catch (e) {
      setErr(e?.response?.data?.message || "Không tải được chi tiết");
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
              Lịch sử đơn hàng
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

        <form
          className="row g-2 mb-3"
          onSubmit={(e) => {
            e.preventDefault();
            setAppliedQ(q);
            load();
          }}
        >
          <div className="col-md-4">
            <input className="form-control" placeholder="Nhập mã đơn hàng" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="col-md-2">
            <button className="btn btn-warning w-100" type="submit">Lọc</button>
          </div>
          <div className="col-md-4 d-flex align-items-center">
            <div className="form-check">
              <input
                id="unrefundedOnly"
                type="checkbox"
                className="form-check-input"
                checked={showUnrefundedOnly}
                onChange={(e) => setShowUnrefundedOnly(e.target.checked)}
              />
              <label
                htmlFor="unrefundedOnly"
                className="form-check-label"
                style={{ color: "#ffd700", fontSize: 13 }}
              >
                Chỉ hiển thị đơn chưa hoàn tiền
              </label>
            </div>
          </div>
        </form>

        {err && <div className="alert alert-danger">{err}</div>}

        <section style={{ padding: 16, borderRadius: 14, background: "linear-gradient(145deg, rgba(255,255,255,0.03), rgba(0,0,0,0.2))", border: "1px solid rgba(255,255,255,0.08)" }}>
          {loading ? (
            <div>Đang tải...</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-striped align-middle">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Ngày</th>
                    <th>Trạng thái</th>
                    <th>Thanh toán</th>
                    <th>Tổng</th>
                    <th className="text-end">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedItems.map((o) => (
                    <tr key={o._id}>
                      <td style={{ fontFamily: "monospace" }}>{o._id}</td>

                      <td>{dayjs(o.createdAt).format("DD/MM/YYYY HH:mm")}</td>
                      <td>
                        {o.status === "completed"
                          ? <span className="badge bg-success">{VN_STATUS[o.status]}</span>
                          : <span className="badge bg-secondary">{VN_STATUS[o.status] || o.status}</span>}
                      </td>
                      <td>
                        {o.customer?.method === "COD" ? (
                          <span className="badge bg-warning text-dark">Tiền mặt (COD)</span>
                        ) : o.status === "completed" ? (
                          <span className="badge bg-primary">VNPAY</span>
                        ) : o.status === "failed" && o.isPaid && !o.isRefunded ? (
                          <span className="badge bg-warning text-dark">Chưa hoàn tiền</span>
                        ) : o.status === "failed" && o.isPaid && o.isRefunded ? (
                          <span className="badge bg-success">Đã hoàn tiền</span>
                        ) : (
                          <span className="badge bg-secondary">VNPAY</span>
                        )}
                      </td>
                      <td>{(o.totalPrice || 0).toLocaleString()} đ</td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-info" onClick={() => openDetail(o._id)}>Chi tiết</button>
                      </td>
                    </tr>
                  ))}
                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center">Không có đơn nào trong lịch sử.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {filteredItems.length > 0 && (
          <div className="d-flex justify-content-between align-items-center mt-2">
            <div style={{ fontSize: 13, color: "#cfc9ff" }}>
              Trang {currentPage} / {totalPages} (Tổng {filteredItems.length} đơn)
            </div>
            <div className="btn-group btn-group-sm">
              <button
                type="button"
                className="btn btn-outline-light"
                disabled={currentPage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Trước
              </button>
              <button
                type="button"
                className="btn btn-outline-light"
                disabled={currentPage === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Sau
              </button>
            </div>
          </div>
        )}

        {detail && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1050,
            }}
          >
            <div
              style={{
                width: "95%",
                maxWidth: 900,
                borderRadius: 16,
                background:
                  "linear-gradient(145deg, rgba(59,0,120,0.9), rgba(26,0,51,0.95))",
                border: "1px solid rgba(255,215,0,0.35)",
                padding: 20,
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 style={{ color: "#FFD700", margin: 0, fontWeight: 800 }}>
                  Đơn: <span style={{ fontFamily: "monospace" }}>{detail._id}</span>
                </h5>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-light"
                  onClick={() => setDetail(null)}
                >
                  Đóng
                </button>
              </div>
              <div className="row g-2">
                <div className="col-md-4">
                  <div><strong>Khách:</strong> {detail.customer?.name}</div>
                  <div><strong>Điện thoại:</strong> {detail.customer?.phone}</div>
                  <div><strong>Địa chỉ:</strong> {detail.customer?.address}</div>
                  {detail.customer?.note && <div><strong>Chú thích:</strong> {detail.customer.note}</div>}
                </div>
                <div className="col-md-4">
                  <div><strong>Ngày đặt:</strong> {dayjs(detail.createdAt).format("DD/MM/YYYY HH:mm")}</div>
                  <div><strong>Trạng thái:</strong> {VN_STATUS[detail.status] || detail.status}</div>
                  <div>
                    <strong>Thanh toán:</strong>{" "}
                    {detail.customer?.method === "COD" ? (
                      <span className="badge bg-warning text-dark me-2">Tiền mặt (COD)</span>
                    ) : detail.status === "failed" && detail.isPaid && detail.isRefunded ? (
                      <span className="badge bg-success me-2">
                        Đã hoàn tiền {detail.refundedAt ? `(${dayjs(detail.refundedAt).format("DD/MM/YYYY")})` : ""}
                      </span>
                    ) : detail.status === "failed" && detail.isPaid && !detail.isRefunded ? (
                      <span className="badge bg-warning text-dark me-2">Chưa hoàn tiền</span>
                    ) : (
                      <span className="badge bg-primary me-2">VNPAY</span>
                    )}

                    {/* Luồng xác nhận hoàn tiền chỉ áp dụng cho đơn online đã hủy và đã thu tiền */}
                    {detail.customer?.method !== "COD" &&
                      detail.status === "failed" &&
                      detail.isPaid &&
                      !detail.isRefunded && (
                        <div className="mt-2">
                          <button
                            className="btn btn-sm btn-outline-success mt-2"
                            onClick={async () => {
                              try {
                                await adminConfirmRefund(detail._id);
                                const res = await adminGetOrder(detail._id);
                                setDetail(res.data);
                                await load();
                              } catch (e) {
                                setErr(
                                  e?.response?.data?.message ||
                                    "Xác nhận hoàn tiền thất bại"
                                );
                              }
                            }}
                          >
                            Xác nhận đã hoàn tiền
                          </button>
                        </div>
                      )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div>
                    <strong>User:</strong> {detail.userId?.username || "—"}
                    {detail.userId?.email ? (
                      <small className="text-muted"> ({detail.userId.email})</small>
                    ) : null}
                  </div>
                  <div><strong>Tổng:</strong> {(detail.totalPrice || 0).toLocaleString()} đ</div>
                </div>
              </div>
              <div className="table-responsive mt-3">
                <table className="table table-dark table-striped align-middle">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Món</th>
                      <th>Giá</th>
                      <th>SL</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.items.map((it, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{it.name}</td>
                        <td>{(it.price || 0).toLocaleString()} đ</td>
                        <td>{it.quantity}</td>
                        <td>{((it.price || 0) * (it.quantity || 1)).toLocaleString()} đ</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

    </div>
  );
}