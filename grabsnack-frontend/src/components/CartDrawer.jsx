import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useGrabSnack } from '../context/GrabSnackContext';

const SHIPPING = 50;
const API_URL  = 'http://localhost:3001';

function CartDrawer() {
  const navigate = useNavigate();
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { user } = useGrabSnack();

  const [placing, setPlacing]   = useState(false);
  const [orderError, setOrderError] = useState('');

  const handlePlaceOrder = async () => {
    setOrderError('');

    if (!cart || cart.length === 0) {
      setOrderError('Add items to your cart first');
      return;
    }

    if (!user?.id) {
      setOrderError('Please log in to place an order');
      return;
    }

    setPlacing(true);
    try {
      const subtotal = cartTotal;
      const total    = subtotal + SHIPPING;

      const { data } = await axios.post(`${API_URL}/api/orders`, {
        userId:   user.id,
        items:    cart.map((i) => ({
          name:     i.name,
          emoji:    i.emoji,
          price:    i.price,
          quantity: i.quantity,
        })),
        subtotal,
        shipping: SHIPPING,
        total,
      });

      clearCart();
      closeCart();
      navigate('/order-confirmation', {
        state: {
          order: {
            id:        `#${data.orderCode}`,
            orderCode: data.orderCode,
            items:     cart,
            subtotal,
            shipping:  SHIPPING,
            total,
          },
        },
      });
    } catch (err) {
      const msg = err?.response?.data?.error || 'Failed to place order. Please try again.';
      setOrderError(msg);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <div
          onClick={closeCart}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 199,
          }}
        />
      )}

      {/* Drawer panel */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100%',
          width: '380px',
          backgroundColor: '#1a1a1a',
          zIndex: 200,
          boxShadow: '-4px 0 20px rgba(0,0,0,0.5)',
          transform: isCartOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🛒 Your Cart
            {cart.length > 0 && (
              <span style={{ backgroundColor: '#e8434a', color: '#fff', fontSize: '12px', fontWeight: 700, padding: '1px 8px', borderRadius: '999px' }}>
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </h2>
          <button
            onClick={closeCart}
            style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: 'none',
              borderRadius: '50%',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {cart.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '60%',
                color: 'rgba(255,255,255,0.4)',
                gap: '12px',
                textAlign: 'center',
                padding: '0 24px',
              }}
            >
              <span style={{ fontSize: '48px' }}>🛒</span>
              <p style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Your cart is empty</p>
              <p style={{ margin: 0, fontSize: '13px' }}>Add some delicious items from our menu!</p>
              <button
                onClick={closeCart}
                style={{
                  marginTop: '8px',
                  backgroundColor: '#e8434a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '10px 24px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="drawer-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 20px',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  {/* Emoji thumbnail */}
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '10px',
                      backgroundColor: '#1e1e2e',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      flexShrink: 0,
                    }}
                  >
                    {item.emoji || '🍔'}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, color: '#fff', fontSize: '13px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.name}
                    </p>
                    <p style={{ margin: '2px 0 0', color: '#e8434a', fontSize: '13px', fontWeight: 700 }}>
                      ₱{item.price}
                    </p>
                  </div>

                  {/* Qty controls */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: '#111',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '999px',
                      padding: '2px 4px',
                    }}
                  >
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      style={{ width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '16px', cursor: 'pointer', borderRadius: '50%' }}
                    >
                      −
                    </button>
                    <span style={{ color: '#fff', fontSize: '13px', fontWeight: 700, minWidth: '18px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={{ width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '16px', cursor: 'pointer', borderRadius: '50%' }}
                    >
                      +
                    </button>
                  </div>

                  {/* Line total + remove */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: 600 }}>
                      ₱{item.price * item.quantity}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', fontSize: '11px', cursor: 'pointer', padding: 0 }}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '16px 20px' }}>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>
                <span>Subtotal</span><span>₱{cartTotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>
                <span>Shipping</span><span>₱{SHIPPING}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 700, color: '#fff', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <span>Total</span>
                <span style={{ color: '#e8434a' }}>₱{cartTotal + SHIPPING}</span>
              </div>
            </div>

            {orderError && (
              <p style={{ color: '#f87171', fontSize: '13px', textAlign: 'center', margin: '0 0 10px', fontWeight: 500 }}>
                {orderError}
              </p>
            )}

            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              style={{
                width: 'calc(100% - 0px)',
                backgroundColor: placing ? '#a33' : '#e8434a',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                padding: '14px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: placing ? 'not-allowed' : 'pointer',
                opacity: placing ? 0.75 : 1,
              }}
            >
              {placing ? 'Placing Order…' : 'Place Order →'}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

export default CartDrawer;
