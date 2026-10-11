import { Mail } from "lucide-react";
import { siteConfig, navLinks } from "../data/portfolio";
import { GithubIcon, XIcon, LinkedinIcon } from "./SocialIcons";

const socialIcons = [
  { icon: GithubIcon, href: siteConfig.socials.github, label: "GitHub" },
  { icon: XIcon, href: siteConfig.socials.x, label: "X" },
  { icon: LinkedinIcon, href: siteConfig.socials.linkedin, label: "LinkedIn" },
  { icon: Mail, href: `mailto:${siteConfig.email}`, label: "Email" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-secondary/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <img
              src="/images/avatar.webp"
              alt={siteConfig.name}
              className="w-6 h-6 rounded-md object-cover"
            />
            <span className="pixel-font text-[8px] text-text-main">
              {siteConfig.name}
            </span>
          </div>

          <nav className="flex flex-wrap justify-center gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-text-secondary hover:text-text-main transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex gap-2">
            {socialIcons.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-primary hover:bg-primary/5 transition-all"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-xs text-text-secondary">
            &copy; {new Date().getFullYear()} {siteConfig.name}. Crafted with pixels and passion.
          </p>
        </div>
      </div>
    </footer>
  );
}