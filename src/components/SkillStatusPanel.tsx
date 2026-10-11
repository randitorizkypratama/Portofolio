import { Code2, Database, Wrench, Layers } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

interface Skill {
  name: string;
  usedIn?: string;
  usedInUrl?: string;
}

interface SkillCategory {
  name: string;
  icon: typeof Code2;
  skills: Skill[];
}

const skillCategories: SkillCategory[] = [
  {
    name: "FRONTEND",
    icon: Code2,
    skills: [
      { name: "Vue 3 Composition API", usedIn: "All projects", usedInUrl: "https://kpop-tracker-six.vercel.app/" },
      { name: "Nuxt 3 / Nuxt 4", usedIn: "HIBIKISHOP, DuelDex, Family Tree" },
      { name: "Tailwind CSS v3 / v4", usedIn: "All projects" },
      { name: "TypeScript", usedIn: "All projects" },
      { name: "Reka UI / shadcn-vue", usedIn: "HIBIKISHOP" },
      { name: "Responsive Design", usedIn: "All projects" },
    ],
  },
  {
    name: "BACKEND",
    icon: Layers,
    skills: [
      { name: "Nuxt Server Routes", usedIn: "HIBIKISHOP, Family Tree" },
      { name: "Elysia (Bun)", usedIn: "DuelDex API", usedInUrl: "https://dueldex-web.onrender.com/" },
      { name: "JWT Auth (HMAC-SHA256)", usedIn: "DuelDex" },
      { name: "REST API Design", usedIn: "DuelDex, HIBIKISHOP" },
      { name: "Rate Limiting & CSRF", usedIn: "Family Tree" },
    ],
  },
  {
    name: "DATABASE",
    icon: Database,
    skills: [
      { name: "Drizzle ORM", usedIn: "Family Tree" },
      { name: "Turso (libSQL / SQLite)", usedIn: "Family Tree, DuelDex" },
      { name: "Schema Design & Migrations", usedIn: "All projects" },
      { name: "Cron Jobs (Vercel)", usedIn: "HIBIKISHOP" },
    ],
  },
  {
    name: "TOOLING",
    icon: Wrench,
    skills: [
      { name: "Bun Runtime", usedIn: "All projects" },
      { name: "Monorepo (Bun Workspaces)", usedIn: "DuelDex, HIBIKISHOP" },
      { name: "Vitest", usedIn: "HIBIKISHOP" },
      { name: "Vercel Deployment", usedIn: "HIBIKISHOP, Family Tree" },
      { name: "Render Deployment", usedIn: "DuelDex" },
      { name: "Git & GitHub", usedIn: "All projects" },
    ],
  },
];

function SkillRow({ skill }: { skill: Skill }) {
  return (
    <div className="flex items-center justify-between gap-2 py-1 border-b border-border/30 last:border-0">
      <span className="retro-font text-[6px] text-cream">{skill.name}</span>
      {skill.usedIn && (
        <span className="retro-font text-[5px] text-text-secondary shrink-0 text-right">
          {skill.usedIn}
        </span>
      )}
    </div>
  );
}

export function SkillStatusPanel() {
  return (
    <section id="skills" className="py-16 sm:py-20 dot-grid">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="text-center mb-10">
            <span className="retro-font text-[8px] text-gold block mb-2">
              ✦ STATUS PANEL ✦
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-cream mb-2">
              Developer Skills
            </h2>
            <p className="text-text-secondary text-sm max-w-md mx-auto">
              Verified skills mapped to real project work.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-3 max-w-4xl mx-auto">
          {skillCategories.map((cat, i) => (
            <ScrollReveal key={cat.name} delay={i * 0.08}>
              <div className="game-border rounded-lg overflow-hidden">
                {/* Category header */}
                <div className="flex items-center gap-2 px-4 py-2 border-b-2 border-border bg-bg-main/40">
                  <cat.icon size={14} className="text-gold" />
                  <span className="pixel-font text-[8px] text-gold">
                    {cat.name}
                  </span>
                  <span className="retro-font text-[5px] text-text-secondary ml-auto">
                    {cat.skills.length} SKILLS
                  </span>
                </div>

                {/* Skills list */}
                <div className="px-4 py-2">
                  {cat.skills.map((skill) => (
                    <SkillRow key={skill.name} skill={skill} />
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Legend */}
        <ScrollReveal delay={0.3}>
          <p className="text-center retro-font text-[5px] text-text-secondary/50 mt-4">
            All skills verified through shipped projects — no fabricated percentages.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}