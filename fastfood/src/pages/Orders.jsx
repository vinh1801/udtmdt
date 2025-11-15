import React, { useEffect, useState, useCallback } from "react";
import {
  getMyOrders,
  getOrderById,
  cancelOrder,
} from "../services/orderService";
import dayjs from "dayjs";

const VN_STATUS = {
  pending: "Chờ xác nhận",
  processing: "Đang thực hiện",
  shipping: "Đang giao",
  completed: "Hoàn thành",
  failed: "Đã hủy",
};

const renderStatusBadge = (status) => {
  const label = VN_STATUS[status] || status;
  switch (status) {
    case "pending":
      return <span className="badge bg-warning text-dark">{label}</span>;
    case "processing":
      return <span className="badge bg-primary">{label}</span>;
    case "shipping":
      return <span className="badge bg-info text-dark">{label}</span>;
    case "completed":
      return <span className="badge bg-success">{label}</span>;
    case "failed":
      return <span className="badge bg-danger">{label}</span>;
    default:
      return <span className="badge bg-secondary">{label}</span>;
  }
};

export default function Orders() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [items, setItems] = useState([]);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);

  const sortOrders = (list) => {
    if (!Array.isArray(list)) return [];
    const isActive = (s) => s !== "completed" && s !== "failed";
    return [...list].sort((a, b) => {
      const aActive = isActive(a.status);
      const bActive = isActive(b.status);
      if (aActive !== bActive) return aActive ? -1 : 1;
      const aTime = new Date(a.createdAt || 0).getTime();
      const bTime = new Date(b.createdAt || 0).getTime();
      return bTime - aTime; // mới nhất trước
    });
  };

  const refresh = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await getMyOrders();
      setItems(sortOrders(res.data || []));
    } catch (e) {
      setErr(e?.response?.data?.message || "Lỗi tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const openDetail = async (id) => {
    setDetail(null);
    setDetailLoading(true);
    try {
      const o = await getOrderById(id);
      setDetail(o);
    } catch (e) {
      setErr(e?.response?.data?.message || "Lỗi tải chi tiết đơn hàng");
    } finally {
      setDetailLoading(false);
    }
  };

  const activeItems = items.filter(
    (o) => o.status !== "completed" && o.status !== "failed"
  );
  const historyItems = items.filter(
    (o) => o.status === "completed" || o.status === "failed"
  );

  const HISTORY_PAGE_SIZE = 5;
  const historyTotalPages = Math.max(
    1,
    Math.ceil(historyItems.length / HISTORY_PAGE_SIZE) || 1
  );
  const currentHistoryPage = Math.min(historyPage, historyTotalPages);
  const historySliceStart = (currentHistoryPage - 1) * HISTORY_PAGE_SIZE;
  const historySliceEnd = historySliceStart + HISTORY_PAGE_SIZE;
  const pagedHistoryItems = historyItems.slice(
    historySliceStart,
    historySliceEnd
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f0b22 0%, #140a33 60%, #000 100%)",
        color: "#fff",
      }}
    >
      <main style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
        {err && (
          <div className="alert alert-danger" role="alert">
            {err}
          </div>
        )}

        {/* Đơn đang xử lý */}
        <section
          style={{
            padding: 16,
            borderRadius: 14,
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.03), rgba(0,0,0,0.2))",
            border: "1px solid rgba(255,255,255,0.08)",
            marginBottom: 16,
          }}
        >
          <h5
            style={{
              color: "#FFD700",
              marginBottom: 12,
              fontWeight: 700,
              letterSpacing: 0.3,
            }}
          >
            Đơn đang xử lý
          </h5>
          {loading ? (
            <div>Đang tải...</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-striped align-middle mb-0">
                <thead
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(255,215,0,0.12), rgba(255,51,204,0.1))",
                  }}
                >
                  <tr>
                    <th>Ngày đặt</th>
                    <th>Mã đơn</th>
                    <th>Phương thức</th>
                    <th>Trạng thái</th>
                    <th>Tổng</th>
                    <th style={{ width: 160 }} className="text-end">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {activeItems.map((o) => (
                    <tr key={o._id}>
                      <td>{dayjs(o.createdAt).format("DD/MM/YYYY HH:mm")}</td>
                      <td style={{ fontFamily: "monospace" }}>{o._id}</td>
                      <td>
                        {(o?.customer?.method || "VNPAY").toUpperCase() ===
                        "COD" ? (
                          <span className="badge bg-warning text-dark">
                            Tiền mặt (COD)
                          </span>
                        ) : (
                          <span className="badge bg-primary">VNPAY</span>
                        )}
                      </td>
                      <td>{renderStatusBadge(o.status)}</td>
                      <td>{(o.totalPrice || 0).toLocaleString()} đ</td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-info"
                          onClick={() => openDetail(o._id)}
                        >
                          Xem chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!loading && activeItems.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center">
                        Hiện không có đơn nào đang xử lý.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Đơn đã hoàn thành / đã hủy */}
        <section
          style={{
            padding: 16,
            borderRadius: 14,
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.03), rgba(0,0,0,0.2))",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <h5
            style={{
              color: "#FFD700",
              marginBottom: 12,
              fontWeight: 700,
              letterSpacing: 0.3,
            }}
          >
            Lịch sử
          </h5>
          {loading ? (
            <div>Đang tải...</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-striped align-middle mb-0">
                <thead
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(255,215,0,0.12), rgba(255,51,204,0.1))",
                  }}
                >
                  <tr>
                    <th>Ngày đặt</th>
                    <th>Mã đơn</th>
                    <th>Phương thức</th>
                    <th>Trạng thái</th>
                    <th>Tổng</th>
                    <th style={{ width: 160 }} className="text-end">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pagedHistoryItems.map((o) => (
                    <tr key={o._id}>
                      <td>{dayjs(o.createdAt).format("DD/MM/YYYY HH:mm")}</td>
                      <td style={{ fontFamily: "monospace" }}>{o._id}</td>
                      <td>
                        {(o?.customer?.method || "VNPAY").toUpperCase() ===
                        "COD" ? (
                          <span className="badge bg-warning text-dark">
                            Tiền mặt (COD)
                          </span>
                        ) : (
                          <span className="badge bg-primary">VNPAY</span>
                        )}
                      </td>
                      <td>{renderStatusBadge(o.status)}</td>
                      <td>{(o.totalPrice || 0).toLocaleString()} đ</td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-info"
                          onClick={() => openDetail(o._id)}
                        >
                          Xem chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!loading && historyItems.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center">
                        Chưa có đơn hoàn thành hoặc đã hủy.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {historyItems.length > HISTORY_PAGE_SIZE && (
                <div className="d-flex justify-content-end align-items-center mt-2 gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-warning"
                    disabled={currentHistoryPage === 1}
                    onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
                  >
                    Trang trước
                  </button>
                  <span style={{ color: "#ffd700" }}>
                    {currentHistoryPage} / {historyTotalPages}
                  </span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-warning"
                    disabled={currentHistoryPage === historyTotalPages}
                    onClick={() =>
                      setHistoryPage((p) => Math.min(historyTotalPages, p + 1))
                    }
                  >
                    Trang sau
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Chi tiết đơn (modal overlay) */}
        {detailLoading && (
          <div style={{ marginTop: 16 }}>Đang tải chi tiết...</div>
        )}
        {detail && !detailLoading && (
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
                  📦 Chi tiết đơn:{" "}
                  <span style={{ fontFamily: "monospace" }}>{detail._id}</span>
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
                <div className="col-md-6">
                  <div>
                    <strong>Ngày đặt:</strong>{" "}
                    {dayjs(detail.createdAt).format("DD/MM/YYYY HH:mm")}
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <strong>Trạng thái:</strong>
                    {renderStatusBadge(detail.status)}
                    {detail.status === "pending" && (
                      <button
                        className="btn btn-sm btn-outline-danger ms-2"
                        onClick={async () => {
                          if (!window.confirm("Bạn muốn hủy đơn này?")) return;
                          try {
                            await cancelOrder(detail._id);
                            await refresh();
                            const o = await getOrderById(detail._id);
                            setDetail(o);
                          } catch (e) {
                            setErr(
                              e?.response?.data?.message || "Hủy đơn thất bại"
                            );
                          }
                        }}
                      >
                        Hủy đơn
                      </button>
                    )}
                  </div>
                  <div className="mt-2">
                    <strong>Thanh toán:</strong>
                    {detail?.customer?.method === "VNPAY" ? (
                      detail.isPaid ? (
                        <span className="badge bg-success ms-2">
                          Đã thanh toán
                        </span>
                      ) : (
                        <span className="badge bg-warning text-dark ms-2">
                          Chưa thanh toán
                        </span>
                      )
                    ) : (
                      <span className="badge bg-warning text-dark ms-2">
                        Tiền mặt (COD)
                      </span>
                    )}

                    {detail.status === "failed" && detail.isPaid && (
                      <div className="mt-2">
                        {detail.isRefunded ? (
                          <span className="badge bg-success">Đã hoàn tiền</span>
                        ) : (
                          <>
                            <span className="badge bg-warning text-dark me-2">
                              Đang xử lý hoàn tiền
                            </span>
                            <div
                              style={{
                                fontSize: 13,
                                opacity: 0.85,
                                marginTop: 6,
                              }}
                            >
                              Tiền sẽ được hoàn trong 3-5 ngày làm việc.
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div>
                    <strong>Khách hàng:</strong> {detail?.customer?.name}
                  </div>
                  <div>
                    <strong>Điện thoại:</strong> {detail?.customer?.phone}
                  </div>
                  <div>
                    <strong>Địa chỉ:</strong> {detail?.customer?.address}
                  </div>
                </div>
              </div>

              <div className="table-responsive mt-3">
                <table className="table table-dark table-striped align-middle">
                  <thead>
                    <tr>
                      <th style={{ width: 60 }}>#</th>
                      <th>Món</th>
                      <th>Giá</th>
                      <th>Số lượng</th>
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
                  <tfoot>
                    <tr>
                      <td colSpan={4} className="text-end">
                        <strong>Tổng:</strong>
                      </td>
                      <td>
                        <strong>
                          {(detail.totalPrice || 0).toLocaleString()} đ
                        </strong>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
