import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

export type Page = "chat" | "admin";
type CSSVars = React.CSSProperties & { [key: `--${string}`]: string };

const SCENES = [
  { id: "intro", duration: 5000 },
  { id: "krishna", duration: 8000 },
  { id: "radha", duration: 8000 },
  { id: "together", duration: 10000 },
  { id: "outro", duration: 4000 },
];

const TOTAL_SCENES = SCENES.length;

function generatePetals(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 8 + Math.random() * 14,
    duration: 6 + Math.random() * 8,
    delay: Math.random() * 6,
    drift: (Math.random() - 0.5) * 120,
    rotation: Math.random() * 360,
    color: ["#FF9EAA", "#FF6B8A", "#FFB3C1", "#FF85A1", "#FFADC0"][
      Math.floor(Math.random() * 5)
    ],
  }));
}

function generateSparkles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    bottom: Math.random() * 30,
    size: 3 + Math.random() * 6,
    duration: 2.5 + Math.random() * 3,
    delay: Math.random() * 4,
    color: ["#FFD700", "#FFF176", "#FFECB3", "#FFE082", "#FFCA28"][
      Math.floor(Math.random() * 5)
    ],
  }));
}

const introStars = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: (i * 37 + 13) % 100,
  top: (i * 53 + 7) % 80,
  size: 1 + (i % 3),
  dur: 1.5 + (i % 3),
  delay: i % 3,
}));

const outroStars = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  left: (i * 41 + 5) % 100,
  top: (i * 67 + 11) % 90,
  size: 1 + (i % 2.5),
  dur: 1.5 + (i % 3),
  delay: i % 2,
}));

const petals = generatePetals(70);
const sparkles = generateSparkles(45);

export default function App() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [fade, setFade] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const goToScene = useCallback((index: number) => {
    setFade(false);
    setTimeout(() => {
      setSceneIndex(index % TOTAL_SCENES);
      setProgress(0);
      startTimeRef.current = Date.now();
      setFade(true);
    }, 700);
  }, []);

  useEffect(() => {
    const duration = SCENES[sceneIndex].duration;
    startTimeRef.current = Date.now();

    if (progressRef.current) clearInterval(progressRef.current);
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);
    }, 50);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      goToScene(sceneIndex + 1);
    }, duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [sceneIndex, goToScene]);

  const scene = SCENES[sceneIndex].id;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Noto+Serif+Devanagari:wght@300;400;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        html, body, #root {
          width: 100%; height: 100%; overflow: hidden;
          background: #000;
        }

        .scene-container {
          position: fixed; inset: 0;
          display: flex; align-items: center; justify-content: center;
          background: #000;
        }

        .cinematic-frame {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          background: #000;
        }

        /* letterbox for wide screens */
        @media (min-aspect-ratio: 16/9) {
          .cinematic-frame {
            width: calc(100vh * 16 / 9);
            height: 100vh;
          }
        }
        @media (max-aspect-ratio: 16/9) {
          .cinematic-frame {
            width: 100vw;
            height: calc(100vw * 9 / 16);
          }
        }

        .scene-fade {
          transition: opacity 0.7s ease-in-out;
        }
        .scene-visible { opacity: 1; }
        .scene-hidden { opacity: 0; }

        /* ── Ken Burns ── */
        @keyframes kenburns-zoom {
          0%   { transform: scale(1) translate(0,0); }
          100% { transform: scale(1.13) translate(-1%, -1%); }
        }
        @keyframes kenburns-pan {
          0%   { transform: scale(1.06) translate(-2%, 0); }
          100% { transform: scale(1.12) translate(2%, -1%); }
        }
        @keyframes kenburns-out {
          0%   { transform: scale(1.1); }
          100% { transform: scale(1.0); }
        }
        .kb-zoom  { animation: kenburns-zoom 8s ease-in-out forwards; }
        .kb-pan   { animation: kenburns-pan  8s ease-in-out forwards; }
        .kb-out   { animation: kenburns-out 10s ease-in-out forwards; }

        /* ── Petal fall ── */
        @keyframes petalFall {
          0%   { transform: translateY(-60px) rotate(0deg) translateX(0); opacity: 0; }
          10%  { opacity: 0.9; }
          90%  { opacity: 0.7; }
          100% { transform: translateY(110vh) rotate(720deg) translateX(var(--drift)); opacity: 0; }
        }
        .petal {
          position: absolute;
          top: -20px;
          border-radius: 50% 10% 50% 10%;
          animation: petalFall var(--dur) ease-in var(--delay) infinite;
          pointer-events: none;
        }

        /* ── Sparkle rise ── */
        @keyframes sparkleRise {
          0%   { transform: translateY(0) scale(1); opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 0.6; }
          100% { transform: translateY(-120px) scale(0.3); opacity: 0; }
        }
        .sparkle {
          position: absolute;
          border-radius: 50%;
          animation: sparkleRise var(--dur) ease-out var(--delay) infinite;
          pointer-events: none;
          box-shadow: 0 0 6px 2px currentColor;
        }

        /* ── Divine aura ── */
        .aura-gold {
          background: radial-gradient(ellipse at center,
            transparent 40%,
            rgba(255,215,0,0.18) 65%,
            rgba(255,165,0,0.28) 80%,
            rgba(255,215,0,0.12) 100%);
        }
        .aura-pink {
          background: radial-gradient(ellipse at center,
            transparent 40%,
            rgba(255,182,193,0.2) 65%,
            rgba(255,105,180,0.28) 80%,
            rgba(255,215,0,0.1) 100%);
        }
        .aura-together {
          background: radial-gradient(ellipse at center,
            transparent 30%,
            rgba(255,215,0,0.1) 55%,
            rgba(255,180,120,0.22) 75%,
            rgba(255,215,0,0.15) 100%);
        }

        /* ── Text glow ── */
        .text-gold-glow {
          color: #FFD700;
          text-shadow:
            0 0 20px rgba(255,215,0,0.9),
            0 0 40px rgba(255,165,0,0.7),
            0 0 80px rgba(255,215,0,0.4),
            0 2px 4px rgba(0,0,0,0.8);
          font-family: 'Noto Serif Devanagari', serif;
        }
        .text-cream-glow {
          color: #FFF8DC;
          text-shadow:
            0 0 15px rgba(255,248,220,0.8),
            0 0 30px rgba(255,215,0,0.4),
            0 2px 4px rgba(0,0,0,0.9);
          font-family: 'Cinzel', serif;
        }
        .text-pink-glow {
          color: #FFB3C6;
          text-shadow:
            0 0 20px rgba(255,179,198,0.9),
            0 0 40px rgba(255,105,180,0.6),
            0 0 80px rgba(255,182,193,0.3),
            0 2px 4px rgba(0,0,0,0.8);
          font-family: 'Noto Serif Devanagari', serif;
        }

        /* ── Pulse glow ── */
        @keyframes glowPulse {
          0%,100% { opacity: 0.7; }
          50%      { opacity: 1; }
        }
        @keyframes textPulse {
          0%,100% { text-shadow: 0 0 20px rgba(255,215,0,0.9), 0 0 40px rgba(255,165,0,0.7), 0 0 80px rgba(255,215,0,0.4), 0 2px 4px rgba(0,0,0,0.8); }
          50%      { text-shadow: 0 0 30px rgba(255,215,0,1),   0 0 60px rgba(255,165,0,0.9), 0 0 120px rgba(255,215,0,0.6), 0 2px 4px rgba(0,0,0,0.8); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .anim-glow-pulse { animation: glowPulse 3s ease-in-out infinite; }
        .anim-text-pulse { animation: textPulse 2.5s ease-in-out infinite; }
        .anim-fade-up    { animation: fadeInUp 1.2s ease-out forwards; }
        .anim-fade-up-delay { animation: fadeInUp 1.2s ease-out 0.6s forwards; opacity: 0; }
        .anim-fade-scale { animation: fadeInScale 1.5s ease-out forwards; }

        .shimmer-text {
          background: linear-gradient(90deg, #FFD700 0%, #FFF8DC 30%, #FFD700 50%, #FF8C00 70%, #FFD700 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }

        /* ── Progress bar ── */
        .progress-bar-track {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          background: rgba(255,255,255,0.1);
          z-index: 100;
        }
        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #FFD700, #FF8C00, #FFD700);
          transition: width 0.1s linear;
          box-shadow: 0 0 8px rgba(255,215,0,0.8);
        }

        /* ── Scene dots ── */
        .scene-dots {
          position: absolute;
          bottom: 14px; left: 50%;
          transform: translateX(-50%);
          display: flex; gap: 8px;
          z-index: 100;
        }
        .dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.3);
          cursor: pointer;
          transition: all 0.3s;
        }
        .dot.active {
          background: #FFD700;
          box-shadow: 0 0 8px rgba(255,215,0,0.8);
          width: 20px; border-radius: 3px;
        }

        /* ── Image fill ── */
        .img-fill {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
        }

        /* ── Intro bg ── */
        @keyframes introGlow {
          0%,100% { opacity: 0.5; transform: scale(1); }
          50%      { opacity: 0.8; transform: scale(1.05); }
        }
        .intro-bg {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at center,
            rgba(120,80,0,0.4) 0%,
            rgba(60,40,0,0.2) 50%,
            transparent 100%);
          animation: introGlow 4s ease-in-out infinite;
        }

        /* ── Outro bg ── */
        @keyframes outroShine {
          0%,100% { opacity: 0.6; }
          50%      { opacity: 1; }
        }
        .outro-bg {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at center,
            rgba(180,130,0,0.35) 0%,
            rgba(100,60,0,0.18) 55%,
            transparent 100%);
          animation: outroShine 3s ease-in-out infinite;
        }

        /* ── lotus decoration ── */
        @keyframes float {
          0%,100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-10px) rotate(5deg); }
        }
        .lotus { animation: float 5s ease-in-out infinite; display: inline-block; }

        @keyframes starTwinkle {
          0%,100% { opacity: 0.2; }
          50%      { opacity: 1; }
        }
      `}</style>

      <div className="scene-container">
        <div className="cinematic-frame">
          {/* ──────────────── SCENE: INTRO ──────────────── */}
          {scene === "intro" && (
            <div
              className={`scene-fade ${fade ? "scene-visible" : "scene-hidden"}`}
              style={{
                position: "absolute",
                inset: 0,
                background: "#000",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div className="intro-bg" />

              {/* Stars */}
              {introStars.map((star) => (
                <div
                  key={star.id}
                  style={{
                    position: "absolute",
                    left: `${star.left}%`,
                    top: `${star.top}%`,
                    width: `${star.size}px`,
                    height: `${star.size}px`,
                    borderRadius: "50%",
                    background: "#FFD700",
                    animation: `starTwinkle ${star.dur}s ease-in-out ${star.delay}s infinite`,
                    pointerEvents: "none",
                  }}
                />
              ))}

              <div style={{ textAlign: "center", zIndex: 10, padding: "0 5%" }}>
                <div
                  className="lotus"
                  style={{
                    fontSize: "clamp(2rem, 6vw, 4rem)",
                    marginBottom: "0.5em",
                  }}
                >
                  🪷
                </div>
                <h1
                  className="text-gold-glow anim-fade-scale"
                  style={{
                    fontSize: "clamp(2.5rem, 8vw, 6rem)",
                    fontWeight: 700,
                    lineHeight: 1.2,
                    letterSpacing: "0.04em",
                    marginBottom: "0.4em",
                  }}
                >
                  श्री राधा कृष्ण
                </h1>
                <p
                  className="text-cream-glow anim-fade-up-delay"
                  style={{
                    fontSize: "clamp(1.2rem, 3.5vw, 2.4rem)",
                    letterSpacing: "0.2em",
                    fontWeight: 400,
                  }}
                >
                  ✦ Radhe Radhe ✦
                </p>
                <div
                  className="anim-fade-up-delay"
                  style={{
                    marginTop: "1.5em",
                    animationDelay: "1.2s",
                    opacity: 0,
                  }}
                >
                  <p
                    style={{
                      color: "rgba(255,215,0,0.55)",
                      fontSize: "clamp(0.7rem, 1.8vw, 1rem)",
                      letterSpacing: "0.3em",
                      fontFamily: "Cinzel, serif",
                      textTransform: "uppercase",
                    }}
                  >
                    A Divine Offering
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────── SCENE: KRISHNA ──────────────── */}
          {scene === "krishna" && (
            <div
              className={`scene-fade ${fade ? "scene-visible" : "scene-hidden"}`}
              style={{ position: "absolute", inset: 0, overflow: "hidden" }}
            >
              <div
                style={{ position: "absolute", inset: 0, overflow: "hidden" }}
              >
                <img
                  src="/assets/uploads/1af3c62a3a18d6fcaeb23bc69715e8f5-1.jpg"
                  alt="Shri Krishna"
                  className="img-fill kb-zoom"
                  style={{ transformOrigin: "center center" }}
                />
              </div>
              {/* divine aura overlay */}
              <div
                className="aura-gold anim-glow-pulse"
                style={{ position: "absolute", inset: 0 }}
              />
              {/* Blue accent aura */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(ellipse at center, transparent 50%, rgba(50,80,200,0.08) 80%, transparent 100%)",
                  animation: "glowPulse 4s ease-in-out infinite",
                }}
              />

              {/* Falling petals */}
              {petals.map((p) => (
                <div
                  key={p.id}
                  className="petal"
                  style={
                    {
                      left: `${p.left}%`,
                      width: `${p.size}px`,
                      height: `${p.size}px`,
                      background: p.color,
                      "--dur": `${p.duration}s`,
                      "--delay": `${p.delay}s`,
                      "--drift": `${p.drift}px`,
                    } as CSSVars
                  }
                />
              ))}

              {/* Bottom text */}
              <div
                style={{
                  position: "absolute",
                  bottom: "8%",
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  zIndex: 20,
                }}
              >
                <div
                  className="text-gold-glow anim-text-pulse"
                  style={{
                    fontSize: "clamp(2rem, 6vw, 4.5rem)",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                  }}
                >
                  श्री कृष्ण
                </div>
                <div
                  className="text-cream-glow"
                  style={{
                    fontSize: "clamp(0.8rem, 2vw, 1.4rem)",
                    letterSpacing: "0.3em",
                    marginTop: "0.4em",
                    fontFamily: "Cinzel",
                  }}
                >
                  SHRI KRISHNA
                </div>
              </div>

              {/* Top subtle text */}
              <div
                style={{
                  position: "absolute",
                  top: "5%",
                  right: "4%",
                  color: "rgba(255,215,0,0.4)",
                  fontSize: "clamp(0.6rem, 1.5vw, 0.9rem)",
                  fontFamily: "Cinzel",
                  letterSpacing: "0.2em",
                }}
              >
                🪷 Radhe Radhe 🪷
              </div>
            </div>
          )}

          {/* ──────────────── SCENE: RADHA ──────────────── */}
          {scene === "radha" && (
            <div
              className={`scene-fade ${fade ? "scene-visible" : "scene-hidden"}`}
              style={{ position: "absolute", inset: 0, overflow: "hidden" }}
            >
              <div
                style={{ position: "absolute", inset: 0, overflow: "hidden" }}
              >
                <img
                  src="/assets/uploads/8150d456648ec72ecdec75a41f20bef1-2.jpg"
                  alt="Shri Radha"
                  className="img-fill kb-pan"
                  style={{ transformOrigin: "center center" }}
                />
              </div>
              <div
                className="aura-pink anim-glow-pulse"
                style={{ position: "absolute", inset: 0 }}
              />

              {/* More petals */}
              {petals.map((p) => (
                <div
                  key={p.id}
                  className="petal"
                  style={
                    {
                      left: `${(p.left + 15) % 100}%`,
                      width: `${p.size}px`,
                      height: `${p.size}px`,
                      background: p.color,
                      "--dur": `${p.duration * 0.9}s`,
                      "--delay": `${p.delay * 0.8}s`,
                      "--drift": `${-p.drift}px`,
                    } as CSSVars
                  }
                />
              ))}

              {/* Bottom text */}
              <div
                style={{
                  position: "absolute",
                  bottom: "8%",
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  zIndex: 20,
                }}
              >
                <div
                  className="text-pink-glow anim-text-pulse"
                  style={{
                    fontSize: "clamp(2rem, 6vw, 4.5rem)",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    animation: "textPulse 2.5s ease-in-out infinite",
                    textShadow:
                      "0 0 20px rgba(255,179,198,0.9), 0 0 40px rgba(255,105,180,0.6), 0 0 80px rgba(255,182,193,0.3), 0 2px 4px rgba(0,0,0,0.8)",
                  }}
                >
                  श्री राधा
                </div>
                <div
                  style={{
                    color: "#FFD8E8",
                    fontSize: "clamp(0.8rem, 2vw, 1.4rem)",
                    letterSpacing: "0.3em",
                    marginTop: "0.4em",
                    fontFamily: "Cinzel",
                    textShadow:
                      "0 0 15px rgba(255,182,193,0.8), 0 2px 4px rgba(0,0,0,0.9)",
                  }}
                >
                  SHRI RADHA
                </div>
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "5%",
                  left: "4%",
                  color: "rgba(255,182,193,0.5)",
                  fontSize: "clamp(0.6rem, 1.5vw, 0.9rem)",
                  fontFamily: "Cinzel",
                  letterSpacing: "0.2em",
                }}
              >
                🌸 Radhe Shyam 🌸
              </div>
            </div>
          )}

          {/* ──────────────── SCENE: TOGETHER ──────────────── */}
          {scene === "together" && (
            <div
              className={`scene-fade ${fade ? "scene-visible" : "scene-hidden"}`}
              style={{
                position: "absolute",
                inset: 0,
                background: "#030008",
                overflow: "hidden",
              }}
            >
              {/* Two images side by side */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  gap: 0,
                }}
              >
                <div
                  style={{ flex: 1, overflow: "hidden", position: "relative" }}
                >
                  <img
                    src="/assets/uploads/1af3c62a3a18d6fcaeb23bc69715e8f5-1.jpg"
                    alt="Shri Krishna"
                    className="img-fill kb-out"
                    style={{ transformOrigin: "right center" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to right, transparent 60%, rgba(3,0,8,0.6) 100%)",
                    }}
                  />
                </div>
                <div
                  style={{ flex: 1, overflow: "hidden", position: "relative" }}
                >
                  <img
                    src="/assets/uploads/8150d456648ec72ecdec75a41f20bef1-2.jpg"
                    alt="Shri Radha"
                    className="img-fill kb-out"
                    style={{ transformOrigin: "left center" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to left, transparent 60%, rgba(3,0,8,0.6) 100%)",
                    }}
                  />
                </div>
              </div>

              {/* Together aura */}
              <div
                className="aura-together anim-glow-pulse"
                style={{ position: "absolute", inset: 0 }}
              />

              {/* Center divider glow */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "3px",
                  background:
                    "linear-gradient(to bottom, transparent, rgba(255,215,0,0.7) 30%, rgba(255,215,0,1) 50%, rgba(255,215,0,0.7) 70%, transparent)",
                  boxShadow:
                    "0 0 20px rgba(255,215,0,0.8), 0 0 40px rgba(255,215,0,0.4)",
                  zIndex: 5,
                }}
              />

              {/* Petals on both sides */}
              {petals.map((p) => (
                <div
                  key={p.id}
                  className="petal"
                  style={
                    {
                      left: `${p.left}%`,
                      width: `${p.size}px`,
                      height: `${p.size}px`,
                      background: p.color,
                      "--dur": `${p.duration}s`,
                      "--delay": `${p.delay}s`,
                      "--drift": `${p.drift}px`,
                    } as CSSVars
                  }
                />
              ))}

              {/* Rising sparkles */}
              {sparkles.map((s) => (
                <div
                  key={s.id}
                  className="sparkle"
                  style={
                    {
                      left: `${s.left}%`,
                      bottom: `${s.bottom}%`,
                      width: `${s.size}px`,
                      height: `${s.size}px`,
                      color: s.color,
                      background: s.color,
                      "--dur": `${s.duration}s`,
                      "--delay": `${s.delay}s`,
                    } as CSSVars
                  }
                />
              ))}

              {/* Top text */}
              <div
                style={{
                  position: "absolute",
                  top: "6%",
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  zIndex: 20,
                }}
              >
                <div
                  className="shimmer-text anim-text-pulse"
                  style={{
                    fontSize: "clamp(2.2rem, 7vw, 5.5rem)",
                    fontWeight: 700,
                    fontFamily: "'Noto Serif Devanagari', serif",
                    letterSpacing: "0.05em",
                    lineHeight: 1,
                  }}
                >
                  राधे कृष्ण
                </div>
              </div>

              {/* Bottom text */}
              <div
                style={{
                  position: "absolute",
                  bottom: "8%",
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  zIndex: 20,
                }}
              >
                <div
                  style={{
                    color: "rgba(255,215,0,0.7)",
                    fontSize: "clamp(0.7rem, 2vw, 1.2rem)",
                    fontFamily: "Cinzel",
                    letterSpacing: "0.4em",
                    textShadow: "0 0 10px rgba(255,215,0,0.5)",
                  }}
                >
                  ETERNAL DIVINE LOVE
                </div>
              </div>

              {/* Name labels */}
              <div
                style={{
                  position: "absolute",
                  bottom: "18%",
                  left: 0,
                  right: 0,
                  display: "flex",
                  justifyContent: "space-around",
                  zIndex: 20,
                  padding: "0 5%",
                }}
              >
                <div
                  className="text-gold-glow"
                  style={{
                    fontSize: "clamp(1.2rem, 3.5vw, 2.5rem)",
                    fontWeight: 600,
                  }}
                >
                  कृष्ण
                </div>
                <div
                  className="text-pink-glow"
                  style={{
                    fontSize: "clamp(1.2rem, 3.5vw, 2.5rem)",
                    fontWeight: 600,
                    textShadow:
                      "0 0 20px rgba(255,179,198,0.9), 0 0 40px rgba(255,105,180,0.6), 0 2px 4px rgba(0,0,0,0.8)",
                  }}
                >
                  राधा
                </div>
              </div>
            </div>
          )}

          {/* ──────────────── SCENE: OUTRO ──────────────── */}
          {scene === "outro" && (
            <div
              className={`scene-fade ${fade ? "scene-visible" : "scene-hidden"}`}
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse at center, #1a0e00 0%, #0d0700 50%, #000 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <div className="outro-bg" />

              {/* Stars */}
              {outroStars.map((star) => (
                <div
                  key={star.id}
                  style={{
                    position: "absolute",
                    left: `${star.left}%`,
                    top: `${star.top}%`,
                    width: `${star.size}px`,
                    height: `${star.size}px`,
                    borderRadius: "50%",
                    background: "#FFD700",
                    animation: `starTwinkle ${star.dur}s ease-in-out ${star.delay}s infinite`,
                    pointerEvents: "none",
                  }}
                />
              ))}

              {/* Rising sparkles in outro */}
              {sparkles.slice(0, 25).map((s) => (
                <div
                  key={s.id}
                  className="sparkle"
                  style={
                    {
                      left: `${s.left}%`,
                      bottom: `${s.bottom * 0.5}%`,
                      width: `${s.size * 0.7}px`,
                      height: `${s.size * 0.7}px`,
                      color: s.color,
                      background: s.color,
                      "--dur": `${s.duration}s`,
                      "--delay": `${s.delay * 0.5}s`,
                    } as CSSVars
                  }
                />
              ))}

              <div style={{ textAlign: "center", zIndex: 10, padding: "0 5%" }}>
                <div
                  style={{
                    fontSize: "clamp(2.5rem, 7vw, 5rem)",
                    marginBottom: "0.3em",
                  }}
                  className="anim-fade-scale"
                >
                  🙏
                </div>
                <h2
                  className="shimmer-text anim-fade-scale"
                  style={{
                    fontSize: "clamp(1.8rem, 5.5vw, 4.5rem)",
                    fontWeight: 700,
                    fontFamily: "Cinzel, serif",
                    letterSpacing: "0.05em",
                    lineHeight: 1.2,
                    marginBottom: "0.4em",
                  }}
                >
                  Jai Shri Krishna
                </h2>
                <div
                  className="text-gold-glow anim-fade-up-delay"
                  style={{
                    fontSize: "clamp(1.5rem, 4.5vw, 3.5rem)",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    marginBottom: "0.6em",
                  }}
                >
                  जय श्री कृष्ण
                </div>
                <div
                  className="anim-fade-up-delay"
                  style={{ animationDelay: "1s", opacity: 0 }}
                >
                  <p
                    style={{
                      color: "rgba(255,215,0,0.45)",
                      fontSize: "clamp(0.65rem, 1.6vw, 1rem)",
                      letterSpacing: "0.25em",
                      fontFamily: "Cinzel",
                      textTransform: "uppercase",
                      marginTop: "1em",
                    }}
                  >
                    Radhe Radhe • राधे राधे • Radhe Radhe
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────── PROGRESS BAR ──────────────── */}
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* ──────────────── SCENE DOTS ──────────────── */}
          <div className="scene-dots">
            {SCENES.map((s, i) => (
              <div
                key={s.id}
                className={`dot ${i === sceneIndex ? "active" : ""}`}
                data-ocid={"scene.tab"}
                onClick={() => goToScene(i)}
                onKeyDown={(e) => e.key === "Enter" && goToScene(i)}
                tabIndex={0}
                role="button"
                title={s.id}
              />
            ))}
          </div>

          {/* ──────────────── BRANDING ──────────────── */}
          <div
            style={{
              position: "absolute",
              top: "1.5%",
              left: "2%",
              color: "rgba(255,215,0,0.3)",
              fontSize: "clamp(0.5rem, 1.2vw, 0.75rem)",
              fontFamily: "Cinzel",
              letterSpacing: "0.2em",
              zIndex: 50,
              userSelect: "none",
            }}
          >
            🌺 RADHA KRISHNA 🌺
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          textAlign: "center",
          padding: "4px 0 6px",
          background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
          color: "rgba(255,215,0,0.35)",
          fontSize: "0.6rem",
          fontFamily: "Cinzel, serif",
          letterSpacing: "0.1em",
          zIndex: 200,
          pointerEvents: "none",
        }}
      >
        © {new Date().getFullYear()} · Built with{" "}
        <span style={{ color: "rgba(255,100,100,0.5)" }}>♥</span> using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
          style={{
            color: "rgba(255,215,0,0.45)",
            textDecoration: "none",
            pointerEvents: "all",
          }}
          target="_blank"
          rel="noopener noreferrer"
        >
          caffeine.ai
        </a>
      </div>
    </>
  );
}
