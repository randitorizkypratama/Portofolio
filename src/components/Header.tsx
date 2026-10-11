import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { navLinks, siteConfig } from "../data/portfolio";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = navLinks.map((l) => l.href.replace("#", ""));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
                className={`px-3 py-1.5 text-xs pixel-font rounded transition-all ${
                  activeSection === link.href.replace("#", "")
                    ? "text-gold bg-gold/10 border border-gold/30"
                    : "text-text-secondary hover:text-cream hover:bg-white/5 border border-transparent"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right - Status + Download */}
        <div className="hidden md:flex items-center gap-3">
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

          <a
            href={siteConfig.cvPath}
            download={siteConfig.cvFileName}
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
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}