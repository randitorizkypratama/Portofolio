import { motion } from "motion/react";
import { MapPin, Code, Gamepad2 } from "lucide-react";
import { siteConfig } from "../data/portfolio";
import { ScrollReveal } from "./ScrollReveal";

const chips = [
  { icon: MapPin, label: siteConfig.location },
  { icon: Code, label: siteConfig.role },
  { icon: Gamepad2, label: siteConfig.interests },
];

export function AboutSection() {
  return (
    <section id="about" className="py-20 sm:py-28 dot-grid">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Workspace Image */}
          <ScrollReveal direction="left">
            <motion.div
              className="relative rounded-lg overflow-hidden border-2 border-border"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src="/images/workspace.webp"
                alt="Developer workspace at night"
                className="w-full h-auto"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-main/50 via-transparent to-transparent" />
            </motion.div>
          </ScrollReveal>

          {/* Right - Content */}
          <ScrollReveal direction="right" delay={0.1}>
            <div className="flex items-center gap-3 mb-4">
              <motion.img
                src="/images/avatar.webp"
                alt={siteConfig.name}
                className="w-9 h-9 rounded object-cover border-2 border-border"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="retro-font text-[8px] text-gold">
                ✦ ABOUT ME ✦
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 text-cream">
              Turning Ideas into{" "}
              <span className="text-gold">Interactive</span>{" "}
              Experiences
            </h2>

            <p className="text-text-secondary leading-relaxed mb-8 text-sm">
              {siteConfig.aboutDescription}
            </p>

            <div className="flex flex-wrap gap-2">
              {chips.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-3 py-1.5 rounded border-2 border-border bg-bg-elevated text-xs text-text-secondary"
                >
                  <Icon size={12} className="text-gold" />
                  {label}
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}