import { useState, useCallback, lazy, Suspense } from "react";
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

const RPGWorld = lazy(() =>
  import("../components/RPGWorld").then((m) => ({ default: m.RPGWorld }))
);

function RootLayout() {
  const [started, setStarted] = useState(false);
  const [showGame, setShowGame] = useState(false);

  const handleStart = useCallback(() => {
    setStarted(true);
    setShowGame(true);
  }, []);

  const handleSkip = useCallback(() => {
    setStarted(true);
    setShowGame(false);
  }, []);

  return (
    <div className="min-h-screen bg-bg-main">
      <StartScreen onStart={handleStart} onSkip={handleSkip} />
      {started && (
        <>
          <Header />
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
            <SectionDivider />
            <TechStackSection />
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