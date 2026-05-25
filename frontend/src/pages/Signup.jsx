import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        email,
        password,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const strengthLevel = (pw) => {
    if (pw.length === 0) return 0;
    if (pw.length < 6) return 1;
    if (/[A-Z]/.test(pw) && /[0-9]/.test(pw) && pw.length >= 8) return 3;
    return 2;
  };

  const strength = strengthLevel(password);
  const strengthColors = ["transparent", "#ef4444", "#f59e0b", "#22c55e"];
  const strengthLabels = ["", "Weak", "Fair", "Strong"];

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
        style={{ top: "15%", right: "5%", opacity: 0.5 }}
      />
      <div
        className="orb orb-pink"
        style={{ bottom: "10%", left: "5%", opacity: 0.4 }}
      />

      {/* Card */}
      <div
        className="glass-card fade-in"
        style={{
          width: "100%",
          maxWidth: "460px",
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
            Create your account
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Start detecting fake content today — free forever
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

          {/* Error */}
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

          {/* Name */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label
              htmlFor="signup-name"
              style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}
            >
              Full Name
            </label>
            <input
              id="signup-name"
              type="text"
              className="input-field"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label
              htmlFor="signup-email"
              style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}
            >
              Email Address
            </label>
            <input
              id="signup-email"
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
              htmlFor="signup-password"
              style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}
            >
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              className="input-field"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {/* Strength bar */}
            {password.length > 0 && (
              <div style={{ marginTop: "6px" }}>
                <div style={{ display: "flex", gap: "4px" }}>
                  {[1, 2, 3].map((level) => (
                    <div
                      key={level}
                      style={{
                        flex: 1,
                        height: "3px",
                        borderRadius: "2px",
                        background: strength >= level ? strengthColors[strength] : "var(--navy-700)",
                        transition: "background 0.3s ease",
                      }}
                    />
                  ))}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    marginTop: "4px",
                    color: strengthColors[strength],
                    fontWeight: 600,
                  }}
                >
                  {strengthLabels[strength]}
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            id="signup-submit-btn"
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
              "Create Account →"
            )}
          </button>
        </form>

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

        <p style={{ textAlign: "center", fontSize: "14px", color: "var(--text-muted)" }}>
          Already have an account?{" "}
          <Link
            to="/login"
            id="signup-login-link"
            style={{
              color: "var(--indigo-light)",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  );
}
