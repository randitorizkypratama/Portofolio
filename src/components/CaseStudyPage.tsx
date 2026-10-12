import { Link, useParams } from "@tanstack/react-router";
import {
  ExternalLink,
  Swords,
  Shield,
  TreePine,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { GithubIcon } from "./SocialIcons";
import { projects } from "../data/portfolio";
import { caseStudyExtras, projectCopy, ui } from "../data/content";
import { useLocale, pick } from "../i18n";
import { sfx } from "../game/sfx";

const questIcons: Record<string, typeof Swords> = {
  "kpop-photocard-tracker": Shield,
  dueldex: Swords,
  "family-tree": TreePine,
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="retro-font text-[7px] text-gold mb-3">{title.toUpperCase()}</h2>
      {children}
    </div>
  );
}

export function CaseStudyPage() {
  const { slug } = useParams({ from: "/projects/$slug" });
  const lang = useLocale();
  const project = projects.find((p) => p.slug === slug);
  const extra = caseStudyExtras[slug];

  if (!project) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-32 text-center">
        <h1 className="pixel-font text-sm text-cream mb-3">QUEST NOT FOUND</h1>
        <p className="text-text-secondary text-sm mb-6">
          This case study doesn't exist in the journal.
        </p>
        <Link to="/" className="game-btn text-[8px] inline-block">
          {pick(ui.backHome, lang)}
        </Link>
      </div>
    );
  }

  const Icon = questIcons[project.slug] || Swords;
  const copy = projectCopy[project.slug];
  const desc = copy ? pick(copy.description, lang) : project.description;
  const problem = copy ? pick(copy.problem, lang) : project.problem;
  const features = copy
    ? copy.features.map((f) => pick(f, lang))
    : project.features;
  const arch = copy ? pick(copy.architecture, lang) : project.architecture;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    url: `https://pixel-quest-portfolio.vercel.app/projects/${project.slug}`,
    author: { "@type": "Person", name: "FixDiriloe" },
    keywords: project.tags.join(", "),
  };

  return (
    <article className="pt-20 pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back link */}
        <Link
          to="/"
          className="retro-font text-[6px] text-text-secondary hover:text-gold inline-flex items-center gap-1.5 mb-8 transition-colors"
          onMouseEnter={() => sfx.hover()}
        >
          <ArrowLeft size={11} />
          {pick(ui.backHome, lang)}
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Icon size={18} style={{ color: project.color }} />
            <span className="retro-font text-[6px] px-2 py-0.5 rounded bg-xp/15 text-xp border border-xp/30">
              ✓ {pick(ui.caseStudyLabel, lang)}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-cream mb-2 pixel-font">
            {project.title}
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            {desc}
          </p>
        </header>

        {/* Screenshot */}
        <div className="rounded-lg overflow-hidden border-2 border-border mb-8 shadow-pixel-glow">
          <img
            src={project.screenshot}
            alt={`${project.title} preview`}
            className="w-full h-auto"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="space-y-8">
          <Section title={pick(ui.overview, lang)}>
            <p className="text-sm text-text-secondary leading-relaxed">
              {desc}
            </p>
          </Section>

          <Section title={pick(ui.problem, lang)}>
            <p className="text-sm text-text-secondary leading-relaxed">
              {problem}
            </p>
          </Section>

          {extra && (
            <>
              <Section title={pick(ui.challenge, lang)}>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {pick(extra.challenge, lang)}
                </p>
              </Section>

              <Section title={pick(ui.solution, lang)}>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {pick(extra.solution, lang)}
                </p>
              </Section>

              <Section title={pick(ui.results, lang)}>
                <ul className="space-y-2">
                  {extra.results.map((r, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-text-secondary"
                    >
                      <ChevronRight size={12} className="text-xp mt-0.5 shrink-0" />
                      {pick(r, lang)}
                    </li>
                  ))}
                </ul>
              </Section>
            </>
          )}

          <Section title={pick(ui.keyFeatures, lang)}>
            <ul className="space-y-2">
              {features.map((f, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-text-secondary"
                >
                  <ChevronRight size={12} className="text-gold mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </Section>

          <Section title={pick(ui.architecture, lang)}>
            <p className="text-sm text-text-secondary leading-relaxed">
              {arch}
            </p>
          </Section>

          <Section title={pick(ui.techStack, lang)}>
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
          </Section>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mt-10 pt-6 border-t border-border/50">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="game-btn flex items-center gap-2 text-[7px]"
            onMouseEnter={() => sfx.hover()}
          >
            <ExternalLink size={12} />
            {pick(ui.liveDemo, lang)}
          </a>
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="retro-font text-[7px] px-4 py-2 border-2 border-border text-text-secondary hover:text-cream hover:border-gold/40 rounded transition-all flex items-center gap-2"
              onMouseEnter={() => sfx.hover()}
            >
              <GithubIcon size={12} />
              REPO
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
