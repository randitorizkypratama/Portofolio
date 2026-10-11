import { motion } from "motion/react";
import { Mail } from "lucide-react";
import { siteConfig, navLinks } from "../data/portfolio";
import { GithubIcon, XIcon, LinkedinIcon } from "./SocialIcons";

const socialIcons = [
  { icon: GithubIcon, href: siteConfig.socials.github, label: "GitHub" },
  { icon: XIcon, href: siteConfig.socials.x, label: "X" },
  { icon: LinkedinIcon, href: siteConfig.socials.linkedin, label: "LinkedIn" },
  { icon: Mail, href: `mailto:${siteConfig.email}`, label: "Email" },
];

export function Footer() {
  return (
    <footer className="border-t-2 border-border bg-bg-secondary/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <motion.img
              src="/images/avatar.webp"
              alt={siteConfig.name}
              className="w-6 h-6 rounded object-cover border border-border"
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ duration: 0.2 }}
            />
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
                {link.label}
              </a>
            ))}
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
            © {new Date().getFullYear()} {siteConfig.name} · Crafted with pixels and passion
          </p>
        </div>
      </div>
    </footer>
  );
}