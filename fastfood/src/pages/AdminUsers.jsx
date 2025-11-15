import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAdminAuth } from "../hooks/useAdminAuth";

import {
  adminListRestrictedUsers,
  adminSearchUsers,
  adminGetUser,
  adminToggleUserRestricted,
  adminDeleteUser,
} from "../services/adminUserService";

export default function AdminUsers() {
  const { admin, logout } = useAdminAuth();
  const [restricted, setRestricted] = useState([]);
  const [searchQ, setSearchQ] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [detail, setDetail] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [loadingRestricted, setLoadingRestricted] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [err, setErr] = useState("");

  const loadRestricted = useCallback(async () => {
    setLoadingRestricted(true);
    setErr("");
    try {
      const res = await adminListRestrictedUsers();
      setRestricted(res.data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Lỗi tải danh sách bị hạn chế");
    } finally {
      setLoadingRestricted(false);
    }
  }, []);

  useEffect(() => {
    loadRestricted();
  }, [loadRestricted]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoadingSearch(true);
    setErr("");
    try {
      const res = await adminSearchUsers({ q: searchQ || undefined });
      setSearchResult(res.data || []);
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Lỗi tìm người dùng");
    } finally {
      setLoadingSearch(false);
    }
  };

  const openDetail = async (id) => {
    try {
      const res = await adminGetUser(id);
      setDetail(res.data);
      setShowDetail(true);
    } catch (e) {
      setErr(e?.response?.data?.message || "Không tải được chi tiết user");
    }
  };

  const toggleRestricted = async () => {
    if (!detail) return;
    if (!window.confirm(detail.isRestricted ? "Bỏ hạn chế tài khoản này?" : "Hạn chế tài khoản này?")) return;
    setUpdating(true);
    setErr("");
    try {
      const res = await adminToggleUserRestricted(detail._id, !detail.isRestricted);
      setDetail(res.data);
      await loadRestricted();
    } catch (e) {
      setErr(e?.response?.data?.message || "Cập nhật trạng thái hạn chế thất bại");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!detail) return;
    if (!window.confirm("XÓA tài khoản này? Hành động không thể hoàn tác.")) return;
    setUpdating(true);
    setErr("");
    try {
      await adminDeleteUser(detail._id);
      setDetail(null);
      await loadRestricted();
      // có thể reload search nếu cần
      if (searchQ) {
        const res = await adminSearchUsers({ q: searchQ });
        setSearchResult(res.data || []);
      }
    } catch (e) {
      setErr(e?.response?.data?.message || "Xóa tài khoản thất bại");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0b22 0%, #140a33 60%, #000 100%)", color: "#fff" }}>
      {/* Header */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "linear-gradient(180deg, rgba(20,8,60,0.9), rgba(10,6,28,0.9))", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link
            to="/admin"
            style={{
              color: "#ffd700",
              textDecoration: "none",
              fontSize: 13,
              opacity: 0.85,
            }}
          >
            ← Bảng điều khiển
          </Link>
          <h4 style={{ margin: 0, color: "#FFD700", fontWeight: 800 }}>Quản lý người dùng</h4>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ textAlign: "right", fontSize: 13, lineHeight: 1.2, color: "#d9d6ff" }}>
            <div style={{ fontWeight: 700 }}>{admin?.name || "Administrator"}</div>
            <div style={{ opacity: 0.8 }}>{admin?.username}</div>
          </div>
          <button onClick={logout} className="btn btn-outline-warning btn-sm">Đăng xuất</button>
        </div>
      </header>

      <main style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
        {err && <div className="alert alert-danger">{err}</div>}

        {/* Tài khoản bị hạn chế */}
        <section style={{ marginBottom: 16 }}>
          <h5 style={{ color: "#ff6b6b" }}>Tài khoản bị hạn chế</h5>
          <div style={{ padding: 16, borderRadius: 14, background: "linear-gradient(145deg, rgba(255,255,255,0.03), rgba(0,0,0,0.2))", border: "1px solid rgba(255,255,255,0.08)" }}>
            {loadingRestricted ? (
              <div>Đang tải...</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-dark table-striped align-middle">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Username</th>
                      <th>Họ tên</th>
                      <th>SĐT</th>
                      <th>Email</th>
                      <th>Ngày tạo</th>
                      <th className="text-end">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {restricted.map((u, idx) => (
                      <tr key={u._id}>
                        <td>{idx + 1}</td>
                        <td style={{ fontFamily: "monospace" }}>{u.username}</td>
                        <td>{u.name}</td>
                        <td>{u.phone}</td>
                        <td>{u.email || "—"}</td>
                        <td>{new Date(u.createdAt).toLocaleString("vi-VN")}</td>
                        <td className="text-end">
                          <button className="btn btn-sm btn-outline-info" onClick={() => openDetail(u._id)}>Chi tiết</button>
                        </td>
                      </tr>
                    ))}
                    {restricted.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center">Chưa có tài khoản bị hạn chế.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Tìm kiếm theo username */}
        <section>
          <h5 style={{ color: "#66ffd1" }}>Tìm kiếm người dùng theo username</h5>
          <form className="row g-2 mb-3" onSubmit={handleSearch}>
            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="Nhập username"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <button className="btn btn-warning w-100" type="submit" disabled={loadingSearch}>
                {loadingSearch ? "Đang tìm..." : "Tìm"}
              </button>
            </div>
          </form>

          <div style={{ padding: 16, borderRadius: 14, background: "linear-gradient(145deg, rgba(255,255,255,0.03), rgba(0,0,0,0.2))", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="table-responsive">
              <table className="table table-dark table-striped align-middle">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Username</th>
                    <th>Họ tên</th>
                    <th>SĐT</th>
                    <th>Email</th>
                    <th>Trạng thái</th>
                    <th className="text-end">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResult.map((u, idx) => (
                    <tr key={u._id}>
                      <td>{idx + 1}</td>
                      <td style={{ fontFamily: "monospace" }}>{u.username}</td>
                      <td>{u.name}</td>
                      <td>{u.phone}</td>
                      <td>{u.email || "—"}</td>
                      <td>
                        {u.isRestricted ? (
                          <span className="badge bg-danger">Bị hạn chế</span>
                        ) : (
                          <span className="badge bg-success">Hoạt động</span>
                        )}
                      </td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-info" onClick={() => openDetail(u._id)}>Chi tiết</button>
                      </td>
                    </tr>
                  ))}
                  {searchResult.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center">Chưa có kết quả.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Modal chi tiết user */}
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
                maxWidth: 560,
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
                  User: <span style={{ fontFamily: "monospace" }}>{detail.username}</span>
                </h5>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-light"
                  onClick={() => setShowDetail(false)}
                >
                  Đóng
                </button>
              </div>

              <div className="row g-2 mb-2">
                <div className="col-md-6">
                  <div><strong>Họ tên:</strong> {detail.name}</div>
                  <div><strong>SĐT:</strong> {detail.phone}</div>
                  <div><strong>Email:</strong> {detail.email || "—"}</div>
                </div>
                <div className="col-md-6">
                  <div><strong>Vai trò:</strong> {detail.role}</div>
                  <div>
                    <strong>Trạng thái:</strong>{" "}
                    {detail.isRestricted ? (
                      <span className="badge bg-danger ms-1">Bị hạn chế</span>
                    ) : (
                      <span className="badge bg-success ms-1">Hoạt động</span>
                    )}
                  </div>
                  <div>
                    <strong>Tạo lúc:</strong>{" "}
                    {new Date(detail.createdAt).toLocaleString("vi-VN")}
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-2">
                <button
                  className={`btn btn-sm ${detail.isRestricted ? "btn-outline-success" : "btn-outline-danger"}`}
                  disabled={updating}
                  onClick={toggleRestricted}
                >
                  {detail.isRestricted ? "Bỏ hạn chế" : "Hạn chế tài khoản"}
                </button>
                <button
                  className="btn btn-sm btn-outline-warning"
                  disabled={updating}
                  onClick={handleDelete}
                >
                  Xóa tài khoản
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}