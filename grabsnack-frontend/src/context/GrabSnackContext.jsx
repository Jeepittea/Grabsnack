import { createContext, useContext, useState } from 'react';

// ─── Product Catalog ────────────────────────────────────────────────────────
export const PRODUCTS = [
  {
    id: 1,
    emoji: '🍔',
    name: 'Crispy Chicken Burger',
    price: 120,
    rating: 4.8,
    category: 'Burgers',
    description: 'Juicy golden-fried chicken fillet stacked with fresh lettuce, ripe tomato slices, pickles, and our signature smoky mayo. Served in a toasted brioche bun.',
  },
  {
    id: 2,
    emoji: '🍟',
    name: 'Loaded Fries',
    price: 85,
    rating: 4.6,
    category: 'Fries',
    description: 'Golden shoestring fries showered in velvety cheese sauce, crispy bacon bits, and a drizzle of ranch. Perfectly seasoned and dangerously addictive.',
  },
  {
    id: 3,
    emoji: '🌭',
    name: 'Cheese Dog',
    price: 95,
    rating: 4.5,
    category: 'Snacks',
    description: 'Premium all-beef frankfurter grilled to perfection in a pillowy soft bun, loaded with melted cheddar, mustard relish, and caramelized onions.',
  },
  {
    id: 4,
    emoji: '🧋',
    name: 'Iced Milk Tea',
    price: 75,
    rating: 4.7,
    category: 'Drinks',
    description: 'Creamy house-blend milk tea poured over crushed ice with a generous portion of chewy tapioca pearls. Sweet, cold, and absolutely refreshing.',
  },
  {
    id: 5,
    emoji: '🍨',
    name: 'Chocolate Sundae',
    price: 65,
    rating: 4.9,
    category: 'Desserts',
    description: 'Rich velvety chocolate ice cream swirled in a cup and drizzled with hot fudge sauce, topped with whipped cream and a cherry on top.',
  },
  {
    id: 6,
    emoji: '🍗',
    name: 'Spicy Wings',
    price: 110,
    rating: 4.7,
    category: 'Snacks',
    description: 'Tender chicken wings marinated overnight in our fiery 3-chili blend, then fried to a crispy finish. Comes with a cooling blue cheese dip.',
  },
  {
    id: 7,
    emoji: '🌮',
    name: 'Beef Nachos',
    price: 130,
    rating: 4.8,
    category: 'Snacks',
    description: 'Tri-color tortilla chips piled high with seasoned ground beef, pico de gallo, jalapeño slices, sour cream, guacamole, and melted pepper jack cheese.',
  },
  {
    id: 8,
    emoji: '🧅',
    name: 'Onion Rings',
    price: 70,
    rating: 4.4,
    category: 'Fries',
    description: 'Thick-cut sweet onion rings coated in a light, crispy beer batter and fried golden brown. Served with our house sriracha dipping sauce.',
  },
];

export const CATEGORIES = ['All', 'Burgers', 'Fries', 'Drinks', 'Snacks', 'Desserts'];

// ─── Context ─────────────────────────────────────────────────────────────────
const GrabSnackContext = createContext(null);

// ─── Provider ────────────────────────────────────────────────────────────────
export function GrabSnackProvider({ children }) {
  // User state — persisted in localStorage
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('grabsnack_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Cart state — in-memory (resets on refresh, intentional for demo)
  const [cart, setCart] = useState([]);

  // Orders — persisted in localStorage
  const [orders, setOrders] = useState(() => {
    try {
      const stored = localStorage.getItem('grabsnack_orders');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // ── Auth ──────────────────────────────────────────────────────────────────
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('grabsnack_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    localStorage.removeItem('grabsnack_user');
  };

  // ── Cart ──────────────────────────────────────────────────────────────────
  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  // ── Orders ────────────────────────────────────────────────────────────────
  const placeOrder = (orderData) => {
    const newOrder = {
      id: `GS-${Date.now()}`,
      date: new Date().toISOString(),
      items: [...cart],
      subtotal: cartTotal,
      shipping: 50,
      total: cartTotal + 50,
      status: 'Pending',
      ...orderData,
    };
    const updated = [newOrder, ...orders];
    setOrders(updated);
    localStorage.setItem('grabsnack_orders', JSON.stringify(updated));
    clearCart();
    return newOrder;
  };

  // ── Derived values ────────────────────────────────────────────────────────
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <GrabSnackContext.Provider
      value={{
        // State
        user,
        cart,
        orders,
        PRODUCTS,
        CATEGORIES,
        // Auth
        login,
        logout,
        // Cart
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        // Orders
        placeOrder,
        // Derived
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </GrabSnackContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useGrabSnack() {
  const ctx = useContext(GrabSnackContext);
  if (!ctx) throw new Error('useGrabSnack must be used within GrabSnackProvider');
  return ctx;
}
