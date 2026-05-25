import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Landing       from "./pages/Landing";
import Login         from "./pages/Login";
import Signup        from "./pages/Signup";
import Dashboard     from "./components/Dashboard";
import Navbar        from "./components/Navbar";
import IntroAnimation from "./components/IntroAnimation";
import { ThemeProvider } from "./context/ThemeContext";
import "./styles.css";

function AppContent() {
  const location    = useLocation();
  const isLanding   = location.pathname === "/";

  // Show intro EVERY time the landing page loads (no localStorage skip)
  const [showIntro,    setShowIntro]    = useState(isLanding);
  const [contentReady, setContentReady] = useState(!isLanding);

  // If user navigates directly to /login, /signup, /dashboard — skip intro
  useEffect(() => {
    if (!isLanding) {
      setShowIntro(false);
      setContentReady(true);
    }
  }, [isLanding]);

  const handleIntroComplete = () => {
    setShowIntro(false);
    // Tiny buffer so overlay fully fades before content pops visible
    setTimeout(() => setContentReady(true), 60);
  };

  return (
    <>
      {/* Intro overlay — above everything */}
      {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}

      {/*
        App shell is ALWAYS mounted so #nav-logo-img exists in the DOM
        and IntroAnimation can measure it for the FLIP.
        It just stays invisible (opacity:0) until the animation ends.
      */}
      <div
        className={contentReady ? "app-content app-content--visible" : "app-content"}
        aria-hidden={showIntro}
      >
        <Navbar />
        <Routes>
          <Route path="/"          element={<Landing />}   />
          <Route path="/login"     element={<Login />}     />
          <Route path="/signup"    element={<Signup />}    />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
