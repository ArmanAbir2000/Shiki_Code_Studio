import type { CSSProperties } from "react";
import { Link } from "react-router";
import { FolioGithub } from "@/components/folio-github";
import { FolioThemeToggle } from "@/components/folio-theme-toggle";
import { FolioFx } from "@/components/folio-fx";
import { Marquee } from "@/components/motion-primitives";
import type {
  AboutContent,
  Capability,
  ExperienceItem,
  HeroContent,
  InProgressContent,
  PricingContent,
  SocialsContent,
} from "@/lib/content";

export type FolioProject = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  stack?: string[];
  year?: number | string;
  category?: string;
  cover?: string;
  shots?: string[];
};

export type FolioGithub = {
  totalContributions?: number;
  contributedToTotal?: number;
  memberSince?: string;
  total?: number;
  days?: { date: string; count: number }[];
  contributedTo?: string[];
  publicRepos?: number;
  topRepos?: string[];
} | null;

type Props = {
  hero: HeroContent;
  skills: string[];
  capabilities: Capability[];
  about: AboutContent;
  experience: ExperienceItem[];
  inProgress: InProgressContent;
  pricing: PricingContent;
  socials: SocialsContent;
  projects: FolioProject[];
  loadingProjects?: boolean;
  github: FolioGithub;
};

const VARIANTS = ["fl-a", "fl-b", "fl-c"] as const;

/** Sample plates shown until the owner uploads real covers. */
export function folioPlate(index: number): string {
  const base = import.meta.env.VITE_BASE_PATH || "/";
  const prefix = base.endsWith("/") ? base : base + "/";
  return prefix + "plates/plate-" + ((index % 6) + 1) + ".svg";
}

function SpreadMedia({ p, index }: { p: FolioProject; index: number }) {
  const second = p.shots?.[0];
  return (
    <figure className="fl-media fl-rv" style={{ "--d": ".1s" } as CSSProperties}>
      <div className="fl-plate">
        <img
          src={p.cover || folioPlate(index)}
          alt={p.cover ? "" : p.title + " — sample plate"}
          loading="lazy"
          decoding="async"
        />
      </div>
      <figcaption className="fl-cap">
        <span>PLATE — {p.title.toUpperCase()}</span>
        <span>{p.year ?? ""}</span>
      </figcaption>
      {second ? (
        <div className="fl-plate fl-crop">
          <img src={second} alt="" loading="lazy" decoding="async" />
        </div>
      ) : (
        <div className="fl-plate fl-crop fl-crop-fb" aria-hidden="true">
          <span>{(p.stack ?? p.tags).slice(0, 2).join(" · ").toUpperCase()}</span>
        </div>
      )}
    </figure>
  );
}

export function FolioLanding({
  hero,
  skills,
  capabilities,
  about,
  experience,
  inProgress,
  pricing,
  socials,
  projects,
  loadingProjects,
  github,
}: Props) {
  const spreads = (projects.length > 0 ? projects : []).slice(0, 2);
  const totalCount = projects.length;
  const mail = socials.email.startsWith("mailto:")
    ? socials.email
    : "mailto:" + socials.email;

  return (
    <div className="fl-root">
      <header className="fl-hdr">
        <span className="fl-mono">
          <a href="#fl-top">ARMAN ABIR — FLUTTER DEVELOPER</a>
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

      <nav className="fl-rail" aria-label="Section index">
        <a href="#fl-work">02 WORK</a>
        <a href="#fl-about">03 ABOUT</a>
        <a href="#fl-services">04 SERVICES</a>
        <a href="#fl-github">05 GITHUB</a>
        <a href="#fl-contact">06 CONTACT</a>
      </nav>

      <main id="fl-top">
        <section className="fl-hero" aria-label="Introduction">
          <div className="fl-wrap">
            <div className="fl-hero-roles fl-mono fl-hrv" style={{ "--d": ".35s" } as CSSProperties}>
              <span>
                <b>FLUTTER DEVELOPER</b> / APP DEVELOPER / PRODUCT ENGINEER
              </span>
              <span>FOLIO 01 — SELECTED WORK 2023–2026</span>
            </div>
            <h1 className="fl-name" aria-label="Arman Abir">
              <span className="fl-line" aria-hidden="true">
                <span className="fl-hl" style={{ "--i": 0 } as CSSProperties}>A</span>
                <span className="fl-hl" style={{ "--i": 1 } as CSSProperties}>R</span>
                <span className="fl-hl" style={{ "--i": 2 } as CSSProperties}>M</span>
                <span className="fl-hl" style={{ "--i": 3 } as CSSProperties}>A</span>
                <span className="fl-hl" style={{ "--i": 4 } as CSSProperties}>N</span>
              </span>
              <span className="fl-line fl-indent" aria-hidden="true">
                <span className="fl-hl" style={{ "--i": 5 } as CSSProperties}>A</span>
                <span className="fl-hl" style={{ "--i": 6 } as CSSProperties}>B</span>
                <span className="fl-hl" style={{ "--i": 7 } as CSSProperties}>I</span>
                <span className="fl-hl" style={{ "--i": 8 } as CSSProperties}>R</span>
                <span className="fl-mark fl-hrv" style={{ "--d": "1.1s" } as CSSProperties} />
              </span>
            </h1>
            <p className="fl-sub fl-hrv" style={{ "--d": ".85s" } as CSSProperties}>
              Founder of <em>ShikiCodeStudio</em> — {hero.subtitle}
            </p>
            <div className="fl-foot fl-mono">
              <p className="fl-hrv" style={{ "--d": ".95s" } as CSSProperties}>
                <b>DHAKA, BANGLADESH</b>23.8103° N, 90.4125° E
              </p>
              <p className="fl-hrv" style={{ "--d": "1.05s" } as CSSProperties}>
                <b>FLUTTER · DART · LARAVEL</b>FIREBASE · REST APIs
              </p>
              <p className="fl-yr fl-hrv" style={{ "--d": "1.15s" } as CSSProperties}>2026</p>
            </div>
          </div>
          <p className="fl-cue fl-hrv" style={{ "--d": "1s" } as CSSProperties} aria-hidden="true">
            SCROLL <span className="fl-cue-arr">↓</span>
          </p>
        </section>

        <div className="fl-marquee" aria-hidden="true">
          <div className="fl-wrap">
            <Marquee
              duration={36}
              items={skills.map((s) => (
                <span key={s} className="fl-mono fl-marquee-item">
                  {s.toUpperCase()}
                </span>
              ))}
            />
          </div>
        </div>

        <section className="fl-sec" aria-label="Manifesto">
          <div className="fl-wrap fl-sec-head">
            <span className="fl-mono">02 — MANIFESTO</span>
            <span className="fl-mono">FIELD NOTES</span>
          </div>
          <div className="fl-wrap fl-mani">
            <p className="fl-lede fl-rv">
              I build mobile products where <em>engineering</em> and{" "}
              <em>visual language</em> meet — {hero.title}
            </p>
            <div className="fl-meta">
              <div className="fl-mm fl-rv" style={{ "--d": ".05s" } as CSSProperties}>
                <small>FIELD</small>APP DEVELOPMENT
              </div>
              <div className="fl-mm fl-rv" style={{ "--d": ".12s" } as CSSProperties}>
                <small>FOCUS</small>FLUTTER / PRODUCT / UI
              </div>
              <div className="fl-mm fl-rv" style={{ "--d": ".19s" } as CSSProperties}>
                <small>BASED IN</small>DHAKA, BANGLADESH
              </div>
              <div className="fl-mm fl-rv" style={{ "--d": ".26s" } as CSSProperties}>
                <small>AVAILABLE</small>
                <span className="fl-dot" aria-hidden="true" />
                FOR SELECTED WORK
              </div>
            </div>
            <div className="fl-words" aria-label="Build. Break. Refine.">
              <span className="fl-w fl-rv">BUILD.</span>
              <span className="fl-w fl-outline fl-rv" style={{ "--d": ".1s" } as CSSProperties}>BREAK.</span>
              <span className="fl-w fl-serif fl-rv" style={{ "--d": ".2s" } as CSSProperties}>Refine.</span>
            </div>
          </div>
        </section>

        <section className="fl-sec" id="fl-work" aria-label="Selected work">
          <div className="fl-wrap fl-sec-head">
            <span className="fl-mono">02 — SELECTED WORK</span>
            <span className="fl-mono">{spreads.length} SPREADS</span>
          </div>
          <div className="fl-wrap fl-work-intro">
            <h2 className="fl-rv">
              SELECTED
              <br />
              WORK
            </h2>
            <p className="fl-mono fl-rv" style={{ "--d": ".1s" } as CSSProperties}>
              EACH PROJECT DOCUMENTED AS A SPREAD — OPEN THE CASE STUDIES.
            </p>
          </div>
          <div className="fl-wrap">
            {loadingProjects ? (
              <p className="fl-mono fl-flat-note">LOADING WORK…</p>
            ) : spreads.length === 0 ? (
              <p className="fl-mono fl-flat-note">
                NO PROJECTS PUBLISHED YET — CHECK BACK SOON.
              </p>
            ) : (
              spreads.map((p, i) => (
              <article
                key={p.slug + i}
                className={"fl-spread " + VARIANTS[i % VARIANTS.length]}
              >
                <div className="fl-num fl-rv">
                  {String(i + 1).padStart(2, "0")}
                  <small>/{String(spreads.length).padStart(2, "0")}</small>
                </div>
                <h3 className="fl-title fl-rv" style={{ "--d": ".04s" } as CSSProperties}>{p.title}</h3>
                <p className="fl-tag fl-mono fl-rv" style={{ "--d": ".08s" } as CSSProperties}>
                  {(p.category ?? "FLUTTER APP").toUpperCase()} · {p.year ?? ""}
                </p>
                <div className="fl-body fl-rv" style={{ "--d": ".12s" } as CSSProperties}>
                  <p>{p.summary}</p>
                </div>
                <SpreadMedia p={p} index={i} />
                <div className="fl-stack fl-mono fl-rv">
                  <small>STACK</small>
                  {(p.stack ?? p.tags).slice(0, 6).join(" · ").toUpperCase()}
                </div>
                <div className="fl-side fl-mono fl-rv">
                  <span>
                    TAGS <b>{p.tags.slice(0, 3).join(", ").toUpperCase()}</b>
                  </span>
                  <Link className="fl-open" to={"/projects/" + p.slug} data-cursor="OPEN CASE">
                    OPEN CASE →
                  </Link>
                </div>
              </article>
            ))
            )}
            {totalCount > spreads.length && (
              <div className="fl-more">
                <Link className="fl-open" to="/projects">
                  ALL WORK ({String(totalCount).padStart(2, "0")}) →
                </Link>
              </div>
            )}
          </div>
        </section>

        <section className="fl-sec" id="fl-about" aria-label="About">
          <div className="fl-wrap fl-sec-head">
            <span className="fl-mono">03 — ABOUT</span>
            <span className="fl-mono">THE AUTHOR</span>
          </div>
          <div className="fl-wrap fl-about">
            <div className="fl-bio">
              <p>{about.heading}</p>
              {about.body.split(/\n{2,}/).map((para, i) => (
                <p key={i} className="fl-p2">
                  {para.trim()}
                </p>
              ))}
            </div>
            <div className="fl-side-col">
              <figure>
                <div className="fl-plate">
                  <img
                    src={about.photoUrl || folioPlate(1)}
                    alt={
                      about.photoUrl ? "Arman Abir" : "Author — sample plate"
                    }
                    loading="lazy"
                  />
                </div>
                <figcaption className="fl-cap">
                  <span>THE AUTHOR — PLATE</span>
                  <span>DHAKA, 2026</span>
                </figcaption>
              </figure>
              <div className="fl-list fl-mono">
                <small>SERVICES</small>
                {capabilities.slice(0, 4).map((c) => (
                  <div key={c.title}>{c.title.toUpperCase()}</div>
                ))}
              </div>
            </div>
          </div>
          <div className="fl-wrap fl-timeline">
            {experience.map((e, i) => (
              <div key={(e.org || "role") + i} className="fl-tl">
                <span className="fl-tl-y">{e.period}</span>
                <span className="fl-tl-w fl-mono">
                  {e.title.toUpperCase()} — {e.org.toUpperCase()}
                  <br />
                  {e.summary}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="fl-sec" id="fl-services" aria-label="Services">
          <div className="fl-wrap fl-sec-head">
            <span className="fl-mono">04 — SERVICES</span>
            <span className="fl-mono">ENGAGEMENT INDEX</span>
          </div>
          <div className="fl-wrap fl-services">
            <p className="fl-svc-lede">
              Ways to <em>work together</em> — fixed scope, steady retainer,
              rescue audits.
            </p>
            <div className="fl-svc-list">
              {(pricing.plans.length > 0
                ? pricing.plans
                : [
                    { name: "Project", price: "", blurb: "", features: [] },
                  ]
              ).map((plan, i) => (
                <div key={(plan.name || "plan") + i} className="fl-svc">
                  <span className="fl-mono">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{plan.name.toUpperCase()}</h3>
                  <p>
                    {[plan.price, plan.blurb].filter(Boolean).join(" — ")}
                    {plan.features.length > 0 &&
                      " · " + plan.features.slice(0, 3).join(" · ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="fl-sec" aria-label="Current work">
          <div className="fl-wrap fl-sec-head">
            <span className="fl-mono">CURRENT DESK</span>
            <span className="fl-mono">LIVE FIELD NOTES</span>
          </div>
          <div className="fl-wrap fl-now">
            <p className="fl-now-title">
              WHAT IS
              <br />
              <em>moving</em> NOW.
            </p>
            <div className="fl-now-list">
              {[...inProgress.client, ...inProgress.personal]
                .slice(0, 6)
                .map((item) => (
                  <div key={item.name} className="fl-now-item">
                    <span className="fl-dot" aria-hidden="true" />
                    <div>
                      <small className="fl-mono">ACTIVE</small>
                      <h3>{item.name.toUpperCase()}</h3>
                      <p>{item.context}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>

        <section className="fl-sec" id="fl-github" aria-label="GitHub activity">
          <div className="fl-wrap fl-sec-head">
            <span className="fl-mono">05 — GITHUB</span>
            <span className="fl-mono">CONTRIBUTION INDEX</span>
          </div>
          <div className="fl-wrap fl-gh">
            <p className="fl-gh-title">
              THE
              <br />
              <em>record</em>.
            </p>
            <FolioGithub cache={github} />
          </div>
          <div className="fl-wrap">
            <div style={{ height: "3rem" }} />
          </div>
        </section>

        <section className="fl-sec" id="fl-contact" aria-label="Contact">
          <div className="fl-wrap fl-sec-head">
            <span className="fl-mono">06 — CONTACT</span>
            <span className="fl-mono">END OF FOLIO</span>
          </div>
          <div className="fl-wrap">
            <a className="fl-big" href={mail} data-cursor="OPEN" aria-label="Email Arman Abir">
              <span className="fl-rv">LET'S</span>
              <span className="fl-outline fl-rv" style={{ "--d": ".08s" } as CSSProperties}>BUILD</span>
              <span className="fl-rv" style={{ "--d": ".16s" } as CSSProperties}>
                SOMETHING<span className="fl-dotr">.</span>
              </span>
            </a>
            <div className="fl-contact-grid">
              <div className="fl-rv">
                <span className="fl-mono">WRITE TO</span>
                <br />
                <br />
                <a className="fl-mail" href={mail} data-cursor="COPY" data-copy={socials.email}>
                  {socials.email}
                </a>
                <div className="fl-socials fl-mono">
                  <a
                    href={socials.github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    GITHUB ↗
                  </a>
                  <a
                    href={socials.facebook}
                    target="_blank"
                    rel="noreferrer"
                  >
                    FACEBOOK ↗
                  </a>
                  <Link to="/book">BOOK A CALL ↗</Link>
                </div>
              </div>
              <div className="fl-avail fl-mono">
                <small>AVAILABLE FOR</small>
                <div>FLUTTER APP DEVELOPMENT</div>
                <div>PRODUCT ENGINEERING</div>
                <div>DESIGN SYSTEM WORK</div>
                <div>FREELANCE & STUDIO PROJECTS</div>
              </div>
            </div>
            <footer className="fl-foot fl-mono">
              <span>ARMAN ABIR — FLUTTER DEVELOPER</span>
              <span>SET IN ARCHIVO · INSTRUMENT SERIF · SPACE MONO</span>
              <span>© 2026 — SHIKI CODE STUDIO</span>
            </footer>
          </div>
        </section>
      </main>
      <FolioFx />
    </div>
  );
}
