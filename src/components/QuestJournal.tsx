import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookMarked, X, Check, Circle, Fish } from "lucide-react";
import { sfx } from "../game/sfx";
import {
  JOURNAL_SECTIONS,
  JOURNAL_PROJECTS,
  getJournal,
  getCompletion,
  subscribeJournal,
} from "../game/journal";
import { FISH, getCaughtFish } from "../game/fishing";
import { getDaily, type DailyQuest } from "../game/daily";

export function QuestJournal() {
  const [open, setOpen] = useState(false);
  const [journal, setJournal] = useState(getJournal());
  const [caught, setCaught] = useState<string[]>(() => getCaughtFish());
  const [daily, setDaily] = useState<DailyQuest | null>(null);

  useEffect(() => subscribeJournal(() => setJournal(getJournal())), []);
  useEffect(() => {
    if (!open) return;
    setCaught(getCaughtFish());
    setDaily(getDaily());
  }, [open]);

  const pct = getCompletion(journal);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => {
          sfx.open();
          setOpen(true);
        }}
        className="fixed bottom-4 right-4 z-[55] game-border rounded-lg px-3 py-2 flex items-center gap-2 bg-bg-main/90 backdrop-blur-sm hover:border-gold/40 transition-colors"
        aria-label="Open quest journal"
      >
        <BookMarked size={14} className="text-gold" />
        <span className="retro-font text-[6px] text-gold hidden sm:inline">
          JOURNAL {pct}%
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-bg-main/80 backdrop-blur-sm"
              onClick={() => {
                sfx.close();
                setOpen(false);
              }}
            />
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              className="dialogue-box rounded-lg max-w-sm w-full relative z-10 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b-2 border-border bg-bg-main/40 sticky top-0">
                <div className="flex items-center gap-2">
                  <BookMarked size={14} className="text-gold" />
                  <span className="pixel-font text-[9px] text-cream">
                    QUEST JOURNAL
                  </span>
                </div>
                <button
                  onClick={() => {
                    sfx.close();
                    setOpen(false);
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded border border-border text-text-secondary hover:text-cream hover:border-gold/40 transition-all"
                  aria-label="Close journal"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="p-4 space-y-4">
                {/* Completion */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="retro-font text-[6px] text-text-secondary">
                      COMPLETION
                    </span>
                    <span className="retro-font text-[6px] text-gold">{pct}%</span>
                  </div>
                  <div className="h-2 bg-bg-main border border-border rounded-sm overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-xp to-gold transition-[width] duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Daily quest */}
                <div>
                  <h3 className="retro-font text-[6px] text-gold mb-2">
                    ✦ DAILY QUEST
                  </h3>
                  {daily ? (
                    <>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-cream">{daily.label}</span>
                        <span
                          className={`retro-font text-[6px] ${
                            daily.done ? "text-xp" : "text-gold"
                          }`}
                        >
                          {daily.done
                            ? "DONE ✓"
                            : `${daily.progress}/${daily.target}`}
                        </span>
                      </div>
                      <div className="h-2 bg-bg-main border border-border rounded-sm overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-xp to-gold transition-[width] duration-500"
                          style={{
                            width: `${Math.min(
                              100,
                              (daily.progress / daily.target) * 100
                            )}%`,
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-text-secondary/60">
                      A new quest arrives each day.
                    </p>
                  )}
                </div>

                {/* Sections */}
                <div>
                  <h3 className="retro-font text-[6px] text-gold mb-2">
                    ✦ PLACES VISITED
                  </h3>
                  <ul className="space-y-1.5">
                    {JOURNAL_SECTIONS.map((s) => {
                      const done = journal.sections.includes(s.id);
                      return (
                        <li key={s.id} className="flex items-center gap-2">
                          {done ? (
                            <Check size={11} className="text-xp shrink-0" />
                          ) : (
                            <Circle size={11} className="text-text-secondary/40 shrink-0" />
                          )}
                          <span
                            className={`text-xs ${
                              done ? "text-cream" : "text-text-secondary/60"
                            }`}
                          >
                            {s.label}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Projects */}
                <div>
                  <h3 className="retro-font text-[6px] text-gold mb-2">
                    ✦ QUESTS CLEARED
                  </h3>
                  <ul className="space-y-1.5">
                    {JOURNAL_PROJECTS.map((p) => {
                      const done = journal.projects.includes(p.id);
                      return (
                        <li key={p.id} className="flex items-center gap-2">
                          {done ? (
                            <Check size={11} className="text-xp shrink-0" />
                          ) : (
                            <Circle size={11} className="text-text-secondary/40 shrink-0" />
                          )}
                          <span
                            className={`text-xs ${
                              done ? "text-cream" : "text-text-secondary/60"
                            }`}
                          >
                            {p.label}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Fish log */}
                {caught.length > 0 && (
                  <div>
                    <h3 className="retro-font text-[6px] text-gold mb-2 flex items-center gap-1.5">
                      <Fish size={10} />
                      ✦ FISHING LOG {caught.length}/{FISH.length}
                    </h3>
                    <ul className="space-y-1.5">
                      {FISH.map((f) => {
                        const done = caught.includes(f.id);
                        return (
                          <li key={f.id} className="flex items-center gap-2">
                            {done ? (
                              <Check size={11} className="text-xp shrink-0" />
                            ) : (
                              <Circle size={11} className="text-text-secondary/40 shrink-0" />
                            )}
                            <span
                              className={`text-xs ${
                                done ? "text-cream" : "text-text-secondary/60"
                              }`}
                            >
                              {done ? f.name : "???"}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                <p className="retro-font text-[5px] text-text-secondary/60 leading-relaxed">
                  EXPLORE THE PAGE & THE WORLD — EVERY CORNER COUNTS.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
