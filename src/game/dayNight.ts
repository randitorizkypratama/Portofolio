export interface DayPeriod {
  id: "dawn" | "day" | "dusk" | "night";
  overlay: string;
  night: boolean;
}

/** Tint overlay based on the visitor's real local time. */
export function getDayPeriod(hour: number = new Date().getHours()): DayPeriod {
  if (hour >= 5 && hour < 8) {
    return {
      id: "dawn",
      overlay: "linear-gradient(180deg, rgba(255,170,110,0.16) 0%, rgba(255,130,90,0.08) 100%)",
      night: false,
    };
  }
  if (hour >= 8 && hour < 16) {
    return { id: "day", overlay: "transparent", night: false };
  }
  if (hour >= 16 && hour < 19) {
    return {
      id: "dusk",
      overlay: "linear-gradient(180deg, rgba(255,120,60,0.14) 0%, rgba(180,60,80,0.10) 100%)",
      night: false,
    };
  }
  return {
    id: "night",
    overlay: "linear-gradient(180deg, rgba(16,30,70,0.14) 0%, rgba(8,14,44,0.20) 100%)",
    night: true,
  };
}
