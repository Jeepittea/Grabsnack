import { useState, useRef } from 'react';
import Navbar from '../../shared/components/Navbar';
import { useCart } from '../../shared/context/CartContext';
import { useGrabSnack } from '../../shared/context/GrabSnackContext';

// ─── Star Rating ─────────────────────────────────────────────────────────────
function Stars({ rating }) {
  const full  = Math.floor(rating);
  const empty = 5 - full;
  return (
    <span style={{ color: '#f59e0b', fontSize: '13px' }}>
      {'★'.repeat(full)}{'☆'.repeat(empty)}
    </span>
  );
}

// ─── Menu Card ───────────────────────────────────────────────────────────────
function MenuCard({ item }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className="menu-card">
      {/* Emoji area */}
      <div
        style={{
          height: '160px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '72px',
          backgroundColor: '#1e1e2e',
        }}
      >
        {item.emoji}
      </div>

      {/* Info area */}
      <div style={{ padding: '16px' }}>
        <p style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: 600, color: '#fff' }}>
          {item.name}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0' }}>
          <Stars rating={item.rating} />
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginLeft: '4px' }}>
            {item.rating}
          </span>
        </div>

        {/* Bottom row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#e8434a' }}>
            ₱{item.price}
          </span>
          <button
            onClick={handleAdd}
            style={{
              backgroundColor: added ? '#22c55e' : '#e8434a',
              color: '#fff',
              border: 'none',
              borderRadius: '999px',
              padding: '6px 16px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
          >
            {added ? '✓ Added' : '+ Add'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Floating emoji positions ─────────────────────────────────────────────────
const FLOATERS = [
  { e: '🍔', style: { top: '15%',  left: '6%',   fontSize: '60px', animationDuration: '4s',   animationDelay: '0s'   } },
  { e: '🥤', style: { top: '20%',  right: '8%',  fontSize: '48px', animationDuration: '5.5s', animationDelay: '0.5s' } },
  { e: '🍗', style: { bottom: '22%', left: '12%', fontSize: '50px', animationDuration: '6s',   animationDelay: '1s'   } },
  { e: '🍟', style: { top: '10%',  right: '22%', fontSize: '40px', animationDuration: '3.5s', animationDelay: '0.3s' } },
  { e: '🧁', style: { bottom: '18%', right: '10%', fontSize: '52px', animationDuration: '5s',  animationDelay: '1.5s' } },
];

// ─── Home page ────────────────────────────────────────────────────────────────
function Home() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery]       = useState('');
  const menuRef                             = useRef(null);
  const { products, productsLoading, CATEGORIES } = useGrabSnack();

  const filtered = products.filter((item) => {
    const matchCat    = activeCategory === 'All' || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const scrollToMenu = () =>
    menuRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0f0f' }}>
      <Navbar searchQuery={searchQuery} onSearch={setSearchQuery} />

      {/* ─ HERO ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          background: 'linear-gradient(135deg, #c0507a 0%, #8b3a6b 100%)',
          minHeight: '280px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          textAlign: 'center',
          padding: '40px 20px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Floating emojis */}
        {FLOATERS.map(({ e, style }, i) => (
          <span
            key={i}
            aria-hidden
            style={{
              position: 'absolute',
              opacity: 0.2,
              animation: `float ${style.animationDuration} ease-in-out infinite`,
              animationDelay: style.animationDelay,
              fontSize: style.fontSize,
              top: style.top,
              bottom: style.bottom,
              left: style.left,
              right: style.right,
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            {e}
          </span>
        ))}

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 12px' }}>
            Fast · Fresh · Delivered
          </p>
          <h1 style={{ fontSize: '42px', fontWeight: 800, color: '#fff', margin: '0 0 8px', lineHeight: 1.1 }}>
            Hungry? We Got You.
          </h1>
          <div style={{ fontSize: '40px', margin: '0 0 12px' }}>🍔</div>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.85)', margin: '8px 0 24px', maxWidth: '480px' }}>
            Order from the best snacks and meals in town. Hot food, fast delivery, every time.
          </p>
          <button
            onClick={scrollToMenu}
            style={{
              backgroundColor: '#fff',
              color: '#e8434a',
              border: 'none',
              borderRadius: '999px',
              padding: '12px 28px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            🛒 Order Now
          </button>
        </div>
      </section>

      {/* ─ MENU SECTION ───────────────────────────────────────────────────── */}
      <main
        ref={menuRef}
        style={{ backgroundColor: '#0f0f0f', padding: '40px 32px' }}
      >
        {/* Heading */}
        <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 4px', color: '#fff' }}>
          📌 Our Menu
        </h2>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', margin: '0 0 20px' }}>
          {filtered.length} item{filtered.length !== 1 ? 's' : ''} available
        </p>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={
                activeCategory === cat
                  ? { backgroundColor: '#e8434a', color: '#fff', border: 'none', borderRadius: '999px', padding: '8px 18px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }
                  : { backgroundColor: 'transparent', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '999px', padding: '8px 18px', fontSize: '13px', cursor: 'pointer' }
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {productsLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 20px', color: 'rgba(255,255,255,0.4)', fontSize: '16px' }}>
            Loading menu...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', textAlign: 'center', gap: '12px' }}>
            <span style={{ fontSize: '48px' }}>🔍</span>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: '18px', margin: 0 }}>No results for "{searchQuery}"</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', margin: 0 }}>Try a different keyword or category</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
              style={{ marginTop: '8px', backgroundColor: 'transparent', color: '#e8434a', border: '1px solid #e8434a', borderRadius: '999px', padding: '9px 22px', fontSize: '13px', cursor: 'pointer' }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="menu-grid">
            {filtered.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        )}

      </main>

      {/* ─ FOOTER ─────────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', padding: '28px', color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>
        🍔 GrabSnack &nbsp;·&nbsp; Made with ❤️ in the Philippines
      </footer>
    </div>
  );
}

export default Home;
