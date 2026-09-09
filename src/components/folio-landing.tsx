import { Link } from "react-router";
import { ContributionMap } from "@/components/contribution-map";
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
};

export type FolioGithub = {
  totalContributions?: number;
  contributedToTotal?: number;
  memberSince?: string;
  total?: number;
  days?: { date: string; count: number }[];
  contributedTo?: string[];
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
  github: FolioGithub;
};

const VARIANTS = ["fl-a", "fl-b", "fl-c"] as const;

function SpreadMedia({ p }: { p: FolioProject }) {
  if (!p.cover) return null;
  return (
    <figure className="fl-media">
      <div className="fl-plate">
        <img src={p.cover} alt="" loading="lazy" decoding="async" />
      </div>
      <figcaption className="fl-cap">
        <span>PLATE — {p.title.toUpperCase()}</span>
        <span>{p.year ?? ""}</span>
      </figcaption>
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
  github,
}: Props) {
  const spreads = (projects.length > 0 ? projects : []).slice(0, 6);
  const mail = socials.email.startsWith("mailto:")
    ? socials.email
    : "mailto:" + socials.email;
  const ghTotal =
    github && typeof github.totalContributions === "number"
      ? github.totalContributions
      : github && typeof github.total === "number"
        ? github.total
        : null;
  const ghRepos = (github?.contributedTo ?? []).slice(0, 8);
  const since =
    github && typeof github.memberSince === "string"
      ? new Date(github.memberSince).getFullYear()
      : null;

  return (
    <div className="fl-root">
      <header className="fl-hdr">
        <span className="fl-mono">
          <a href="#fl-top">ARMAN ABIR — FLUTTER DEVELOPER</a>
        </span>
        <span className="fl-hdr-r fl-mono">
          DHAKA · <a href="#fl-contact">AVAILABLE</a>
        </span>
      </header>

      <nav className="fl-rail" aria-label="Section index">
        <a href="#fl-work">02 WORK</a>
        <a href="#fl-tools">03 STACK</a>
        <a href="#fl-about">04 ABOUT</a>
        <a href="#fl-services">05 SERVICES</a>
        <a href="#fl-github">06 GITHUB</a>
        <a href="#fl-contact">07 CONTACT</a>
      </nav>

      <main id="fl-top">
        <section className="fl-hero" aria-label="Introduction">
          <div className="fl-wrap">
            <div className="fl-hero-roles fl-mono">
              <span>
                <b>FLUTTER DEVELOPER</b> / APP DEVELOPER / PRODUCT ENGINEER
              </span>
              <span>FOLIO 01 — SELECTED WORK 2023–2026</span>
            </div>
            <h1 className="fl-name" aria-label="Arman Abir">
              <span className="fl-line">ARMAN</span>
              <span className="fl-line fl-indent">
                ABIR<span className="fl-mark" aria-hidden="true" />
              </span>
            </h1>
            <p className="fl-sub">
              Founder of <em>ShikiCodeStudio</em> — {hero.subtitle}
            </p>
            <div className="fl-foot fl-mono">
              <p>
                <b>DHAKA, BANGLADESH</b>23.8103° N, 90.4125° E
              </p>
              <p>
                <b>FLUTTER · DART · LARAVEL</b>FIREBASE · REST APIs
              </p>
              <p className="fl-yr">2026</p>
            </div>
          </div>
        </section>

        <section className="fl-sec" aria-label="Manifesto">
          <div className="fl-wrap fl-sec-head">
            <span className="fl-mono">02 — MANIFESTO</span>
            <span className="fl-mono">FIELD NOTES</span>
          </div>
          <div className="fl-wrap fl-mani">
            <p className="fl-lede">
              I build mobile products where <em>engineering</em> and{" "}
              <em>visual language</em> meet — {hero.title}
            </p>
            <div className="fl-meta">
              <div className="fl-mm">
                <small>FIELD</small>APP DEVELOPMENT
              </div>
              <div className="fl-mm">
                <small>FOCUS</small>FLUTTER / PRODUCT / UI
              </div>
              <div className="fl-mm">
                <small>BASED IN</small>DHAKA, BANGLADESH
              </div>
              <div className="fl-mm">
                <small>AVAILABLE</small>
                <span className="fl-dot" aria-hidden="true" />
                FOR SELECTED WORK
              </div>
            </div>
            <div className="fl-words" aria-label="Build. Break. Refine.">
              <span className="fl-w">BUILD.</span>
              <span className="fl-w fl-outline">BREAK.</span>
              <span className="fl-w fl-serif">Refine.</span>
            </div>
          </div>
        </section>

        <section className="fl-sec" id="fl-work" aria-label="Selected work">
          <div className="fl-wrap fl-sec-head">
            <span className="fl-mono">02 — SELECTED WORK</span>
            <span className="fl-mono">{spreads.length} SPREADS</span>
          </div>
          <div className="fl-wrap fl-work-intro">
            <h2>
              SELECTED
              <br />
              WORK
            </h2>
            <p className="fl-mono">
              EACH PROJECT DOCUMENTED AS A SPREAD — OPEN THE CASE STUDIES.
            </p>
          </div>
          <div className="fl-wrap">
            {spreads.map((p, i) => (
              <article
                key={p.slug + i}
                className={"fl-spread " + VARIANTS[i % VARIANTS.length]}
              >
                <div className="fl-num">
                  {String(i + 1).padStart(2, "0")}
                  <small>/{String(spreads.length).padStart(2, "0")}</small>
                </div>
                <h3 className="fl-title">{p.title}</h3>
                <p className="fl-tag fl-mono">
                  {(p.category ?? "FLUTTER APP").toUpperCase()} · {p.year ?? ""}
                </p>
                <div className="fl-body">
                  <p>{p.summary}</p>
                </div>
                <SpreadMedia p={p} />
                <div className="fl-stack fl-mono">
                  <small>STACK</small>
                  {(p.stack ?? p.tags).slice(0, 6).join(" · ").toUpperCase()}
                </div>
                <div className="fl-side fl-mono">
                  <span>
                    TAGS <b>{p.tags.slice(0, 3).join(", ").toUpperCase()}</b>
                  </span>
                  <Link className="fl-open" to={"/projects/" + p.slug}>
                    OPEN CASE →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="fl-sec" id="fl-tools" aria-label="Technology index">
          <div className="fl-wrap fl-sec-head">
            <span className="fl-mono">03 — TECHNOLOGY INDEX</span>
            <span className="fl-mono">NO SKILL BARS</span>
          </div>
          <div className="fl-wrap fl-tools">
            <div className="fl-flow">
              {skills.map((s, i) => (
                <span key={s + i} className={"fl-ti fl-t" + ((i % 3) + 1)}>
                  {s.toUpperCase()} <em>{String(i + 1).padStart(2, "0")}</em>
                </span>
              ))}
            </div>
            <div className="fl-tools-note fl-mono">
              <span>
                <b>TOOLS ARE MATERIALS.</b> THE PRODUCT IS THE RESULT.
              </span>
              <span>SCALE = DEPTH OF USE</span>
            </div>
          </div>
        </section>

        <section className="fl-sec" id="fl-about" aria-label="About">
          <div className="fl-wrap fl-sec-head">
            <span className="fl-mono">04 — ABOUT</span>
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
              {about.photoUrl && (
                <figure>
                  <div className="fl-plate">
                    <img
                      src={about.photoUrl}
                      alt="Arman Abir"
                      loading="lazy"
                    />
                  </div>
                  <figcaption className="fl-cap">
                    <span>THE AUTHOR — PLATE</span>
                    <span>DHAKA, 2026</span>
                  </figcaption>
                </figure>
              )}
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
            <span className="fl-mono">05 — SERVICES</span>
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
            <span className="fl-mono">09 — CURRENT DESK</span>
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
            <span className="fl-mono">06 — GITHUB</span>
            <span className="fl-mono">CONTRIBUTION INDEX</span>
          </div>
          <div className="fl-wrap fl-gh">
            <p className="fl-gh-title">
              THE
              <br />
              <em>record</em>.
            </p>
            <div>
              <div className="fl-gh-stats">
                <div>
                  <b>{ghTotal !== null ? ghTotal + "+" : "—"}</b>
                  <span className="fl-mono">CONTRIBUTIONS</span>
                </div>
                <div>
                  <b>{ghRepos.length > 0 ? ghRepos.length + "+" : "—"}</b>
                  <span className="fl-mono">REPOSITORIES</span>
                </div>
                <div>
                  <b>{since ?? "—"}</b>
                  <span className="fl-mono">SHIPPING SINCE</span>
                </div>
              </div>
              {github?.days && (
                <div className="fl-gh-map">
                  <ContributionMap
                    data={{ total: ghTotal ?? 0, days: github.days }}
                  />
                </div>
              )}
              {ghRepos.length > 0 && (
                <div className="fl-gh-repos fl-mono">
                  {ghRepos.map((repo) => (
                    <a
                      key={repo}
                      href={"https://github.com/" + repo}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {repo.toUpperCase()} ↗
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="fl-sec" id="fl-contact" aria-label="Contact">
          <div className="fl-wrap fl-sec-head">
            <span className="fl-mono">07 — CONTACT</span>
            <span className="fl-mono">END OF FOLIO</span>
          </div>
          <div className="fl-wrap">
            <a className="fl-big" href={mail} aria-label="Email Arman Abir">
              <span>LET'S</span>
              <span className="fl-outline">BUILD</span>
              <span>
                SOMETHING<span className="fl-dotr">.</span>
              </span>
            </a>
            <div className="fl-contact-grid">
              <div>
                <span className="fl-mono">WRITE TO</span>
                <br />
                <br />
                <a className="fl-mail" href={mail}>
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
    </div>
  );
}
