import { useState, useEffect } from "react";
import { sfx } from "../game/sfx";

export function TypewriterText({
  text,
  speed = 28,
  className = "",
}: {
  text: string;
  speed?: number;
  className?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
    const id = window.setInterval(() => {
      setCount((c) => {
        if (c >= text.length) {
          window.clearInterval(id);
          return c;
        }
        if (c % 3 === 0) sfx.type();
        return c + 1;
      });
    }, speed);
    return () => window.clearInterval(id);
  }, [text, speed]);

  return (
    <span className={className}>
      {text.slice(0, count)}
      {count < text.length && <span className="type-caret">▌</span>}
    </span>
  );
}
