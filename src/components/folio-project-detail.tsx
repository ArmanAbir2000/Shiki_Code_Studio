import { Link } from "react-router";
import { plateFor, shotsFor } from "@/lib/plates";
import { FolioFx } from "@/components/folio-fx";
import { FolioHeader } from "@/components/folio-shell";
import { ProjectVideo } from "@/components/project-video";
import { StoreBadges } from "@/components/store-badges";

export type FolioDetailProject = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  category: string;
  tags: string[];
  stack: string[];
  highlights: string[];
  year: number | string;
  featured?: boolean;
  liveUrl?: string;
  repoUrl?: string;
  playUrl?: string;
  appStoreUrl?: string;
  videoUrl?: string;
  cover?: string;
  shots?: string[];
};

function Bleed({ p }: { p: FolioDetailProject }) {
  return (
    <div className="fl-plate fl-cs-bleed-plate">
      <img
        src={p.cover || plateFor(p)}
        alt={
          p.cover ? p.title + " — case spread" : p.title + " — sample plate"
        }
        loading="lazy"
      />
    </div>
  );
}

function Sec({
  n,
  title,
  paras,
  children,
}: {
  n: string;
  title: string;
  paras: string[];
  children?: React.ReactNode;
}) {
  return (
    <section className="fl-cs-sec fl-rv">
      <header>
        <span>{n}</span>
        <h4>{title}</h4>
      </header>
      <div className="fl-cs-c">
        {paras
          .filter((t) => t.trim().length > 0)
          .map((t, i) => (
            <p key={i}>{t}</p>
          ))}
        {children}
      </div>
    </section>
  );
}

export function FolioProjectDetail({
  project: p,
  next,
}: {
  project: FolioDetailProject;
  next: { slug: string; title: string } | null;
}) {
  const paras = (p.description || p.summary).split(/\n{2,}|\n/);
  const context = paras.slice(0, 2);
  const approach = paras.slice(2, 4);
  const detail = paras.slice(4);
  const uploaded = (p.shots ?? []).slice(0, 4);
  const shots = uploaded.length > 0 ? uploaded : shotsFor(p, 3);
  const stats: [string, string][] = [
    [String(p.year), "YEAR"],
    [String((p.stack ?? []).length).padStart(2, "0"), "STACK ITEMS"],
    [String((p.highlights ?? []).length).padStart(2, "0"), "HIGHLIGHTS"],
  ];

  return (
    <div className="fl-root fl-cs-page">
      <FolioHeader />

      <div className="fl-cs-top">
        <span className="fl-mono">CASE — {p.title.toUpperCase()}</span>
        <Link className="fl-cs-close" to="/projects">
          CLOSE ×
        </Link>
      </div>

      <div className="fl-wrap">
        <div className="fl-cs-hero">
          <h1 className="fl-cs-title">{p.title}</h1>
          <div className="fl-cs-meta fl-mono">
            <span>
              <b>YEAR</b> {p.year}
            </span>
            <span>
              <b>ROLE</b> FLUTTER DEVELOPER
            </span>
            <span>
              <b>STATUS</b> {p.featured ? "FEATURED" : "SHIPPED"}
            </span>
            <span>
              <b>STACK</b> {(p.stack ?? []).slice(0, 5).join(" · ").toUpperCase()}
            </span>
          </div>
          <div className="fl-cs-bleed">
            <Bleed p={p} />
          </div>
          <p className="fl-cs-summary">{p.summary}</p>
          {(p.liveUrl || p.repoUrl || p.playUrl || p.appStoreUrl) && (
            <div className="fl-cs-links">
              <StoreBadges playUrl={p.playUrl} appStoreUrl={p.appStoreUrl} />
              {p.liveUrl && (
                <a href={p.liveUrl} target="_blank" rel="noreferrer" className="fl-open">
                  VIEW LIVE ↗
                </a>
              )}
              {p.repoUrl && (
                <a href={p.repoUrl} target="_blank" rel="noreferrer" className="fl-open">
                  SOURCE ↗
                </a>
              )}
            </div>
          )}
        </div>

        <Sec n="01" title="CONTEXT" paras={context.length > 0 ? context : [p.summary]} />

        <Sec
          n="02"
          title="APPROACH"
          paras={approach.length > 0 ? approach : [(p.highlights ?? [])[0] ?? ""]}
        >
          <div className="fl-cs-list fl-mono">
            {(p.stack ?? []).map((s) => (
              <div key={s}>
                <b>STACK</b>
                <span>{s.toUpperCase()}</span>
              </div>
            ))}
            {(p.tags ?? []).slice(0, 4).map((t) => (
              <div key={t}>
                <b>TAG</b>
                <span>#{t.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </Sec>

        <Sec
          n="03"
          title="BUILD DETAIL"
          paras={detail.length > 0 ? detail : (p.highlights ?? []).slice(1)}
        >
          {p.videoUrl && (
            <div className="fl-cs-video">
              <ProjectVideo url={p.videoUrl} title={p.title} />
            </div>
          )}
          <div className="fl-cs-plates">
            {shots.map((url, i) => (
              <figure key={url + i}>
                <div className="fl-plate">
                  <img
                    src={url}
                    alt={
                      uploaded.length > 0
                        ? p.title + " screenshot " + (i + 1)
                        : p.title + " — sample plate " + (i + 1)
                    }
                    loading="lazy"
                  />
                </div>
                <figcaption className="fl-cap">
                  <span>SHOT {String(i + 1).padStart(2, "0")}</span>
                  <span>{p.year}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          {(p.highlights ?? []).length > 0 && (
            <div className="fl-cs-hls">
              {(p.highlights ?? []).map((h, i) => (
                <div key={i} className="fl-cs-hl">
                  <span className="fl-mono">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p>{h}</p>
                </div>
              ))}
            </div>
          )}
          <div className="fl-cs-stats">
            {stats.map(([v, label]) => (
              <div key={label} className="fl-cs-stat">
                <b>{v}</b>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </Sec>

        {next ? (
          <div className="fl-cs-next">
            <Link to={"/projects/" + next.slug}>
              <span className="fl-mono">NEXT PROJECT</span>
              {next.title.toUpperCase()} →
            </Link>
          </div>
        ) : (
          <div className="fl-cs-next">
            <Link to="/projects">
              <span className="fl-mono">BACK TO</span>
              ALL WORK →
            </Link>
          </div>
        )}
        <p className="fl-cs-end fl-mono">END OF CASE — {p.title.toUpperCase()}</p>
      </div>
      <FolioFx />
    </div>
  );
}
