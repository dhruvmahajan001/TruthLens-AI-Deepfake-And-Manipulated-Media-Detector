import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        position: "relative",
      }}
    >
      {/* Background orbs */}
      <div
        className="orb orb-indigo"
        style={{ top: "10%", left: "5%", opacity: 0.5 }}
      />
      <div
        className="orb orb-pink"
        style={{ bottom: "10%", right: "5%", opacity: 0.4 }}
      />

      {/* Card */}
      <div
        className="glass-card fade-in"
        style={{
          width: "100%",
          maxWidth: "440px",
          padding: "52px 44px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "18px",
              background: "linear-gradient(135deg, #6366f1, #ec4899)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              margin: "0 auto 18px",
              boxShadow: "0 0 30px rgba(99,102,241,0.4)",
            }}
          >
            ⬡
          </div>
          <h1
            style={{
              fontSize: "26px",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              marginBottom: "8px",
            }}
          >
            Welcome back
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Sign in to your TruthLens account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

          {/* Error Message */}
          {error && (
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "10px",
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#f87171",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* Email */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label
              htmlFor="login-email"
              style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}
            >
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              className="input-field"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label
              htmlFor="login-password"
              style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            id="login-submit-btn"
            className="btn btn-primary"
            disabled={loading}
            style={{
              width: "100%",
              padding: "15px",
              fontSize: "15px",
              marginTop: "8px",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <span className="loading-dots">
                <span /><span /><span />
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            margin: "24px 0",
          }}
        >
          <div className="divider" style={{ flex: 1 }} />
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>OR</span>
          <div className="divider" style={{ flex: 1 }} />
        </div>

        {/* Switch to Signup */}
        <p style={{ textAlign: "center", fontSize: "14px", color: "var(--text-muted)" }}>
          Don't have an account?{" "}
          <Link
            to="/signup"
            id="login-signup-link"
            style={{
              color: "var(--indigo-light)",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Create one →
          </Link>
        </p>
      </div>
    </div>
  );
}
