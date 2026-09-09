import { useEffect, useState } from "react";
import { Link } from "react-router";
import { FolioFx } from "@/components/folio-fx";
import { FolioThemeToggle } from "@/components/folio-theme-toggle";

const PAGES: [string, string, string][] = [
  ["01", "/", "INDEX"],
  ["02", "/projects", "WORK"],
  ["03", "/blog", "WRITING"],
  ["04", "/book", "BOOK A CALL"],
  ["05", "/contact", "CONTACT"],
];

/** Full-bleed page index for narrow screens, where the inline nav is hidden. */
function FolioMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div className="fl-menu" data-open={open} aria-hidden={!open}>
      <div className="fl-menu-top">
        <span className="fl-mono">INDEX — SHIKI CODE STUDIO</span>
        <button type="button" className="fl-menu-x fl-mono" onClick={onClose}>
          CLOSE ×
        </button>
      </div>
      <nav className="fl-menu-list" aria-label="Pages">
        {PAGES.map(([n, to, label]) => (
          <Link key={to} to={to} onClick={onClose}>
            <span className="fl-mono">{n}</span>
            {label}
          </Link>
        ))}
      </nav>
      <p className="fl-menu-foot fl-mono">
        ARMAN ABIR — FLUTTER DEVELOPER
        <br />
        DHAKA, BANGLADESH · 2026
      </p>
    </div>
  );
}

/** Editorial header used on every screen while folio is active. */
export function FolioHeader({ homeHref }: { homeHref?: string } = {}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fl-hdr">
        <span className="fl-mono fl-hdr-mark">
          {homeHref ? (
            <a href={homeHref}>ARMAN ABIR — FLUTTER DEVELOPER</a>
          ) : (
            <Link to="/">ARMAN ABIR — FLUTTER DEVELOPER</Link>
          )}
        </span>
        <span className="fl-hdr-r">
          <nav className="fl-nav fl-mono" aria-label="Site">
            <Link to="/projects">Work</Link>
            <Link to="/blog">Writing</Link>
            <Link to="/book">Book</Link>
            <Link to="/contact">Contact</Link>
          </nav>
          <Link className="fl-cta" to="/book">
            Book a call ↗
          </Link>
          <FolioThemeToggle />
          <button
            type="button"
            className="fl-burger fl-mono"
            aria-expanded={open}
            aria-label="Open page index"
            onClick={() => setOpen(true)}
          >
            INDEX
          </button>
        </span>
      </header>
      <FolioMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}

/** Editorial footer used on every screen while folio is active. */
export function FolioFooter() {
  return (
    <div className="fl-wrap">
      <footer className="fl-foot fl-mono">
        <span>ARMAN ABIR — FLUTTER DEVELOPER</span>
        <span>SET IN ARCHIVO · INSTRUMENT SERIF · SPACE MONO</span>
        <span>
          © 2026 — <Link to="/">BACK TO INDEX ↑</Link>
        </span>
      </footer>
    </div>
  );
}

/** Editorial chrome for every inner screen while folio is active —
 *  same header/footer language as the folio landing replica. */
export function FolioShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="fl-root fl-page">
      <FolioHeader />
      <main className="fl-page-body">{children}</main>
      <FolioFooter />
      <FolioFx />
    </div>
  );
}
