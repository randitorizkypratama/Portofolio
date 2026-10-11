import { motion } from "motion/react";
import { ExternalLink } from "lucide-react";
import { projects, type Project } from "../data/portfolio";
import { ScrollReveal } from "./ScrollReveal";

function ProjectThumbnail({ color, title }: { color: string; title: string }) {
  return (
    <div
      className="relative aspect-video rounded-lg overflow-hidden"
      style={{ backgroundColor: `${color}10` }}
    >
      <svg
        viewBox="0 0 400 225"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <rect width="400" height="225" fill={`${color}08`} />
        {/* Grid pattern */}
        {Array.from({ length: 8 }).map((_, i) => (
          <line
            key={`h${i}`}
            x1="0"
            y1={i * 30}
            x2="400"
            y2={i * 30}
            stroke={color}
            strokeOpacity="0.05"
          />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={`v${i}`}
            x1={i * 35}
            y1="0"
            x2={i * 35}
            y2="225"
            stroke={color}
            strokeOpacity="0.05"
          />
        ))}
        {/* Center pixel art element */}
        <rect x="170" y="80" width="60" height="60" fill={color} opacity="0.15" rx="4" />
        <rect x="180" y="90" width="40" height="40" fill={color} opacity="0.2" rx="2" />
        <rect x="190" y="100" width="20" height="20" fill={color} opacity="0.4" rx="1" />
        {/* Title text */}
        <text
          x="200"
          y="165"
          textAnchor="middle"
          fill={color}
          fontSize="10"
          fontFamily="monospace"
          opacity="0.6"
        >
          {title}
        </text>
      </svg>
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <ScrollReveal delay={index * 0.1}>
      <motion.div
        className="glow-border rounded-xl overflow-hidden bg-bg-elevated group hover:shadow-card-hover transition-all duration-300"
        whileHover={{ y: -6 }}
        transition={{ duration: 0.25 }}
      >
        <ProjectThumbnail color={project.color} title={project.title} />
        <div className="p-5">
          <h3 className="font-semibold text-text-main mb-2 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-text-secondary mb-4 line-clamp-2">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-[10px] rounded-md bg-primary/10 text-primary border border-primary/20"
              >
                {tag}
              </span>
            ))}
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-accent transition-colors"
          >
            View Project
            <ExternalLink size={14} />
          </a>
        </div>
      </motion.div>
    </ScrollReveal>
  );
}

export function ProjectsSection() {
  return (
    <section id="projects" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="retro-font text-[10px] text-primary block mb-3">
              Featured Projects
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              Things I've Built
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}