import { motion } from "motion/react";
import { MapPin, Code, Gamepad2 } from "lucide-react";
import { siteConfig } from "../data/portfolio";
import { ScrollReveal } from "./ScrollReveal";
import { useLocale, pick } from "../i18n";
import { ui } from "../data/content";

const chips = [
  { icon: MapPin, label: siteConfig.location },
  { icon: Code, label: siteConfig.role },
  { icon: Gamepad2, labelKey: "interests" as const },
];

export function AboutSection() {
  const lang = useLocale();

  return (
    <section id="about" className="py-20 sm:py-28 dot-grid">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Workspace Image */}
          <ScrollReveal direction="left">
            <motion.div
              className="relative rounded-lg overflow-hidden border-2 border-border group"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <video
                src="/images/coding_workspace.mp4"
                aria-label="Developer workspace at night"
                className="w-full h-auto"
                autoPlay
                muted
                loop
                playsInline
              />

              {/* Animated code overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Screen glow */}
                <div className="absolute top-[15%] left-[25%] w-[50%] h-[40%] bg-primary/5 rounded blur-xl animate-pulse" />

                {/* Code lines appearing */}
                <div
                  className="absolute top-[22%] left-[30%] flex flex-col gap-1"
                >
                  <div
                    className="h-[3px] rounded bg-primary/40 anim-code-line"
                    style={{ "--w": "60px", animationDelay: "0s" } as React.CSSProperties}
                  />
                  <div
                    className="h-[3px] rounded bg-cyan/30 anim-code-line"
                    style={{ "--w": "45px", animationDelay: "0.4s" } as React.CSSProperties}
                  />
                  <div
                    className="h-[3px] rounded bg-accent/30 anim-code-line"
                    style={{ "--w": "70px", animationDelay: "0.8s" } as React.CSSProperties}
                  />
                  <div
                    className="h-[3px] rounded bg-primary/30 anim-code-line"
                    style={{ "--w": "35px", animationDelay: "1.2s" } as React.CSSProperties}
                  />
                  <div
                    className="h-[3px] rounded bg-cyan/40 anim-code-line"
                    style={{ "--w": "55px", animationDelay: "1.6s" } as React.CSSProperties}
                  />
                </div>

                {/* Blinking cursor */}
                <div
                  className="absolute top-[22%] w-[2px] h-[16px] bg-gold anim-cursor"
                />

                {/* Typing indicator dots */}
                <div className="absolute bottom-[30%] right-[20%] flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-xp anim-dot" />
                  <div className="w-1.5 h-1.5 rounded-full bg-xp anim-dot" style={{ animationDelay: "0.2s" }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-xp anim-dot" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-bg-main/50 via-transparent to-transparent" />
            </motion.div>
          </ScrollReveal>

          {/* Right - Content */}
          <ScrollReveal direction="right" delay={0.1}>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/images/avatar.webp"
                alt={siteConfig.name}
                className="w-9 h-9 rounded object-cover border-2 border-border anim-bob"
              />
              <span className="retro-font text-[8px] text-gold">
                {pick(ui.aboutMe, lang)}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 text-cream">
              {pick(ui.aboutTitleBefore, lang)}{" "}
              <span className="text-gold">{pick(ui.aboutTitleAccent, lang)}</span>{" "}
              {pick(ui.aboutTitleAfter, lang)}
            </h2>

            <p className="text-text-secondary leading-relaxed mb-8 text-sm">
              {pick(ui.aboutBody, lang)}
            </p>

            <div className="flex flex-wrap gap-2">
              {chips.map(({ icon: Icon, label, labelKey }) => (
                <div
                  key={labelKey ?? label}
                  className="flex items-center gap-2 px-3 py-1.5 rounded border-2 border-border bg-bg-elevated text-xs text-text-secondary"
                >
                  <Icon size={12} className="text-gold" />
                  {labelKey ? pick(ui[labelKey], lang) : label}
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}