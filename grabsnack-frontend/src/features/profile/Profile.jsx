import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '../../shared/components/Navbar';
import { useGrabSnack } from '../../shared/context/GrabSnackContext';
import api from '../../shared/api/api';
import "../../shared/styles/Style2.css";

function Profile() {
  const navigate = useNavigate();
  const { user, logout, login } = useGrabSnack();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      api.get('/api/orders')
        .then(({ data }) => setOrders(data.data ?? []))
        .catch(() => setOrders([]));
    }
  }, [user]);

  const [editing, setEditing]       = useState(false);
  const [saved, setSaved]           = useState(false);
  const [form, setForm]             = useState({
    fullName: user?.fullName || "",
    email:    user?.email    || "",
    phone:    user?.phone    || "",
  });

  const [pwForm, setPwForm]         = useState({ current: "", newPw: "", confirm: "" });
  const [pwError, setPwError]       = useState("");
  const [pwSuccess, setPwSuccess]   = useState(false);
  const [pwLoading, setPwLoading]   = useState(false);
  const [showPw, setShowPw]         = useState({ current: false, newPw: false, confirm: false });

  const handleChangePassword = async () => {
    setPwError("");
    if (!pwForm.current)                          return setPwError("Current password is required");
    if (pwForm.newPw.length < 6)                  return setPwError("New password must be at least 6 characters");
    if (pwForm.newPw !== pwForm.confirm)           return setPwError("Passwords do not match");
    setPwLoading(true);
    try {
      await api.put("/api/users/me/change-password", {
        currentPassword: pwForm.current,
        newPassword:     pwForm.newPw,
      });
      setPwSuccess(true);
      setPwForm({ current: "", newPw: "", confirm: "" });
      setTimeout(() => setPwSuccess(false), 3000);
    } catch (err) {
      setPwError(err?.response?.data?.error?.message || "Failed to change password");
    } finally {
      setPwLoading(false);
    }
  };

  // Derive initials for avatar
  const initials = (form.fullName || form.email || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Stats
  const totalOrders    = orders.length;
  const totalSpent     = orders.reduce((s, o) => s + (o.total || 0), 0);
  const favoriteItem   = (() => {
    const freq = {};
    orders.forEach((o) =>
      o.items?.forEach((item) => {
        freq[item.name] = (freq[item.name] || 0) + item.quantity;
      })
    );
    const top = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];
    return top ? top[0] : "—";
  })();

  const handleSave = () => {
    login({ ...user, ...form });
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="page-wrapper">
      <Navbar />

      <div className="page-header">
        <h1 className="page-title">👤 My Profile</h1>
        <p className="page-subtitle">Manage your account and preferences</p>
      </div>

      <div className="content-section">
        <div className="profile-grid">

          {/* ─ Left column: Avatar + stats ─ */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Profile card */}
            <div className="dark-card" style={{ padding: "36px 28px", textAlign: "center" }}>
              <div className="avatar">{initials}</div>

              <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#fff", marginBottom: "4px" }}>
                {form.fullName || "GrabSnack User"}
              </h2>
              <p style={{ color: "#4a4e68", fontSize: "14px", marginBottom: "20px" }}>
                {form.email}
              </p>

              <span
                style={{
                  display: "inline-block",
                  background: "rgba(77,163,255,0.1)",
                  border: "1px solid rgba(77,163,255,0.25)",
                  color: "#4da3ff",
                  fontSize: "12px",
                  fontWeight: "700",
                  padding: "5px 16px",
                  borderRadius: "50px",
                }}
              >
                🏅 GrabSnack Member
              </span>
            </div>

            {/* Stats */}
            <div className="dark-card" style={{ padding: "24px" }}>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  color: "#DC6180",
                  marginBottom: "20px",
                }}
              >
                Your Stats
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="stat-card">
                  <div className="stat-value">{totalOrders}</div>
                  <div className="stat-label">Orders</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">₱{totalSpent}</div>
                  <div className="stat-label">Total Spent</div>
                </div>
              </div>

              <div className="stat-card" style={{ marginTop: "12px" }}>
                <div
                  style={{ fontSize: "22px", fontWeight: "800", color: "#DC6180", marginBottom: "4px" }}
                >
                  {favoriteItem.length > 16 ? favoriteItem.slice(0, 16) + "…" : favoriteItem}
                </div>
                <div className="stat-label">Favorite Item</div>
              </div>
            </div>

            {/* Logout */}
            <button
              className="btn-danger"
              style={{ width: "100%", justifyContent: "center", padding: "14px" }}
              onClick={handleLogout}
            >
              🚪 Sign Out
            </button>
          </div>

          {/* ─ Right column: Edit form ─ */}
          <div>
            <div className="dark-card" style={{ padding: "32px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "28px",
                }}
              >
                <div>
                  <div
                    style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.8px", color: "#DC6180", marginBottom: "4px" }}
                  >
                    Profile Info
                  </div>
                  <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#fff", margin: 0 }}>
                    Personal Details
                  </h3>
                </div>
                {!editing && (
                  <button
                    className="btn-outline"
                    style={{ padding: "10px 20px" }}
                    onClick={() => setEditing(true)}
                  >
                    ✏️ Edit
                  </button>
                )}
              </div>

              {saved && (
                <div className="auth-success" style={{ marginBottom: "20px" }}>
                  ✅ Profile updated successfully!
                </div>
              )}

              {/* Fields */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  {editing ? (
                    <input
                      type="text"
                      className="form-input"
                      value={form.fullName}
                      onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                      placeholder="Juan dela Cruz"
                    />
                  ) : (
                    <div
                      style={{
                        padding: "14px 16px",
                        background: "rgba(57,61,82,0.3)",
                        border: "1.5px solid #393d52",
                        borderRadius: "10px",
                        color: "#fff",
                        fontSize: "14px",
                      }}
                    >
                      {form.fullName || <span style={{ color: "#4a4e68" }}>Not set</span>}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  {editing ? (
                    <input
                      type="email"
                      className="form-input"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="you@example.com"
                    />
                  ) : (
                    <div
                      style={{
                        padding: "14px 16px",
                        background: "rgba(57,61,82,0.3)",
                        border: "1.5px solid #393d52",
                        borderRadius: "10px",
                        color: "#fff",
                        fontSize: "14px",
                      }}
                    >
                      {form.email || <span style={{ color: "#4a4e68" }}>Not set</span>}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  {editing ? (
                    <input
                      type="tel"
                      className="form-input"
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      placeholder="+63 9xx xxx xxxx"
                    />
                  ) : (
                    <div
                      style={{
                        padding: "14px 16px",
                        background: "rgba(57,61,82,0.3)",
                        border: "1.5px solid #393d52",
                        borderRadius: "10px",
                        color: form.phone ? "#fff" : "#4a4e68",
                        fontSize: "14px",
                      }}
                    >
                      {form.phone || "Not set"}
                    </div>
                  )}
                </div>
              </div>

              {/* Save / Cancel */}
              {editing && (
                <div style={{ display: "flex", gap: "12px", marginTop: "28px" }}>
                  <button className="btn-primary" style={{ flex: 1 }} onClick={handleSave}>
                    💾 Save Changes
                  </button>
                  <button
                    className="btn-outline"
                    style={{ padding: "14px 24px" }}
                    onClick={() => { setEditing(false); setForm({ fullName: user?.fullName || "", email: user?.email || "", phone: user?.phone || "" }); }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Change Password */}
            <div className="dark-card" style={{ padding: "32px", marginTop: "20px" }}>
              <div style={{ marginBottom: "24px" }}>
                <div style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.8px", color: "#DC6180", marginBottom: "4px" }}>
                  Security
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#fff", margin: 0 }}>
                  🔒 Change Password
                </h3>
              </div>

              {pwSuccess && (
                <div className="auth-success" style={{ marginBottom: "16px" }}>
                  ✅ Password changed successfully!
                </div>
              )}
              {pwError && (
                <p style={{ color: "#f87171", fontSize: "13px", marginBottom: "16px", fontWeight: 500 }}>
                  {pwError}
                </p>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {[
                  { key: "current", label: "Current Password",     placeholder: "Enter current password" },
                  { key: "newPw",   label: "New Password",         placeholder: "At least 6 characters" },
                  { key: "confirm", label: "Confirm New Password", placeholder: "Re-enter new password" },
                ].map(({ key, label, placeholder }) => (
                  <div key={key} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "12px", fontWeight: "600", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {label}
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showPw[key] ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder={placeholder}
                        value={pwForm[key]}
                        onChange={(e) => setPwForm((f) => ({ ...f, [key]: e.target.value }))}
                        style={{
                          width: "100%",
                          boxSizing: "border-box",
                          padding: "14px 44px 14px 16px",
                          background: "#2a2d3e",
                          border: "1.5px solid #393d52",
                          borderRadius: "10px",
                          outline: "none",
                          fontSize: "14px",
                          color: "#ffffff",
                          caretColor: "#ffffff",
                          letterSpacing: showPw[key] ? "normal" : "4px",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw((s) => ({ ...s, [key]: !s[key] }))}
                        style={{
                          position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                          background: "none", border: "none", cursor: "pointer",
                          fontSize: "18px", padding: 0, lineHeight: 1,
                        }}
                        title={showPw[key] ? "Hide password" : "Show password"}
                      >
                        {showPw[key] ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  className="btn-primary"
                  style={{ opacity: pwLoading ? 0.7 : 1, cursor: pwLoading ? "not-allowed" : "pointer" }}
                  onClick={handleChangePassword}
                  disabled={pwLoading}
                >
                  {pwLoading ? "⏳ Updating..." : "🔑 Update Password"}
                </button>
              </div>
            </div>

            {/* Account actions */}
            <div className="dark-card" style={{ padding: "28px", marginTop: "20px" }}>
              <div
                style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.8px", color: "#DC6180", marginBottom: "16px" }}
              >
                Quick Links
              </div>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <a href="/orders"   className="btn-outline" style={{ padding: "11px 20px" }}>📋 My Orders</a>
                <a href="/cart"     className="btn-outline" style={{ padding: "11px 20px" }}>🛒 My Cart</a>
                <a href="/dashboard" className="btn-outline" style={{ padding: "11px 20px" }}>🍔 Menu</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
