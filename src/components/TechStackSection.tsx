import { techStack } from "../data/portfolio";
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
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="retro-font text-[10px] text-primary block mb-3">
              Tech Stack
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              Tools I Use
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto text-sm sm:text-base">
              I build my projects using modern technologies for faster, cleaner,
              and scalable web applications.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
          {techStack.map((tech, i) => (
            <ScrollReveal key={tech.name} delay={i * 0.04}>
              <div className="glow-border rounded-xl p-4 bg-bg-elevated hover:bg-bg-secondary hover:shadow-card-hover transition-all group h-full">
                <div className="flex items-center gap-3 mb-2">
                  <TechIcon name={tech.icon} />
                  <span className="font-semibold text-sm text-text-main group-hover:text-primary transition-colors">
                    {tech.name}
                  </span>
                </div>
                <p className="text-xs text-text-secondary">
                  {tech.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}