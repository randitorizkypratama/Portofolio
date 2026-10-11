import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Download, FileText, User, Trophy, Lock, Volume2, VolumeX, Music, Pause, Monitor, MonitorOff } from "lucide-react";
import { siteConfig } from "../data/portfolio";
import { ScrollReveal } from "./ScrollReveal";
import {
  ACHIEVEMENT_DEFS,
  getStats,
  getUnlockedIds,
  subscribe,
} from "../game/achievements";
import { trackAndNotify } from "../game/toast";
import { isSfxMuted, toggleSfxMuted } from "../game/sfx";
import { isBgmOn, toggleBgm } from "../game/music";
import { getTitle } from "../game/titles";
import { ITEMS, getInventory } from "../game/inventory";
import { useLocale, pick } from "../i18n";
import { ui } from "../data/content";

export function PlayerProfile() {
  const lang = useLocale();
  const [downloadState, setDownloadState] = useState<
    "idle" | "started" | "unavailable"
  >("idle");
  const [unlocked, setUnlocked] = useState<string[]>(() =>
    getUnlockedIds(getStats())
  );
  const [muted, setMuted] = useState(() => isSfxMuted());
  const [bgmOn, setBgmOn] = useState(() => isBgmOn());
  const [crtOn, setCrtOn] = useState(
    () => localStorage.getItem("pq_crt") !== "0"
  );
  const [title, setTitle] = useState(() => getTitle());
  const [inv, setInv] = useState<Record<string, number>>(() => getInventory());

  useEffect(
    () =>
      subscribe(() => {
        setUnlocked(getUnlockedIds(getStats()));
        setTitle(getTitle());
        setInv(getInventory());
      }),
    []
  );

  // Sync CRT state when toggled from the Header
  useEffect(() => {
    const onChange = (e: Event) => setCrtOn((e as CustomEvent<boolean>).detail);
    window.addEventListener("pq-crt-changed", onChange);
    return () => window.removeEventListener("pq-crt-changed", onChange);
  }, []);

  const handleToggleMute = useCallback(() => {
    setMuted(toggleSfxMuted());
  }, []);

  const handleToggleBgm = useCallback(() => {
    setBgmOn(toggleBgm());
  }, []);

  const handleToggleCrt = useCallback(() => {
    setCrtOn((prev) => {
      const next = !prev;
      localStorage.setItem("pq_crt", next ? "1" : "0");
      window.dispatchEvent(new CustomEvent("pq-crt-changed", { detail: next }));
      return next;
    });
  }, []);

  const handleDownload = useCallback(() => {
    const link = document.createElement("a");
    link.href = siteConfig.cvPath;
    link.download = siteConfig.cvFileName;

    fetch(siteConfig.cvPath, { method: "HEAD" })
      .then((res) => {
        if (res.ok) {
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setDownloadState("started");
          trackAndNotify("cv");
          setTimeout(() => setDownloadState("idle"), 3000);
        } else {
          setDownloadState("unavailable");
          setTimeout(() => setDownloadState("idle"), 4000);
        }
      })
      .catch(() => {
        setDownloadState("unavailable");
        setTimeout(() => setDownloadState("idle"), 4000);
      });
  }, []);

  return (
    <ScrollReveal>
      <div className="dialogue-box rounded-lg max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b-2 border-border bg-bg-main/40">
          <span className="retro-font text-[7px] text-gold">
            {pick(ui.playerProfile, lang)}
          </span>
          <span className="retro-font text-[5px] text-text-secondary">
            FILE #001
          </span>
        </div>

        {/* Body */}
        <div className="p-4">
          <div className="flex items-start gap-3 mb-4">
            {/* Avatar */}
            <motion.img
              src="/images/avatar.webp"
              alt={siteConfig.name}
              className="w-14 h-14 rounded border-2 border-border object-cover shrink-0"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="min-w-0">
              <h3 className="pixel-font text-[10px] text-cream leading-tight">
                {siteConfig.name}
              </h3>
              <p className="retro-font text-[6px] text-gold mt-0.5">
                {siteConfig.role}
              </p>
              <p className="retro-font text-[5px] text-text-secondary mt-1">
                {siteConfig.location}
              </p>
              <p className="retro-font text-[6px] text-accent mt-1">
                ★ {title}
              </p>
            </div>
          </div>

          {/* Document card */}
          <div className="flex items-center gap-3 p-3 rounded border-2 border-border bg-bg-main/60 mb-4">
            <div className="w-9 h-9 rounded flex items-center justify-center bg-primary/10 border border-primary/30 shrink-0">
              <FileText size={16} className="text-gold" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="pixel-font text-[7px] text-cream">CV / RESUME</p>
              <p className="retro-font text-[5px] text-text-secondary">
                PDF DOCUMENT
              </p>
            </div>
          </div>

          {/* Download button */}
          <motion.button
            onClick={handleDownload}
            className="game-btn w-full flex items-center justify-center gap-2 text-[8px] mb-2"
            whileHover={{ y: -2 }}
            whileTap={{ y: 2 }}
            transition={{ duration: 0.1 }}
            aria-label="Download CV PDF"
          >
            <Download size={14} />
            DOWNLOAD CV (PDF)
          </motion.button>

          {/* Secondary action */}
          <a
            href="#about"
            className="flex items-center justify-center gap-2 w-full py-1.5 retro-font text-[6px] text-text-secondary hover:text-cream border border-transparent hover:border-border rounded transition-all mb-3"
          >
            <User size={12} />
            VIEW PROFILE
          </a>

          {/* Sound toggles */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={handleToggleMute}
              className="flex-1 flex items-center justify-center gap-2 py-1.5 retro-font text-[6px] text-text-secondary hover:text-cream border border-border/50 hover:border-gold/40 rounded transition-all"
              aria-label={muted ? "Enable sound effects" : "Mute sound effects"}
            >
              {muted ? <VolumeX size={12} /> : <Volume2 size={12} />}
              {muted ? "SFX: OFF" : "SFX: ON"}
            </button>
            <button
              onClick={handleToggleBgm}
              className="flex-1 flex items-center justify-center gap-2 py-1.5 retro-font text-[6px] text-text-secondary hover:text-cream border border-border/50 hover:border-gold/40 rounded transition-all"
              aria-label={bgmOn ? "Turn off background music" : "Turn on background music"}
            >
              {bgmOn ? <Music size={12} /> : <Pause size={12} />}
              {bgmOn ? "MUSIC: ON" : "MUSIC: OFF"}
            </button>
            <button
              onClick={handleToggleCrt}
              className="flex-1 flex items-center justify-center gap-2 py-1.5 retro-font text-[6px] text-text-secondary hover:text-cream border border-border/50 hover:border-gold/40 rounded transition-all"
              aria-label={crtOn ? "Disable CRT effect" : "Enable CRT effect"}
            >
              {crtOn ? <Monitor size={12} /> : <MonitorOff size={12} />}
              {crtOn ? "CRT: ON" : "CRT: OFF"}
            </button>
          </div>

          {/* Inventory */}
          <div className="mb-3">
            <span className="retro-font text-[6px] text-gold block mb-1.5">
              {pick(ui.inventoryLabel, lang)}
            </span>
            {ITEMS.filter((it) => (inv[it.id] ?? 0) > 0).length === 0 ? (
              <p className="retro-font text-[5px] text-text-secondary/60">
                {pick(ui.inventoryEmpty, lang)}
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {ITEMS.filter((it) => (inv[it.id] ?? 0) > 0).map((it) => (
                  <span
                    key={it.id}
                    title={`${it.name} — ${it.desc}`}
                    className="retro-font text-[6px] text-cream border border-border/60 rounded px-2 py-1 bg-bg-main/50"
                  >
                    {it.icon} {it.name} x{inv[it.id]}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Achievements */}
          <div className="mb-1">
            <div className="flex items-center gap-2 mb-2">
              <Trophy size={11} className="text-gold" />
              <span className="retro-font text-[6px] text-gold">
                {pick(ui.achievementsLabel, lang)} {unlocked.length}/{ACHIEVEMENT_DEFS.length}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {ACHIEVEMENT_DEFS.map((a) => {
                const isUnlocked = unlocked.includes(a.id);
                return (
                  <div
                    key={a.id}
                    title={`${a.name} — ${a.desc}`}
                    className={`rounded border px-1.5 py-1 text-center ${
                      isUnlocked
                        ? "border-gold/50 bg-gold/10"
                        : "border-border/50 bg-bg-main/40 opacity-50"
                    }`}
                  >
                    {isUnlocked ? (
                      <Trophy size={10} className="text-gold mx-auto mb-0.5" />
                    ) : (
                      <Lock size={10} className="text-text-secondary mx-auto mb-0.5" />
                    )}
                    <p
                      className={`retro-font text-[4px] leading-tight ${
                        isUnlocked ? "text-gold" : "text-text-secondary"
                      }`}
                    >
                      {a.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status notification */}
          <AnimatePresence>
            {downloadState === "started" && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 text-center retro-font text-[6px] text-xp"
              >
                ✓ CV DOWNLOAD STARTED!
              </motion.div>
            )}
            {downloadState === "unavailable" && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 text-center retro-font text-[6px] text-hp"
              >
                ✕ CV NOT AVAILABLE YET
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-border/50">
          <p className="retro-font text-[5px] text-text-secondary/40 text-center">
            PDF DOCUMENT — /cv/FixDiriloe-CV.pdf
          </p>
        </div>
      </div>
    </ScrollReveal>
  );
}