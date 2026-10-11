import { motion } from "motion/react";
import { techStack, siteConfig } from "../data/portfolio";
import { ScrollReveal } from "./ScrollReveal";

function TechIcon({ name }: { name: string }) {
  const colors: Record<string, string> = {
    tanstack: "#EF4444",
    react: "#61DAFB",
    tailwind: "#06B6D4",
    motion: "#FFD700",
    typescript: "#3178C6",
    lucide: "#F4F6FF",
    zod: "#3056D3",
    rhf: "#EC5990",
    vite: "#646CFF",
    vercel: "#F4F6FF",
    playwright: "#2EAD33",
  };
  const letters: Record<string, string> = {
    tanstack: "T",
    react: "R",
    tailwind: "Tw",
    motion: "M",
    typescript: "Ts",
    lucide: "L",
    zod: "Z",
    rhf: "F",
    vite: "V",
    vercel: "▲",
    playwright: "P",
  };
  return (
    <div
      className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
      style={{ backgroundColor: `${colors[name]}15`, color: colors[name] }}
    >
      {letters[name]}
    </div>
  );
}

export function TechStackSection() {
  return (
    <section id="tech-stack" className="py-20 sm:py-28 dot-grid">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-10 items-start">
          {/* Left - Header + Avatar */}
          <ScrollReveal direction="left">
            <div className="lg:sticky lg:top-24">
              <span className="retro-font text-[10px] text-primary block mb-3">
                Tech Stack
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                Tools I Use
              </h2>
              <p className="text-text-secondary text-sm sm:text-base mb-6">
                I build my projects using modern technologies for faster,
                cleaner, and scalable web applications.
              </p>
              <motion.img
                src="/images/avatar.webp"
                alt={siteConfig.name}
                className="w-16 h-16 rounded-xl object-cover border border-border hidden lg:block"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </ScrollReveal>

          {/* Right - Tech Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {techStack.map((tech, i) => (
              <ScrollReveal key={tech.name} delay={i * 0.04} direction="right">
                <motion.div
                  className="glow-border rounded-xl p-4 bg-bg-elevated hover:bg-bg-secondary hover:shadow-card-hover transition-all group h-full"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <TechIcon name={tech.icon} />
                    <span className="font-semibold text-sm text-text-main group-hover:text-primary transition-colors">
                      {tech.name}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary">
                    {tech.description}
                  </p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}