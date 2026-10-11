import { useState, useCallback, useEffect, lazy, Suspense } from "react";
import { createRootRoute, createRoute } from "@tanstack/react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { HeroSection } from "../components/HeroSection";
import { AboutSection } from "../components/AboutSection";
import { TechStackSection } from "../components/TechStackSection";
import { ProjectsSection } from "../components/ProjectsSection";
import { ContactSection } from "../components/ContactSection";
import { SectionDivider } from "../components/SectionDivider";
import { StartScreen } from "../components/StartScreen";
import { PlayerProfile } from "../components/PlayerProfile";
import { SkillStatusPanel } from "../components/SkillStatusPanel";
import { GlobalToast } from "../components/GlobalToast";
import { QuestJournal } from "../components/QuestJournal";
import { GitHubStats } from "../components/GitHubStats";
import { UpdateScroll } from "../components/UpdateScroll";
import { Analytics } from "@vercel/analytics/react";
import { markSection } from "../game/journal";
import { track } from "../game/achievements";
import { notifyNewly, showToast } from "../game/toast";
import { startBgm, cycleBgmTrack, getBgmTrackName } from "../game/music";

const RPGWorld = lazy(() =>
  import("../components/RPGWorld").then((m) => ({ default: m.RPGWorld }))
);

const KONAMI = [
  "arrowup", "arrowup", "arrowdown", "arrowdown",
  "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a",
];

function ExpBar() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setPct(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40 w-36 sm:w-56 pointer-events-none">
      <div className="flex items-center gap-1.5">
        <span className="retro-font text-[5px] text-gold">EXP</span>
        <div className="flex-1 h-1.5 bg-bg-main/80 border border-border rounded-sm overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-xp to-gold transition-[width] duration-150"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="retro-font text-[5px] text-text-secondary">
          {Math.round(pct)}%
        </span>
      </div>
    </div>
  );
}

function MiniPlayer() {
  const [trackName, setTrackName] = useState(getBgmTrackName());

  return (
    <button
      onClick={() => {
        cycleBgmTrack();
        const name = getBgmTrackName();
        setTrackName(name);
        showToast(`NOW PLAYING — ${name}`);
      }}
      className="fixed bottom-4 left-4 z-[55] game-border rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 bg-bg-main/90 backdrop-blur-sm hover:border-gold/40 transition-colors"
      aria-label="Cycle background music track"
      title="Next track"
    >
      <span className="text-gold text-[10px] leading-none">♪</span>
      <span className="retro-font text-[5px] text-cream hidden sm:inline max-w-[90px] truncate">
        {trackName}
      </span>
    </button>
  );
}

function RootLayout() {
  const [started, setStarted] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [crtOn, setCrtOn] = useState(
    () => typeof localStorage !== "undefined" && localStorage.getItem("pq_crt") !== "0"
  );

  useEffect(() => {
    const onChange = (e: Event) => setCrtOn((e as CustomEvent<boolean>).detail);
    window.addEventListener("pq-crt-changed", onChange);
    return () => window.removeEventListener("pq-crt-changed", onChange);
  }, []);

  const handleStart = useCallback(() => {
    setStarted(true);
    setShowGame(true);
    startBgm();
  }, []);

  const handleSkip = useCallback(() => {
    setStarted(true);
    setShowGame(false);
    startBgm();
  }, []);

  // Track visited sections for the quest journal
  useEffect(() => {
    if (!started) return;
    const ids = ["home", "about", "explore", "projects", "skills", "contact"];
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting && en.intersectionRatio >= 0.2) {
            markSection(en.target.id);
          }
        }
      },
      { threshold: [0.2] }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [started]);

  // Konami code easter egg
  useEffect(() => {
    let idx = 0;
    let done = false;
    const onKey = (e: KeyboardEvent) => {
      if (done) return;
      const k = e.key.toLowerCase();
      if (k === KONAMI[idx]) {
        idx++;
        if (idx === KONAMI.length) {
          done = true;
          notifyNewly(track("konami"));
          showToast("BUG HUNTER MODE — RAINBOW UNLEASHED!");
          document.body.classList.add("konami-rainbow");
          window.setTimeout(() => {
            document.body.classList.remove("konami-rainbow");
            done = false;
            idx = 0;
          }, 8000);
        }
      } else {
        idx = k === KONAMI[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen bg-bg-main">
      <Analytics />
      {crtOn && <div className="crt-overlay" aria-hidden="true" />}
      <StartScreen onStart={handleStart} onSkip={handleSkip} />
      {started && (
        <>
          <Header />
          <ExpBar />
          <GlobalToast />
          <QuestJournal />
          <MiniPlayer />
          <main>
            <HeroSection />

            {showGame && (
              <>
                <SectionDivider />
                <section id="explore" className="py-16 sm:py-20 dot-grid">
                  <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    {/* Game HUD */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
                      <div className="text-center sm:text-left">
                        <span className="retro-font text-[8px] text-gold block mb-1">
                          ✦ EXPLORE THE WORLD ✦
                        </span>
                        <h2 className="text-xl sm:text-2xl font-bold text-cream">
                          Pixel Quest World
                        </h2>
                      </div>
                      <div className="flex items-center gap-3">
                        {/* Objective */}
                        <div className="game-border rounded px-3 py-1.5 hidden sm:block">
                          <span className="retro-font text-[5px] text-text-secondary block">
                            OBJECTIVE
                          </span>
                          <span className="retro-font text-[6px] text-cream">
                            Find & interact with quest boards
                          </span>
                        </div>
                        {/* Skip button */}
                        <a
                          href="#projects"
                          className="retro-font text-[6px] text-text-secondary hover:text-cream px-2 py-1 border border-border hover:border-gold/40 rounded transition-all"
                        >
                          SKIP →
                        </a>
                      </div>
                    </div>

                    <Suspense
                      fallback={
                        <div className="game-border rounded-lg p-10 text-center">
                          <span className="retro-font text-[6px] text-text-secondary animate-pulse">
                            LOADING WORLD…
                          </span>
                        </div>
                      }
                    >
                      <RPGWorld />
                    </Suspense>

                    {/* Quick links below game */}
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                      {[
                        { label: "Projects", href: "#projects" },
                        { label: "Skills", href: "#skills" },
                        { label: "CV", href: "#about" },
                        { label: "Contact", href: "#contact" },
                      ].map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          className="retro-font text-[6px] text-text-secondary hover:text-gold px-2 py-1 border border-border/50 hover:border-gold/30 rounded transition-all"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </section>
              </>
            )}

            <SectionDivider />
            <AboutSection />
            <SectionDivider />
            <PlayerProfile />
            <SectionDivider />
            <ProjectsSection />
            <GitHubStats />
            <SectionDivider />
            <TechStackSection />
            <UpdateScroll />
            <SectionDivider />
            <SkillStatusPanel />
            <SectionDivider />
            <ContactSection />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => null,
});

export const routeTree = rootRoute.addChildren([indexRoute]);
