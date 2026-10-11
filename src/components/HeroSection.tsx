import { motion } from "motion/react";
import { Heart, ArrowDown, Mail } from "lucide-react";
import { siteConfig } from "../data/portfolio";
import { GithubIcon, XIcon, LinkedinIcon } from "./SocialIcons";

const socialIcons = [
  { icon: GithubIcon, href: siteConfig.socials.github, label: "GitHub" },
  { icon: XIcon, href: siteConfig.socials.x, label: "X" },
  { icon: LinkedinIcon, href: siteConfig.socials.linkedin, label: "LinkedIn" },
  { icon: Mail, href: `mailto:${siteConfig.email}`, label: "Email" },
];

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Full-bleed pixel art background */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-bg.webp"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center"
        />
        {/* Gradient overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg-main via-bg-main/80 to-bg-main/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-main via-transparent to-bg-main/40" />
      </div>

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 w-full py-20 lg:py-0">
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 mb-4"
          >
            <Heart size={16} className="text-accent fill-accent" />
            <span className="retro-font text-[8px] sm:text-[10px] text-text-secondary tracking-wider">
                Hi, I'm {siteConfig.name}
              </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6 pixel-font"
          >
            Building Digital{" "}
            <span className="gradient-text">Worlds</span>
            <br />
            with Code
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-text-secondary text-base sm:text-lg max-w-lg mb-8"
          >
            {siteConfig.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 mb-8"
          >
            <a
              href="#projects"
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 shadow-pixel-btn hover:shadow-pixel-glow transition-all text-sm text-center"
            >
              View My Projects
            </a>
            <a
              href="#contact"
              className="px-6 py-3 border border-border text-text-main rounded-lg font-medium hover:border-primary/50 hover:bg-white/5 transition-all text-sm text-center"
            >
              Contact Me
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex gap-3"
          >
            {socialIcons.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-border text-text-secondary hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                <Icon size={18} />
              </a>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown size={20} className="text-text-secondary" />
        </motion.div>
      </div>
    </section>
  );
}