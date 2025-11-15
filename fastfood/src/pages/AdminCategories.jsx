import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAdminAuth } from "../hooks/useAdminAuth";

import {
  adminGetCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
} from "../services/adminCategoryService";

export default function AdminCategories() {
  const { admin, logout } = useAdminAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({ name: "", slug: "" });
  const [editing, setEditing] = useState(null); // id đang sửa
  const [submitting, setSubmitting] = useState(false);
  const [filterQ, setFilterQ] = useState("");
  const [showModal, setShowModal] = useState(false);

  const refresh = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await adminGetCategories();
      setItems(res.data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Lỗi tải danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setSubmitting(true);
    try {
      if (!form.name.trim()) {
        setErr("Tên danh mục không được trống");
      } else if (editing) {
        await adminUpdateCategory(editing, { ...form });
        setEditing(null);
        setForm({ name: "", slug: "" });
        setShowModal(false);
        await refresh();
      } else {
        await adminCreateCategory({ ...form });
        setForm({ name: "", slug: "" });
        setShowModal(false);
        await refresh();
      }
    } catch (e) {
      setErr(e?.response?.data?.message || "Lỗi lưu danh mục");
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (cat) => {
    setEditing(cat._id);
    setForm({ name: cat.name, slug: cat.slug || "" });
    setShowModal(true);
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm({ name: "", slug: "" });
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa danh mục này?")) return;
    setErr("");
    try {
      await adminDeleteCategory(id);
      await refresh();
    } catch (e) {
      setErr(e?.response?.data?.message || "Không thể xóa danh mục (có thể đang được dùng).");
    }
  };

  const normalizedFilter = filterQ.trim().toLowerCase();
  const filteredItems = normalizedFilter
    ? items.filter((c) =>
        (c.name || "").toLowerCase().includes(normalizedFilter) ||
        (c.slug || "").toLowerCase().includes(normalizedFilter)
      )
    : items;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f0b22 0%, #140a33 60%, #000 100%)",
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
              Quản lý danh mục
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

      <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
        <section
          style={{
            padding: 16,
            borderRadius: 14,
            background: "linear-gradient(145deg, rgba(255,255,255,0.03), rgba(0,0,0,0.2))",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 style={{ color: "#FFD700", margin: 0, fontWeight: 800 }}>Danh mục</h5>
            <button
              className="btn btn-warning"
              type="button"
              onClick={() => {
                setEditing(null);
                setForm({ name: "", slug: "" });
                setErr("");
                setShowModal(true);
              }}
            >
              Thêm danh mục
            </button>
          </div>

          <div className="row g-2 mb-2">
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Lọc theo tên hoặc slug"
                value={filterQ}
                onChange={(e) => setFilterQ(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div>Đang tải...</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-striped align-middle">
                <thead>
                  <tr>
                    <th>Tên</th>
                    <th>Slug</th>
                    <th style={{ width: 200 }} className="text-end">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((c) => (
                    <tr key={c._id}>
                      <td>{c.name}</td>
                      <td>{c.slug || "—"}</td>
                      <td className="text-end">
                        <div className="d-inline-flex gap-2">
                          <button className="btn btn-sm btn-outline-warning" onClick={() => startEdit(c)}>
                            Sửa
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c._id)}>
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-center">
                        Không có danh mục phù hợp.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {showModal && (
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
                maxWidth: 500,
                borderRadius: 16,
                background:
                  "linear-gradient(145deg, rgba(59,0,120,0.9), rgba(26,0,51,0.95))",
                border: "1px solid rgba(255,215,0,0.35)",
                padding: 20,
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 style={{ color: "#FFD700", margin: 0, fontWeight: 800 }}>
                  {editing ? "Sửa danh mục" : "Thêm danh mục"}
                </h5>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-light"
                  onClick={cancelEdit}
                >
                  Đóng
                </button>
              </div>

              <form onSubmit={handleSubmit} className="row g-2">
                <div className="col-12">
                  <input
                    className="form-control"
                    placeholder="Tên danh mục"
                    value={form.name}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, name: e.target.value }))
                    }
                  />
                </div>
                <div className="col-12">
                  <input
                    className="form-control"
                    placeholder="Slug (tuỳ chọn)"
                    value={form.slug}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, slug: e.target.value }))
                    }
                  />
                </div>
                <div className="col-12 d-flex gap-2 justify-content-end mt-2">
                  <button
                    className="btn btn-warning"
                    disabled={submitting}
                    type="submit"
                  >
                    {submitting
                      ? "Đang lưu..."
                      : editing
                      ? "Cập nhật"
                      : "Thêm"}
                  </button>
                  <button
                    className="btn btn-outline-light"
                    type="button"
                    onClick={cancelEdit}
                  >
                    Hủy
                  </button>
                </div>
              </form>

              {err && (
                <div style={{ color: "#ff9b9b", marginTop: 10 }}>{err}</div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}