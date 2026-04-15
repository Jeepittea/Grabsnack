import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useGrabSnack } from '../context/GrabSnackContext';

const S = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backgroundColor: '#0f0f0f',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    alignItems: 'center',
    padding: '0 32px',
    height: '60px',
    gap: '16px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    textDecoration: 'none',
    fontSize: '20px',
    fontWeight: 700,
    color: '#fff',
    flexShrink: 0,
  },
  logoAccent: { color: '#e8434a' },
  right: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  cartBtn: {
    backgroundColor: '#e8434a',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    position: 'relative',
  },
  badge: {
    backgroundColor: '#fff',
    color: '#e8434a',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    fontSize: '11px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#2a2a2a',
    border: '1px solid rgba(255,255,255,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    cursor: 'pointer',
    color: '#fff',
    fontWeight: 700,
    userSelect: 'none',
  },
  avatarWrap: { position: 'relative' },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: 'calc(100% + 8px)',
    width: '200px',
    backgroundColor: '#1a1a1a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '14px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    overflow: 'hidden',
    zIndex: 200,
  },
  dropdownHeader: {
    padding: '12px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
  },
  dropdownName: { color: '#fff', fontSize: '13px', fontWeight: 600, margin: 0 },
  dropdownEmail: { color: 'rgba(255,255,255,0.4)', fontSize: '11px', margin: '2px 0 0' },
  dropdownLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '11px 16px',
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    fontSize: '13px',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    fontFamily: 'inherit',
    transition: 'background 0.15s',
  },
  dropdownDivider: { borderTop: '1px solid rgba(255,255,255,0.07)', margin: 0 },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '11px 16px',
    color: '#f87171',
    fontSize: '13px',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    fontFamily: 'inherit',
  },
};

function Navbar({ onSearch, searchQuery = '' }) {
  const navigate                        = useNavigate();
  const { cartCount, openCart }         = useCart();
  const { user, logout }                = useGrabSnack();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef                     = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const displayName = user?.fullName
    ? user.fullName.split(' ')[0]
    : user?.email?.split('@')[0] || 'You';

  const initials = (user?.fullName || user?.email || 'G')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  return (
    <header style={S.nav}>
      {/* Logo */}
      <Link to="/dashboard" style={S.logo}>
        <span>🍔</span>
        <span>Grab<span style={S.logoAccent}>Snack</span></span>
      </Link>

      {/* Search */}
      <input
        type="text"
        className="nav-search"
        value={searchQuery}
        onChange={(e) => onSearch?.(e.target.value)}
        placeholder="Search food, drinks..."
      />

      {/* Right side */}
      <div style={S.right}>
        {/* Cart */}
        <button style={S.cartBtn} onClick={openCart} aria-label="Open cart">
          🛒 Cart
          {cartCount > 0 && (
            <span style={S.badge}>{cartCount > 99 ? '99+' : cartCount}</span>
          )}
        </button>

        {/* Avatar / dropdown */}
        <div style={S.avatarWrap} ref={dropdownRef}>
          <div
            style={S.avatar}
            onClick={() => setDropdownOpen((v) => !v)}
            title={displayName}
          >
            {initials}
          </div>

          {dropdownOpen && (
            <div style={S.dropdown}>
              <div style={S.dropdownHeader}>
                <p style={S.dropdownName}>{user?.fullName || displayName}</p>
                <p style={S.dropdownEmail}>{user?.email}</p>
              </div>

              <Link
                to="/profile"
                style={S.dropdownLink}
                onClick={() => setDropdownOpen(false)}
              >
                👤 My Profile
              </Link>
              <Link
                to="/orders"
                style={S.dropdownLink}
                onClick={() => setDropdownOpen(false)}
              >
                📋 My Orders
              </Link>

              <div style={S.dropdownDivider} />

              <button style={S.logoutBtn} onClick={handleLogout}>
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
