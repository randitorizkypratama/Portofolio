import { motion } from "motion/react";
import { ScrollText, BookOpen } from "lucide-react";
import { updates, devlog } from "../data/portfolio";
import { useLocale, pick } from "../i18n";
import { ui, updatesCopy, devlogCopy } from "../data/content";

export function UpdateScroll() {
  const lang = useLocale();

  return (
    <section id="updates" className="py-16 sm:py-20 dot-grid">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="retro-font text-[8px] text-gold block mb-2 flex items-center justify-center gap-2">
            <ScrollText size={12} />
            SCROLL OF UPDATES
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-cream">{pick(ui.changelogTitle, lang)}</h2>
          <p className="text-sm text-text-secondary mt-2">
            {pick(ui.changelogIntro, lang)}
          </p>
        </div>
        <div className="space-y-4">
          {updates.map((u, i) => {
            const copy = updatesCopy[u.version];
            return (
            <motion.div
              key={u.version}
              className="dialogue-box rounded-lg p-4"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="retro-font text-[7px] text-bg-main bg-gold px-1.5 py-0.5 rounded-sm font-bold">
                    v{u.version}
                  </span>
                  <span className="pixel-font text-[9px] text-cream">
                    {copy ? pick(copy.title, lang) : u.title}
                  </span>
                </div>
                <span className="retro-font text-[5px] text-text-secondary">{u.date}</span>
              </div>
              <ul className="space-y-1">
                {(copy ? copy.items : u.items).map((item, j) => (
                  <li
                    key={typeof item === "string" ? item : j}
                    className="flex items-start gap-2 text-xs text-text-secondary"
                  >
                    <span className="text-gold shrink-0 mt-px">✦</span>
                    <span>{typeof item === "string" ? item : pick(item, lang)}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            );
          })}
        </div>

        {/* Quest Archive — dev journal */}
        <div className="mt-12">
          <span className="retro-font text-[8px] text-gold block mb-2 flex items-center justify-center gap-2">
            <BookOpen size={12} />
            {pick(ui.questArchive, lang)}
          </span>
          <p className="text-sm text-text-secondary text-center mb-6">
            {pick(ui.questArchiveIntro, lang)}
          </p>
          <div className="space-y-3 max-w-2xl mx-auto">
            {devlog.map((d, i) => (
              <motion.div
                key={`${d.date}-${i}`}
                className="flex items-start gap-3 border-l-2 border-gold/40 pl-3"
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.06 }}
              >
                <span className="retro-font text-[5px] text-gold shrink-0 mt-1 w-16">
                  {d.date}
                </span>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {devlogCopy[i] ? pick(devlogCopy[i], lang) : d.entry}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
