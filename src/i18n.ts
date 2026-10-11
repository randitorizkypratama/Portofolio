import { useSyncExternalStore } from "react";

export type Locale = "en" | "id";

export interface L {
  en: string;
  id: string;
}

const KEY = "pq_lang";
let locale: Locale =
  typeof localStorage !== "undefined" && localStorage.getItem(KEY) === "id"
    ? "id"
    : "en";

if (typeof document !== "undefined") {
  document.documentElement.lang = locale;
}

const listeners = new Set<() => void>();

export function getLocale(): Locale {
  return locale;
}

export function setLocale(next: Locale): void {
  locale = next;
  try {
    localStorage.setItem(KEY, next);
    document.documentElement.lang = next;
  } catch {
    /* private mode */
  }
  listeners.forEach((fn) => fn());
}

function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function useLocale(): Locale {
  return useSyncExternalStore(
    subscribe,
    () => locale,
    () => "en"
  );
}

/** Pick a localized string from an L object. */
export function pick(obj: L, lang: Locale): string {
  return obj[lang];
}
