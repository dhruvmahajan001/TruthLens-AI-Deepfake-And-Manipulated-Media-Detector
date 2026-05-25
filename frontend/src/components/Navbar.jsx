import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location    = useLocation();
  const isDashboard = location.pathname === "/dashboard";
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <nav
      className="navbar"
      style={{ boxShadow: scrolled ? "var(--nav-shadow)" : "none" }}
    >
      {/* ── Logo ── */}
      <Link to="/" className="navbar-logo" id="nav-logo">
        {/* id="nav-logo-img" is the FLIP measurement target for IntroAnimation */}
        <img
          id="nav-logo-img"
          src={logo}
          alt="TruthLens logo"
          style={{
            width: "38px",
            height: "38px",
            objectFit: "contain",
            marginRight: "9px",
            flexShrink: 0,
          }}
        />
        TruthLens
      </Link>

      {/* ── Desktop Nav Links ── */}
      <ul className="navbar-links">
        {!isDashboard ? (
          <>
            <li>
              <a href="#features" id="nav-features">
                Features
              </a>
            </li>
            <li>
              <a href="#how-it-works" id="nav-how">
                How It Works
              </a>
            </li>
            <li>
              <a href="#whatsapp" id="nav-whatsapp">
                WhatsApp
              </a>
            </li>
          </>
        ) : (
          
            <li>
              <Link to="/" id="nav-home">
                Home
              </Link>
            </li>
            
        )}
      </ul>

      {/* ── Right Controls ── */}
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        {/* Theme Toggle */}
        <button
          id="theme-toggle-btn"
          onClick={toggle}
          aria-label="Toggle theme"
          title={
            theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
          }
          style={{
            background: "var(--glass-bg)",
            border: "1px solid var(--glass-border)",
            borderRadius: "10px",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: "18px",
            transition: "all 0.25s ease",
            backdropFilter: "blur(8px)",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--glass-hover)";
            e.currentTarget.style.transform = "scale(1.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--glass-bg)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        {/* Auth Buttons */}
        {isDashboard ? (
          <button
            id="nav-logout-btn"
            className="btn btn-outline"
            onClick={handleLogout}
            style={{ fontSize: "14px", padding: "9px 20px" }}
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" id="nav-login-link">
              <button
                className="btn btn-outline"
                id="nav-login-btn"
                style={{ fontSize: "14px", padding: "9px 20px" }}
              >
                Login
              </button>
            </Link>
            <Link to="/signup" id="nav-signup-link">
              <button
                className="btn btn-primary"
                id="nav-signup-btn"
                style={{ fontSize: "14px", padding: "9px 20px" }}
              >
                Get Started
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
