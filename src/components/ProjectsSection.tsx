import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ExternalLink, Swords, Shield, TreePine, X, ChevronRight } from "lucide-react";
import { projects, type Project } from "../data/portfolio";
import { ScrollReveal } from "./ScrollReveal";

const questIcons: Record<string, typeof Swords> = {
  "kpop-photocard-tracker": Shield,
  dueldex: Swords,
  "family-tree": TreePine,
};

function CaseStudyModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const Icon = questIcons[project.slug] || Swords;

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-bg-main/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        className="dialogue-box rounded-lg max-w-2xl w-full max-h-[85vh] overflow-y-auto relative z-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b-2 border-border bg-bg-main/40 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Icon size={16} style={{ color: project.color }} />
            <span className="pixel-font text-[10px] text-cream">
              {project.title}
            </span>
            <span className="retro-font text-[5px] px-1.5 py-0.5 rounded bg-xp/15 text-xp border border-xp/30">
              ✓ CLEAR
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded border border-border text-text-secondary hover:text-cream hover:border-gold/40 transition-all"
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Screenshot */}
          <div className="rounded-lg overflow-hidden border-2 border-border">
            <img
              src={project.screenshot}
              alt={`${project.title} application screenshot`}
              className="w-full h-auto"
              loading="lazy"
            />
          </div>

          {/* Description */}
          <div>
            <h3 className="retro-font text-[7px] text-gold mb-2">
              OVERVIEW
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Problem */}
          <div>
            <h3 className="retro-font text-[7px] text-gold mb-2">
              PROBLEM
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {project.problem}
            </p>
          </div>

          {/* Key Features */}
          <div>
            <h3 className="retro-font text-[7px] text-gold mb-2">
              KEY FEATURES
            </h3>
            <ul className="space-y-1.5">
              {project.features.map((f, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-text-secondary"
                >
                  <ChevronRight
                    size={12}
                    className="text-gold mt-0.5 shrink-0"
                  />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Architecture */}
          <div>
            <h3 className="retro-font text-[7px] text-gold mb-2">
              ARCHITECTURE
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {project.architecture}
            </p>
          </div>

          {/* Tech tags */}
          <div>
            <h3 className="retro-font text-[7px] text-gold mb-2">
              TECH STACK
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="retro-font text-[6px] px-2 py-1 rounded bg-bg-main text-text-secondary border border-border"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="game-btn flex items-center gap-2 text-[7px] flex-1 justify-center"
            >
              <ExternalLink size={12} />
              LIVE DEMO
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function QuestCard({
  project,
  index,
  onSelect,
}: {
  project: Project;
  index: number;
  onSelect: () => void;
}) {
  const Icon = questIcons[project.slug] || Swords;

  return (
    <ScrollReveal delay={index * 0.1}>
      <motion.div
        className="game-border rounded-lg overflow-hidden group cursor-pointer"
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2 }}
        onClick={onSelect}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSelect();
        }}
        aria-label={`View ${project.title} case study`}
      >
        {/* Screenshot thumbnail */}
        <div className="aspect-video overflow-hidden border-b-2 border-border">
          <img
            src={project.screenshot}
            alt={`${project.title} preview`}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        {/* Quest header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-border/50 bg-bg-main/30">
          <div className="flex items-center gap-2">
            <Icon size={14} style={{ color: project.color }} />
            <span className="retro-font text-[5px] text-text-secondary">
              QUEST #{String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <span className="retro-font text-[5px] px-1.5 py-0.5 rounded bg-xp/15 text-xp border border-xp/30">
            ✓ CLEAR
          </span>
        </div>

        {/* Card body */}
        <div className="p-3">
          <h3 className="pixel-font text-[9px] text-cream group-hover:text-gold transition-colors mb-1.5">
            {project.title}
          </h3>
          <p className="text-xs text-text-secondary leading-relaxed mb-2.5 line-clamp-2">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-1 mb-2.5">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="retro-font text-[5px] px-1.5 py-0.5 rounded bg-bg-main text-text-secondary border border-border"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-gold group-hover:text-accent transition-colors">
            <ExternalLink size={11} />
            <span className="retro-font text-[6px]">VIEW CASE STUDY</span>
          </div>
        </div>
      </motion.div>
    </ScrollReveal>
  );
}

export function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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
              Click a quest to view the full case study.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, i) => (
            <QuestCard
              key={project.slug}
              project={project}
              index={i}
              onSelect={() => setSelectedProject(project)}
            />
          ))}
        </div>
      </div>

      {/* Case Study Modal */}
      <AnimatePresence>
        {selectedProject && (
          <CaseStudyModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}