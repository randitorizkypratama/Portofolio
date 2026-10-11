import { motion } from "motion/react";
import { Briefcase, Rocket, GraduationCap, Star } from "lucide-react";
import { useLocale, pick } from "../i18n";
import { ui, timeline } from "../data/content";
import { ScrollReveal } from "./ScrollReveal";

const typeMeta = {
  work: { icon: Briefcase, color: "text-gold" },
  project: { icon: Rocket, color: "text-xp" },
  edu: { icon: GraduationCap, color: "text-mp" },
  milestone: { icon: Star, color: "text-accent" },
};

export function TimelineSection() {
  const lang = useLocale();

  return (
    <section id="timeline" className="py-16 sm:py-20 dot-grid">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="text-center mb-10">
            <span className="retro-font text-[8px] text-gold block mb-2">
              ✦ {pick(ui.timelineTitle, lang)} ✦
            </span>
            <p className="text-text-secondary text-sm max-w-md mx-auto">
              {pick(ui.timelineIntro, lang)}
            </p>
          </div>
        </ScrollReveal>

        <div className="relative">
          {/* Vertical rail */}
          <div className="absolute left-[15px] sm:left-[19px] top-2 bottom-2 w-0.5 bg-border" aria-hidden="true" />

          <ol className="space-y-6">
            {timeline.map((entry, i) => {
              const meta = typeMeta[entry.type];
              const Icon = meta.icon;
              return (
                <motion.li
                  key={`${entry.year}-${i}`}
                  className="relative pl-11 sm:pl-14"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.07 }}
                >
                  {/* Node */}
                  <div
                    className={`absolute left-0 top-1 w-8 h-8 sm:w-10 sm:h-10 rounded border-2 border-border bg-bg-main flex items-center justify-center ${meta.color}`}
                  >
                    <Icon size={14} />
                  </div>

                  <div className="game-border rounded-lg p-4">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="retro-font text-[6px] px-1.5 py-0.5 rounded bg-gold/10 text-gold border border-gold/30">
                        {entry.year}
                      </span>
                      <span className="retro-font text-[5px] text-text-secondary uppercase">
                        {pick(entry.org, lang)}
                      </span>
                    </div>
                    <h3 className="pixel-font text-[8px] text-cream mb-1.5">
                      {pick(entry.title, lang)}
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {pick(entry.desc, lang)}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
