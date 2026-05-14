import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../shared/styles/Style2.css";

const FLOATING_EMOJIS = [
  { emoji: "🌮", style: { top: "7%",   left: "5%",   "--dur": "4.5s", "--delay": "0s"   } },
  { emoji: "🍗", style: { top: "18%",  right: "7%",  "--dur": "5.2s", "--delay": "0.6s" } },
  { emoji: "🍔", style: { top: "55%",  left: "3%",   "--dur": "3.9s", "--delay": "1.3s" } },
  { emoji: "🍟", style: { top: "65%",  right: "6%",  "--dur": "4.7s", "--delay": "0.9s" } },
  { emoji: "🧋", style: { top: "30%",  left: "2%",   "--dur": "5.6s", "--delay": "2s"   } },
  { emoji: "🍨", style: { bottom: "10%", right: "8%", "--dur": "4.1s", "--delay": "2.2s" } },
  { emoji: "🌭", style: { bottom: "5%", left: "9%",  "--dur": "6.1s", "--delay": "0.4s" } },
  { emoji: "🧅", style: { top: "42%",  right: "2%",  "--dur": "3.6s", "--delay": "1.6s" } },
];

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  const navigate = useNavigate();

  const getStrength = (pw) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8)          score++;
    if (/[A-Z]/.test(pw))        score++;
    if (/[0-9]/.test(pw))        score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };
  const strength = getStrength(password);
  const strengthColors = ["", "#EF4444", "#F59E0B", "#4da3ff", "#10B981"];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong 💪"];

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      await axios.post("http://localhost:8080/api/auth/register", {
        fullName,
        email,
        password,
      });

      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      const msg =
        err?.response?.data?.error?.message ||
        "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      {FLOATING_EMOJIS.map(({ emoji, style }, i) => (
        <span key={i} className="floating-emoji" style={style}>
          {emoji}
        </span>
      ))}

      <div className="auth-card">
        <div className="auth-logo">🍔</div>
        <div className="auth-brand">GrabSnack</div>

        <h1 className="auth-title">Join GrabSnack 🎉</h1>
        <p className="auth-subtitle">Create your account and start ordering</p>

        {error   && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Juan dela Cruz"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
            />
          </div>

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
            <div style={{ position: "relative" }}>
              <input
                type={showPw ? "text" : "password"}
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                style={{
                  paddingRight: "44px",
                  color: "#ffffff",
                  backgroundColor: "rgba(57,61,82,0.8)",
                  letterSpacing: showPw ? "normal" : "3px",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                style={{
                  position: "absolute", right: "12px", top: password ? "30%" : "50%",
                  transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: "18px", padding: 0, lineHeight: 1,
                }}
                title={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? "🙈" : "👁️"}
              </button>
            </div>

            {password && (
              <div style={{ marginTop: "10px" }}>
                <div style={{ height: "4px", borderRadius: "4px", background: "#393d52", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${(strength / 4) * 100}%`,
                      background: strengthColors[strength],
                      borderRadius: "4px",
                      transition: "all 0.3s ease",
                    }}
                  />
                </div>
                <span style={{ fontSize: "11px", color: strengthColors[strength], marginTop: "4px", display: "block", fontWeight: "600" }}>
                  {strengthLabels[strength]}
                </span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Creating account..." : "🚀 Create Account"}
          </button>
        </form>

        <div className="auth-link">
          Already have an account?{" "}
          <Link to="/login">Sign in here</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
