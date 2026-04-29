import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGrabSnack } from '../../shared/context/GrabSnackContext';
import "../Style2.css";

const FLOATING_EMOJIS = [
  { emoji: "🍔", style: { top: "8%",  left: "6%",  "--dur": "4.2s", "--delay": "0s" } },
  { emoji: "🍟", style: { top: "15%", right: "8%", "--dur": "5.1s", "--delay": "0.5s" } },
  { emoji: "🌮", style: { top: "60%", left: "4%",  "--dur": "3.8s", "--delay": "1.2s" } },
  { emoji: "🧋", style: { top: "70%", right: "5%", "--dur": "4.6s", "--delay": "0.8s" } },
  { emoji: "🍨", style: { top: "35%", left: "2%",  "--dur": "5.5s", "--delay": "1.8s" } },
  { emoji: "🍗", style: { bottom: "12%", right: "9%", "--dur": "4s",   "--delay": "2.1s" } },
  { emoji: "🌭", style: { bottom: "6%",  left: "10%", "--dur": "6s",   "--delay": "0.3s" } },
  { emoji: "🧅", style: { top: "45%",  right: "3%",  "--dur": "3.5s", "--delay": "1.5s" } },
];

function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const { login } = useGrabSnack();
  const navigate  = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });

      // Backend returns ApiResponse — actual user data is in response.data.data
      const userData = response.data.data;
      login(userData);
      navigate("/dashboard");
    } catch (err) {
      const msg =
        err?.response?.data?.error?.message ||
        "Invalid email or password. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className="auth-wrapper">
      {/* Floating background emojis */}
      {FLOATING_EMOJIS.map(({ emoji, style }, i) => (
        <span key={i} className="floating-emoji" style={style}>
          {emoji}
        </span>
      ))}

      <div className="auth-card">
        {/* Brand */}
        <div className="auth-logo">🍔</div>
        <div className="auth-brand">GrabSnack</div>

        <h1 className="auth-title">Welcome Back, Hungry? 😋</h1>
        <p className="auth-subtitle">Sign in to order your favorites</p>

        {/* Error */}
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Signing in..." : "🔑 Sign In"}
          </button>
        </form>

        <div className="auth-divider">
          <span>or continue with</span>
        </div>

        <button className="btn-google" onClick={handleGoogleLogin}>
          <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
            <path d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.5-.4-3.5z" fill="#FFC107"/>
            <path d="M6.3 14.7l6.6 4.8C14.6 16.1 19 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" fill="#FF3D00"/>
            <path d="M24 44c5.5 0 10.4-2 14.1-5.3l-6.5-5.5C29.5 35 26.9 36 24 36c-5.3 0-9.7-3.3-11.3-8H6.1C9.5 39.6 16.2 44 24 44z" fill="#4CAF50"/>
            <path d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4-4.1 5.3l6.5 5.5C43.5 35.3 44 30 44 24c0-1.2-.1-2.5-.4-3.5z" fill="#1976D2"/>
          </svg>
          Continue with Google
        </button>

        <div className="auth-link">
          New to GrabSnack?{" "}
          <Link to="/register">Create a free account</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
