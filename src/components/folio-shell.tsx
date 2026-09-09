import { Link } from "react-router";
import { FolioFx } from "@/components/folio-fx";
import { FolioThemeToggle } from "@/components/folio-theme-toggle";

/** Editorial header used on every screen while folio is active. */
export function FolioHeader() {
  return (
    <header className="fl-hdr">
      <span className="fl-mono">
        <Link to="/">ARMAN ABIR — FLUTTER DEVELOPER</Link>
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: 18 }}>
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
      </span>
    </header>
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
