import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useGrabSnack } from "./context/GrabSnackContext";

// Auth pages (keep existing design)
import Login             from "./pages/Login";
import Register          from "./pages/Register";
import OAuthSuccess      from "./pages/OAuthSuccess";

// Main pages (new Tailwind design)
import Home              from "./pages/Home";
import ProductDetail     from "./pages/ProductDetail";
import Cart              from "./pages/Cart";
import Checkout          from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderHistory      from "./pages/OrderHistory";
import Profile           from "./pages/Profile";
import GroupOrder        from "./pages/GroupOrder";

// Global UI
import CartDrawer from "./components/CartDrawer";
import Toast      from "./components/Toast";

// ── Route guards ──────────────────────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const { user } = useGrabSnack();
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user } = useGrabSnack();
  return user ? <Navigate to="/dashboard" replace /> : children;
}

// ── App ───────────────────────────────────────────────────────────────────────
function App() {
  return (
    <Router>
      {/* Global overlays — rendered outside the route tree so they persist across navigation */}
      <CartDrawer />
      <Toast />

      <Routes>
        {/* Redirects */}
        <Route path="/"    element={<Navigate to="/login" replace />} />

        {/* Public — redirect to /dashboard if logged in */}
        <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* OAuth callback — no guard needed */}
        <Route path="/oauth-success" element={<OAuthSuccess />} />

        {/* Protected */}
        <Route path="/dashboard"          element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/product/:id"        element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
        <Route path="/cart"               element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/checkout"           element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/order-confirmation" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
        <Route path="/orders"             element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
        <Route path="/profile"            element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/group-order"        element={<ProtectedRoute><GroupOrder /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
