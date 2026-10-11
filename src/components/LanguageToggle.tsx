import { getLocale, setLocale, useLocale } from "../i18n";
import { sfx } from "../game/sfx";

export function LanguageToggle() {
  const lang = useLocale();

  return (
    <button
      onClick={() => {
        sfx.hover();
        setLocale(getLocale() === "en" ? "id" : "en");
      }}
      className="retro-font text-[6px] px-2 py-1.5 border-2 border-border rounded text-text-secondary hover:text-gold hover:border-gold/40 transition-all"
      aria-label="Toggle language English / Bahasa Indonesia"
      title="EN / ID"
    >
      {lang === "en" ? "EN" : "ID"}
    </button>
  );
}
