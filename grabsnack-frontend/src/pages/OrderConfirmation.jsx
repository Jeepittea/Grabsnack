import { useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const SHIPPING = 50;

function OrderConfirmation() {
  const navigate  = useNavigate();
  const { state } = useLocation();
  const order     = state?.order;
  const savedRef  = useRef(false);

  // No longer saving to localStorage — orders are persisted in MySQL via the API
  useEffect(() => {
    savedRef.current = true;
  }, []);

  useEffect(() => {
    if (!order) {
      const t = setTimeout(() => navigate('/dashboard'), 3000);
      return () => clearTimeout(t);
    }
  }, [order, navigate]);

  if (!order) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', color: 'rgba(255,255,255,0.5)' }}>
        <span style={{ fontSize: '40px' }}>🔍</span>
        <p>Order not found — redirecting…</p>
      </div>
    );
  }

  const displayCode = order.orderCode
    ? `#${order.orderCode}`
    : order.id || `#GS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const etaMin = new Date(Date.now() + 25 * 60 * 1000).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' });
  const etaMax = new Date(Date.now() + 40 * 60 * 1000).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0f0f' }}>
      <Navbar />

      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '40px 20px 64px' }}>
        <div style={{ backgroundColor: '#1e1e2e', borderRadius: '20px', padding: '40px 32px', textAlign: 'center' }}>

          {/* Success circle */}
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(34,197,94,0.15)', border: '2px solid rgba(34,197,94,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '36px' }}>
            ✓
          </div>

          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', margin: '0 0 8px' }}>Order Placed! 🎉</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', margin: '0 0 24px', lineHeight: 1.6 }}>
            Your food is being prepared with love. Sit tight!
          </p>

          {/* Order ID */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: '999px', marginBottom: '24px' }}>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Order</span>
            <span style={{ color: '#fff', fontWeight: 800, fontFamily: 'monospace', fontSize: '13px', letterSpacing: '1px' }}>{displayCode}</span>
          </div>

          {/* ETA */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', backgroundColor: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px' }}>
            <span style={{ fontSize: '24px' }}>🕐</span>
            <div style={{ textAlign: 'left' }}>
              <p style={{ color: '#facc15', fontWeight: 700, fontSize: '13px', margin: '0 0 2px' }}>Estimated Delivery</p>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', margin: 0 }}>{etaMin} – {etaMax} (25–40 min)</p>
            </div>
          </div>

          {/* Items */}
          <div style={{ backgroundColor: '#111', borderRadius: '14px', padding: '20px', marginBottom: '24px', textAlign: 'left' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 16px' }}>
              Your Order
            </p>

            {(order.items || []).map((item) => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#1e1e2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                  {item.emoji || '🍔'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: '#fff', fontSize: '13px', fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', margin: '2px 0 0' }}>× {item.quantity}</p>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: 600, flexShrink: 0 }}>
                  ₱{item.price * item.quantity}
                </span>
              </div>
            ))}

            {/* Totals */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px', marginTop: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>
                <span>Subtotal</span><span>₱{order.subtotal ?? (order.total - SHIPPING)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>
                <span>Shipping</span><span>₱{SHIPPING}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 800, color: '#fff' }}>
                <span>Total Paid</span>
                <span style={{ color: '#e8434a' }}>₱{order.total}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '6px' }}>
                <span>Estimated delivery</span><span>25–40 minutes</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/orders"
              style={{ backgroundColor: '#e8434a', color: '#fff', textDecoration: 'none', borderRadius: '12px', padding: '12px 28px', fontSize: '14px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              📋 Track Order
            </Link>
            <Link
              to="/dashboard"
              style={{ backgroundColor: 'transparent', color: '#e8434a', border: '1px solid #e8434a', textDecoration: 'none', borderRadius: '12px', padding: '12px 28px', fontSize: '14px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              🏠 Back to Menu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
