import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [dismissed, setDismissed] = useState(() => localStorage.getItem("pq_install_dismissed") === "1");

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowInstall(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowInstall(false);
    setDismissed(true);
    localStorage.setItem("pq_install_dismissed", "1");
  };

  if (!showInstall || dismissed || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 game-border rounded-lg p-3 bg-bg-main/95 max-w-[220px]">
      <button
        onClick={handleDismiss}
        className="absolute top-1 right-1 p-1 text-text-secondary hover:text-cream"
        aria-label="Dismiss"
      >
        <X size={12} />
      </button>
      <div className="flex items-center gap-2 mb-2">
        <Download size={14} className="text-gold" />
        <span className="retro-font text-[7px] text-cream">INSTALL APP</span>
      </div>
      <p className="retro-font text-[5px] text-text-secondary mb-3">
        Add Pixel Quest to your home screen for quick access
      </p>
      <button
        onClick={handleInstall}
        className="game-btn w-full text-[6px] py-2"
      >
        INSTALL
      </button>
    </div>
  );
}
