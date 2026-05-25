import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import logo from "../assets/logo.png";
const features = [
  {
    icon: "🧠",
    title: "Text Detection",
    desc: "Analyze articles, messages, and news using advanced NLP to detect misinformation and AI-generated content in milliseconds.",
    tag: "NLP Engine",
  },
  {
    icon: "📸",
    title: "Deepfake Images",
    desc: "Uncover manipulated and AI-generated images using multi-layer convolutional neural network analysis.",
    tag: "Vision AI",
  },
  {
    icon: "🎥",
    title: "Video Analysis",
    desc: "Frame-by-frame forensic deepfake detection with temporal consistency scoring and artifact detection.",
    tag: "Video ML",
  },
  {
    icon: "📱",
    title: "WhatsApp Bot",
    desc: "Forward any message, image, or video directly to our WhatsApp bot and receive an instant AI verification report.",
    tag: "Real-time",
  },
];

const steps = [
  { num: "01", icon: "📤", title: "Upload Content", desc: "Paste text, upload an image, or drop a video file into the TruthLens analyzer." },
  { num: "02", icon: "⚙️", title: "AI Processing", desc: "Our multi-model AI pipeline scans for patterns, inconsistencies, and manipulation signatures." },
  { num: "03", icon: "📊", title: "Get Report", desc: "Receive a detailed authenticity score with a confidence percentage and full breakdown." },
];

const stats = [
  { num: "92.3%", label: "Detection Accuracy" },
  { num: "< 5s",  label: "Average Analysis Time" },
  { num: "50+",   label: "Content Scanned" },
  { num: "10+",  label: "Trained Model Used" },
];

export default function Landing() {
  const heroRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Intersection Observer for scroll-triggered animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1 }
    );

    const animatedEls = document.querySelectorAll(".scroll-reveal");
    animatedEls.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(40px)";
      el.style.transition = "opacity 0.7s ease, transform 0.7s ease";
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ overflowX: "hidden" }}>
      {/* ─── HERO ─── */}
      <section
        id="hero"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "120px 5% 80px",
          position: "relative",
        }}
        ref={heroRef}
      >
        {/* Background orbs */}
        <div
          className="orb orb-indigo"
          style={{ top: "10%", left: "5%", opacity: 0.6 }}
        />
        <div
          className="orb orb-pink"
          style={{ bottom: "15%", right: "8%", opacity: 0.5 }}
        />
        <div
          className="orb orb-indigo"
          style={{
            top: "50%",
            right: "20%",
            width: "300px",
            height: "300px",
            opacity: 0.3,
          }}
        />

        {/* Badge */}
        <div
          className="badge badge-indigo fade-in"
          style={{ marginBottom: "28px" }}
        >
          <span style={{ animation: "pulseSoft 2s infinite" }}>●</span>
          AI-Powered Media Verification
        </div>

        {/* Main Heading */}
        <h1
          className="fade-in-delay-1"
          style={{
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            maxWidth: "820px",
            lineHeight: 1.1,
          }}
        >
          Truth in the Age of{" "}
          <span className="gradient-text">AI Deception</span>
        </h1>

        {/* Subtitle */}
        <p
          className="fade-in-delay-2"
          style={{
            marginTop: "24px",
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            maxWidth: "600px",
            lineHeight: 1.8,
            color: "var(--text-secondary)",
          }}
        >
          TruthLens uses cutting-edge AI to detect fake news, deepfake images,
          and manipulated videos — giving you confidence in what's real.
        </p>

        {/* CTA Buttons */}
        <div
          className="fade-in-delay-3"
          style={{
            display: "flex",
            gap: "14px",
            marginTop: "44px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Link to="/signup" id="hero-cta-signup">
            <button
              className="btn btn-primary"
              id="hero-get-started-btn"
              style={{ padding: "16px 36px", fontSize: "16px" }}
            >
              Get Started Free →
            </button>
          </Link>
          <Link to="/login" id="hero-cta-login">
            <button
              className="btn btn-outline"
              id="hero-login-btn"
              style={{ padding: "16px 36px", fontSize: "16px" }}
            >
              Login to Dashboard
            </button>
          </Link>
        </div>

        {/* Stats Bar */}
        <div
          className="fade-in-delay-3"
          style={{
            display: "flex",
            gap: "48px",
            marginTop: "72px",
            flexWrap: "wrap",
            justifyContent: "center",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: "48px",
          }}
        >
          {stats.map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div className="stat-number">{s.num}</div>
              <div
                style={{
                  fontSize: "13px",
                  color: "var(--text-muted)",
                  marginTop: "6px",
                  fontWeight: 500,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="section" style={{ paddingTop: "40px" }}>
        <div
          className="scroll-reveal"
          style={{ textAlign: "center", marginBottom: "64px" }}
        >
          <div className="badge badge-indigo" style={{ marginBottom: "18px" }}>
            Platform Capabilities
          </div>
          <h2
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: "16px" }}
          >
            What <span className="gradient-text">TruthLens</span> Can Do
          </h2>
          <p style={{ maxWidth: "520px", margin: "0 auto", lineHeight: 1.8 }}>
            From viral WhatsApp messages to deepfake profile photos — our AI
            catches manipulation across every content type.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "24px",
          }}
        >
          {features.map((f, i) => (
            <div
              key={f.title}
              className="glass-card scroll-reveal"
              id={`feature-card-${i}`}
              style={{
                padding: "32px 28px",
                cursor: "default",
                transitionDelay: `${i * 0.1}s`,
              }}
            >
              <div className="feature-icon">{f.icon}</div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: "var(--indigo-light)",
                  marginBottom: "10px",
                  textTransform: "uppercase",
                }}
              >
                {f.tag}
              </div>
              <h3
                style={{
                  fontSize: "18px",
                  marginBottom: "12px",
                  color: "var(--text-primary)",
                }}
              >
                {f.title}
              </h3>
              <p style={{ fontSize: "14px", lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section
        id="how-it-works"
        style={{
          padding: "80px 5%",
          background:
            "linear-gradient(180deg, transparent, rgba(99,102,241,0.04), transparent)",
        }}
      >
        <div
          className="scroll-reveal"
          style={{ textAlign: "center", marginBottom: "64px" }}
        >
          <div className="badge badge-indigo" style={{ marginBottom: "18px" }}>
            Simple Process
          </div>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            How It <span className="gradient-text">Works</span>
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "28px",
            maxWidth: "960px",
            margin: "0 auto",
          }}
        >
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="glass scroll-reveal"
              id={`step-${i}`}
              style={{
                padding: "36px 28px",
                position: "relative",
                transitionDelay: `${i * 0.12}s`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  fontSize: "48px",
                  fontWeight: 900,
                  color: "rgba(99,102,241,0.08)",
                  lineHeight: 1,
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                {step.num}
              </div>
              <div style={{ fontSize: "36px", marginBottom: "20px" }}>
                {step.icon}
              </div>
              <h3 style={{ fontSize: "20px", marginBottom: "12px" }}>
                {step.title}
              </h3>
              <p style={{ fontSize: "14px", lineHeight: 1.75 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── WHATSAPP ─── */}
      <section id="whatsapp" className="section">
        <div
          className="glass-card scroll-reveal"
          style={{
            padding: "64px",
            position: "relative",
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "48px",
            alignItems: "center",
          }}
        >
          {/* Glow decoration */}
          <div
            className="orb orb-indigo"
            style={{ top: "-100px", right: "-100px", opacity: 0.4 }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              className="badge badge-indigo"
              style={{ marginBottom: "20px" }}
            >
              📱 WhatsApp Integration
            </div>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
                marginBottom: "20px",
              }}
            >
              Verify on the <span className="gradient-text">Go</span>
            </h2>
            <p
              style={{
                lineHeight: 1.85,
                marginBottom: "28px",
                fontSize: "15px",
              }}
            >
              Link your WhatsApp to TruthLens and instantly verify any message,
              image, or video — directly from your chat. Our AI bot processes
              and responds within seconds, no app switching needed.
            </p>
            <ul
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {[
                "Forward messages for instant fact-checking",
                "Send photos to detect image manipulation",
                "Drop videos for deepfake frame analysis",
                "Receive detailed AI confidence reports",
              ].map((item) => (
                <li
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                  }}
                >
                  <span
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #6366f1, #ec4899)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "10px",
                      flexShrink: 0,
                    }}
                  >
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* WhatsApp Mock Chat */}
          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              className="glass"
              style={{
                padding: "24px",
                background: "rgba(5,10,20,0.6)",
                borderRadius: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                maxWidth: "340px",
                margin: "0 auto",
              }}
            >
              <div
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.07)",
                  paddingBottom: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #6366f1, #ec4899)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                  }}
                >
                  ⬡
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "14px" }}>
                    TruthLens Bot
                  </div>
                  <div style={{ fontSize: "11px", color: "#4ade80" }}>
                    ● Active
                  </div>
                </div>
              </div>

              {/* Chat bubbles */}
              {[
                {
                  text: "Is this image real?  [photo.jpg]",
                  fromUser: true,
                  time: "10:24 AM",
                },
                {
                  text: "🔍 Analyzing image…\n🧠 Running deepfake detection…\n\n⚠️ Result: MANIPULATED\nConfidence: 94.2%\n\nThis image shows signs of GAN-based face synthesis.",
                  fromUser: false,
                  time: "10:24 AM",
                },
              ].map((msg, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: msg.fromUser ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "80%",
                      padding: "10px 14px",
                      borderRadius: msg.fromUser
                        ? "18px 18px 4px 18px"
                        : "18px 18px 18px 4px",
                      background: msg.fromUser
                        ? "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(236,72,153,0.2))"
                        : "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      fontSize: "12px",
                      lineHeight: 1.6,
                      whiteSpace: "pre-wrap",
                      color: msg.fromUser ? "#e2e8f0" : "#94a3b8",
                    }}
                  >
                    {msg.text}
                    <div
                      style={{
                        fontSize: "10px",
                        color: "var(--text-muted)",
                        marginTop: "6px",
                        textAlign: "right",
                      }}
                    >
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA BAND ─── */}
      <section style={{ padding: "80px 5%", textAlign: "center" }}>
        <div className="scroll-reveal">
          <h2
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: "20px" }}
          >
            Ready to detect the <span className="gradient-text">truth?</span>
          </h2>
          <p
            style={{
              maxWidth: "460px",
              margin: "0 auto 36px",
              lineHeight: 1.8,
            }}
          >
            Join thousands of journalists, researchers, and everyday users
            protecting themselves from misinformation.
          </p>
          <Link to="/signup" id="cta-bottom-signup">
            <button
              className="btn btn-primary"
              id="cta-bottom-btn"
              style={{ padding: "18px 48px", fontSize: "17px" }}
            >
              Create Free Account
            </button>
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "40px 5%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div className="navbar-logo" style={{ fontSize: "18px" }}>
          <span style={{ marginRight: "6px" }}>
            <img
              src={logo}
              alt="TruthLens"
              style={{
                width: "40px",
                height: "40px",
                objectFit: "contain",
                filter:
                  "drop-shadow(0 0 28px rgba(99,102,241,0.75)) drop-shadow(0 0 12px rgba(236,72,153,0.5))",
                flexShrink: 0,
              }}
            />
          </span>
          TruthLens
        </div>
        <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
          © 2025 TruthLens. AI-powered media verification.
        </p>
        <div style={{ display: "flex", gap: "20px" }}>
          {["Privacy", "Terms", "Contact"].map((item) => (
            <a
              key={item}
              href="#"
              style={{
                fontSize: "13px",
                color: "var(--text-muted)",
                transition: "var(--transition-fast)",
              }}
              onMouseEnter={(e) =>
                (e.target.style.color = "var(--text-primary)")
              }
              onMouseLeave={(e) => (e.target.style.color = "var(--text-muted)")}
            >
              {item}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
