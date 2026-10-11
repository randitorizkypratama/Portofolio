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
              className="relative rounded-lg overflow-hidden border-2 border-border group"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src="/images/workspace.webp"
                alt="Developer workspace at night"
                className="w-full h-auto"
                loading="lazy"
              />

              {/* Animated code overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Screen glow */}
                <div className="absolute top-[15%] left-[25%] w-[50%] h-[40%] bg-primary/5 rounded blur-xl animate-pulse" />

                {/* Code lines appearing */}
                <motion.div
                  className="absolute top-[22%] left-[30%] flex flex-col gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.div
                    className="h-[3px] rounded bg-primary/40"
                    animate={{ width: [0, 60, 60, 0] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
                  />
                  <motion.div
                    className="h-[3px] rounded bg-cyan/30"
                    animate={{ width: [0, 45, 45, 0] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 1, delay: 0.4 }}
                  />
                  <motion.div
                    className="h-[3px] rounded bg-accent/30"
                    animate={{ width: [0, 70, 70, 0] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 1, delay: 0.8 }}
                  />
                  <motion.div
                    className="h-[3px] rounded bg-primary/30"
                    animate={{ width: [0, 35, 35, 0] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 1, delay: 1.2 }}
                  />
                  <motion.div
                    className="h-[3px] rounded bg-cyan/40"
                    animate={{ width: [0, 55, 55, 0] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 1, delay: 1.6 }}
                  />
                </motion.div>

                {/* Blinking cursor */}
                <motion.div
                  className="absolute top-[22%] w-[2px] h-[16px] bg-gold"
                  animate={{
                    left: ["30%", "30%", "38%", "38%"],
                    opacity: [1, 1, 1, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                {/* Typing indicator dots */}
                <div className="absolute bottom-[30%] right-[20%] flex gap-1">
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-xp"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-xp"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-xp"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              </div>

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