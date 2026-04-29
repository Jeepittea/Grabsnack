import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../shared/components/Navbar';
import { useGrabSnack } from '../../shared/context/GrabSnackContext';
import { useCart } from '../../shared/context/CartContext';
import { MENU_ITEMS } from '../../shared/data/menuItems';

const LS_KEY = 'grabsnack_group_sessions';
function loadSessions() { try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch { return {}; } }
function saveSessions(s) { localStorage.setItem(LS_KEY, JSON.stringify(s)); }
function makeCode() { return Math.random().toString(36).substring(2, 8).toUpperCase(); }

function ItemPicker({ onSelect }) {
  const [search, setSearch] = useState('');
  const items = MENU_ITEMS.filter((i) => i.name.toLowerCase().includes(search.toLowerCase())).slice(0, 12);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <input
        type="text"
        placeholder="Search item..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '13px', outline: 'none', fontFamily: 'inherit' }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '8px 10px', cursor: 'pointer', textAlign: 'left' }}
          >
            <span style={{ fontSize: '18px' }}>{item.emoji}</span>
            <div>
              <p style={{ color: '#fff', fontSize: '11px', fontWeight: 600, margin: 0 }}>{item.name}</p>
              <p style={{ color: '#e8434a', fontSize: '11px', fontWeight: 700, margin: 0 }}>₱{item.price}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

const card = { backgroundColor: '#1e1e2e', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', padding: '20px', marginBottom: '16px' };
const btn  = { backgroundColor: '#e8434a', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 24px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', width: '100%' };

function GroupOrder() {
  const navigate = useNavigate();
  const { user } = useGrabSnack();
  const { addToCart, openCart } = useCart();

  const [view, setView]               = useState('landing');
  const [sessions, setSessions]       = useState(loadSessions);
  const [currentCode, setCurrentCode] = useState(null);
  const [name, setName]               = useState(user?.fullName?.split(' ')[0] || '');
  const [joinCode, setJoinCode]       = useState('');
  const [joinName, setJoinName]       = useState('');
  const [joinError, setJoinError]     = useState('');
  const [showPicker, setShowPicker]   = useState(null);

  const session = currentCode ? sessions[currentCode] : null;

  useEffect(() => { saveSessions(sessions); }, [sessions]);

  const handleCreate = () => {
    if (!name.trim()) return;
    const code = makeCode();
    setSessions((prev) => ({ ...prev, [code]: { code, hostName: name.trim(), createdAt: new Date().toISOString(), participants: [{ name: name.trim(), items: [] }] } }));
    setCurrentCode(code);
    setView('session');
  };

  const handleJoin = () => {
    const code = joinCode.trim().toUpperCase();
    if (!sessions[code]) { setJoinError('Session not found.'); return; }
    if (!joinName.trim()) { setJoinError('Please enter your name.'); return; }
    setJoinError('');
    setSessions((prev) => {
      const sess = { ...prev[code] };
      if (!sess.participants.some((p) => p.name === joinName.trim())) {
        sess.participants = [...sess.participants, { name: joinName.trim(), items: [] }];
      }
      return { ...prev, [code]: sess };
    });
    setCurrentCode(code);
    setName(joinName.trim());
    setView('session');
  };

  const handleAddItem = (pName, item) => {
    setSessions((prev) => {
      const sess = { ...prev[currentCode] };
      sess.participants = sess.participants.map((p) => {
        if (p.name !== pName) return p;
        const exists = p.items.find((i) => i.id === item.id);
        return { ...p, items: exists ? p.items.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i) : [...p.items, { ...item, qty: 1 }] };
      });
      return { ...prev, [currentCode]: sess };
    });
    setShowPicker(null);
  };

  const handleRemoveItem = (pName, itemId) => {
    setSessions((prev) => {
      const sess = { ...prev[currentCode] };
      sess.participants = sess.participants.map((p) => p.name !== pName ? p : { ...p, items: p.items.filter((i) => i.id !== itemId) });
      return { ...prev, [currentCode]: sess };
    });
  };

  const handlePlaceGroupOrder = () => {
    if (!session) return;
    session.participants.forEach((p) => p.items.forEach((item) => { for (let i = 0; i < item.qty; i++) addToCart(item); }));
    openCart();
    navigate('/checkout');
  };

  const groupTotal = session?.participants?.reduce((s, p) => s + p.items.reduce((a, i) => a + i.price * i.qty, 0), 0) || 0;
  const allItemCount = session?.participants?.reduce((s, p) => s + p.items.reduce((a, i) => a + i.qty, 0), 0) || 0;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0f0f' }}>
      <Navbar />
      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 24px 64px' }}>

        {view === 'landing' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '56px', marginBottom: '12px' }}>👥</div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', margin: '0 0 12px' }}>Group Order</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', maxWidth: '400px', margin: '0 auto 32px', lineHeight: 1.6 }}>
              Order together with friends. Everyone picks their items, the host places one order.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[{ icon: '🎯', title: 'Create a Session', desc: 'Start a group order and share the code.', action: () => setView('create') },
                { icon: '🔑', title: 'Join a Session',   desc: 'Have a code? Join your group order.',    action: () => setView('join') }]
                .map(({ icon, title, desc, action }) => (
                  <button key={title} onClick={action} style={{ ...card, textAlign: 'left', cursor: 'pointer', display: 'block', background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '28px', marginBottom: '8px' }}>{icon}</div>
                    <h3 style={{ color: '#fff', fontWeight: 800, fontSize: '16px', margin: '0 0 6px' }}>{title}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: '0 0 12px', lineHeight: 1.5 }}>{desc}</p>
                    <span style={{ color: '#e8434a', fontSize: '13px', fontWeight: 600 }}>Get started →</span>
                  </button>
                ))}
            </div>
          </div>
        )}

        {view === 'create' && (
          <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <button onClick={() => setView('landing')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '13px', cursor: 'pointer', marginBottom: '20px', padding: 0 }}>← Back</button>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '20px' }}>Create Group Order</h2>
            <div style={card}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Your Name</label>
              <input
                type="text"
                placeholder="e.g. Juan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                style={{ width: '100%', backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: '16px' }}
              />
              <button onClick={handleCreate} disabled={!name.trim()} style={{ ...btn, opacity: name.trim() ? 1 : 0.4 }}>Create Session</button>
            </div>
          </div>
        )}

        {view === 'join' && (
          <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <button onClick={() => setView('landing')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '13px', cursor: 'pointer', marginBottom: '20px', padding: 0 }}>← Back</button>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '20px' }}>Join Group Order</h2>
            <div style={card}>
              {['Session Code', 'Your Name'].map((label, idx) => (
                <div key={label} style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{label}</label>
                  <input
                    type="text"
                    placeholder={idx === 0 ? 'ABC123' : 'e.g. Maria'}
                    maxLength={idx === 0 ? 6 : undefined}
                    value={idx === 0 ? joinCode : joinName}
                    onChange={(e) => { if (idx === 0) { setJoinCode(e.target.value.toUpperCase()); setJoinError(''); } else { setJoinName(e.target.value); setJoinError(''); } }}
                    onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                    style={{ width: '100%', backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: idx === 0 ? '18px' : '14px', fontWeight: idx === 0 ? 800 : 400, letterSpacing: idx === 0 ? '0.2em' : 'normal', textAlign: idx === 0 ? 'center' : 'left', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
              {joinError && <p style={{ color: '#f87171', fontSize: '13px', marginBottom: '12px' }}>{joinError}</p>}
              <button onClick={handleJoin} disabled={joinCode.length < 6 || !joinName.trim()} style={{ ...btn, opacity: joinCode.length >= 6 && joinName.trim() ? 1 : 0.4 }}>Join Session</button>
            </div>
          </div>
        )}

        {view === 'session' && session && (
          <div>
            {/* Session header */}
            <div style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 6px' }}>Session Code</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#fff', fontWeight: 800, fontSize: '24px', fontFamily: 'monospace', letterSpacing: '0.2em' }}>{session.code}</span>
                  <button onClick={() => navigator.clipboard.writeText(session.code)} style={{ backgroundColor: 'transparent', border: '1px solid rgba(232,67,74,0.4)', color: '#e8434a', borderRadius: '999px', padding: '4px 12px', fontSize: '11px', cursor: 'pointer' }}>Copy</button>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', margin: '4px 0 0' }}>Share with your group</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', margin: '0 0 2px' }}>Host</p>
                <p style={{ color: '#fff', fontWeight: 600, margin: 0 }}>{session.hostName}</p>
              </div>
            </div>

            <h3 style={{ color: '#fff', fontWeight: 800, fontSize: '18px', marginBottom: '16px' }}>Participants ({session.participants.length})</h3>

            {session.participants.map((p) => {
              const pTotal = p.items.reduce((s, i) => s + i.price * i.qty, 0);
              const isMe   = p.name === name;
              return (
                <div key={p.name} style={card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#e8434a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '13px', fontWeight: 700 }}>{p.name[0].toUpperCase()}</div>
                      <span style={{ color: '#fff', fontWeight: 700, fontSize: '14px' }}>
                        {p.name}
                        {isMe && <span style={{ color: '#e8434a', fontSize: '11px', marginLeft: '6px' }}>(you)</span>}
                        {p.name === session.hostName && <span style={{ color: '#facc15', fontSize: '11px', marginLeft: '6px' }}>👑 Host</span>}
                      </span>
                    </div>
                    {p.items.length > 0 && <span style={{ color: '#e8434a', fontWeight: 800 }}>₱{pTotal}</span>}
                  </div>

                  {p.items.length === 0
                    ? <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', textAlign: 'center', padding: '8px 0' }}>No items added yet</p>
                    : <ul style={{ margin: '0 0 10px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {p.items.map((item) => (
                          <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                            <span style={{ color: 'rgba(255,255,255,0.7)' }}>{item.emoji} {item.name} × {item.qty}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <span style={{ color: 'rgba(255,255,255,0.5)' }}>₱{item.price * item.qty}</span>
                              {isMe && <button onClick={() => handleRemoveItem(p.name, item.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', fontSize: '12px' }}>✕</button>}
                            </div>
                          </li>
                        ))}
                      </ul>
                  }

                  {isMe && (showPicker === p.name
                    ? <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px' }}>
                        <ItemPicker onSelect={(item) => handleAddItem(p.name, item)} />
                        <button onClick={() => setShowPicker(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '12px', cursor: 'pointer', marginTop: '10px' }}>Done</button>
                      </div>
                    : <button onClick={() => setShowPicker(p.name)} style={{ background: 'none', border: 'none', color: '#e8434a', fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: '4px 0' }}>+ Add Item</button>
                  )}
                </div>
              );
            })}

            {allItemCount > 0 && (
              <div style={card}>
                <h4 style={{ color: '#fff', fontWeight: 800, marginBottom: '14px' }}>Combined Order Summary</h4>
                {session.participants.flatMap((p) => p.items.map((item) => (
                  <div key={`${p.name}-${item.id}`} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
                    <span>{p.name}: {item.emoji} {item.name} × {item.qty}</span>
                    <span>₱{item.price * item.qty}</span>
                  </div>
                )))}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px', marginTop: '4px', display: 'flex', justifyContent: 'space-between', color: '#fff', fontWeight: 800 }}>
                  <span>Group Total</span>
                  <span style={{ color: '#e8434a' }}>₱{groupTotal}</span>
                </div>
                {name === session.hostName
                  ? <button onClick={handlePlaceGroupOrder} style={{ ...btn, marginTop: '16px' }}>🚀 Place Group Order (Host)</button>
                  : <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textAlign: 'center', marginTop: '14px' }}>Waiting for {session.hostName} (host) to place the order...</p>
                }
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default GroupOrder;
