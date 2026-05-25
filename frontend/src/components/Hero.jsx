import { useEffect } from "react";
import { gsap } from "gsap";

export default function Hero() {
  useEffect(() => {
    gsap.from(".hero-title", {
      y: -50,
      opacity: 0,
      duration: 1,
    });

    gsap.from(".hero-btn", {
      scale: 0.8,
      opacity: 0,
      delay: 0.5,
      duration: 0.8,
    });
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "100px 20px" }}>
      <h1 className="gradient-text" style={{ fontSize: "3rem" }}>
        TruthLens AI Detection Platform
      </h1>

      <p style={{ marginTop: "20px", color: "#94a3b8" }}>
        AI-powered detection for text, images, and videos.
      </p>

      <button className="hero-btn" style={{ marginTop: "30px" }}>
        Start Analyzing
      </button>
    </div>
  );
}
