import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { sfx } from "../game/sfx";

const BEST_KEY = "pq_slime_whack_best";
const ROUND_SECS = 20;
const CELLS = 9;

type Phase = "idle" | "playing" | "done";

export function SlimeWhack({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECS);
  const [active, setActive] = useState<number | null>(null);
  const [best, setBest] = useState(() => Number(localStorage.getItem(BEST_KEY) || 0));
  const scoreRef = useRef(0);
  const activeRef = useRef<number | null>(null);

  const startRound = () => {
    scoreRef.current = 0;
    setScore(0);
    setTimeLeft(ROUND_SECS);
    setActive(null);
    activeRef.current = null;
    setPhase("playing");
  };

  // Open → start a fresh round
  useEffect(() => {
    if (open) startRound();
    else setPhase("idle");
  }, [open]);

  // Countdown
  useEffect(() => {
    if (phase !== "playing") return;
    const tick = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(tick);
  }, [phase]);

  // Round over when the clock hits zero
  useEffect(() => {
    if (phase !== "playing" || timeLeft > 0) return;
    setActive(null);
    activeRef.current = null;
    setPhase("done");
    if (scoreRef.current > best) {
      localStorage.setItem(BEST_KEY, String(scoreRef.current));
      setBest(scoreRef.current);
      sfx.achievement();
    } else {
      sfx.close();
    }
  }, [phase, timeLeft, best]);

  // Slime hops to a new tile
  useEffect(() => {
    if (phase !== "playing") return;
    const hop = setInterval(() => {
      setActive((cur) => {
        let next = cur;
        while (next === cur || next === null) next = Math.floor(Math.random() * CELLS);
        activeRef.current = next;
        return next;
      });
    }, 650);
    return () => clearInterval(hop);
  }, [phase]);

  const whack = (i: number) => {
    if (phase !== "playing" || activeRef.current !== i) return;
    scoreRef.current += 1;
    setScore(scoreRef.current);
    sfx.hit();
    setActive(null);
    activeRef.current = null;
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-bg-main/80 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="dialogue-box rounded-lg p-4 relative z-10 w-full max-w-[280px]"
            initial={{ scale: 0.9, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 12 }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="pixel-font text-[9px] text-gold">SLIME WHACK</span>
              <button onClick={onClose} aria-label="Close" className="text-text-secondary hover:text-cream">
                <X size={14} />
              </button>
            </div>

            <div className="flex justify-between retro-font text-[7px] mb-3">
              <span className="text-xp">SCORE {score}</span>
              <span className={timeLeft <= 5 ? "text-hp animate-blink" : "text-text-secondary"}>
                {timeLeft}s
              </span>
              <span className="text-gold">BEST {best}</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 mb-3">
              {Array.from({ length: CELLS }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => whack(i)}
                  className="aspect-square rounded border border-border bg-bg-elevated hover:border-gold/40 transition-colors flex items-center justify-center select-none"
                  aria-label="Whack tile"
                >
                  {active === i && <span className="whack-slime text-xl leading-none">👾</span>}
                </button>
              ))}
            </div>

            {phase === "done" ? (
              <div className="text-center">
                <p className="retro-font text-[7px] text-cream mb-2">
                  {score >= best && score > 0 ? "NEW RECORD!" : "TIME UP!"} — {score} whacked
                </p>
                <button className="game-btn text-[7px] py-1.5 px-4" onClick={startRound}>
                  PLAY AGAIN
                </button>
              </div>
            ) : (
              <p className="retro-font text-[6px] text-text-secondary text-center">
                Whack the wild slime before it escapes!
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
