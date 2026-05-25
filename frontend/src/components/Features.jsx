export default function Features() {
  return (
    <div
      className="container"
      style={{ display: "flex", gap: "20px", marginTop: "50px" }}
    >
      <div
        style={{
          flex: 1,
          padding: "20px",
          background: "#1e293b",
          borderRadius: "10px",
        }}
      >
        <h3>🧠 Text Analysis</h3>
        <p>Detect fake news and misleading messages instantly.</p>
      </div>

      <div
        style={{
          flex: 1,
          padding: "20px",
          background: "#1e293b",
          borderRadius: "10px",
        }}
      >
        <h3>📸 Image Detection</h3>
        <p>Identify deepfake and manipulated images.</p>
      </div>

      <div
        style={{
          flex: 1,
          padding: "20px",
          borderRadius: "15px",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <h3>🎥 Video Analysis</h3>
        <p>Analyze videos using frame-based AI detection.</p>
      </div>
    </div>
  );
}
