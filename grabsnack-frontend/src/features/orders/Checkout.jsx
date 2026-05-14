import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from '../../shared/components/Navbar';
import { useCart } from '../../shared/context/CartContext';
import { useGrabSnack } from '../../shared/context/GrabSnackContext';
import api from '../../shared/api/api';
import "../../shared/styles/Style2.css";

const SHIPPING_FEE = 50;

const getExpediteFee = (subtotal) => {
  if (subtotal >= 600) return 80;
  if (subtotal >= 300) return 60;
  return 40;
};

const CashIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="6" width="20" height="13" rx="2" fill="#22c55e" opacity="0.15" stroke="#22c55e" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="3" stroke="#22c55e" strokeWidth="1.5"/>
    <path d="M6 9v6M18 9v6" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const GCashIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect width="28" height="28" rx="6" fill="#007DFF"/>
    <text x="14" y="20" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="Arial">G</text>
  </svg>
);

const CreditCardIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect x="1" y="5" width="26" height="18" rx="3" fill="#1a1f71" stroke="#1a1f71" strokeWidth="1"/>
    <rect x="1" y="10" width="26" height="5" fill="#fff" opacity="0.15"/>
    <text x="4" y="21" fill="#fff" fontSize="6" fontWeight="900" fontFamily="Arial" letterSpacing="0.5">VISA</text>
    <circle cx="21" cy="19" r="4" fill="#EB001B" opacity="0.9"/>
    <circle cx="25" cy="19" r="4" fill="#F79E1B" opacity="0.9"/>
  </svg>
);

const DebitCardIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="5" width="20" height="14" rx="2" stroke="#a78bfa" strokeWidth="1.5" fill="#a78bfa" fillOpacity="0.1"/>
    <path d="M2 9h20" stroke="#a78bfa" strokeWidth="1.5"/>
    <rect x="4" y="13" width="6" height="2" rx="1" fill="#a78bfa"/>
    <rect x="12" y="13" width="3" height="2" rx="1" fill="#a78bfa" opacity="0.5"/>
  </svg>
);

const PAYMENT_METHODS = [
  { id: "cod",    Icon: CashIcon,       name: "Cash on Delivery", desc: "Pay when it arrives" },
  { id: "gcash",  Icon: GCashIcon,      name: "GCash",            desc: "Mobile payment" },
  { id: "credit", Icon: CreditCardIcon, name: "Credit Card",      desc: "Visa / Mastercard" },
  { id: "debit",  Icon: DebitCardIcon,  name: "Debit Card",       desc: "Bank debit card" },
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
  const [payment, setPayment]           = useState("cod");
  const [deliveryType, setDeliveryType] = useState("standard");
  const [scheduledTime, setScheduledTime] = useState("");
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
      const subtotal    = cartTotal;
      const expediteFee = deliveryType === "expedite" ? getExpediteFee(subtotal) : 0;
      const total       = subtotal + SHIPPING_FEE + expediteFee;

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
            deliveryType,
            expediteFee,
            scheduledTime:   deliveryType === "later" ? scheduledTime : null,
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

  const selectedMethod = PAYMENT_METHODS.find((m) => m.id === payment);

  return (
    <div className="page-wrapper">
      <Navbar />

      <div className="page-header">
        <h1 className="page-title">📦 Checkout</h1>
        <p className="page-subtitle">Almost there! Fill in your delivery details</p>
      </div>

      <div className="content-section">
        <div className="checkout-grid">

          {/* Left: Forms */}
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

            {/* Delivery Time */}
            <div className="dark-card" style={{ padding: "28px" }}>
              <div className="section-label">🕐 Delivery Time</div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "4px" }}>

                {/* Standard */}
                <button
                  type="button"
                  onClick={() => setDeliveryType("standard")}
                  style={{
                    padding: "14px 16px",
                    borderRadius: "12px",
                    border: deliveryType === "standard" ? "2px solid #e8434a" : "2px solid #393d52",
                    background: deliveryType === "standard" ? "rgba(232,67,74,0.08)" : "rgba(57,61,82,0.3)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "22px" }}>🛵</span>
                    <div>
                      <div style={{ color: "#fff", fontWeight: "700", fontSize: "14px" }}>Standard Delivery</div>
                      <div style={{ color: "#afb1be", fontSize: "12px" }}>ASAP · Est. 30–45 min</div>
                    </div>
                  </div>
                  <span style={{ color: "#22c55e", fontWeight: "700", fontSize: "13px" }}>FREE</span>
                </button>

                {/* Expedite */}
                <button
                  type="button"
                  onClick={() => setDeliveryType("expedite")}
                  style={{
                    padding: "14px 16px",
                    borderRadius: "12px",
                    border: deliveryType === "expedite" ? "2px solid #f59e0b" : "2px solid #393d52",
                    background: deliveryType === "expedite" ? "rgba(245,158,11,0.08)" : "rgba(57,61,82,0.3)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "22px" }}>🚀</span>
                    <div>
                      <div style={{ color: "#fff", fontWeight: "700", fontSize: "14px" }}>
                        Expedite / Rush
                        <span style={{ marginLeft: "8px", fontSize: "10px", background: "#f59e0b", color: "#000", padding: "2px 7px", borderRadius: "50px", fontWeight: "800" }}>FAST</span>
                      </div>
                      <div style={{ color: "#afb1be", fontSize: "12px" }}>Priority delivery · Est. 15–20 min</div>
                    </div>
                  </div>
                  <span style={{ color: "#f59e0b", fontWeight: "700", fontSize: "13px" }}>+₱{getExpediteFee(cartTotal)}</span>
                </button>

                {/* Schedule Later */}
                <button
                  type="button"
                  onClick={() => setDeliveryType("later")}
                  style={{
                    padding: "14px 16px",
                    borderRadius: "12px",
                    border: deliveryType === "later" ? "2px solid #4da3ff" : "2px solid #393d52",
                    background: deliveryType === "later" ? "rgba(77,163,255,0.08)" : "rgba(57,61,82,0.3)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "22px" }}>📅</span>
                    <div>
                      <div style={{ color: "#fff", fontWeight: "700", fontSize: "14px" }}>Schedule for Later</div>
                      <div style={{ color: "#afb1be", fontSize: "12px" }}>Pick your preferred time</div>
                    </div>
                  </div>
                  <span style={{ color: "#22c55e", fontWeight: "700", fontSize: "13px" }}>FREE</span>
                </button>
              </div>

              {/* Expedite fee breakdown */}
              {deliveryType === "expedite" && (
                <div style={{
                  marginTop: "14px", padding: "12px 16px",
                  background: "rgba(245,158,11,0.07)",
                  border: "1px solid rgba(245,158,11,0.25)",
                  borderRadius: "10px",
                }}>
                  <div style={{ color: "#f59e0b", fontWeight: "700", fontSize: "13px", marginBottom: "6px" }}>🚀 Expedite Fee Breakdown</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#afb1be" }}>
                      <span>Order ₱0 – ₱299</span><span style={{ color: "#f59e0b" }}>+₱40</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#afb1be" }}>
                      <span>Order ₱300 – ₱599</span><span style={{ color: "#f59e0b" }}>+₱60</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#afb1be" }}>
                      <span>Order ₱600+</span><span style={{ color: "#f59e0b" }}>+₱80</span>
                    </div>
                  </div>
                  <div style={{ marginTop: "8px", fontSize: "12px", color: "#afb1be" }}>
                    📍 Higher fees apply for far locations or large orders.
                  </div>
                </div>
              )}

              {/* Schedule time picker */}
              {deliveryType === "later" && (
                <div style={{ marginTop: "14px" }}>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "8px" }}>
                    Select Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledTime}
                    min={new Date(Date.now() + 30 * 60000).toISOString().slice(0, 16)}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    style={{
                      width: "100%", boxSizing: "border-box",
                      padding: "12px 16px",
                      background: "#2a2d3e",
                      border: "1.5px solid #393d52",
                      borderRadius: "10px",
                      color: "#ffffff", fontSize: "14px",
                      outline: "none", colorScheme: "dark",
                    }}
                  />
                  <p style={{ color: "#afb1be", fontSize: "12px", marginTop: "8px" }}>
                    📌 Minimum 30 minutes from now
                  </p>
                </div>
              )}
            </div>

            {/* Payment method */}
            <div className="dark-card" style={{ padding: "28px" }}>
              <div className="section-label">💳 Payment Method</div>

              <div className="payment-options">
                {PAYMENT_METHODS.map(({ id, Icon, name, desc }) => (
                  <button
                    key={id}
                    className={`payment-option${payment === id ? " selected" : ""}`}
                    onClick={() => setPayment(id)}
                  >
                    <span className="payment-emoji" style={{ display: "flex", alignItems: "center" }}>
                      <Icon />
                    </span>
                    <div className="payment-option-text">
                      <span className="payment-option-name">{name}</span>
                      <span className="payment-option-desc">{desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Summary */}
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
                  <span>Delivery</span>
                  <span style={{ color: deliveryType === "expedite" ? "#f59e0b" : deliveryType === "later" ? "#4da3ff" : "#22c55e" }}>
                    {deliveryType === "standard" ? "🛵 Standard" : deliveryType === "expedite" ? "🚀 Expedite" : scheduledTime ? `📅 ${new Date(scheduledTime).toLocaleString("en-PH", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}` : "📅 Scheduled"}
                  </span>
                </div>
                {deliveryType === "expedite" && (
                  <div className="summary-row">
                    <span>Expedite Fee</span>
                    <span style={{ color: "#f59e0b" }}>+₱{getExpediteFee(cartTotal)}</span>
                  </div>
                )}
                <div className="summary-row">
                  <span>Payment</span>
                  <span style={{ color: "#DC6180" }}>
                    {selectedMethod?.name}
                  </span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>₱{cartTotal + SHIPPING_FEE + (deliveryType === "expedite" ? getExpediteFee(cartTotal) : 0)}</span>
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
