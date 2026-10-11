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
            <AboutSection />
            <SectionDivider />
            <ProjectsSection />
            <SectionDivider />
            <TechStackSection />
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