import { useState } from "react";
import { motion } from "motion/react";
import { Mail } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { siteConfig, navLinks } from "../data/portfolio";
import { GithubIcon, XIcon, LinkedinIcon } from "./SocialIcons";
import { SlimeWhack } from "./SlimeWhack";
import { useLocale, pick } from "../i18n";
import { ui, navLabels } from "../data/content";

const socialIcons = [
  { icon: GithubIcon, href: siteConfig.socials.github, label: "GitHub" },
  { icon: XIcon, href: siteConfig.socials.x, label: "X" },
  { icon: LinkedinIcon, href: siteConfig.socials.linkedin, label: "LinkedIn" },
  { icon: Mail, href: `mailto:${siteConfig.email}`, label: "Email" },
];

export function Footer() {
  const lang = useLocale();
  const [showWhack, setShowWhack] = useState(false);

  return (
    <footer className="border-t-2 border-border bg-bg-secondary/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => setShowWhack(true)}
              title="???"
              aria-label="Secret: click the avatar"
              className="w-6 h-6 rounded object-cover border border-border cursor-pointer hover:border-gold/60 transition-colors"
              whileHover={{ rotate: 10, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <img
                src="/images/avatar.webp"
                alt={siteConfig.name}
                className="w-full h-full rounded object-cover"
              />
            </motion.button>
            <span className="pixel-font text-[8px] text-gold">
              {siteConfig.name}
            </span>
          </div>

          <nav className="flex flex-wrap justify-center gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="retro-font text-[6px] text-text-secondary hover:text-cream transition-colors"
              >
                {navLabels[link.label] ? pick(navLabels[link.label], lang) : link.label}
              </a>
            ))}
            <Link
              to="/uses"
              className="retro-font text-[6px] text-text-secondary hover:text-cream transition-colors"
            >
              {pick(ui.navUses, lang)}
            </Link>
          </nav>

          <div className="flex gap-2">
            {socialIcons.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-7 h-7 flex items-center justify-center rounded border border-border text-text-secondary hover:text-gold hover:border-gold/40 transition-all"
              >
                <Icon size={13} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="retro-font text-[6px] text-text-secondary">
            © {new Date().getFullYear()} {siteConfig.name} · {pick(ui.footerRights, lang)}
          </p>
        </div>
      </div>
      <SlimeWhack open={showWhack} onClose={() => setShowWhack(false)} />
    </footer>
  );
}