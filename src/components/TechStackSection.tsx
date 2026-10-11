import { motion } from "motion/react";
import { techStack, siteConfig } from "../data/portfolio";
import { ScrollReveal } from "./ScrollReveal";

const itemColors: Record<string, string> = {
  tanstack: "#EF4444",
  react: "#61DAFB",
  tailwind: "#06B6D4",
  motion: "#d4a847",
  typescript: "#3178C6",
  lucide: "#f0e6d2",
  zod: "#3056D3",
  rhf: "#EC5990",
  vite: "#646CFF",
  vercel: "#f0e6d2",
  playwright: "#2EAD33",
};

const itemIcons: Record<string, string> = {
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

const itemRarity: Record<string, string> = {
  tanstack: "LEGENDARY",
  react: "EPIC",
  tailwind: "RARE",
  motion: "RARE",
  typescript: "EPIC",
  lucide: "COMMON",
  zod: "RARE",
  rhf: "UNCOMMON",
  vite: "EPIC",
  vercel: "LEGENDARY",
  playwright: "RARE",
};

const rarityColors: Record<string, string> = {
  COMMON: "#8a9bb0",
  UNCOMMON: "#27ae60",
  RARE: "#3498db",
  EPIC: "#9b59b6",
  LEGENDARY: "#d4a847",
};

export function TechStackSection() {
  return (
    <section id="tech-stack" className="py-20 sm:py-28 dot-grid">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-10 items-start">
          {/* Left - Header */}
          <ScrollReveal direction="left">
            <div className="lg:sticky lg:top-24">
              <span className="retro-font text-[8px] text-gold block mb-3">
                ✦ INVENTORY ✦
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cream mb-4">
                Tools I Use
              </h2>
              <p className="text-text-secondary text-sm mb-6">
                Equipment and skills acquired on my developer journey.
              </p>
              <motion.img
                src="/images/avatar.webp"
                alt={siteConfig.name}
                className="w-16 h-16 rounded-lg object-cover border-2 border-border hidden lg:block"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </ScrollReveal>

          {/* Right - Inventory Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {techStack.map((tech, i) => {
              const color = itemColors[tech.icon] || "#d4a847";
              const letter = itemIcons[tech.icon] || "?";
              const rarity = itemRarity[tech.icon] || "COMMON";
              const rarityColor = rarityColors[rarity];

              return (
                <ScrollReveal key={tech.name} delay={i * 0.04} direction="right">
                  <motion.div
                    className="game-border rounded-lg p-3 cursor-default group"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="flex items-start gap-2.5">
                      {/* Item icon */}
                      <div
                        className="w-9 h-9 rounded flex items-center justify-center text-xs font-bold border-2 shrink-0"
                        style={{
                          borderColor: `${color}40`,
                          background: `${color}12`,
                          color: color,
                        }}
                      >
                        {letter}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="pixel-font text-[7px] text-cream truncate leading-tight">
                          {tech.name}
                        </p>
                        <p className="retro-font text-[5px] truncate mt-0.5"
                          style={{ color: rarityColor }}
                        >
                          {rarity}
                        </p>
                      </div>
                    </div>
                    <p className="retro-font text-[5px] text-text-secondary mt-2 leading-relaxed">
                      {tech.description}
                    </p>
                  </motion.div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}