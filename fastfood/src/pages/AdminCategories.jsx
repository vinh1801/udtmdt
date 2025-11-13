import React, { useEffect, useState } from "react";
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
        await refresh();
      } else {
        await adminCreateCategory({ ...form });
        setForm({ name: "", slug: "" });
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
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm({ name: "", slug: "" });
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
          padding: "16px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          background: "linear-gradient(180deg, rgba(20,8,60,0.9), rgba(10,6,28,0.9))",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <h4 style={{ margin: 0, color: "#FFD700", fontWeight: 800 }}>Quản lý danh mục</h4>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ textAlign: "right", fontSize: 13, lineHeight: 1.2, color: "#d9d6ff" }}>
            <div style={{ fontWeight: 700 }}>{admin?.name || "Administrator"}</div>
            <div style={{ opacity: 0.8 }}>{admin?.username}</div>
          </div>
          <button
            onClick={logout}
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: "1px solid rgba(255,215,0,0.4)",
              background: "linear-gradient(90deg, rgba(255,215,0,0.15), rgba(255,51,204,0.15))",
              color: "#FFD700",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Đăng xuất
          </button>
        </div>
      </header>

      <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
        <section
          style={{
            marginBottom: 20,
            padding: 16,
            borderRadius: 14,
            background: "linear-gradient(145deg, rgba(59,0,120,0.35), rgba(26,0,51,0.35))",
            border: "1px solid rgba(255,215,0,0.25)",
          }}
        >
          <h5 style={{ color: "#FFD700", marginBottom: 12, fontWeight: 800 }}>
            {editing ? "Sửa danh mục" : "Thêm danh mục"}
          </h5>
          <form onSubmit={handleSubmit} className="row g-2">
            <div className="col-md-5">
              <input
                className="form-control"
                placeholder="Tên danh mục"
                value={form.name}
                onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              />
            </div>
            <div className="col-md-5">
              <input
                className="form-control"
                placeholder="Slug (tuỳ chọn)"
                value={form.slug}
                onChange={(e) => setForm((s) => ({ ...s, slug: e.target.value }))}
              />
            </div>
            <div className="col-md-2 d-flex gap-2">
              <button className="btn btn-warning w-100" disabled={submitting} type="submit">
                {submitting ? "Đang lưu..." : editing ? "Cập nhật" : "Thêm"}
              </button>
              {editing && (
                <button className="btn btn-outline-light" type="button" onClick={cancelEdit}>
                  Hủy
                </button>
              )}
            </div>
          </form>
          {err && <div style={{ color: "#ff9b9b", marginTop: 10 }}>{err}</div>}
        </section>

        <section
          style={{
            padding: 16,
            borderRadius: 14,
            background: "linear-gradient(145deg, rgba(255,255,255,0.03), rgba(0,0,0,0.2))",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {loading ? (
            <div>Đang tải...</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-striped align-middle">
                <thead>
                  <tr>
                    <th style={{ width: 60 }}>#</th>
                    <th>Tên</th>
                    <th>Slug</th>
                    <th style={{ width: 200 }} className="text-end">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((c, idx) => (
                    <tr key={c._id}>
                      <td>{idx + 1}</td>
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
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center">
                        Chưa có danh mục.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}