import { useCallback, useEffect, useState } from "react";

const KEY = "shiki-folio-mode";

function effectiveDark(stored: string | null): boolean {
  if (stored === "dark") return true;
  if (stored === "light") return false;
  return (
    typeof window !== "undefined" &&
    !!window.matchMedia?.("(prefers-color-scheme: dark)").matches
  );
}

function readStored(): string | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "dark" || v === "light" ? v : null;
  } catch {
    return null;
  }
}

/** Manual LIGHT/DARK switch mirroring the portfolio header button. */
export function FolioThemeToggle() {
  const [stored, setStored] = useState<string | null>(null);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const s = readStored();
    setStored(s);
    const d = effectiveDark(s);
    setDark(d);
    document.documentElement.classList.toggle("dark", d);
    document.documentElement.style.colorScheme = d ? "dark" : "light";
  }, []);

  const toggle = useCallback(() => {
    const next = dark ? "light" : "dark";
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* private mode — non-fatal */
    }
    setStored(next);
    setDark(next === "dark");
    document.documentElement.classList.toggle("dark", next === "dark");
    document.documentElement.style.colorScheme = next === "dark" ? "dark" : "light";
  }, [dark]);

  void stored;
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
