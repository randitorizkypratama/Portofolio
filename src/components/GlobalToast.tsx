import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trophy } from "lucide-react";

export function GlobalToast() {
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const onToast = (e: Event) => {
      setMsg((e as CustomEvent<string>).detail);
      window.setTimeout(() => setMsg(null), 2800);
    };
    window.addEventListener("pq-toast", onToast);
    return () => window.removeEventListener("pq-toast", onToast);
  }, []);

  return (
    <AnimatePresence>
      {msg && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[80] game-border-gold rounded-lg px-4 py-2 flex items-center gap-2 bg-bg-main/90 backdrop-blur-sm pointer-events-none"
        >
          <Trophy size={12} className="text-gold shrink-0" />
          <span className="retro-font text-[6px] text-gold whitespace-nowrap">
            {msg}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
