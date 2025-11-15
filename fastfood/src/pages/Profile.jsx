import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { updateProfile, changePassword, deleteAccount } from "../services/authService";

export default function Profile() {
  const { user, logout, setUserFromProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
  });

  const [pwOpen, setPwOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [saving, setSaving] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <h5>Vui lòng đăng nhập để xem thông tin cá nhân.</h5>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isValidPhone = (value) => {
    const cleaned = String(value).replace(/\D/g, "");
    return /^0\d{9}$/.test(cleaned);
  };

  const isValidEmail = (value) => {
    if (!value) return true; // cho phép để trống
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const openEdit = () => {
    setForm({ name: user.name || "", phone: user.phone || "", email: user.email || "" });
    setError("");
    setSuccess("");
    setEditOpen(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      if (!isValidPhone(form.phone)) {
        setError("Số điện thoại phải gồm 10 số và bắt đầu bằng 0.");
        setSaving(false);
        return;
      }
      if (!isValidEmail(form.email)) {
        setError("Email không đúng định dạng.");
        setSaving(false);
        return;
      }
      const res = await updateProfile(form);
      if (res?.user) {
        setUserFromProfile(res.user);
        setSuccess("Cập nhật thông tin thành công");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwSaving(true);
    setPwError("");
    setPwSuccess("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPwError("Vui lòng nhập đầy đủ mật khẩu");
      setPwSaving(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("Mật khẩu mới nhập lại không khớp");
      setPwSaving(false);
      return;
    }
    if (newPassword === oldPassword) {
      setPwError("Mật khẩu mới không được trùng mật khẩu cũ");
      setPwSaving(false);
      return;
    }

    try {
      const res = await changePassword({ oldPassword, newPassword });
      setPwSuccess(res?.message || "Đổi mật khẩu thành công");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPwError(err?.response?.data?.message || "Đổi mật khẩu thất bại");
    } finally {
      setPwSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    setSaving(true);
    setError("");
    try {
      await deleteAccount();
      setDeleteOpen(false);
      logout();
      navigate("/", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Xóa tài khoản thất bại");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: 700 }}>
      <h3 className="mb-3">Thông tin cá nhân</h3>

      <div className="card bg-dark text-light mb-3">
        <div className="card-body">
          <h5 className="card-title">Tài khoản</h5>
          <p className="mb-1"><strong>Username:</strong> {user.username}</p>
          <p className="mb-1"><strong>Họ tên:</strong> {user.name}</p>
          <p className="mb-1"><strong>Số điện thoại:</strong> {user.phone}</p>
          <p className="mb-1"><strong>Email:</strong> {user.email || "(chưa cập nhật)"}</p>
        </div>
        <div className="card-footer d-flex justify-content-between">
          <button className="btn btn-warning btn-sm" onClick={openEdit}>
            Sửa thông tin
          </button>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => {
              setError("");
              setSuccess("");
              setDeleteOpen(true);
            }}
          >
            Xóa tài khoản
          </button>
        </div>
      </div>

      {/* Modal sửa thông tin */}
      {editOpen && (
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
            className="bg-dark text-light"
            style={{
              borderRadius: 12,
              padding: 20,
              minWidth: 400,
              maxWidth: "90vw",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="mb-0">Sửa thông tin cá nhân</h5>
              <button className="btn btn-sm btn-outline-light" onClick={() => setEditOpen(false)}>
                Đóng
              </button>
            </div>

            {error && <div className="alert alert-danger py-2">{error}</div>}
            {success && <div className="alert alert-success py-2">{success}</div>}

            <form onSubmit={handleSaveProfile} className="mb-3">
              <div className="mb-2">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={user.username}
                  disabled
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Họ tên</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Số điện thoại</label>
                <input
                  type="tel"
                  className="form-control form-control-sm"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control form-control-sm"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="btn btn-warning btn-sm" disabled={saving}>
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>

              {/* Nút mở modal đổi mật khẩu riêng */}
              <div className="mt-3">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-warning"
                  onClick={() => {
                    setEditOpen(false);
                    setPwOpen(true);
                    setPwError("");
                    setPwSuccess("");
                    setOldPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                >
                  Đổi mật khẩu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa tài khoản */}
      {deleteOpen && (
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
            className="bg-dark text-light"
            style={{
              borderRadius: 12,
              padding: 20,
              minWidth: 380,
              maxWidth: "90vw",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h5 className="mb-2">Xóa tài khoản</h5>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <p className="mb-3">
              Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.
            </p>
            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setDeleteOpen(false)}
                disabled={saving}
              >
                Hủy
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={handleConfirmDelete}
                disabled={saving}
              >
                {saving ? "Đang xóa..." : "Xóa tài khoản"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal đổi mật khẩu riêng */}
      {pwOpen && (
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
            className="bg-dark text-light"
            style={{
              borderRadius: 12,
              padding: 20,
              minWidth: 400,
              maxWidth: "90vw",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="mb-0">Đổi mật khẩu</h5>
              <button
                className="btn btn-sm btn-outline-light"
                onClick={() => setPwOpen(false)}
              >
                Đóng
              </button>
            </div>

            {pwError && <div className="alert alert-danger py-2">{pwError}</div>}
            {pwSuccess && <div className="alert alert-success py-2">{pwSuccess}</div>}

            <form onSubmit={handleChangePassword}>
              <div className="mb-2">
                <label className="form-label">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  className="form-control form-control-sm"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Mật khẩu mới</label>
                <input
                  type="password"
                  className="form-control form-control-sm"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Nhập lại mật khẩu mới</label>
                <input
                  type="password"
                  className="form-control form-control-sm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-warning btn-sm"
                disabled={pwSaving}
              >
                {pwSaving ? "Đang đổi..." : "Lưu mật khẩu mới"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
