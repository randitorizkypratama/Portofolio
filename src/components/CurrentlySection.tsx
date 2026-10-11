import { motion } from "motion/react";
import { Sparkles, BookOpen, Hammer, Gamepad2 } from "lucide-react";
import { useLocale, pick } from "../i18n";
import { ui, currently } from "../data/content";
import { ScrollReveal } from "./ScrollReveal";

const items = [
  { icon: BookOpen, label: { en: "Learning", id: "Belajar" }, value: currently.learning },
  { icon: Hammer, label: { en: "Building", id: "Membangun" }, value: currently.building },
  { icon: Sparkles, label: { en: "Reading", id: "Membaca" }, value: currently.reading },
  { icon: Gamepad2, label: { en: "Playing", id: "Bermain" }, value: currently.playing },
];

export function CurrentlySection() {
  const lang = useLocale();

  return (
    <section id="currently" className="py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="text-center mb-10">
            <span className="retro-font text-[8px] text-gold block mb-2">
              ✦ {pick(ui.currentlyTitle, lang)} ✦
            </span>
            <p className="text-text-secondary text-sm max-w-md mx-auto">
              {pick(ui.currentlyIntro, lang)}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
          {items.map(({ icon: Icon, label, value }, i) => (
            <motion.div
              key={pick(label, lang)}
              className="game-border rounded-lg p-4 flex items-start gap-3"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="w-8 h-8 rounded border-2 border-border bg-bg-main flex items-center justify-center shrink-0">
                <Icon size={14} className="text-gold" />
              </div>
              <div>
                <span className="retro-font text-[6px] text-gold block mb-1">
                  {pick(label, lang).toUpperCase()}
                </span>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {pick(value, lang)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
