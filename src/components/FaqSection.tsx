import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight } from "lucide-react";
import { useLocale, pick } from "../i18n";
import { ui, faqs } from "../data/content";
import { ScrollReveal } from "./ScrollReveal";
import { sfx } from "../game/sfx";

export function FaqSection() {
  const lang = useLocale();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-16 sm:py-20 dot-grid">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="text-center mb-10">
            <span className="retro-font text-[8px] text-gold block mb-2">
              ✦ {pick(ui.faqTitle, lang)} ✦
            </span>
            <p className="text-text-secondary text-sm max-w-md mx-auto">
              {pick(ui.faqIntro, lang)}
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-2">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <ScrollReveal key={i} delay={i * 0.05}>
                <div className="game-border rounded-lg overflow-hidden">
                  <button
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors ${
                      isOpen ? "bg-gold/5" : "hover:bg-white/[0.03]"
                    }`}
                    onClick={() => {
                      sfx.hover();
                      setOpen(isOpen ? null : i);
                    }}
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm text-cream leading-snug">
                      {pick(faq.q, lang)}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 90 : 0 }}
                      transition={{ duration: 0.15 }}
                      className="shrink-0"
                    >
                      <ChevronRight
                        size={14}
                        className={isOpen ? "text-gold" : "text-text-secondary"}
                      />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="px-4 pb-4 text-xs text-text-secondary leading-relaxed border-t border-border/40 pt-3">
                          {pick(faq.a, lang)}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
