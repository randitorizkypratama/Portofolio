import { Link } from "@tanstack/react-router";
import { ArrowLeft, Monitor, Cpu, Boxes } from "lucide-react";
import { usesGear, usesSoftware, ui } from "../data/content";
import { useLocale, pick } from "../i18n";
import { sfx } from "../game/sfx";
import { ScrollReveal } from "./ScrollReveal";

function CategoryBlock({
  icon: Icon,
  title,
  items,
}: {
  icon: typeof Monitor;
  title: string;
  items: string[];
}) {
  return (
    <ScrollReveal>
      <div className="game-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Icon size={14} className="text-gold" />
          <span className="retro-font text-[6px] text-gold">
            {title.toUpperCase()}
          </span>
        </div>
        <ul className="space-y-1.5">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-xs text-text-secondary"
            >
              <span className="text-gold mt-0.5 shrink-0">▸</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </ScrollReveal>
  );
}

export function UsesPage() {
  const lang = useLocale();

  return (
    <div className="pt-20 pb-20 min-h-screen dot-grid">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link
          to="/"
          className="retro-font text-[6px] text-text-secondary hover:text-gold inline-flex items-center gap-1.5 mb-8 transition-colors"
          onMouseEnter={() => sfx.hover()}
        >
          <ArrowLeft size={11} />
          {pick(ui.backHome, lang)}
        </Link>

        <header className="text-center mb-10">
          <span className="retro-font text-[8px] text-gold block mb-2">
            ✦ {pick(ui.usesTitle, lang)} ✦
          </span>
          <p className="text-text-secondary text-sm max-w-md mx-auto">
            {pick(ui.usesIntro, lang)}
          </p>
        </header>

        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            {usesGear.map((cat) => (
              <CategoryBlock
                key={pick(cat.category, lang)}
                icon={Monitor}
                title={pick(cat.category, lang)}
                items={cat.items}
              />
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {usesSoftware.map((cat, i) => (
              <CategoryBlock
                key={pick(cat.category, lang)}
                icon={i === 0 ? Cpu : Boxes}
                title={pick(cat.category, lang)}
                items={cat.items}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
