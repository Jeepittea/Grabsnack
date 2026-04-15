import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useGrabSnack } from "../context/GrabSnackContext";
import "../Style2.css";

function StarRating({ rating }) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <span className="stars">
      {"★".repeat(full)}
      {half ? "½" : ""}
      {"☆".repeat(empty)}
    </span>
  );
}

function Dashboard() {
  const { PRODUCTS, CATEGORIES, addToCart } = useGrabSnack();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery]       = useState("");
  const [addedMap, setAddedMap]             = useState({});

  const filtered = PRODUCTS.filter((p) => {
    const matchCat    = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => setAddedMap((prev) => ({ ...prev, [product.id]: false })), 1500);
  };

  return (
    <div className="page-wrapper">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Hero */}
      <section className="hero">
        <span className="hero-deco left">🍔</span>
        <span className="hero-deco right">🍟</span>
        <span className="hero-deco top">🧋</span>
        <span className="hero-deco bot">🍗</span>

        <div className="hero-content">
          <h1 className="hero-title">Hungry? We Got You. 🍔</h1>
          <p className="hero-subtitle">
            Order from the best snack selection in town. Fast delivery, hot food, happy you.
          </p>
          <button
            className="btn-hero"
            onClick={() => document.getElementById("menu-section").scrollIntoView({ behavior: "smooth" })}
          >
            🛒 Order Now
          </button>
        </div>
      </section>

      {/* Menu */}
      <section className="content-section" id="menu-section">
        <div className="section-header">
          <h2 className="section-title">🍽️ Our Menu</h2>
          <p className="section-subtitle">
            {filtered.length} item{filtered.length !== 1 ? "s" : ""} available
          </p>
        </div>

        {/* Category chips */}
        <div className="categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`chip${activeCategory === cat ? " active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <span className="empty-emoji">🔍</span>
            <h3 className="empty-title">No results found</h3>
            <p className="empty-text">Try searching for something else or browse all categories.</p>
            <button
              className="btn-outline"
              onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}
            >
              Show All
            </button>
          </div>
        ) : (
          <div className="product-grid">
            {filtered.map((product, i) => (
              <div
                key={product.id}
                className="product-card"
                style={{ animationDelay: `${i * 0.07}s` }}
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="product-emoji-wrapper">
                  <span className="product-emoji-inner">{product.emoji}</span>
                </div>

                <div className="product-info">
                  <div className="product-name">{product.name}</div>

                  <div className="product-rating">
                    <StarRating rating={product.rating} />
                    <span className="rating-value">{product.rating}</span>
                  </div>

                  <div className="product-footer">
                    <span className="product-price">₱{product.price}</span>
                    <button
                      className="btn-add-cart"
                      onClick={(e) => handleAddToCart(e, product)}
                      style={{
                        background: addedMap[product.id]
                          ? "linear-gradient(135deg, #10B981, #059669)"
                          : undefined,
                      }}
                    >
                      {addedMap[product.id] ? "✓ Added!" : "+ Add"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer strip */}
      <footer
        style={{
          textAlign: "center",
          padding: "32px",
          color: "#4a4e68",
          fontSize: "13px",
          borderTop: "1px solid #393d52",
          marginTop: "24px",
        }}
      >
        🍔 GrabSnack &nbsp;·&nbsp; Fast food, faster delivery &nbsp;·&nbsp;
        <span style={{ color: "#DC6180" }}>Made with ❤️ in PH</span>
      </footer>
    </div>
  );
}

export default Dashboard;
