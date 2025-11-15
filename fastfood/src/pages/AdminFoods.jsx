import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
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
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [discountFilter, setDiscountFilter] = useState("all"); // all | on | off
  const [availableFilter, setAvailableFilter] = useState("all"); // all | available | unavailable
  const [page, setPage] = useState(1);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image: "",
    isAvailable: true,
    hasDiscount: false,
    discountPercent: "",
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

  const filteredItems = items.filter((f) => {
    const matchName = f.name?.toLowerCase().includes(search.toLowerCase());

    let matchDiscount = true;
    if (discountFilter === "on") {
      matchDiscount = !!(f.discountPercent && f.discountPercent > 0);
    } else if (discountFilter === "off") {
      matchDiscount = !f.discountPercent || f.discountPercent <= 0;
    }

    let matchAvailable = true;
    if (availableFilter === "available") {
      matchAvailable = !!f.isAvailable;
    } else if (availableFilter === "unavailable") {
      matchAvailable = !f.isAvailable;
    }

    return matchName && matchDiscount && matchAvailable;
  });

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedItems = filteredItems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, discountFilter, availableFilter, items.length]);

  const startCreate = () => {
    setEditing(null);
    setForm({
      name: "",
      price: "",
      category: "",
      description: "",
      image: "",
      isAvailable: true,
      hasDiscount: false,
      discountPercent: "",
    });
    setErr("");
    setShowModal(true);
  };

  const startEdit = (f) => {
    setEditing(f._id);
    setForm({
      name: f.name,
      price: f.price,
      category: f.category || "",
      description: f.description || "",
      image: f.image || "",
      isAvailable: !!f.isAvailable,
      hasDiscount: !!(f.discountPercent && f.discountPercent > 0),
      discountPercent: f.discountPercent || "",
    });
    setErr("");
    setShowModal(true);
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm({
      name: "",
      price: "",
      category: "",
      description: "",
      image: "",
      isAvailable: true,
      hasDiscount: false,
      discountPercent: "",
    });
    setShowModal(false);
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

      let discountPayload = 0;
      if (form.hasDiscount) {
        const d = Number(form.discountPercent);
        if (isNaN(d) || d < 0 || d > 100) {
          return setErr("% giảm phải từ 0 đến 100");
        }
        discountPayload = d;
      }

      if (editing) {
        await adminUpdateFood(editing, {
          name: form.name,
          price: p,
          category: form.category,
          description: form.description,
          image: form.image || undefined,
          isAvailable: !!form.isAvailable,
          discountPercent: discountPayload,
        });
      } else {
        await adminCreateFood({
          name: form.name,
          price: p,
          category: form.category,
          description: form.description,
          image: form.image || undefined,
          isAvailable: !!form.isAvailable,
          discountPercent: discountPayload,
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
              Quản lý món ăn
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

      <main style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
        <section style={{ marginBottom: 16, padding: 12, borderRadius: 12, background: "linear-gradient(145deg, rgba(255,255,255,0.03), rgba(0,0,0,0.25))", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="row g-2 align-items-center">
            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="Lọc theo tên món"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={discountFilter}
                onChange={(e) => setDiscountFilter(e.target.value)}
              >
                <option value="all">Tất cả giảm giá</option>
                <option value="on">Chỉ món đang giảm</option>
                <option value="off">Chỉ món không giảm</option>
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={availableFilter}
                onChange={(e) => setAvailableFilter(e.target.value)}
              >
                <option value="all">Tất cả trạng thái bán</option>
                <option value="available">Chỉ còn bán</option>
                <option value="unavailable">Chỉ ngừng bán</option>
              </select>
            </div>
            <div className="col-md-2 text-end">
              <button
                type="button"
                className="btn btn-warning w-100"
                onClick={startCreate}
              >
                + Thêm món
              </button>
            </div>
          </div>
        </section>

        <section style={{ padding: 16, borderRadius: 14, background: "linear-gradient(145deg, rgba(255,255,255,0.03), rgba(0,0,0,0.2))", border: "1px solid rgba(255,255,255,0.08)" }}>
          {loading ? (
            <div>Đang tải...</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-striped align-middle">
                <thead>
                  <tr>
                    <th>Tên</th>
                    <th>Danh mục</th>
                    <th>Mô tả</th>
                    <th>Giá</th>
                    <th>Giảm</th>
                    <th>Còn bán</th>
                    <th style={{ width: 200 }} className="text-end">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedItems.map((f) => (
                    <tr key={f._id}>
                      <td>{f.name}</td>
                      <td>{f.category}</td>
                      <td style={{ maxWidth: 300, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.description}</td>
                      <td>{f.price.toLocaleString()} đ</td>
                      <td>
                        {f.discountPercent && f.discountPercent > 0
                          ? `${f.discountPercent}%`
                          : "-"}
                      </td>
                      <td>{f.isAvailable ? "Có" : "Hết"}</td>
                      <td className="text-end">
                        <div className="d-inline-flex gap-2">
                          <button className="btn btn-sm btn-outline-warning" onClick={() => startEdit(f)}>Sửa</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(f._id)}>Xóa</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center">Chưa có món ăn.</td>
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
              Trang {currentPage} / {totalPages} (Tổng {filteredItems.length} món)
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
                onClick={() =>
                  setPage((p) => Math.min(totalPages, p + 1))
                }
              >
                Sau
              </button>
            </div>
          </div>
        )}
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
                  {editing ? "Sửa món ăn" : "Thêm món ăn"}
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
                <div className="col-md-3">
                  <input
                    className="form-control"
                    placeholder="Tên món"
                    value={form.name}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, name: e.target.value }))
                    }
                  />
                </div>
                <div className="col-md-2">
                  <input
                    className="form-control"
                    placeholder="Giá"
                    type="number"
                    min="1"
                    value={form.price}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, price: e.target.value }))
                    }
                  />
                </div>
                <div className="col-md-2 d-flex align-items-center gap-2">
                  <input
                    id="hasDiscount"
                    type="checkbox"
                    checked={form.hasDiscount}
                    onChange={(e) =>
                      setForm((s) => ({
                        ...s,
                        hasDiscount: e.target.checked,
                        discountPercent: e.target.checked
                          ? s.discountPercent
                          : "",
                      }))
                    }
                  />
                  <label htmlFor="hasDiscount" className="mb-0">
                    Giảm giá
                  </label>
                </div>
                {form.hasDiscount && (
                  <div className="col-md-2">
                    <div className="input-group">
                      <input
                        className="form-control"
                        placeholder="% giảm"
                        type="number"
                        min="0"
                        max="100"
                        value={form.discountPercent}
                        onChange={(e) =>
                          setForm((s) => ({
                            ...s,
                            discountPercent: e.target.value,
                          }))
                        }
                      />
                      <span className="input-group-text">%</span>
                    </div>
                  </div>
                )}
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={form.category}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, category: e.target.value }))
                    }
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {cats.map((c) => (
                      <option key={c._id || c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <input
                    className="form-control"
                    placeholder="Ảnh (URL tuỳ chọn)"
                    value={form.image}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, image: e.target.value }))
                    }
                  />
                </div>
                <div className="col-12">
                  <textarea
                    className="form-control"
                    placeholder="Mô tả"
                    rows={2}
                    value={form.description}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, description: e.target.value }))
                    }
                  />
                </div>
                <div className="col-12 d-flex align-items-center gap-2">
                  <input
                    id="available"
                    type="checkbox"
                    checked={form.isAvailable}
                    onChange={(e) =>
                      setForm((s) => ({
                        ...s,
                        isAvailable: e.target.checked,
                      }))
                    }
                  />
                  <label htmlFor="available">Còn bán</label>
                </div>
                <div className="col-12 d-flex gap-2 mt-1">
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