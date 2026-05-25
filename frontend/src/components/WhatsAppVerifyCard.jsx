

const WA_NUMBER = "14155238886"; // Twilio sandbox number (fixed)

const SAMPLE_TIPS = [
  "Paste suspicious news text above first",
  "Forward a viral WhatsApp message",
  "Check a social media claim",
];

export default function WhatsAppVerifyCard({ inputText = "" }) {
  const buildWaLink = () => {
    const base = "Check this content for authenticity using TruthLens AI:\n\n";
    const message = inputText.trim()
      ? `${base}${inputText.slice(0, 800)}`           // cap at 800 chars
      : `${base}[Paste your message here before clicking]`;
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  const handleClick = () => {
    window.open(buildWaLink(), "_blank", "noopener,noreferrer");
  };

  const hasText = inputText.trim().length > 0;

  return (
    <div
      id="whatsapp-verify-card"
      className="wa-card"
    >
      {/* ── Top shimmer accent ── */}
      <div className="wa-card-strip" />

      <div style={{ padding: "28px 30px 30px" }}>
        {/* ── Header row ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "18px" }}>
          {/* WA icon bubble */}
          <div className="wa-icon-bubble">
            {/* WhatsApp SVG */}
            <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </div>

          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
              Verify via WhatsApp Bot
            </h3>
            <span className="wa-live-badge">
              <span className="wa-live-dot" />
              Bot Active
            </span>
          </div>
        </div>

        {/* ── Description ── */}
        <p style={{ fontSize: "13.5px", lineHeight: 1.8, color: "var(--text-secondary)", marginBottom: "20px" }}>
          Forward suspicious messages to our WhatsApp bot for instant
          AI-powered verification — no sign-in needed on WhatsApp.
        </p>

        {/* ── Tips ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "7px", marginBottom: "22px" }}>
          {SAMPLE_TIPS.map((tip) => (
            <div
              key={tip}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                fontSize: "12px", color: "var(--text-muted)",
              }}
            >
              <span style={{ color: "#25D366", fontWeight: 700 }}>✓</span>
              {tip}
            </div>
          ))}
        </div>

        {/* ── Text preview (if text entered) ── */}
        {hasText && (
          <div className="wa-preview-box">
            <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "6px" }}>
              Message preview
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.7, wordBreak: "break-word" }}>
              {inputText.slice(0, 120)}{inputText.length > 120 ? "…" : ""}
            </div>
          </div>
        )}

        {/* ── CTA Button ── */}
        <button
          id="whatsapp-verify-btn"
          className="btn wa-btn"
          onClick={handleClick}
          title="Open WhatsApp with pre-filled message"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white" style={{ flexShrink: 0 }}>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          {hasText ? "Send to WhatsApp Bot →" : "Open WhatsApp Bot →"}
        </button>

        {/* ── Disclaimer ── */}
        <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "12px", textAlign: "center", lineHeight: 1.6 }}>
          Opens WhatsApp in a new tab · Zero data stored · Powered by Twilio Sandbox
        </p>
      </div>
    </div>
  );
}
