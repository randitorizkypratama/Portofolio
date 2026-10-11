import { Link } from "@tanstack/react-router";
import { pick, useLocale } from "../i18n";
import { ui } from "../data/content";

export function NotFoundPage() {
  const lang = useLocale();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="pixel-font text-4xl sm:text-5xl text-gold mb-4">404</div>
      <h1 className="pixel-font text-sm sm:text-base text-cream mb-3">
        {pick(ui.notFoundTitle, lang)}
      </h1>
      <p className="text-text-secondary text-sm mb-8 max-w-sm">
        {pick(ui.notFoundDesc, lang)}
      </p>
      <Link to="/" className="game-btn text-[8px]">
        {pick(ui.notFoundBack, lang)}
      </Link>
    </div>
  );
}
