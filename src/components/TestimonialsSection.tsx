import { motion } from "motion/react";
import { Quote } from "lucide-react";
import { useLocale, pick } from "../i18n";
import { ui, testimonials } from "../data/content";
import { ScrollReveal } from "./ScrollReveal";

export function TestimonialsSection() {
  const lang = useLocale();

  return (
    <section id="testimonials" className="py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="text-center mb-10">
            <span className="retro-font text-[8px] text-gold block mb-2">
              ✦ {pick(ui.testimonialsTitle, lang)} ✦
            </span>
            <p className="text-text-secondary text-sm max-w-md mx-auto">
              {pick(ui.testimonialsIntro, lang)}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              className="game-border rounded-lg p-4 flex flex-col"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08 }}
            >
              <Quote size={14} className="text-gold mb-2" />
              <blockquote className="text-xs text-text-secondary leading-relaxed flex-1">
                “{pick(t.quote, lang)}”
              </blockquote>
              <figcaption className="mt-3 pt-3 border-t border-border/50">
                <span className="pixel-font text-[7px] text-cream block">
                  {t.name}
                </span>
                <span className="retro-font text-[5px] text-text-secondary block mt-0.5">
                  {pick(t.role, lang)}
                </span>
                <span className="retro-font text-[5px] text-gold block mt-1">
                  ▸ {t.project}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
