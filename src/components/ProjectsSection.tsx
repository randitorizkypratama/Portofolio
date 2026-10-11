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
    <ScrollReveal delay={index * 0.12}>
      <motion.div
        className="game-border rounded-lg overflow-hidden group cursor-pointer"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        onClick={() => window.open(project.url, "_blank")}
        role="link"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") window.open(project.url, "_blank");
        }}
      >
        {/* Quest header */}
        <div
          className="px-4 py-3 flex items-center gap-3 border-b-2 border-border"
          style={{ background: `linear-gradient(135deg, ${project.color}15, transparent)` }}
        >
          <div
            className="w-10 h-10 rounded flex items-center justify-center border-2"
            style={{ borderColor: `${project.color}40`, background: `${project.color}10` }}
          >
            <Icon size={18} style={{ color: project.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="pixel-font text-[9px] text-cream truncate">
                {project.title}
              </h3>
              <span className="retro-font text-[5px] px-1.5 py-0.5 rounded bg-xp/20 text-xp border border-xp/30">
                CLEAR
              </span>
            </div>
            <span className="retro-font text-[5px] text-text-secondary">
              QUEST #{String(index + 1).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Quest body */}
        <div className="px-4 py-3">
          <p className="text-xs text-text-secondary leading-relaxed mb-3 line-clamp-2">
            {project.description}
          </p>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="retro-font text-[5px] px-2 py-0.5 rounded bg-bg-main text-text-secondary border border-border"
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
      </motion.div>
    </ScrollReveal>
  );
}

export function ProjectsSection() {
  return (
    <section id="projects" className="py-20 sm:py-28 dot-grid">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="retro-font text-[8px] text-gold block mb-3">
              ✦ QUEST LOG ✦
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cream mb-3">
              Things I've Built
            </h2>
            <p className="text-text-secondary text-sm max-w-md mx-auto">
              Completed quests from my developer journey.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {projects.map((project, i) => (
            <QuestCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}