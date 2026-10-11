import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  const handleStart = useCallback(() => {
    setFadeOut(true);
    setTimeout(() => {
      setShow(false);
      onStart();
    }, 800);
  }, [onStart]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleStart();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleStart]);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="start-screen"
        initial={{ opacity: 1 }}
        animate={{ opacity: fadeOut ? 0 : 1 }}
        transition={{ duration: 0.8 }}
        onClick={handleStart}
      >
        {/* Background stars */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cream/30 rounded-full"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 53) % 100}%`,
                animationDelay: `${(i * 0.4) % 3}s`,
                opacity: 0.2 + (i % 5) * 0.15,
              }}
            />
          ))}
        </div>

        {/* Title */}
        <motion.div
          className="relative z-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Pixel art crown */}
          <div className="mb-6 flex justify-center">
            <svg width="48" height="32" viewBox="0 0 48 32" className="pixel-art">
              <rect x="8" y="20" width="32" height="8" fill="#d4a847" />
              <rect x="4" y="12" width="8" height="8" fill="#d4a847" />
              <rect x="20" y="4" width="8" height="16" fill="#d4a847" />
              <rect x="36" y="12" width="8" height="8" fill="#d4a847" />
              <rect x="12" y="8" width="8" height="4" fill="#e8c56d" />
              <rect x="28" y="8" width="8" height="4" fill="#e8c56d" />
              <rect x="6" y="14" width="4" height="4" fill="#e74c3c" />
              <rect x="22" y="6" width="4" height="4" fill="#3498db" />
              <rect x="38" y="14" width="4" height="4" fill="#2ecc71" />
            </svg>
          </div>

          <h1 className="pixel-font text-xl sm:text-2xl text-gold mb-2 tracking-wider">
            PIXEL QUEST
          </h1>
          <p className="retro-font text-[8px] sm:text-[10px] text-text-secondary mb-1">
            Developer Portfolio
          </p>
          <p className="retro-font text-[6px] sm:text-[8px] text-text-secondary/50 mb-12">
            v1.0
          </p>

          {/* PRESS START */}
          <div
            className="press-start cursor-pointer"
            onClick={handleStart}
            role="button"
            tabIndex={0}
            aria-label="Press start to enter portfolio"
          >
            <span className="retro-font text-[10px] sm:text-xs text-cream tracking-widest">
              ▶ PRESS START ◀
            </span>
          </div>

          <p className="retro-font text-[6px] text-text-secondary/40 mt-8">
            or press Enter / Space
          </p>
        </motion.div>

        {/* Bottom bar */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center">
          <p className="retro-font text-[6px] text-text-secondary/30">
            © {new Date().getFullYear()} FixDiriloe
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}