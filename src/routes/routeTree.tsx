import { useState, useCallback } from "react";
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
import { RPGWorld } from "../components/RPGWorld";

function RootLayout() {
  const [started, setStarted] = useState(false);

  const handleStart = useCallback(() => {
    setStarted(true);
  }, []);

  return (
    <div className="min-h-screen bg-bg-main">
      <StartScreen onStart={handleStart} />
      {started && (
        <>
          <Header />
          <main>
            <HeroSection />
            <SectionDivider />
            {/* RPG World - Interactive Explorer */}
            <section id="explore" className="py-16 sm:py-20">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
                <span className="retro-font text-[8px] text-gold block mb-2">
                  ✦ EXPLORE THE WORLD ✦
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-cream mb-2">
                  Pixel Quest World
                </h2>
                <p className="text-text-secondary text-sm mb-6 max-w-md mx-auto">
                  Walk around, talk to NPCs, and discover quest boards.
                </p>
                <RPGWorld />
              </div>
            </section>
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