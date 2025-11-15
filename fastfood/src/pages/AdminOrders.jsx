import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAdminAuth } from "../hooks/useAdminAuth";
import {
  adminListOrders,
  adminGetOrder,
  adminUpdateOrderStatus,
  adminCancelOrder,
} from "../services/adminOrderService";
import dayjs from "dayjs";

const VN_STATUS = {
  pending: "Chờ xác nhận",
  processing: "Đang thực hiện",
  shipping: "Đang giao",
  completed: "Hoàn thành",
};

const STATUS_OPTIONS = Object.entries(VN_STATUS);

export default function AdminOrders() {
  const { admin, logout } = useAdminAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [detail, setDetail] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await adminListOrders({
        q,
        status: statusFilter || undefined,
      });
      const active = (res.data || []).filter(
        (o) => o.status !== "completed" && o.status !== "failed"
      );
      setItems(active);
    } catch (e) {
      setErr(e?.response?.data?.message || "Lỗi tải danh sách đơn");
    } finally {
      setLoading(false);
    }
  }, [q, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);
  const applyFilter = async (e) => {
    e?.preventDefault?.();
    setPage(1);
    await load();
  };

  const openDetail = async (id) => {
    try {
      const res = await adminGetOrder(id);
      setDetail(res.data);
      setShowDetail(true);
    } catch (e) {
      setErr(e?.response?.data?.message || "Không tải được chi tiết");
    }
  };

  const changeStatus = async (id, nextStatus) => {
    setUpdating(true);
    setErr("");

    try {
      await adminUpdateOrderStatus(id, nextStatus);
      await load();
      if (detail?._id === id) {
        const res = await adminGetOrder(id);
        setDetail(res.data);
      }
    } catch (e) {
      setErr(e?.response?.data?.message || "Cập nhật trạng thái thất bại");
    } finally {
      setUpdating(false);
    }
  };

  // Sắp xếp từ đơn cũ nhất đến mới nhất
  const sortedItems = [...items].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  const totalPages = Math.max(1, Math.ceil(sortedItems.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const pagedItems = sortedItems.slice(startIndex, startIndex + pageSize);

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f0b22 0%, #140a33 60%, #000 100%)",
        color: "#fff",
      }}
    >
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
              Quản lý đơn hàng
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

      <main style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
        <form className="row g-2 mb-3" onSubmit={applyFilter}>
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Tìm theo mã đơn, tên, SĐT"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Tất cả trạng thái</option>
              {STATUS_OPTIONS.filter(([val]) => val !== "completed").map(
                ([val, label]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                )
              )}
            </select>
          </div>
          <div className="col-md-2">
            <button className="btn btn-warning w-100" type="submit">
              Lọc
            </button>
          </div>
        </form>

        {err && <div className="alert alert-danger">{err}</div>}

        <section
          style={{
            padding: 16,
            borderRadius: 14,
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.03), rgba(0,0,0,0.2))",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {loading ? (
            <div>Đang tải...</div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-dark table-striped align-middle">
                  <thead>
                    <tr>
                      <th>Mã đơn</th>
                      <th>Ngày đặt</th>
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
                          <select
                            className="form-select form-select-sm"
                            value={o.status}
                            onChange={(e) =>
                              changeStatus(o._id, e.target.value)
                            }
                            disabled={
                              updating ||
                              o.status === "completed" ||
                              o.status === "failed"
                            }
                          >
                            {STATUS_OPTIONS.filter(
                              ([val]) => val !== "completed"
                            ).map(([val, label]) => (
                              <option key={val} value={val}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          {(o.customer?.method || "VNPAY").toUpperCase() !==
                          "COD" ? (
                            o.isPaid ? (
                              <span className="badge bg-success">
                                Đã thanh toán
                              </span>
                            ) : (
                              <span className="badge bg-warning text-dark">
                                Chưa thanh toán
                              </span>
                            )
                          ) : (
                            <span className="badge bg-warning text-dark">
                              Tiền mặt (COD)
                            </span>
                          )}
                        </td>
                        <td>{(o.totalPrice || 0).toLocaleString()} đ</td>
                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-outline-info"
                            onClick={() => openDetail(o._id)}
                          >
                            Chi tiết
                          </button>
                        </td>
                      </tr>
                    ))}
                    {sortedItems.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center">
                          Không có đơn nào.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {sortedItems.length > 0 && (
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <div style={{ fontSize: 13, opacity: 0.85 }}>
                    Trang {currentPage}/{totalPages}
                  </div>
                  <div className="btn-group btn-group-sm">
                    <button
                      type="button"
                      className="btn btn-outline-light"
                      disabled={currentPage <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      « Trước
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-light"
                      disabled={currentPage >= totalPages}
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                    >
                      Sau »
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {detail && showDetail && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1050,
          }}
        >
          <div
            style={{
              width: "95%",
              maxWidth: 720,
              borderRadius: 18,
              background:
                "linear-gradient(145deg, rgba(59,0,120,0.95), rgba(26,0,51,0.98))",
              border: "1px solid rgba(255,215,0,0.35)",
              padding: 20,
              boxShadow: "0 0 40px rgba(0,0,0,0.6)",
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5
                style={{
                  color: "#FFD700",
                  margin: 0,
                  fontWeight: 800,
                }}
              >
                Đơn:{" "}
                <span style={{ fontFamily: "monospace" }}>{detail._id}</span>
              </h5>
              <button
                type="button"
                className="btn btn-sm btn-outline-light"
                onClick={() => setShowDetail(false)}
              >
                Đóng
              </button>
            </div>

            <div className="row g-2">
              <div className="col-md-4">
                <div>
                  <strong>Khách:</strong> {detail.customer?.name}
                </div>
                <div>
                  <strong>Điện thoại:</strong> {detail.customer?.phone}
                </div>
                <div>
                  <strong>Địa chỉ:</strong> {detail.customer?.address}
                </div>
                {detail.customer?.note && (
                  <div>
                    <strong>Chú thích:</strong> {detail.customer.note}
                  </div>
                )}
              </div>
              <div className="col-md-4">
                <div>
                  <strong>Ngày đặt:</strong>{" "}
                  {dayjs(detail.createdAt).format("DD/MM/YYYY HH:mm")}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <strong>Trạng thái:</strong>
                  <span className="badge bg-info text-dark">
                    {VN_STATUS[detail.status] || detail.status}
                  </span>
                  {detail.status !== "completed" &&
                    detail.status !== "failed" && (
                      <>
                        <button
                          className="btn btn-sm btn-outline-success"
                          disabled={updating}
                          onClick={async () => {
                            setUpdating(true);
                            try {
                              await adminUpdateOrderStatus(
                                detail._id,
                                "completed"
                              );
                              await load();
                              const res = await adminGetOrder(detail._id);
                              setDetail(res.data);
                            } catch (e) {
                              setErr(
                                e?.response?.data?.message ||
                                  "Đánh dấu hoàn thành thất bại"
                              );
                            } finally {
                              setUpdating(false);
                            }
                          }}
                        >
                          Đánh dấu hoàn thành
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger ms-2"
                          disabled={updating}
                          onClick={async () => {
                            if (!window.confirm("Xác nhận hủy đơn này?"))
                              return;
                            setUpdating(true);
                            try {
                              await adminCancelOrder(detail._id);
                              await load();
                              const res = await adminGetOrder(detail._id);
                              setDetail(res.data);
                            } catch (e) {
                              setErr(
                                e?.response?.data?.message || "Hủy đơn thất bại"
                              );
                            } finally {
                              setUpdating(false);
                            }
                          }}
                        >
                          Hủy đơn
                        </button>
                      </>
                    )}
                </div>
                <div className="mt-2">
                  <strong>Thanh toán:</strong>{" "}
                  {(detail.customer?.method || "VNPAY").toUpperCase() !==
                  "COD" ? (
                    detail.isPaid ? (
                      <span className="badge bg-success me-2">
                        Đã thanh toán
                      </span>
                    ) : (
                      <span className="badge bg-warning text-dark me-2">
                        Chưa thanh toán
                      </span>
                    )
                  ) : (
                    <span className="badge bg-warning text-dark me-2">
                      Tiền mặt (COD)
                    </span>
                  )}
                </div>
              </div>
              <div className="col-md-4">
                <div>
                  <strong>Tổng:</strong>{" "}
                  {(detail.totalPrice || 0).toLocaleString()} đ
                </div>
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
                      <td>
                        {(
                          (it.price || 0) * (it.quantity || 1)
                        ).toLocaleString()}{" "}
                        đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
