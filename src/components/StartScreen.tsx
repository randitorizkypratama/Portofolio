import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

interface StartScreenProps {
  onStart: () => void;
  onSkip: () => void;
}

export function StartScreen({ onStart, onSkip }: StartScreenProps) {
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  const handleStart = useCallback(() => {
    setFadeOut(true);
    setTimeout(() => {
      setShow(false);
      onStart();
    }, 600);
  }, [onStart]);

  const handleSkip = useCallback(() => {
    setFadeOut(true);
    setTimeout(() => {
      setShow(false);
      onSkip();
    }, 600);
  }, [onSkip]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleStart();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        handleSkip();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleStart, handleSkip]);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="start-screen cursor-pointer"
        initial={{ opacity: 1 }}
        animate={{ opacity: fadeOut ? 0 : 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Stars */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 25 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                left: `${(i * 41) % 100}%`,
                top: `${(i * 57) % 100}%`,
                opacity: 0.15 + (i % 4) * 0.12,
                backgroundColor: i % 7 === 0 ? "#d4a847" : "#f0e6d2",
              }}
            />
          ))}
        </div>

        {/* Content */}
        <motion.div
          className="relative z-10 text-center max-w-md px-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Crown */}
          <div className="mb-4 flex justify-center">
            <svg width="40" height="28" viewBox="0 0 48 32" className="pixel-art">
              <rect x="8" y="20" width="32" height="8" fill="#d4a847" />
              <rect x="4" y="12" width="8" height="8" fill="#d4a847" />
              <rect x="20" y="4" width="8" height="16" fill="#d4a847" />
              <rect x="36" y="12" width="8" height="8" fill="#d4a847" />
              <rect x="6" y="14" width="4" height="4" fill="#e74c3c" />
              <rect x="22" y="6" width="4" height="4" fill="#3498db" />
              <rect x="38" y="14" width="4" height="4" fill="#2ecc71" />
            </svg>
          </div>

          <h1 className="pixel-font text-xl sm:text-2xl text-gold mb-1 tracking-wider">
            PIXEL QUEST
          </h1>
          <p className="retro-font text-[8px] text-text-secondary mb-1">
            Developer Portfolio
          </p>
          <p className="retro-font text-[6px] text-text-secondary/40 mb-6">
            v1.0
          </p>

          {/* Objective */}
          <div className="dialogue-box rounded-lg p-4 mb-6 text-left">
            <p className="retro-font text-[7px] text-cream leading-relaxed mb-3">
              Explore the world to discover my projects, technical skills, and experience.
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="retro-font text-[6px] px-1.5 py-0.5 bg-bg-main border border-border rounded text-gold">WASD</span>
                <span className="retro-font text-[6px] text-text-secondary">Move</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="retro-font text-[6px] px-1.5 py-0.5 bg-bg-main border border-border rounded text-gold">E</span>
                <span className="retro-font text-[6px] text-text-secondary">Interact</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="retro-font text-[6px] px-1.5 py-0.5 bg-bg-main border border-border rounded text-gold">ESC</span>
                <span className="retro-font text-[6px] text-text-secondary">Menu</span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 items-center">
            <button
              onClick={handleStart}
              className="game-btn text-[9px] w-full max-w-[240px]"
              autoFocus
            >
              ▶ START EXPLORING
            </button>
            <button
              onClick={handleSkip}
              className="retro-font text-[7px] text-text-secondary hover:text-cream px-4 py-2 border border-border hover:border-gold/40 rounded transition-all w-full max-w-[240px]"
            >
              SKIP GAME — VIEW PORTFOLIO
            </button>
          </div>

          <p className="retro-font text-[5px] text-text-secondary/30 mt-4">
            Enter / Space — Start · Esc — Skip
          </p>
        </motion.div>

        {/* Footer */}
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <p className="retro-font text-[5px] text-text-secondary/25">
            © {new Date().getFullYear()} FixDiriloe
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}