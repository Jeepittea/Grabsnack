import { useNavigate, Link } from "react-router-dom";
import Navbar from '../../shared/components/Navbar';
import { useCart } from '../../shared/context/CartContext';
import "../Style2.css";

const SHIPPING_FEE = 50;

function Cart() {
  const navigate = useNavigate();
  const { cart, cartTotal, updateQuantity, removeFromCart } = useCart();

  return (
    <div className="page-wrapper">
      <Navbar />

      <div className="page-header">
        <h1 className="page-title">🛒 Your Cart</h1>
        <p className="page-subtitle">
          {cart.length === 0
            ? "Your cart is empty"
            : `${cart.reduce((s, i) => s + i.quantity, 0)} item${cart.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""} in your order`}
        </p>
      </div>

      <div className="content-section">
        {cart.length === 0 ? (
          /* ─ Empty State ─ */
          <div className="empty-state">
            <span className="empty-emoji">🛒</span>
            <h3 className="empty-title">Nothing in here yet!</h3>
            <p className="empty-text">
              Looks like you haven&apos;t added anything to your cart. Browse our delicious menu and start ordering!
            </p>
            <Link to="/dashboard" className="btn-primary" style={{ display: "inline-block", width: "auto", padding: "14px 40px" }}>
              🍔 Browse Menu
            </Link>
          </div>
        ) : (
          /* ─ Cart Layout ─ */
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "28px", alignItems: "start" }}>

            {/* Cart items card */}
            <div className="dark-card" style={{ overflow: "hidden" }}>
              <div style={{ padding: "24px 24px 0", borderBottom: "1px solid #393d52", paddingBottom: "16px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#fff" }}>Order Items</h2>
              </div>

              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  {/* Emoji */}
                  <span className="cart-emoji">{item.emoji}</span>

                  {/* Info */}
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-unit-price">₱{item.price} each</div>
                  </div>

                  {/* Qty controls */}
                  <div className="qty-controls">
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      title="Decrease"
                    >
                      −
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      title="Increase"
                    >
                      +
                    </button>
                  </div>

                  {/* Line total */}
                  <span className="cart-item-price">₱{item.price * item.quantity}</span>

                  {/* Remove */}
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                    title="Remove item"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Order summary sticky */}
            <div style={{ position: "sticky", top: "88px" }}>
              <div className="dark-card">
                <div className="order-summary">
                  <div className="order-summary-title">Order Summary</div>

                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>₱{cartTotal}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping Fee</span>
                    <span>₱{SHIPPING_FEE}</span>
                  </div>
                  <div className="summary-row">
                    <span>Estimated Tax</span>
                    <span style={{ color: "#10B981" }}>FREE</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>₱{cartTotal + SHIPPING_FEE}</span>
                  </div>

                  <button
                    className="btn-primary"
                    style={{ marginTop: "8px" }}
                    onClick={() => navigate("/checkout")}
                  >
                    🚀 Proceed to Checkout
                  </button>

                  <Link
                    to="/dashboard"
                    className="btn-outline"
                    style={{ display: "flex", justifyContent: "center", marginTop: "12px" }}
                  >
                    ← Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Trust badges */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "center",
                  marginTop: "20px",
                  flexWrap: "wrap",
                }}
              >
                {["🔒 Secure Checkout", "⚡ Fast Delivery", "✅ Freshly Made"].map((badge) => (
                  <span
                    key={badge}
                    style={{
                      fontSize: "12px",
                      color: "#4a4e68",
                      background: "rgba(57,61,82,0.3)",
                      padding: "6px 12px",
                      borderRadius: "50px",
                      border: "1px solid #393d52",
                    }}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
