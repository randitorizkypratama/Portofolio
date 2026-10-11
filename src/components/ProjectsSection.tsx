import { motion } from "motion/react";
import { ExternalLink, Swords, Shield, TreePine } from "lucide-react";
import { projects, type Project } from "../data/portfolio";
import { ScrollReveal } from "./ScrollReveal";

const questIcons: Record<string, typeof Swords> = {
  "kpop-photocard-tracker": Shield,
  dueldex: Swords,
  "family-tree": TreePine,
};

function QuestCard({ project, index }: { project: Project; index: number }) {
  const Icon = questIcons[project.slug] || Swords;

  return (
    <ScrollReveal delay={index * 0.1}>
      <motion.a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block game-border rounded-lg overflow-hidden group cursor-pointer no-underline"
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2 }}
      >
        {/* Quest header bar */}
        <div className="flex items-center justify-between px-3 py-2 border-b-2 border-border bg-bg-main/50">
          <span className="retro-font text-[5px] text-text-secondary">
            QUEST #{String(index + 1).padStart(2, "0")}
          </span>
          <span className="retro-font text-[5px] px-1.5 py-0.5 rounded bg-xp/15 text-xp border border-xp/30">
            ✓ CLEAR
          </span>
        </div>

        {/* Quest body */}
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded flex items-center justify-center border-2 shrink-0"
              style={{
                borderColor: `${project.color}40`,
                background: `${project.color}10`,
              }}
            >
              <Icon size={18} style={{ color: project.color }} />
            </div>
            <div className="min-w-0">
              <h3 className="pixel-font text-[9px] text-cream group-hover:text-gold transition-colors truncate">
                {project.title}
              </h3>
            </div>
          </div>

          <p className="text-xs text-text-secondary leading-relaxed mb-3 line-clamp-2">
            {project.description}
          </p>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="retro-font text-[5px] px-1.5 py-0.5 rounded bg-bg-main text-text-secondary border border-border"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action */}
          <div className="flex items-center gap-1.5 text-gold group-hover:text-accent transition-colors">
            <ExternalLink size={12} />
            <span className="retro-font text-[6px]">OPEN QUEST</span>
          </div>
        </div>
      </motion.a>
    </ScrollReveal>
  );
}

export function ProjectsSection() {
  return (
    <section id="projects" className="py-20 sm:py-28 dot-grid">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="text-center mb-10">
            <span className="retro-font text-[8px] text-gold block mb-2">
              ✦ QUEST LOG ✦
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cream mb-2">
              Things I've Built
            </h2>
            <p className="text-text-secondary text-sm max-w-md mx-auto">
              Completed quests from my developer journey. Click to explore.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, i) => (
            <QuestCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}