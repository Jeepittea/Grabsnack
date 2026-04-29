import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useGrabSnack } from '../context/GrabSnackContext';
import api from '../api/api';

const STATUS_STYLE = {
  delivered:  { bg: 'rgba(34,197,94,0.15)',  color: '#4ade80', dot: '#4ade80',  label: 'Delivered' },
  processing: { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa', dot: '#60a5fa', label: 'Processing' },
  pending:    { bg: 'rgba(234,179,8,0.15)',  color: '#facc15', dot: '#facc15', label: 'Pending' },
};

function OrderHistory() {
  const { user } = useGrabSnack();
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    api.get('/api/orders')
      .then(({ data }) => setOrders(data.data ?? []))
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false));
  }, [user]);

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-PH', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0f0f' }}>
      <Navbar />

      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 24px 64px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>My Orders</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', margin: 0 }}>
              {loading ? 'Loading…' : orders.length === 0 ? 'No orders yet' : `${orders.length} order${orders.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        {error && (
          <p style={{ color: '#f87171', textAlign: 'center', marginBottom: '24px' }}>{error}</p>
        )}

        {!loading && !error && orders.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>📋</div>
            <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '20px', margin: '0 0 8px' }}>No orders yet</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '28px' }}>
              Once you place an order, it will appear here.
            </p>
            <Link
              to="/dashboard"
              style={{ backgroundColor: '#e8434a', color: '#fff', textDecoration: 'none', borderRadius: '12px', padding: '12px 32px', fontSize: '15px', fontWeight: 600 }}
            >
              Browse Menu
            </Link>
          </div>
        )}

        <div>
          {orders.map((order, i) => {
            const st    = STATUS_STYLE[order.status] || STATUS_STYLE.pending;
            const items = order.items || [];

            return (
              <div key={order.id || i} className="order-card">
                {/* Order header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ color: '#fff', fontWeight: 800, fontFamily: 'monospace', fontSize: '14px', letterSpacing: '1px' }}>
                        #{order.orderCode}
                      </span>
                      <span
                        style={{
                          backgroundColor: st.bg,
                          color: st.color,
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 10px',
                          borderRadius: '999px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: st.dot, display: 'inline-block' }} />
                        {st.label}
                      </span>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', margin: '4px 0 0' }}>
                      {order.createdAt ? formatDate(order.createdAt) : 'Unknown date'}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: '#e8434a', fontWeight: 800, fontSize: '18px', margin: 0 }}>₱{order.total ?? 0}</p>
                  </div>
                </div>

                {/* Items — backend uses itemName / itemEmoji */}
                {items.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                    {items.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.07)',
                          borderRadius: '8px',
                          padding: '6px 10px',
                        }}
                      >
                        <span style={{ fontSize: '18px' }}>{item.itemEmoji || '🍔'}</span>
                        <div>
                          <p style={{ color: '#fff', fontSize: '12px', fontWeight: 600, margin: 0 }}>{item.itemName}</p>
                          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', margin: 0 }}>× {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Totals row */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px', marginTop: '4px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
                  <span>Subtotal ₱{order.subtotal} + Shipping ₱{order.shipping ?? 50}</span>
                  <span>Est. 25–40 min</span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default OrderHistory;
