import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import WhatsAppVerifyCard from "./WhatsAppVerifyCard";

const LOADING_STEPS = [
  {
    icon: "🔍",
    label: "Scanning content…",
    detail: "Parsing structure & metadata",
  },
  {
    icon: "🧠",
    label: "Running AI model…",
    detail: "Neural network inference active",
  },
  {
    icon: "📊",
    label: "Generating report…",
    detail: "Compiling authenticity signals",
  },
  {
    icon: "⚡",
    label: "Finalizing results…",
    detail: "Calibrating confidence scores",
  },
];

const STATS = [
  {
    id: "accuracy",
    icon: "🎯",
    label: "Accuracy",
    value: "98.4%",
    sub: "Detection rate",
  },
  {
    id: "speed",
    icon: "⚡",
    label: "Avg Speed",
    value: "< 2s",
    sub: "Per analysis",
  },
  {
    id: "scans",
    icon: "📡",
    label: "Total Scans",
    value: "1000+",
    sub: "Lifetime",
  },
  {
    id: "confidence",
    icon: "🧠",
    label: "AI Confidence",
    value: "97.1%",
    sub: "Model accuracy",
  },
];

const RECENT = [
  {
    id: 1,
    type: "text",
    label: "Fake",
    icon: "📝",
    time: "2 min ago",
    text: "Breaking news article",
    conf: 94,
  },
  {
    id: 2,
    type: "image",
    label: "Real",
    icon: "📸",
    time: "11 min ago",
    text: "Profile photo analysis",
    conf: 88,
  },
  {
    id: 3,
    type: "video",
    label: "Fake",
    icon: "🎥",
    time: "34 min ago",
    text: "Viral video deepfake",
    conf: 97,
  },
  {
    id: 4,
    type: "text",
    label: "Real",
    icon: "📝",
    time: "1 hr ago",
    text: "WhatsApp message forward",
    conf: 82,
  },
  {
    id: 5,
    type: "image",
    label: "Fake",
    icon: "📸",
    time: "2 hr ago",
    text: "Social media image",
    conf: 91,
  },
];

const MODES = [
  { key: "text", icon: "📝", label: "Text", desc: "Articles, messages, posts" },
  { key: "image", icon: "📸", label: "Image", desc: "JPG, PNG, WEBP files" },
  { key: "video", icon: "🎥", label: "Video", desc: "MP4, MOV, AVI files" },
];

const CHART_OPTIONS = {
  plugins: {
    legend: { display: false },
    tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.raw}%` } },
  },
  cutout: "74%",
  animation: {
    animateRotate: true,
    animateScale: false,
    duration: 1400,
    easing: "easeOutQuart",
  },
};

function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (typeof target !== "number") return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

/* ── Stats Bar ── */
function StatsBar() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "16px",
        marginBottom: "32px",
      }}
    >
      {STATS.map((s, i) => (
        <div
          key={s.id}
          className="stat-card"
          style={{ animationDelay: `${i * 0.08}s` }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "14px",
            }}
          >
            <div className="stat-icon-wrap">{s.icon}</div>
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--indigo-light)",
                animation: "pulseSoft 2s infinite",
                opacity: 0.7,
              }}
            />
          </div>
          <div className="stat-value">{s.value}</div>
          <div
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--text-primary)",
              marginTop: "4px",
            }}
          >
            {s.label}
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "var(--text-muted)",
              marginTop: "2px",
            }}
          >
            {s.sub}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Mode Selector (3-Tab) ── */
function ModeSelector({ mode, setMode, disabled }) {
  return (
    <div>
      <div
        style={{
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.1em",
          color: "var(--text-muted)",
          textTransform: "uppercase",
          marginBottom: "12px",
        }}
      >
        Analysis Mode
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
        }}
      >
        {MODES.map((m) => (
          <button
            key={m.key}
            id={`mode-${m.key}-btn`}
            onClick={() => !disabled && setMode(m.key)}
            className={`mode-btn${mode === m.key ? " mode-btn-active" : ""}`}
            disabled={disabled}
          >
            <span
              style={{
                fontSize: "22px",
                marginBottom: "6px",
                display: "block",
              }}
            >
              {m.icon}
            </span>
            <span
              style={{ fontWeight: 700, fontSize: "13px", display: "block" }}
            >
              {m.label}
            </span>
            <span
              style={{
                fontSize: "10px",
                color:
                  mode === m.key
                    ? "rgba(255,255,255,0.65)"
                    : "var(--text-muted)",
                display: "block",
                marginTop: "2px",
              }}
            >
              {m.desc}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Text Input Panel ── */
function TextPanel({ text, setText, onAnalyze, loading }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label
          htmlFor="text-input"
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--text-secondary)",
          }}
        >
          Content to analyze
        </label>
        <div style={{ position: "relative" }}>
          <textarea
            id="text-input"
            className="input-field"
            placeholder="Paste a news article, WhatsApp message, social media post…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={9}
            style={{
              resize: "vertical",
              lineHeight: 1.75,
              paddingBottom: "36px",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "12px",
              left: "18px",
              right: "18px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pointerEvents: "none",
            }}
          >
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              {text.length > 0
                ? `${text.split(/\s+/).filter(Boolean).length} words`
                : "Start typing…"}
            </span>
            <span
              style={{
                fontSize: "11px",
                color: text.length > 800 ? "#f59e0b" : "var(--text-muted)",
              }}
            >
              {text.length} chars
            </span>
          </div>
        </div>
      </div>
      <button
        id="analyze-text-btn"
        className="btn btn-primary analyze-btn"
        onClick={onAnalyze}
        disabled={loading || !text.trim()}
        style={{
          width: "100%",
          padding: "15px",
          opacity: loading || !text.trim() ? 0.55 : 1,
        }}
      >
        {loading ? (
          <span className="loading-dots">
            <span />
            <span />
            <span />
          </span>
        ) : (
          "🧠 Analyze Text"
        )}
      </button>
    </div>
  );
}

/* ── File Drop Panel (image or video) ── */
function FilePanel({
  mode,
  file,
  fileName,
  setFile,
  setFileName,
  onAnalyze,
  loading,
}) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) {
      setFile(f);
      setFileName(f.name);
    }
  };

  const accept = mode === "video" ? "video/*" : "image/*";
  const modeIcon = mode === "video" ? "🎥" : "📸";
  const modeLabel = mode === "video" ? "Video" : "Image";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <div
        id="drop-zone"
        className={`upload-area${dragging ? " drag-over" : ""}`}
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-input-hidden").click()}
        style={{
          minHeight: "200px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <input
          id="file-input-hidden"
          type="file"
          accept={accept}
          style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files[0];
            if (f) {
              setFile(f);
              setFileName(f.name);
            }
          }}
        />
        {fileName ? (
          <>
            <div style={{ fontSize: "48px" }}>{modeIcon}</div>
            <div
              style={{
                fontWeight: 700,
                fontSize: "14px",
                color: "var(--text-primary)",
              }}
            >
              {fileName}
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </div>
            <div className="badge badge-indigo" style={{ marginTop: "4px" }}>
              Click to change file
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                fontSize: "52px",
                opacity: dragging ? 1 : 0.5,
                transition: "all 0.2s",
                transform: dragging ? "scale(1.15)" : "scale(1)",
              }}
            >
              {dragging ? "⬇️" : "⬆️"}
            </div>
            <div
              style={{
                fontWeight: 700,
                fontSize: "15px",
                color: dragging
                  ? "var(--text-primary)"
                  : "var(--text-secondary)",
              }}
            >
              {dragging ? "Drop it!" : `Drop ${modeLabel} or click to browse`}
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              {mode === "video" ? "MP4, MOV, AVI, WEBM" : "JPG, PNG, WEBP, GIF"}
            </div>
          </>
        )}
      </div>

      <button
        id="analyze-file-btn"
        className="btn btn-primary analyze-btn"
        onClick={onAnalyze}
        disabled={loading || !file}
        style={{
          width: "100%",
          padding: "15px",
          opacity: loading || !file ? 0.55 : 1,
        }}
      >
        {loading ? (
          <span className="loading-dots">
            <span />
            <span />
            <span />
          </span>
        ) : (
          `${modeIcon} Analyze ${modeLabel}`
        )}
      </button>
    </div>
  );
}

/* ── Empty State ── */
function EmptyState() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "480px",
        gap: "20px",
        padding: "40px",
      }}
    >
      {/* Animated radar icon */}
      <div style={{ position: "relative", width: "120px", height: "120px" }}>
        <div className="radar-ring radar-ring-1" />
        <div className="radar-ring radar-ring-2" />
        <div className="radar-ring radar-ring-3" />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "44px",
            zIndex: 1,
          }}
        >
          🔭
        </div>
      </div>

      <h3
        style={{
          fontSize: "20px",
          fontWeight: 700,
          color: "var(--text-primary)",
          marginTop: "8px",
        }}
      >
        Ready to Analyze
      </h3>
      <p
        style={{
          fontSize: "14px",
          color: "var(--text-secondary)",
          textAlign: "center",
          maxWidth: "300px",
          lineHeight: 1.8,
        }}
      >
        Select a mode from the left panel, add your content, and hit analyze to
        receive an AI authenticity report.
      </p>

      <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
        {[
          { icon: "📝", text: "Text" },
          { icon: "📸", text: "Image" },
          { icon: "🎥", text: "Video" },
        ].map((item) => (
          <div
            key={item.text}
            style={{
              padding: "8px 16px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: 600,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {item.icon} {item.text}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Live Loader ── */
function LiveLoader({ step }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "480px",
        gap: "36px",
        padding: "40px",
      }}
    >
      {/* Dual-ring spinner */}
      <div style={{ position: "relative", width: "100px", height: "100px" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "3px solid rgba(99,102,241,0.15)",
            borderTop: "3px solid #6366f1",
            animation: "spinSlow 0.9s linear infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: "12px",
            borderRadius: "50%",
            border: "3px solid rgba(236,72,153,0.15)",
            borderTop: "3px solid #ec4899",
            animation: "spinSlow 1.3s linear infinite reverse",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
          }}
        >
          {LOADING_STEPS[step]?.icon}
        </div>
      </div>

      {/* Live step label */}
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "6px",
          }}
        >
          {LOADING_STEPS[step]?.label}
        </div>
        <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
          {LOADING_STEPS[step]?.detail}
        </div>
      </div>

      {/* Step progress track */}
      <div
        style={{
          width: "100%",
          maxWidth: "340px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {LOADING_STEPS.map((s, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                opacity: done ? 0.45 : active ? 1 : 0.18,
                transition: "opacity 0.35s ease",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: 700,
                  background: done
                    ? "rgba(34,197,94,0.18)"
                    : active
                      ? "rgba(99,102,241,0.25)"
                      : "rgba(255,255,255,0.04)",
                  border: done
                    ? "1px solid rgba(34,197,94,0.4)"
                    : active
                      ? "1px solid rgba(99,102,241,0.6)"
                      : "1px solid rgba(255,255,255,0.06)",
                  boxShadow: active ? "0 0 12px rgba(99,102,241,0.35)" : "none",
                  color: done
                    ? "#4ade80"
                    : active
                      ? "#818cf8"
                      : "var(--text-muted)",
                  transition: "all 0.35s ease",
                }}
              >
                {done ? "✓" : i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: active
                      ? "var(--text-primary)"
                      : "var(--text-secondary)",
                  }}
                >
                  {s.label}
                </div>
                {active && (
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--text-muted)",
                      marginTop: "2px",
                    }}
                  >
                    {s.detail}
                  </div>
                )}
              </div>
              {active && (
                <div className="loading-dots" style={{ flexShrink: 0 }}>
                  <span />
                  <span />
                  <span />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pulsing bar */}
      <div style={{ width: "100%", maxWidth: "340px" }}>
        <div
          style={{
            height: "3px",
            borderRadius: "2px",
            background: "linear-gradient(90deg, #6366f1, #ec4899, #6366f1)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.8s linear infinite",
          }}
        />
      </div>
    </div>
  );
}

/* ── Error State ── */
function ErrorState({ error, onReset }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "400px",
        gap: "16px",
        padding: "40px",
        border: "1px solid rgba(239,68,68,0.25)",
        background: "rgba(239,68,68,0.04)",
        borderRadius: "var(--radius-xl)",
      }}
    >
      <div style={{ fontSize: "56px" }}>⚠️</div>
      <h3 style={{ color: "#f87171", fontSize: "20px" }}>Analysis Failed</h3>
      <p
        style={{
          fontSize: "14px",
          textAlign: "center",
          maxWidth: "320px",
          lineHeight: 1.7,
        }}
      >
        {error}
      </p>
      <button
        className="btn btn-outline"
        id="error-retry-btn"
        onClick={onReset}
        style={{ marginTop: "8px", fontSize: "14px" }}
      >
        ← Try Again
      </button>
    </div>
  );
}

/* ── Result Card ── */
function ResultCard({ result, tab, file, onReset, resultRef }) {
  const isReal = result?.label?.toLowerCase() === "real";
  const confidence = result?.confidence ?? 0;

  const glowColor = isReal ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)";
  const glowBorder = isReal ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)";
  const accentColor = isReal ? "#4ade80" : "#f87171";

  const chartData = {
    labels: ["Confidence", "Remaining"],
    datasets: [
      {
        data: [confidence, 100 - confidence],
        backgroundColor: [
          isReal ? "rgba(34,197,94,0.85)" : "rgba(239,68,68,0.85)",
          "rgba(15,23,42,0.6)",
        ],
        borderColor: [isReal ? "#22c55e" : "#ef4444", "transparent"],
        borderWidth: [2, 0],
        hoverOffset: 4,
      },
    ],
  };

  const modelType =
    tab === "text"
      ? "🧠 NLP Engine"
      : file?.type?.includes("video")
        ? "🎥 Video ML"
        : "📸 Vision AI";

  return (
    <div
      ref={resultRef}
      style={{
        borderRadius: "var(--radius-xl)",
        border: `1px solid ${glowBorder}`,
        background: `linear-gradient(135deg, rgba(99,102,241,0.06), rgba(236,72,153,0.03))`,
        boxShadow: `0 0 40px ${glowColor}, 0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)`,
        backdropFilter: "blur(20px)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Top accent strip ── */}
      <div
        style={{
          height: "3px",
          background: isReal
            ? "linear-gradient(90deg, #22c55e, #4ade80, #22c55e)"
            : "linear-gradient(90deg, #6366f1, #ec4899, #6366f1)",
          backgroundSize: "200% 100%",
          animation: "shimmer 2.5s linear infinite",
        }}
      />

      <div
        style={{
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          gap: "26px",
        }}
      >
        {/* ── Verdict Header ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: accentColor,
                  animation: "pulseSoft 1.5s infinite",
                }}
              />
              AI Verdict
            </div>
            <h2
              style={{
                fontSize: "clamp(22px, 3vw, 30px)",
                fontWeight: 900,
                letterSpacing: "-0.02em",
                color: accentColor,
              }}
            >
              {isReal ? "✅ Content Authentic" : "❌ Content Manipulated"}
            </h2>
          </div>
          <div
            className={`verdict-badge ${isReal ? "verdict-real" : "verdict-fake"}`}
            style={{ fontSize: "14px", fontWeight: 800 }}
          >
            {result.label}
          </div>
        </div>

        <div className="divider" />

        {/* ── Chart Row ── */}
        <div
          style={{
            display: "flex",
            gap: "28px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {/* Donut */}
          <div
            style={{
              width: "170px",
              height: "170px",
              position: "relative",
              flexShrink: 0,
              margin: "0 auto",
            }}
          >
            <Doughnut data={chartData} options={CHART_OPTIONS} />
            {/* Centre label */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  fontSize: "30px",
                  fontWeight: 900,
                  color: accentColor,
                  lineHeight: 1,
                }}
              >
                {confidence}%
              </div>
              <div
                style={{
                  fontSize: "10px",
                  color: "var(--text-muted)",
                  marginTop: "4px",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                confidence
              </div>
            </div>
          </div>

          {/* Right details */}
          <div
            style={{
              flex: 1,
              minWidth: "180px",
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            {/* Progress */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                  }}
                >
                  Confidence Score
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: accentColor,
                  }}
                >
                  {confidence}%
                </span>
              </div>
              <div className="progress-bar" style={{ height: "6px" }}>
                <div
                  className="progress-fill"
                  style={{
                    width: `${confidence}%`,
                    background: isReal
                      ? "linear-gradient(90deg, #22c55e, #4ade80)"
                      : "linear-gradient(90deg, #ef4444, #f87171)",
                    boxShadow: `0 0 8px ${accentColor}50`,
                  }}
                />
              </div>
            </div>

            {/* Mini metric grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              }}
            >
              {[
                { label: "Model", value: modelType },
                { label: "Engine", value: "v2.1" },
                { label: "Status", value: isReal ? "Verified" : "Flagged" },
                {
                  label: "Scan ID",
                  value: `#${Math.floor(Math.random() * 90000 + 10000)}`,
                },
              ].map((m) => (
                <div
                  key={m.label}
                  style={{
                    padding: "10px 12px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "10px",
                      color: "var(--text-muted)",
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    {m.label}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      marginTop: "4px",
                    }}
                  >
                    {m.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="divider" />

        {/* ── AI Summary ── */}
        <div
          style={{
            padding: "20px 22px",
            borderRadius: "var(--radius-md)",
            background: "rgba(255,255,255,0.025)",
            border: `1px solid ${isReal ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)"}`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              width: "3px",
              background: isReal ? "#22c55e" : "#ef4444",
              borderRadius: "2px 0 0 2px",
            }}
          />
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: "var(--text-muted)",
              textTransform: "uppercase",
              marginBottom: "10px",
            }}
          >
            AI Analysis Summary
          </div>
          <p
            style={{
              fontSize: "14px",
              lineHeight: 1.85,
              color: "var(--text-secondary)",
            }}
          >
            {result.message}
          </p>
        </div>

        {/* ── Action Row ── */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            id="analyze-again-btn"
            className="btn btn-outline"
            onClick={onReset}
            style={{ fontSize: "13px", padding: "10px 20px" }}
          >
            ← New Analysis
          </button>
          <button
            className="btn"
            style={{
              fontSize: "13px",
              padding: "10px 20px",
              background: isReal
                ? "rgba(34,197,94,0.1)"
                : "rgba(239,68,68,0.1)",
              border: `1px solid ${isReal ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
              color: accentColor,
            }}
          >
            📋 Copy Report
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Recent Activity Panel ── */
function RecentActivity({ scanCount }) {
  return (
    <div className="glass-card" style={{ padding: "24px", marginTop: "28px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "18px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#22c55e",
              animation: "pulseSoft 1.5s infinite",
            }}
          />
          <h3 style={{ fontSize: "15px", fontWeight: 700 }}>Recent Activity</h3>
        </div>
        <div className="badge badge-indigo">{scanCount} scans</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {RECENT.map((item, i) => {
          const isFake = item.label === "Fake";
          return (
            <div
              key={item.id}
              className="activity-row"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              {/* Icon */}
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  flexShrink: 0,
                  background: isFake
                    ? "rgba(239,68,68,0.1)"
                    : "rgba(34,197,94,0.1)",
                  border: `1px solid ${isFake ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                }}
              >
                {item.icon}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.text}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--text-muted)",
                    marginTop: "2px",
                  }}
                >
                  {item.time}
                </div>
              </div>

              {/* Confidence */}
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  flexShrink: 0,
                }}
              >
                {item.conf}%
              </div>

              {/* Verdict */}
              <div
                style={{
                  padding: "3px 10px",
                  borderRadius: "999px",
                  fontSize: "11px",
                  fontWeight: 700,
                  flexShrink: 0,
                  background: isFake
                    ? "rgba(239,68,68,0.12)"
                    : "rgba(34,197,94,0.12)",
                  border: `1px solid ${isFake ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`,
                  color: isFake ? "#f87171" : "#4ade80",
                }}
              >
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN DASHBOARD
═══════════════════════════════════════════════════ */
export default function Dashboard() {
  const [mode, setMode] = useState("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [scanCount, setScanCount] = useState(5);

  const resultRef = useRef(null);
  const loaderRef = useRef(null);

  /* ── Loader cycle ── */
  const startLoader = useCallback(() => {
    setLoadingStep(0);
    let i = 0;
    loaderRef.current = setInterval(() => {
      i = (i + 1) % LOADING_STEPS.length;
      setLoadingStep(i);
    }, 950);
  }, []);

  const stopLoader = useCallback(() => {
    if (loaderRef.current) clearInterval(loaderRef.current);
  }, []);

  /* ── Slide-in result ── */
  useEffect(() => {
    if (result && resultRef.current) {
      const el = resultRef.current;
      el.style.opacity = "0";
      el.style.transform = "translateY(28px) scale(0.97)";
      requestAnimationFrame(() => {
        el.style.transition =
          "opacity 0.65s cubic-bezier(0.4,0,0.2,1), transform 0.65s cubic-bezier(0.4,0,0.2,1)";
        el.style.opacity = "1";
        el.style.transform = "translateY(0) scale(1)";
      });
    }
  }, [result]);

  /* ── Text Analysis ── */
  const analyzeText = async () => {
    if (!text.trim()) return;
    setError("");
    setResult(null);
    setLoading(true);
    startLoader();
    try {
      const res = await axios.post(
        "https://truthlens-ai-deepfake-and-manipulated.onrender.com/api/analysis/analyze",
        {
          inputType: "text",
          content: text,
        },
      );
      setResult(res.data);
      setScanCount((c) => c + 1);
    } catch (err) {
      setError(
        err.response?.data?.message || "Analysis failed. Please try again.",
      );
    } finally {
      stopLoader();
      setLoading(false);
    }
  };

  /* ── File Analysis ── */
  const analyzeFile = async () => {
    if (!file) return;
    setError("");
    setResult(null);
    setLoading(true);
    startLoader();
    const formData = new FormData();
    formData.append("file", file);
    const endpoint = file.type.includes("video")
      ? "analyze-video"
      : "analyze-image";
    try {
      const res = await axios.post(
        `https://truthlens-ai-deepfake-and-manipulated.onrender.com/api/analysis/${endpoint}`,
        formData,
      );
      setResult(res.data);
      setScanCount((c) => c + 1);
    } catch (err) {
      setError(
        err.response?.data?.message || "Analysis failed. Please try again.",
      );
    } finally {
      stopLoader();
      setLoading(false);
    }
  };

  /* ── Reset ── */
  const handleReset = () => {
    setResult(null);
    setError("");
    setText("");
    setFile(null);
    setFileName("");
  };

  const handleModeChange = (m) => {
    setMode(m);
    setResult(null);
    setError("");
    setFile(null);
    setFileName("");
    setText("");
  };

  const handleAnalyze = mode === "text" ? analyzeText : analyzeFile;

  /* ── Render ── */
  return (
    <div
      style={{
        minHeight: "100vh",
        paddingTop: "88px",
        paddingBottom: "60px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient orbs */}
      <div
        className="orb orb-indigo"
        style={{
          top: "0%",
          right: "-5%",
          opacity: 0.2,
          width: "600px",
          height: "600px",
        }}
      />
      <div
        className="orb orb-pink"
        style={{ bottom: "-5%", left: "-5%", opacity: 0.15 }}
      />

      <div
        className="section"
        style={{ padding: "0 0 80px", position: "relative", zIndex: 1 }}
      >
        {/* ── Page Header ── */}
        <div
          style={{
            marginBottom: "32px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <div
              className="badge badge-indigo"
              style={{ marginBottom: "12px" }}
            >
              <span
                style={{
                  animation: "pulseSoft 1.5s infinite",
                  color: "#22c55e",
                }}
              >
                ●
              </span>
              Analysis Engine Active
            </div>
            <h1
              className="gradient-text"
              style={{
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
              }}
            >
              TruthLens Dashboard
            </h1>
            <p
              style={{
                marginTop: "8px",
                fontSize: "15px",
                color: "var(--text-secondary)",
              }}
            >
              Upload content to receive an instant AI-powered authenticity
              report.
            </p>
          </div>

          {/* Quick status chip */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 18px",
              borderRadius: "999px",
              background: "rgba(34,197,94,0.08)",
              border: "1px solid rgba(34,197,94,0.2)",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#22c55e",
                animation: "pulseSoft 1.5s infinite",
              }}
            />
            <span
              style={{ fontSize: "13px", fontWeight: 600, color: "#4ade80" }}
            >
              AI System Online
            </span>
          </div>
        </div>

        {/* ── Stats Bar ── */}
        <StatsBar />

        {/* ── Main Split Layout ── */}
        <div
          className="dash-layout"
          style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}
        >
          {/* ───────── LEFT: Input Panel ───────── */}
          <div style={{ flex: "0 0 400px" }}>
            <div
              className="glass-card"
              style={{
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                gap: "22px",
              }}
            >
              {/* Panel title */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "9px",
                    background:
                      "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(236,72,153,0.2))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                  }}
                >
                  ⚡
                </div>
                <h2 style={{ fontSize: "17px", fontWeight: 700 }}>
                  Input Panel
                </h2>
              </div>

              {/* Mode selector */}
              <ModeSelector
                mode={mode}
                setMode={handleModeChange}
                disabled={loading}
              />

              <div className="divider" />

              {/* Content area */}
              {mode === "text" ? (
                <TextPanel
                  text={text}
                  setText={setText}
                  onAnalyze={handleAnalyze}
                  loading={loading}
                />
              ) : (
                <FilePanel
                  mode={mode}
                  file={file}
                  fileName={fileName}
                  setFile={setFile}
                  setFileName={setFileName}
                  onAnalyze={handleAnalyze}
                  loading={loading}
                />
              )}
            </div>

            {/* ── WhatsApp Verify Card ── */}
            <WhatsAppVerifyCard inputText={text} />
          </div>

          {/* ───────── RIGHT: Result Panel ───────── */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "9px",
                  background:
                    "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(236,72,153,0.2))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                }}
              >
                📊
              </div>
              <h2 style={{ fontSize: "17px", fontWeight: 700 }}>
                Analysis Report
              </h2>
              {result && (
                <div
                  className={`verdict-badge ${result.label?.toLowerCase() === "real" ? "verdict-real" : "verdict-fake"}`}
                  style={{ marginLeft: "auto", fontSize: "12px" }}
                >
                  {result.label}
                </div>
              )}
            </div>

            {/* ── State switching ── */}
            {!loading && !result && !error && <EmptyState />}
            {loading && <LiveLoader step={loadingStep} />}
            {error && !loading && (
              <ErrorState error={error} onReset={handleReset} />
            )}
            {result && !loading && (
              <ResultCard
                result={result}
                tab={mode}
                file={file}
                onReset={handleReset}
                resultRef={resultRef}
              />
            )}

            {/* ── Recent Activity ── */}
            <RecentActivity scanCount={scanCount + RECENT.length} />
          </div>
        </div>
      </div>
    </div>
  );
}
