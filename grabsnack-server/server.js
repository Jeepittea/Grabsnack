const express = require('express');
const cors    = require('cors');
const mysql   = require('mysql2/promise');

const app  = express();
const PORT = 3001;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// ── DB Pool ───────────────────────────────────────────────────────────────────
const pool = mysql.createPool({
  host:            'localhost',
  user:            'root',
  password:        '',
  database:        'grabsnack_db',
  charset:         'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
});

// ── POST /api/orders ──────────────────────────────────────────────────────────
// Body: { userId, items, subtotal, shipping, total }
app.post('/api/orders', async (req, res) => {
  const { userId, items, subtotal, shipping, total } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  if (!userId) {
    return res.status(400).json({ error: 'User not authenticated' });
  }

  // Generate 6-digit order code
  const orderCode = 'GS-' + Math.floor(100000 + Math.random() * 900000);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [orderResult] = await conn.execute(
      `INSERT INTO orders (user_id, order_code, status, subtotal, shipping, total)
       VALUES (?, ?, 'pending', ?, ?, ?)`,
      [userId, orderCode, subtotal, shipping ?? 50, total]
    );

    const orderId = orderResult.insertId;

    for (const item of items) {
      await conn.execute(
        `INSERT INTO order_items (order_id, item_name, item_emoji, price, quantity)
         VALUES (?, ?, ?, ?, ?)`,
        [orderId, item.name, item.emoji ?? null, item.price, item.quantity]
      );
    }

    await conn.commit();

    return res.json({ success: true, orderId, orderCode });
  } catch (err) {
    await conn.rollback();
    console.error('Order insert error:', err);
    return res.status(500).json({ error: 'Failed to place order' });
  } finally {
    conn.release();
  }
});

// ── GET /api/orders/:userId ───────────────────────────────────────────────────
app.get('/api/orders/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch all orders for this user, newest first
    const [orders] = await pool.execute(
      `SELECT id, order_code, status, subtotal, shipping, total, created_at
       FROM orders
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    if (orders.length === 0) {
      return res.json([]);
    }

    // Fetch all items for those orders in one query
    const orderIds = orders.map((o) => o.id);
    const placeholders = orderIds.map(() => '?').join(',');
    const [items] = await pool.execute(
      `SELECT id, order_id, item_name, item_emoji, price, quantity
       FROM order_items
       WHERE order_id IN (${placeholders})`,
      orderIds
    );

    // Group items by order_id
    const itemsByOrder = {};
    for (const item of items) {
      if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = [];
      itemsByOrder[item.order_id].push({
        id:       item.id,
        name:     item.item_name,
        emoji:    item.item_emoji,
        price:    item.price,
        quantity: item.quantity,
      });
    }

    // Assemble response
    const result = orders.map((o) => ({
      id:         o.id,
      orderCode:  o.order_code,
      status:     o.status,
      subtotal:   o.subtotal,
      shipping:   o.shipping,
      total:      o.total,
      createdAt:  o.created_at,
      items:      itemsByOrder[o.id] || [],
    }));

    return res.json(result);
  } catch (err) {
    console.error('Fetch orders error:', err);
    return res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`GrabSnack API server running on http://localhost:${PORT}`);
});
