import React, { useEffect, useState } from "react";
import { useAdminAuth } from "../hooks/useAdminAuth";
import { getCategories } from "../services/categoryService";
import { adminGetFoods, adminCreateFood, adminUpdateFood, adminDeleteFood } from "../services/adminFoodService";

export default function AdminFoods() {
  const { admin, logout } = useAdminAuth();
  const [items, setItems] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image: "",
    isAvailable: true,
  });

  const refresh = async () => {
    setLoading(true);
    setErr("");
    try {
      const [foodRes, catRes] = await Promise.all([adminGetFoods(), getCategories()]);
      setItems(foodRes.data || []);
      setCats(catRes.data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const startEdit = (f) => {
    setEditing(f._id);
    setForm({
      name: f.name,
      price: f.price,
      category: f.category || "",
      description: f.description || "",
      image: f.image || "",
      isAvailable: !!f.isAvailable,
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm({ name: "", price: "", category: "", description: "", image: "", isAvailable: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setSubmitting(true);
    try {
      if (!form.name.trim()) return setErr("Tên là bắt buộc");
      if (!form.description.trim()) return setErr("Mô tả là bắt buộc");
      const p = Number(form.price);
      if (isNaN(p) || p <= 0) return setErr("Giá phải > 0");
      if (!form.category.trim()) return setErr("Phải chọn danh mục");

      if (editing) {
        await adminUpdateFood(editing, {
          name: form.name,
          price: p,
          category: form.category,
          description: form.description,
          image: form.image || undefined,
          isAvailable: !!form.isAvailable,
        });
      } else {
        await adminCreateFood({
          name: form.name,
          price: p,
          category: form.category,
          description: form.description,
          image: form.image || undefined,
          isAvailable: !!form.isAvailable,
        });
      }
      cancelEdit();
      await refresh();
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Lỗi lưu món ăn");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa món ăn này?")) return;
    setErr("");
    try {
      await adminDeleteFood(id);
      await refresh();
    } catch (e) {
      setErr(e?.response?.data?.message || "Không thể xóa món ăn");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0b22 0%, #140a33 60%, #000 100%)", color: "#fff" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "linear-gradient(180deg, rgba(20,8,60,0.9), rgba(10,6,28,0.9))", position: "sticky", top: 0, zIndex: 10 }}>
        <h4 style={{ margin: 0, color: "#FFD700", fontWeight: 800 }}>Quản lý món ăn</h4>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ textAlign: "right", fontSize: 13, lineHeight: 1.2, color: "#d9d6ff" }}>
            <div style={{ fontWeight: 700 }}>{admin?.name || "Administrator"}</div>
            <div style={{ opacity: 0.8 }}>{admin?.username}</div>
          </div>
          <button onClick={logout} className="btn btn-outline-warning btn-sm">Đăng xuất</button>
        </div>
      </header>

      <main style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
        <section style={{ marginBottom: 20, padding: 16, borderRadius: 14, background: "linear-gradient(145deg, rgba(59,0,120,0.35), rgba(26,0,51,0.35))", border: "1px solid rgba(255,215,0,0.25)" }}>
          <h5 style={{ color: "#FFD700", marginBottom: 12, fontWeight: 800 }}>{editing ? "Sửa món ăn" : "Thêm món ăn"}</h5>
          <form onSubmit={handleSubmit} className="row g-2">
            <div className="col-md-3">
              <input className="form-control" placeholder="Tên món" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
            </div>
            <div className="col-md-2">
              <input className="form-control" placeholder="Giá" type="number" min="1" value={form.price} onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))} />
            </div>
            <div className="col-md-3">
              <select className="form-select" value={form.category} onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}>
                <option value="">-- Chọn danh mục --</option>
                {cats.map((c) => (
                  <option key={c._id || c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <input className="form-control" placeholder="Ảnh (URL tuỳ chọn)" value={form.image} onChange={(e) => setForm((s) => ({ ...s, image: e.target.value }))} />
            </div>
            <div className="col-12">
              <textarea className="form-control" placeholder="Mô tả" rows={2} value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} />
            </div>
            <div className="col-12 d-flex align-items-center gap-2">
              <input id="available" type="checkbox" checked={form.isAvailable} onChange={(e) => setForm((s) => ({ ...s, isAvailable: e.target.checked }))} />
              <label htmlFor="available">Còn bán</label>
            </div>
            <div className="col-12 d-flex gap-2">
              <button className="btn btn-warning" disabled={submitting} type="submit">{submitting ? "Đang lưu..." : editing ? "Cập nhật" : "Thêm"}</button>
              {editing && <button className="btn btn-outline-light" type="button" onClick={cancelEdit}>Hủy</button>}
            </div>
          </form>
          {err && <div style={{ color: "#ff9b9b", marginTop: 10 }}>{err}</div>}
        </section>

        <section style={{ padding: 16, borderRadius: 14, background: "linear-gradient(145deg, rgba(255,255,255,0.03), rgba(0,0,0,0.2))", border: "1px solid rgba(255,255,255,0.08)" }}>
          {loading ? (
            <div>Đang tải...</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-striped align-middle">
                <thead>
                  <tr>
                    <th style={{ width: 60 }}>#</th>
                    <th>Tên</th>
                    <th>Danh mục</th>
                    <th>Mô tả</th>
                    <th>Giá</th>
                    <th>Còn bán</th>
                    <th style={{ width: 200 }} className="text-end">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((f, idx) => (
                    <tr key={f._id}>
                      <td>{idx + 1}</td>
                      <td>{f.name}</td>
                      <td>{f.category}</td>
                      <td style={{ maxWidth: 300, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.description}</td>
                      <td>{f.price.toLocaleString()} đ</td>
                      <td>{f.isAvailable ? "Có" : "Hết"}</td>
                      <td className="text-end">
                        <div className="d-inline-flex gap-2">
                          <button className="btn btn-sm btn-outline-warning" onClick={() => startEdit(f)}>Sửa</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(f._id)}>Xóa</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center">Chưa có món ăn.</td>
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