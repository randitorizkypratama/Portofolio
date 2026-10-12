import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Monitor, MonitorOff } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { navLinks, siteConfig } from "../data/portfolio";
import { sfx } from "../game/sfx";
import { LanguageToggle } from "./LanguageToggle";
import { useLocale, pick, type L } from "../i18n";
import { ui } from "../data/content";

const navLabels: Record<string, L> = {
  Home: ui.navHome,
  Explore: ui.navExplore,
  Projects: ui.navProjects,
  Skills: ui.navSkills,
  Contact: ui.navContact,
};

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [crtOn, setCrtOn] = useState(
    () => typeof localStorage !== "undefined" && localStorage.getItem("pq_crt") !== "0"
  );
  const lang = useLocale();

  const toggleCrt = () => {
    const next = !crtOn;
    setCrtOn(next);
    localStorage.setItem("pq_crt", next ? "1" : "0");
    window.dispatchEvent(new CustomEvent("pq-crt-changed", { detail: next }));
    sfx.hover();
  };

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setScrolled(window.scrollY > 20);
        const sections = navLinks.map((l) => l.href.replace("#", ""));
        for (let i = sections.length - 1; i >= 0; i--) {
          const el = document.getElementById(sections[i]);
          if (el && el.getBoundingClientRect().top <= 120) {
            setActiveSection(sections[i]);
            break;
          }
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Sync CRT toggle when changed from PlayerProfile pause menu
  useEffect(() => {
    const onChange = (e: Event) => setCrtOn((e as CustomEvent<boolean>).detail);
    window.addEventListener("pq-crt-changed", onChange);
    return () => window.removeEventListener("pq-crt-changed", onChange);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg-main/95 backdrop-blur-sm border-b-2 border-border"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Left - Brand */}
        <a href="#home" className="flex items-center gap-3 group">
          <motion.img
            src="/images/avatar.webp"
            alt={siteConfig.name}
            className="w-8 h-8 rounded object-cover border-2 border-border"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.15 }}
          />
          <div className="hidden sm:flex flex-col">
            <span className="pixel-font text-[9px] text-gold leading-tight group-hover:text-accent transition-colors">
              {siteConfig.name}
            </span>
            <span className="retro-font text-[5px] text-text-secondary leading-tight">
              LVL 99 DEV
            </span>
          </div>
        </a>

        {/* Center - Nav Links (Desktop) */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onMouseEnter={() => sfx.hover()}
                className={`px-3 py-1.5 text-xs pixel-font rounded transition-all ${
                  activeSection === link.href.replace("#", "")
                    ? "text-gold bg-gold/10 border border-gold/30"
                    : "text-text-secondary hover:text-cream hover:bg-white/5 border border-transparent"
                }`}
              >
                {navLabels[link.label] ? pick(navLabels[link.label], lang) : link.label}
              </a>
            </li>
          ))}
          <li>
            <Link
              to="/uses"
              onMouseEnter={() => sfx.hover()}
              className="px-3 py-1.5 text-xs pixel-font rounded transition-all text-text-secondary hover:text-cream hover:bg-white/5 border border-transparent"
            >
              {pick(ui.navUses, lang)}
            </Link>
          </li>
        </ul>

        {/* Right - Status + Download */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageToggle />
          <button
            onClick={toggleCrt}
            onMouseEnter={() => sfx.hover()}
            aria-label={crtOn ? "Disable CRT scanlines" : "Enable CRT scanlines"}
            title={crtOn ? "CRT: ON" : "CRT: OFF"}
            className="w-7 h-7 flex items-center justify-center rounded border border-border text-text-secondary hover:text-gold hover:border-gold/40 transition-all"
          >
            {crtOn ? <Monitor size={12} /> : <MonitorOff size={12} />}
          </button>
          {/* Mini status bars */}
          <div className="flex flex-col gap-0.5 w-16">
            <div className="flex items-center gap-1">
              <span className="retro-font text-[5px] text-hp">HP</span>
              <div className="flex-1 h-1.5 bg-bg-main border border-border rounded-sm overflow-hidden">
                <div className="bar-hp h-full w-[90%] rounded-sm" />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="retro-font text-[5px] text-mp">MP</span>
              <div className="flex-1 h-1.5 bg-bg-main border border-border rounded-sm overflow-hidden">
                <div className="bar-mp h-full w-[75%] rounded-sm" />
              </div>
            </div>
          </div>

          {/* Open for Work badge */}
          {siteConfig.availableForWork && (
            <div
              className="flex items-center gap-1.5 px-2 py-1 rounded border border-green-500/50 bg-green-500/10"
              title="Available for freelance projects"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="retro-font text-[5px] text-green-400 whitespace-nowrap">OPEN FOR WORK</span>
            </div>
          )}

          <a
            href={siteConfig.cvPath}
            download={siteConfig.cvFileName}
            onMouseEnter={() => sfx.hover()}
            className="game-btn text-[7px] py-1 px-3"
          >
            CV
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-text-secondary hover:text-cream"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-bg-main/95 backdrop-blur-sm border-b-2 border-border overflow-hidden"
          >
            <ul className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2 text-xs pixel-font rounded transition-colors ${
                      activeSection === link.href.replace("#", "")
                        ? "text-gold bg-gold/10"
                        : "text-text-secondary hover:text-cream"
                    }`}
                  >
                    {navLabels[link.label] ? pick(navLabels[link.label], lang) : link.label}
                  </a>
                </li>
              ))}
              <li className="pt-2 mt-1 border-t border-border/50">
                <Link
                  to="/uses"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-xs pixel-font rounded text-text-secondary hover:text-cream"
                >
                  {pick(ui.navUses, lang)}
                </Link>
              </li>
              <li className="px-3 pt-1 flex items-center gap-2">
                <LanguageToggle />
                <button
                  onClick={toggleCrt}
                  aria-label={crtOn ? "Disable CRT scanlines" : "Enable CRT scanlines"}
                  className="w-7 h-7 flex items-center justify-center rounded border border-border text-text-secondary hover:text-gold hover:border-gold/40 transition-all"
                >
                  {crtOn ? <Monitor size={12} /> : <MonitorOff size={12} />}
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}