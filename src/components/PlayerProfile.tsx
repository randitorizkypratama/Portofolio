import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Download, FileText, User } from "lucide-react";
import { siteConfig } from "../data/portfolio";
import { ScrollReveal } from "./ScrollReveal";

export function PlayerProfile() {
  const [downloadState, setDownloadState] = useState<
    "idle" | "started" | "unavailable"
  >("idle");

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
      <div className="dialogue-box rounded-lg max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b-2 border-border bg-bg-main/40">
          <span className="retro-font text-[7px] text-gold">
            ✦ PLAYER PROFILE ✦
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
            className="flex items-center justify-center gap-2 w-full py-1.5 retro-font text-[6px] text-text-secondary hover:text-cream border border-transparent hover:border-border rounded transition-all"
          >
            <User size={12} />
            VIEW PROFILE
          </a>

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