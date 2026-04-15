import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useGrabSnack } from "../context/GrabSnackContext";
import "../Style2.css";

function StarRating({ rating }) {
  return (
    <span className="stars" style={{ fontSize: "18px", letterSpacing: "2px" }}>
      {"★".repeat(Math.floor(rating))}
      {"☆".repeat(5 - Math.floor(rating))}
    </span>
  );
}

function ProductDetail() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { PRODUCTS, addToCart } = useGrabSnack();

  const product  = PRODUCTS.find((p) => p.id === Number(id));
  const related  = PRODUCTS.filter((p) => p.id !== Number(id) && p.category === product?.category).slice(0, 3);

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded]       = useState(false);
  const [bought, setBought]     = useState(false);

  if (!product) {
    return (
      <div className="page-wrapper">
        <Navbar />
        <div className="empty-state" style={{ marginTop: "80px" }}>
          <span className="empty-emoji">😕</span>
          <h3 className="empty-title">Product Not Found</h3>
          <p className="empty-text">This item doesn&apos;t exist in our menu.</p>
          <button className="btn-primary" style={{ width: "auto", padding: "14px 32px" }} onClick={() => navigate("/dashboard")}>
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate("/cart");
  };

  const relatedAdd = (p) => {
    addToCart(p, 1);
    navigate("/cart");
  };

  return (
    <div className="page-wrapper">
      <Navbar />

      <div className="content-section" style={{ paddingTop: "40px" }}>
        <button className="btn-back" onClick={() => navigate("/dashboard")}>
          ← Back to Menu
        </button>

        {/* Main detail grid */}
        <div className="dark-card" style={{ padding: "48px" }}>
          <div className="product-detail-grid">
            {/* Emoji display */}
            <div className="product-detail-emoji-box">{product.emoji}</div>

            {/* Info */}
            <div style={{ animation: "slideUp 0.6s ease forwards" }}>
              {/* Category badge */}
              <span
                style={{
                  display: "inline-block",
                  background: "rgba(220,97,128,0.1)",
                  border: "1px solid rgba(220,97,128,0.3)",
                  color: "#DC6180",
                  fontSize: "12px",
                  fontWeight: "700",
                  padding: "5px 14px",
                  borderRadius: "50px",
                  marginBottom: "16px",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                }}
              >
                {product.category}
              </span>

              <h1
                style={{
                  fontSize: "34px",
                  fontWeight: "900",
                  color: "#fff",
                  marginBottom: "12px",
                  letterSpacing: "-0.5px",
                  lineHeight: "1.1",
                }}
              >
                {product.name}
              </h1>

              {/* Rating */}
              <div className="product-rating" style={{ marginBottom: "20px" }}>
                <StarRating rating={product.rating} />
                <span className="rating-value" style={{ fontSize: "16px" }}>
                  {product.rating} · Highly rated
                </span>
              </div>

              {/* Price */}
              <div
                style={{
                  fontSize: "40px",
                  fontWeight: "900",
                  color: "#DC6180",
                  marginBottom: "24px",
                  letterSpacing: "-1px",
                }}
              >
                ₱{product.price}
              </div>

              {/* Description */}
              <p
                style={{
                  color: "#afb1be",
                  fontSize: "15px",
                  lineHeight: "1.7",
                  marginBottom: "36px",
                }}
              >
                {product.description}
              </p>

              {/* Quantity selector */}
              <div style={{ marginBottom: "28px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    color: "#afb1be",
                    marginBottom: "12px",
                  }}
                >
                  Quantity
                </label>
                <div className="qty-selector">
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    −
                  </button>
                  <span className="qty-value">{quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total */}
              <div
                style={{
                  background: "rgba(57,61,82,0.3)",
                  border: "1px solid #393d52",
                  borderRadius: "10px",
                  padding: "16px 20px",
                  marginBottom: "28px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ color: "#afb1be", fontSize: "14px" }}>
                  Subtotal ({quantity} {quantity === 1 ? "item" : "items"})
                </span>
                <span style={{ color: "#DC6180", fontSize: "22px", fontWeight: "900" }}>
                  ₱{product.price * quantity}
                </span>
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                <button
                  className="btn-primary"
                  style={{
                    flex: 1,
                    minWidth: "160px",
                    background: added
                      ? "linear-gradient(135deg, #10B981, #059669)"
                      : undefined,
                  }}
                  onClick={handleAddToCart}
                >
                  {added ? "✓ Added to Cart!" : "🛒 Add to Cart"}
                </button>

                <button
                  className="btn-success"
                  style={{ flex: 1, minWidth: "160px", justifyContent: "center" }}
                  onClick={handleBuyNow}
                >
                  ⚡ Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div style={{ marginTop: "48px" }}>
            <div className="section-header">
              <h2 className="section-title">🍽️ You Might Also Like</h2>
            </div>
            <div className="product-grid">
              {related.map((p) => (
                <div
                  key={p.id}
                  className="product-card"
                  onClick={() => navigate(`/product/${p.id}`)}
                >
                  <div className="product-emoji-wrapper">
                    <span className="product-emoji-inner">{p.emoji}</span>
                  </div>
                  <div className="product-info">
                    <div className="product-name">{p.name}</div>
                    <div className="product-rating">
                      <span className="stars">{"★".repeat(Math.floor(p.rating))}</span>
                      <span className="rating-value">{p.rating}</span>
                    </div>
                    <div className="product-footer">
                      <span className="product-price">₱{p.price}</span>
                      <button
                        className="btn-add-cart"
                        onClick={(e) => { e.stopPropagation(); relatedAdd(p); }}
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
