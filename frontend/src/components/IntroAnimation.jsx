import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import logo from "../assets/logo.png";


export default function IntroAnimation({ onComplete }) {
  const overlayRef   = useRef(null);
  const logoWrapRef  = useRef(null); // the element we FLIP-move
  const logoImgRef   = useRef(null); // <img> inside wrapper
  const wordRef      = useRef(null); // "TruthLens" text
  const taglineRef   = useRef(null);
  const particlesRef = useRef([]);

  const [particles] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      angle: (i / 20) * 360,
      r: 100 + Math.random() * 70,
      size: 2 + Math.random() * 3.5,
    }))
  );

  useEffect(() => {
    const overlay  = overlayRef.current;
    const logoWrap = logoWrapRef.current;
    const word     = wordRef.current;
    const tagline  = taglineRef.current;
    if (!overlay || !logoWrap) return;

    // Lock scroll during intro
    document.body.style.overflow = "hidden";

    // ── Set initial states ──────────────────────────────────────────
    gsap.set(overlay,   { opacity: 1 });
    gsap.set(logoWrap,  { opacity: 0, scale: 0.55, y: 28 });
    gsap.set(word,      { opacity: 0, x: -12 });
    gsap.set(tagline,   { opacity: 0, y: 10 });
    gsap.set(particlesRef.current.filter(Boolean), { opacity: 0, scale: 0 });

    // ── Timeline ───────────────────────────────────────────────────
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        onComplete?.();
      },
    });

    // STEP 1 — Logo in
    tl.to(logoWrap, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.9,
      ease: "back.out(1.5)",
    })

    // Tagline fades in
    .to(tagline, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out",
    }, "-=0.3")

    // Text slides in
    .to(word, {
      opacity: 1,
      x: 0,
      duration: 0.55,
      ease: "power2.out",
    }, "-=0.5")

    // Particles burst
    .to(particlesRef.current.filter(Boolean), {
      opacity: 0.65,
      scale: 1,
      duration: 0.5,
      stagger: 0.025,
      ease: "power2.out",
    }, "-=0.4")

    // STEP 2 — Pulse
    .to(logoWrap, {
      scale: 1.07,
      duration: 0.4,
      ease: "sine.inOut",
      yoyo: true,
      repeat: 1,
    }, "+=0.2")

    // Particles fade out
    .to(particlesRef.current.filter(Boolean), {
      opacity: 0,
      scale: 0,
      duration: 0.35,
      stagger: 0.018,
      ease: "power2.in",
    }, "-=0.25")

    // STEP 3 — FLIP: measure navbar img, fly to it
    .add(() => {
      // Target: the <img> inside the navbar logo link
      const navImg  = document.getElementById("nav-logo-img");
      const logoEl  = logoWrapRef.current;
      if (!navImg || !logoEl) return;

      const navRect  = navImg.getBoundingClientRect();
      const logoRect = logoEl.getBoundingClientRect();

      const fromCX = logoRect.left + logoRect.width  / 2;
      const fromCY = logoRect.top  + logoRect.height / 2;
      const toCX   = navRect.left  + navRect.width   / 2;
      const toCY   = navRect.top   + navRect.height  / 2;

      const dx = toCX - fromCX;
      const dy = toCY - fromCY;
      // Scale so the big ~120px img shrinks to navbar img height (~38px)
      const scaleTo = navRect.height / logoRect.height;

      gsap.to(logoEl, {
        x: dx,
        y: dy,
        scale: scaleTo,
        duration: 0.6,
        ease: "power3.inOut",
      });

      // Fade out the text word (navbar has its own)
      gsap.to(word, {
        opacity: 0,
        x: -8,
        duration: 0.28,
        ease: "power2.in",
      });

      // Fade out tagline too
      gsap.to(tagline, {
        opacity: 0,
        duration: 0.28,
        ease: "power2.in",
      });
    })

    // STEP 4 — Overlay fades out
    .to(overlay, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
      delay: 0.7,
    });

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  return (
    <div
      ref={overlayRef}
      id="intro-overlay"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        background:
          "radial-gradient(ellipse 100% 70% at 50% 35%, rgba(99,102,241,0.22) 0%, rgba(2,6,23,0.98) 65%)",
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      {/* ── Ambient pulse rings ── */}
      {[440, 310, 190].map((size, i) => (
        <div
          key={size}
          style={{
            position: "absolute",
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: "50%",
            border: `1px solid rgba(99,102,241,${0.1 + i * 0.06})`,
            animation: `introPulseRing 3.2s ease-in-out ${i * 0.55}s infinite`,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        />
      ))}

      {/* ── Particles ── */}
      {particles.map((p, i) => {
        const rad = (p.angle * Math.PI) / 180;
        const px  = Math.cos(rad) * p.r;
        const py  = Math.sin(rad) * p.r;
        return (
          <div
            key={p.id}
            ref={(el) => (particlesRef.current[i] = el)}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: `${p.size}px`,
              height: `${p.size}px`,
              borderRadius: "50%",
              background: i % 2 === 0 ? "#818cf8" : "#ec4899",
              transform: `translate(calc(-50% + ${px}px), calc(-50% + ${py}px))`,
              opacity: 0,
              filter: "blur(0.4px)",
              boxShadow: `0 0 ${p.size * 3}px ${i % 2 === 0 ? "#818cf8" : "#ec4899"}`,
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* ── Logo wrapper — FLIP target ── */}
      <div
        ref={logoWrapRef}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "18px",
          position: "relative",
          zIndex: 2,
          cursor: "default",
        }}
      >
        {/* Real logo image */}
        <img
          ref={logoImgRef}
          src={logo}
          alt="TruthLens"
          style={{
            width:  "120px",
            height: "120px",
            objectFit: "contain",
            filter: "drop-shadow(0 0 28px rgba(99,102,241,0.75)) drop-shadow(0 0 12px rgba(236,72,153,0.5))",
            flexShrink: 0,
          }}
        />

        {/* Brand text */}
        <span
          ref={wordRef}
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize:   "50px",
            fontWeight: 900,
            letterSpacing: "-0.025em",
            background: "linear-gradient(135deg, #818cf8, #ec4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: 1.1,
            whiteSpace: "nowrap",
          }}
        >
          TruthLens
        </span>
      </div>

      {/* ── Tagline ── */}
      <p
        ref={taglineRef}
        style={{
          marginTop: "24px",
          fontSize: "13px",
          color: "rgba(148,163,184,0.75)",
          fontFamily: "'Inter', sans-serif",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          fontWeight: 500,
          position: "relative",
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        AI&nbsp;•&nbsp;Detection&nbsp;•&nbsp;Verification
      </p>

      {/* ── Bottom progress bar ── */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "180px",
          height: "2px",
          background: "rgba(255,255,255,0.06)",
          borderRadius: "1px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: "0%",
            background: "linear-gradient(90deg, #6366f1, #ec4899)",
            borderRadius: "1px",
            animation: "introBar 2.6s cubic-bezier(0.4,0,0.2,1) 0.2s forwards",
          }}
        />
      </div>
    </div>
  );
}
