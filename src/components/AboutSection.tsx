import { MapPin, Code, Gamepad2 } from "lucide-react";
import { siteConfig } from "../data/portfolio";
import { ScrollReveal } from "./ScrollReveal";

const chips = [
  { icon: MapPin, label: siteConfig.location },
  { icon: Code, label: siteConfig.role },
  { icon: Gamepad2, label: siteConfig.interests },
];

export function AboutSection() {
  return (
    <section id="about" className="py-20 sm:py-28 dot-grid">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Workspace Image */}
          <ScrollReveal direction="left">
            <div className="relative rounded-xl overflow-hidden border border-border">
              <img
                src="/images/workspace.webp"
                alt="Developer workspace at night"
                className="w-full h-auto"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-main/40 via-transparent to-transparent" />
            </div>
          </ScrollReveal>

          {/* Right - Content */}
          <ScrollReveal direction="right" delay={0.1}>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/images/avatar.webp"
                alt={siteConfig.name}
                className="w-8 h-8 rounded-md object-cover"
              />
              <span className="pixel-font text-[10px] text-primary">
                About Me
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6">
              Turning Ideas into{" "}
              <span className="gradient-text">Interactive</span>{" "}
              Experiences
            </h2>

            <p className="text-text-secondary leading-relaxed mb-8">
              {siteConfig.aboutDescription}
            </p>

            <div className="flex flex-wrap gap-3">
              {chips.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-bg-elevated text-sm text-text-secondary"
                >
                  <Icon size={14} className="text-primary" />
                  {label}
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}