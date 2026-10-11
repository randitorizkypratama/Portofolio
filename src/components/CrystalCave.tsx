import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { sfx } from "../game/sfx";

const BEST_KEY = "pq_cave_best";
const ROUND_SECS = 30;
const LANES = 5;

type Drop = { id: number; lane: number; y: number; kind: "gem" | "rock" };

export function CrystalCave({
  open,
  onClose,
  onEnd,
}: {
  open: boolean;
  onClose: () => void;
  onEnd: (score: number) => void;
}) {
  const [phase, setPhase] = useState<"playing" | "done">("playing");
  const [score, setScore] = useState(0);
  const [hp, setHp] = useState(3);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECS);
  const [lane, setLane] = useState(2);
  const [drops, setDrops] = useState<Drop[]>([]);
  const [best, setBest] = useState(() => Number(localStorage.getItem(BEST_KEY) || 0));
  const scoreRef = useRef(0);
  const hpRef = useRef(3);
  const laneRef = useRef(2);
  const dropsRef = useRef<Drop[]>([]);
  const nextId = useRef(1);
  const endedRef = useRef(false);

  const finish = useCallback(
    (finalScore: number) => {
      if (endedRef.current) return;
      endedRef.current = true;
      setPhase("done");
      setDrops([]);
      dropsRef.current = [];
      if (finalScore > best) {
        localStorage.setItem(BEST_KEY, String(finalScore));
        setBest(finalScore);
        sfx.achievement();
      }
      onEnd(finalScore);
    },
    [best, onEnd]
  );

  // Fresh round on open
  useEffect(() => {
    if (!open) return;
    endedRef.current = false;
    scoreRef.current = 0;
    hpRef.current = 3;
    laneRef.current = 2;
    dropsRef.current = [];
    setScore(0);
    setHp(3);
    setLane(2);
    setDrops([]);
    setTimeLeft(ROUND_SECS);
    setPhase("playing");
  }, [open]);

  // Countdown
  useEffect(() => {
    if (!open || phase !== "playing") return;
    const tick = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(tick);
  }, [open, phase]);

  useEffect(() => {
    if (open && phase === "playing" && timeLeft <= 0) finish(scoreRef.current);
  }, [open, phase, timeLeft, finish]);

  // Game loop: spawn + fall + collide
  useEffect(() => {
    if (!open || phase !== "playing") return;
    const loop = setInterval(() => {
      // Spawn a drop every tick (60% gem, 40% rock)
      const kind: Drop["kind"] = Math.random() < 0.6 ? "gem" : "rock";
      const spawn: Drop = {
        id: nextId.current++,
        lane: Math.floor(Math.random() * LANES),
        y: 0,
        kind,
      };
      const moved: Drop[] = [];
      for (const d of [...dropsRef.current, spawn]) {
        const y = d.y + 12;
        if (y >= 88) {
          if (d.lane === laneRef.current) {
            if (d.kind === "gem") {
              scoreRef.current += 1;
              setScore(scoreRef.current);
              sfx.link();
            } else {
              hpRef.current -= 1;
              setHp(hpRef.current);
              sfx.hit();
              if (hpRef.current <= 0) {
                finish(scoreRef.current);
                return;
              }
            }
          }
          continue;
        }
        moved.push({ ...d, y });
      }
      dropsRef.current = moved;
      setDrops(moved);
    }, 140);
    return () => clearInterval(loop);
  }, [open, phase, finish]);

  // Controls: keyboard (capture-phase so the world doesn't also move)
  useEffect(() => {
    if (!open || phase !== "playing") return;
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "arrowleft" || k === "a") {
        e.preventDefault();
        e.stopImmediatePropagation();
        laneRef.current = Math.max(0, laneRef.current - 1);
        setLane(laneRef.current);
      } else if (k === "arrowright" || k === "d") {
        e.preventDefault();
        e.stopImmediatePropagation();
        laneRef.current = Math.min(LANES - 1, laneRef.current + 1);
        setLane(laneRef.current);
      } else if (k === "escape") {
        e.stopImmediatePropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, phase, onClose]);

  const nudge = (dir: -1 | 1) => {
    laneRef.current = Math.max(0, Math.min(LANES - 1, laneRef.current + dir));
    setLane(laneRef.current);
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
          <div className="absolute inset-0 bg-bg-main/85 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="dialogue-box rounded-lg p-4 relative z-10 w-full max-w-[320px]"
            initial={{ scale: 0.92, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 12 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="pixel-font text-[9px] text-gold">CRYSTAL CAVERN</span>
              <button onClick={onClose} aria-label="Close" className="text-text-secondary hover:text-cream">
                <X size={14} />
              </button>
            </div>

            <div className="flex justify-between retro-font text-[7px] mb-2">
              <span className="text-cyan">💎 {score}</span>
              <span className="text-hp">{"♥".repeat(Math.max(0, hp))}</span>
              <span className={timeLeft <= 5 ? "text-hp animate-blink" : "text-text-secondary"}>
                {timeLeft}s
              </span>
              <span className="text-gold">BEST {best}</span>
            </div>

            {/* Cave shaft */}
            <div className="relative h-52 rounded border-2 border-border bg-bg-main overflow-hidden mb-2">
              {phase === "playing" && (
                <>
                  {drops.map((d) => (
                    <span
                      key={d.id}
                      className="absolute text-base leading-none select-none"
                      style={{
                        left: `calc(${(d.lane * 100) / LANES}% + ${50 / LANES}%)`,
                        top: `${d.y}%`,
                        transform: "translateX(-50%)",
                      }}
                    >
                      {d.kind === "gem" ? "💎" : "🪨"}
                    </span>
                  ))}
                  {/* Miner */}
                  <span
                    className="absolute bottom-1 text-xl leading-none select-none transition-[left] duration-100"
                    style={{
                      left: `calc(${(lane * 100) / LANES}% + ${50 / LANES}%)`,
                      transform: "translateX(-50%)",
                    }}
                  >
                    ⛏️
                  </span>
                </>
              )}
              {phase === "done" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-bg-main/80">
                  <p className="pixel-font text-[10px] text-gold">
                    {score >= best && score > 0 ? "NEW RECORD!" : "CAVE CLOSED"}
                  </p>
                  <p className="retro-font text-[7px] text-text-secondary">{score} gems mined</p>
                  <button className="game-btn text-[7px] py-1.5 px-4" onClick={() => {
                    endedRef.current = false;
                    scoreRef.current = 0;
                    hpRef.current = 3;
                    laneRef.current = 2;
                    setScore(0);
                    setHp(3);
                    setLane(2);
                    setTimeLeft(ROUND_SECS);
                    setPhase("playing");
                  }}>
                    DIVE AGAIN
                  </button>
                </div>
              )}
            </div>

            {/* Touch controls */}
            <div className="flex gap-2">
              <button
                className="flex-1 game-btn text-[8px] py-1.5"
                onClick={() => nudge(-1)}
                aria-label="Move left"
              >
                ◀
              </button>
              <button
                className="flex-1 game-btn text-[8px] py-1.5"
                onClick={() => nudge(1)}
                aria-label="Move right"
              >
                ▶
              </button>
            </div>
            <p className="retro-font text-[5px] text-text-secondary text-center mt-2">
              Mine gems, dodge rocks — ← → or A/D
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
