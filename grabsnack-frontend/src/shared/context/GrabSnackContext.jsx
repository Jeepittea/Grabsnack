import { createContext, useContext, useState, useEffect } from 'react';
import api from '../../shared/api/api';

export const CATEGORIES = ['All', 'Burgers', 'Fries', 'Drinks', 'Snacks', 'Desserts'];

const GrabSnackContext = createContext(null);

export function GrabSnackProvider({ children }) {
  // ── User (persisted) ────────────────────────────────────────────────────────
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('grabsnack_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // ── Products (fetched from backend) ─────────────────────────────────────────
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    api.get('/api/products?limit=100')
      .then(({ data }) => setProducts(data.data?.products ?? []))
      .catch(() => setProducts([]))
      .finally(() => setProductsLoading(false));
  }, []);

  // ── Auth ────────────────────────────────────────────────────────────────────
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('grabsnack_user', JSON.stringify(userData));
  };

  const logout = () => {
    // Call backend logout (fire-and-forget)
    api.post('/api/auth/logout').catch(() => {});
    setUser(null);
    localStorage.removeItem('grabsnack_user');
  };

  return (
    <GrabSnackContext.Provider
      value={{
        user,
        products,
        productsLoading,
        CATEGORIES,
        login,
        logout,
      }}
    >
      {children}
    </GrabSnackContext.Provider>
  );
}

export function useGrabSnack() {
  const ctx = useContext(GrabSnackContext);
  if (!ctx) throw new Error('useGrabSnack must be used within GrabSnackProvider');
  return ctx;
}
