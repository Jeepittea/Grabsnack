import { useCart } from '../context/CartContext';

function Toast() {
  const { toast } = useCart();

  if (!toast.show) return null;

  return (
    <div
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      <div
        className="toast-wrap"
        style={{
          backgroundColor: '#1a1a1a',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#fff',
          fontSize: '14px',
          fontWeight: 600,
          padding: '12px 20px',
          borderRadius: '999px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#e8434a', flexShrink: 0, display: 'inline-block' }} />
        {toast.message}
      </div>
    </div>
  );
}

export default Toast;
