import { motion } from "motion/react";
import { Heart, ArrowDown, Mail } from "lucide-react";
import { siteConfig } from "../data/portfolio";
import { GithubIcon, XIcon, LinkedinIcon } from "./SocialIcons";

const socialIcons = [
  { icon: GithubIcon, href: siteConfig.socials.github, label: "GitHub" },
  { icon: XIcon, href: siteConfig.socials.x, label: "X" },
  { icon: LinkedinIcon, href: siteConfig.socials.linkedin, label: "LinkedIn" },
  { icon: Mail, href: `mailto:${siteConfig.email}`, label: "Email" },
];

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-16 overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-main via-bg-secondary to-bg-main" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 w-full py-12 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 justify-center lg:justify-start mb-4"
            >
              <Heart size={16} className="text-accent fill-accent" />
              <span className="pixel-font text-[8px] sm:text-[10px] text-text-secondary tracking-wider">
                Hi, I'm {siteConfig.name}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6"
            >
              Building Digital{" "}
              <span className="gradient-text">Worlds</span>
              <br />
              with Code
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-text-secondary text-base sm:text-lg max-w-lg mx-auto lg:mx-0 mb-8"
            >
              {siteConfig.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8"
            >
              <a
                href="#projects"
                className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm"
              >
                View My Projects
              </a>
              <a
                href="#contact"
                className="px-6 py-3 border border-border text-text-main rounded-lg font-medium hover:border-primary/50 hover:bg-white/5 transition-all text-sm"
              >
                Contact Me
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex gap-3 justify-center lg:justify-start"
            >
              {socialIcons.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-border text-text-secondary hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <Icon size={18} />
                </a>
              ))}
            </motion.div>
          </div>

          {/* Right - Hero Image */}
          <motion.div
            className="order-1 lg:order-2 relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative rounded-xl overflow-hidden border border-border">
              <img
                src="/images/hero-bg.webp"
                alt="Pixel art fantasy landscape"
                className="w-full h-auto"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-main/60 via-transparent to-transparent" />
            </div>
            {/* Decoration overlay */}
            <img
              src="/images/decoration.webp"
              alt=""
              aria-hidden="true"
              className="absolute -bottom-4 -right-4 w-24 h-24 object-contain opacity-80 pointer-events-none"
              loading="lazy"
            />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown size={20} className="text-text-secondary" />
        </motion.div>
      </div>
    </section>
  );
}