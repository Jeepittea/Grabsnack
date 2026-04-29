import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { useGrabSnack } from "../context/GrabSnackContext";
import api from "../api/api";
import "../Style2.css";

const SHIPPING_FEE = 50;

const PAYMENT_METHODS = [
  { id: "cod",    emoji: "💵", name: "Cash on Delivery", desc: "Pay when it arrives" },
  { id: "gcash",  emoji: "📱", name: "GCash",            desc: "Mobile payment" },
  { id: "credit", emoji: "💳", name: "Credit Card",      desc: "Visa / Mastercard" },
  { id: "debit",  emoji: "🏦", name: "Debit Card",       desc: "Bank debit card" },
];

function Checkout() {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useGrabSnack();

  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    address:  "",
    city:     "",
    zip:      "",
    country:  "Philippines",
    phone:    "",
  });
  const [payment, setPayment]       = useState("cod");
  const [loading, setLoading]       = useState(false);
  const [errors, setErrors]         = useState({});
  const [orderError, setOrderError] = useState("");

  if (cart.length === 0) {
    return (
      <div className="page-wrapper">
        <Navbar />
        <div className="empty-state" style={{ marginTop: "80px" }}>
          <span className="empty-emoji">🛒</span>
          <h3 className="empty-title">Your cart is empty</h3>
          <p className="empty-text">Add some items before checking out.</p>
          <Link to="/dashboard" className="btn-primary" style={{ display: "inline-block", width: "auto", padding: "14px 36px" }}>
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (!form.address.trim())  errs.address  = "Address is required";
    if (!form.city.trim())     errs.city     = "City is required";
    if (!form.zip.trim())      errs.zip      = "ZIP code is required";
    if (!form.country.trim())  errs.country  = "Country is required";
    if (!form.phone.trim())    errs.phone    = "Phone number is required";
    return errs;
  };

  const handlePlaceOrder = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setOrderError("");
    setLoading(true);

    try {
      const subtotal = cartTotal;
      const total    = subtotal + SHIPPING_FEE;

      const { data } = await api.post("/api/orders", {
        items: cart.map((i) => ({
          productId: i.id,
          name:      i.name,
          emoji:     i.emoji,
          price:     i.price,
          quantity:  i.quantity,
        })),
        shippingAddress: {
          shippingFullName: form.fullName,
          shippingAddress:  form.address,
          shippingCity:     form.city,
          shippingZipCode:  form.zip,
          shippingCountry:  form.country,
        },
        subtotal,
        shipping: SHIPPING_FEE,
        total,
      });

      clearCart();
      navigate("/order-confirmation", {
        state: {
          order: {
            id:              `#${data.data.orderCode}`,
            orderCode:       data.data.orderCode,
            items:           cart,
            subtotal,
            shipping:        SHIPPING_FEE,
            total,
            shippingAddress: form,
            paymentMethod:   payment,
          },
        },
      });
    } catch (err) {
      const msg =
        err?.response?.data?.error?.message ||
        "Failed to place order. Please try again.";
      setOrderError(msg);
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ field, label, placeholder, type = "text" }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        type={type}
        className="form-input"
        placeholder={placeholder}
        value={form[field]}
        onChange={handleChange(field)}
        style={{ borderColor: errors[field] ? "#EF4444" : undefined }}
      />
      {errors[field] && (
        <span style={{ fontSize: "12px", color: "#EF4444", marginTop: "4px", display: "block" }}>
          {errors[field]}
        </span>
      )}
    </div>
  );

  return (
    <div className="page-wrapper">
      <Navbar />

      <div className="page-header">
        <h1 className="page-title">📦 Checkout</h1>
        <p className="page-subtitle">Almost there! Fill in your delivery details</p>
      </div>

      <div className="content-section">
        <div className="checkout-grid">

          {/* ─ Left: Forms ─ */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* Shipping form */}
            <div className="dark-card" style={{ padding: "28px" }}>
              <div className="section-label">📍 Delivery Address</div>

              <InputField field="fullName" label="Full Name"       placeholder="Juan dela Cruz" />
              <InputField field="address"  label="Street Address"  placeholder="123 Rizal St, Barangay..." />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <InputField field="city" label="City / Municipality" placeholder="Cebu City" />
                <InputField field="zip"  label="ZIP Code"            placeholder="6000" />
              </div>

              <InputField field="country" label="Country"      placeholder="Philippines" />
              <InputField field="phone"   label="Phone Number" placeholder="+63 9xx xxx xxxx" type="tel" />
            </div>

            {/* Payment method */}
            <div className="dark-card" style={{ padding: "28px" }}>
              <div className="section-label">💳 Payment Method</div>

              <div className="payment-options">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m.id}
                    className={`payment-option${payment === m.id ? " selected" : ""}`}
                    onClick={() => setPayment(m.id)}
                  >
                    <span className="payment-emoji">{m.emoji}</span>
                    <div className="payment-option-text">
                      <span className="payment-option-name">{m.name}</span>
                      <span className="payment-option-desc">{m.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ─ Right: Summary ─ */}
          <div style={{ position: "sticky", top: "88px" }}>
            <div className="dark-card">
              <div className="order-summary">
                <div className="order-summary-title">Order Summary</div>

                <div style={{ marginBottom: "20px" }}>
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", fontSize: "14px" }}
                    >
                      <span style={{ color: "#afb1be" }}>
                        {item.emoji} {item.name} × {item.quantity}
                      </span>
                      <span style={{ color: "#fff", fontWeight: "600" }}>
                        ₱{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₱{cartTotal}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping Fee</span>
                  <span>₱{SHIPPING_FEE}</span>
                </div>
                <div className="summary-row">
                  <span>Payment</span>
                  <span style={{ color: "#DC6180" }}>
                    {PAYMENT_METHODS.find((m) => m.id === payment)?.name}
                  </span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>₱{cartTotal + SHIPPING_FEE}</span>
                </div>

                {orderError && (
                  <p style={{ color: "#f87171", fontSize: "13px", textAlign: "center", margin: "0 0 10px", fontWeight: 500 }}>
                    {orderError}
                  </p>
                )}

                <button
                  className="btn-success"
                  style={{ width: "100%", justifyContent: "center", marginTop: "8px", opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
                  onClick={handlePlaceOrder}
                  disabled={loading}
                >
                  {loading ? "⏳ Processing..." : "✅ Place Order"}
                </button>

                <Link
                  to="/cart"
                  className="btn-outline"
                  style={{ display: "flex", justifyContent: "center", marginTop: "12px" }}
                >
                  ← Back to Cart
                </Link>
              </div>
            </div>

            <p style={{ textAlign: "center", color: "#4a4e68", fontSize: "12px", marginTop: "16px" }}>
              🔒 Your payment is 100% secure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
