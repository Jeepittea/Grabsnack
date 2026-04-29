import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  // ── Cart items ──────────────────────────────────────────────────────────────
  const [cart, setCart] = useState([]);

  // ── Drawer open/close ───────────────────────────────────────────────────────
  const [isCartOpen, setIsCartOpen] = useState(false);
  const openCart  = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // ── Toast ───────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState({ show: false, message: '' });

  const showToast = useCallback((message) => {
    setToast({ show: true, message });
    const t = setTimeout(() => setToast({ show: false, message: '' }), 2500);
    return () => clearTimeout(t);
  }, []);

  // ── Cart mutations ──────────────────────────────────────────────────────────
  const addToCart = useCallback((item) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    showToast(`${item.emoji || '🍔'} ${item.name} added to cart!`);
  }, [showToast]);

  const removeFromCart = useCallback((id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id, qty) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i))
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => setCart([]), []);

  // ── Derived ─────────────────────────────────────────────────────────────────
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      isCartOpen, openCart, closeCart,
      toast, showToast,
      addToCart, removeFromCart, updateQuantity, clearCart,
      cartCount, cartTotal,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
