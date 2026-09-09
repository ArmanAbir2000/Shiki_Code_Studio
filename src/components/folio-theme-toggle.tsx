import { useCallback, useEffect, useState } from "react";

const KEY = "shiki-folio-mode";

function readStored(): "dark" | "light" | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "dark" || v === "light" ? v : null;
  } catch {
    return null;
  }
}

function osDark(): boolean {
  return (
    typeof window !== "undefined" &&
    !!window.matchMedia?.("(prefers-color-scheme: dark)").matches
  );
}

function applyMode(stored: "dark" | "light" | null) {
  const dark = stored === "dark" || (stored === null && osDark());
  const root = document.documentElement;
  root.classList.toggle("dark", dark);
  root.classList.toggle("folio-manual", stored !== null);
  root.style.colorScheme = dark ? "dark" : "light";
  return dark;
}

/** Manual LIGHT/DARK switch mirroring the portfolio header button. */
export function FolioThemeToggle() {
  const [dark, setDark] = useState<boolean>(() =>
    typeof window === "undefined"
      ? false
      : readStored() === "dark" ||
        (readStored() === null && osDark()),
  );

  useEffect(() => {
    setDark(applyMode(readStored()));
  }, []);

  const toggle = useCallback(() => {
    const next: "dark" | "light" = dark ? "light" : "dark";
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* private mode — non-fatal */
    }
    setDark(applyMode(next));
  }, [dark]);

  return (
    <button
      type="button"
      className="fl-theme-btn"
      onClick={toggle}
      aria-pressed={dark}
      title="Switch folio theme (follows your system until you choose)"
    >
      <i aria-hidden="true" />
      <span>{dark ? "LIGHT" : "DARK"}</span>
    </button>
  );
}
