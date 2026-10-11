import { motion } from "motion/react";
import { ChevronDown, Mail, Code2, Database, Wrench } from "lucide-react";
import { siteConfig } from "../data/portfolio";
import { GithubIcon, XIcon, LinkedinIcon } from "./SocialIcons";

const socialIcons = [
  { icon: GithubIcon, href: siteConfig.socials.github, label: "GitHub" },
  { icon: XIcon, href: siteConfig.socials.x, label: "X" },
  { icon: LinkedinIcon, href: siteConfig.socials.linkedin, label: "LinkedIn" },
  { icon: Mail, href: `mailto:${siteConfig.email}`, label: "Email" },
];

const specializations = [
  { icon: Code2, label: "Frontend", detail: "Vue · Nuxt · Tailwind" },
  { icon: Database, label: "Backend & DB", detail: "Bun · Elysia · Turso · Drizzle" },
  { icon: Wrench, label: "Tooling", detail: "TypeScript · Vitest · Vercel" },
];

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-bg-main via-bg-secondary to-bg-main" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 w-full pt-24 pb-16 lg:pt-24 lg:pb-12">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 items-center">
          {/* Left - Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-shadow-hero"
          >
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-border bg-bg-elevated/60 backdrop-blur-sm mb-5">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-xp opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-xp" />
              </span>
              <span className="retro-font text-[7px] text-text-secondary">
                {siteConfig.location}
              </span>
              <span className="w-px h-3 bg-border" />
              <span className="retro-font text-[7px] text-gold">
                {siteConfig.role}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4 pixel-font text-cream">
              Building Digital{" "}
              <span className="text-gold">Worlds</span>
              <br />
              with Code
            </h1>

            <p className="text-text-secondary text-sm sm:text-base max-w-md mb-6 leading-relaxed">
              {siteConfig.description}
            </p>

            {/* Specialization chips */}
            <div className="flex flex-wrap gap-2 mb-6">
              {specializations.map(({ icon: Icon, label, detail }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-3 py-1.5 rounded border-2 border-border bg-bg-elevated/80 group"
                  title={detail}
                >
                  <Icon size={13} className="text-gold" />
                  <div>
                    <span className="pixel-font text-[7px] text-cream block leading-tight">
                      {label}
                    </span>
                    <span className="retro-font text-[5px] text-text-secondary leading-tight">
                      {detail}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <a href="#projects" className="game-btn text-center text-[8px]">
                ▸ View Projects
              </a>
              <a
                href="#contact"
                className="text-center text-[8px] retro-font px-4 py-2 border-2 border-border text-text-secondary hover:text-cream hover:border-gold/40 rounded transition-all"
              >
                ▸ Contact Me
              </a>
            </div>

            <div className="flex gap-2">
              {socialIcons.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 flex items-center justify-center rounded border-2 border-border text-text-secondary hover:text-gold hover:border-gold/40 transition-all"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right - Image */}
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1.1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <img
                src="/images/hero-bg.webp"
                alt="Pixel art fantasy landscape"
                className="w-full h-auto rounded-lg border-2 border-border shadow-pixel-glow"
                loading="eager"
              />
              {/* Partial overlay — left side blends into bg, right stays visible */}
              <div className="absolute inset-0 rounded-lg pointer-events-none"
                style={{
                  background: "linear-gradient(to right, #0f1923 0%, #0f1923cc 15%, #0f192355 35%, transparent 55%)",
                }}
              />
              {/* Bottom fade for depth */}
              <div className="absolute inset-x-0 bottom-0 h-1/4 rounded-b-lg pointer-events-none"
                style={{
                  background: "linear-gradient(to top, #0f1923aa, transparent)",
                }}
              />
              {/* Subtle top-left glow accent */}
              <div className="absolute top-2 left-2 w-16 h-16 rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(212,168,71,0.08), transparent 70%)",
                }}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown size={18} className="text-text-secondary/50" />
        </motion.div>
      </div>
    </section>
  );
}