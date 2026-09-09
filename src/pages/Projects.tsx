import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Loader2, Search } from "lucide-react";
import { Link, useSearchParams } from "react-router";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { folioPlate } from "@/components/folio-landing";
import { FolioShell } from "@/components/folio-shell";
import { useSiteTheme } from "@/hooks/use-site-theme";
import {
  AppStoreGlyph,
  PlayStoreGlyph,
} from "@/components/store-badges";
import { EASE } from "@/lib/motion";
import { useDocumentMeta } from "@/lib/seo";

export default function Projects() {
  useDocumentMeta({
    title: "Work — Shiki Code Studio",
    description:
      "Flutter apps shipped end to end — personal products and client platforms built with Laravel APIs and Firebase.",
  });

  const projects = useQuery(api.portfolio.listProjects, {});
  const ensureSeeded = useMutation(api.portfolio.ensureSeeded);

  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(
    searchParams.get("tag"),
  );

  useEffect(() => {
    void ensureSeeded().catch((err) => console.error(err));
  }, [ensureSeeded]);

  const tags = useMemo(() => {
    const set = new Set<string>();
    for (const p of projects ?? []) p.tags.forEach((t) => set.add(t));
    return [...set].sort();
  }, [projects]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (projects ?? []).filter((p) => {
      if (activeTag && !p.tags.includes(activeTag)) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.stack.some((s) => s.toLowerCase().includes(q)) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [projects, query, activeTag]);

  const { theme } = useSiteTheme();
  if (theme === "folio") {
    return (
      <FolioShell>
        <div className="fl-wrap fl-sec-head">
          <span className="fl-mono">02 — FULL ARCHIVE</span>
          <span className="fl-mono">
            {filtered.length} SPREAD{filtered.length === 1 ? "" : "S"}
          </span>
        </div>
        <div className="fl-wrap fl-work-intro">
          <h2>
            ALL
            <br />
            WORK
          </h2>
          <p className="fl-mono">
            EVERY ENTRY REAL SOFTWARE THAT SHIPPED — SEARCH BY NAME,
            TECHNOLOGY, OR TAG.
          </p>
        </div>
        <div className="fl-wrap fl-archive-tools">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH PROJECTS…"
            className="fl-search fl-mono"
            aria-label="Search projects"
          />
          {tags.length > 0 && (
            <div className="fl-tagrow">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  aria-pressed={activeTag === tag}
                  className={
                    "fl-tagbtn fl-mono" +
                    (activeTag === tag ? " fl-on" : "")
                  }
                >
                  {tag.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="fl-wrap">
          {projects === undefined ? (
            <p className="fl-mono fl-flat-note">LOADING PROJECTS…</p>
          ) : filtered.length === 0 ? (
            <p className="fl-mono fl-flat-note">
              NO PROJECTS MATCH YOUR SEARCH.
            </p>
          ) : (
            filtered.map((p, i) => (
              <article key={p._id} className="fl-spread">
                <div className="fl-num fl-rv">
                  {String(i + 1).padStart(2, "0")}
                  <small>/{String(filtered.length).padStart(2, "0")}</small>
                </div>
                <h3 className="fl-title fl-rv">{p.title}</h3>
                <p className="fl-tag fl-mono fl-rv">
                  {(p.category ?? "FLUTTER APP").toUpperCase()} · {p.year}
                </p>
                <div className="fl-body fl-rv">
                  <p>{p.summary}</p>
                </div>
                <figure className="fl-media fl-rv">
                  <div className="fl-plate">
                    <img
                      src={p.cover || folioPlate(i)}
                      alt={p.cover ? "" : p.title + " — sample plate"}
                      loading="lazy"
                    />
                  </div>
                  <figcaption className="fl-cap">
                    <span>PLATE — {p.title.toUpperCase()}</span>
                    <span>{p.year}</span>
                  </figcaption>
                </figure>
                <div className="fl-stack fl-mono fl-rv">
                  <small>STACK</small>
                  {(p.stack ?? []).slice(0, 6).join(" · ").toUpperCase()}
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
        </div>
      </FolioShell>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-6 pt-16 pb-24 sm:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Selected work
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              Every entry is real software that shipped — production systems,
              client engagements, and open-source tooling. Search by name,
              technology, or tag.
            </p>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="mt-10"
          >
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects…"
                className="pl-9"
              />
            </div>
            {tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                    className={
                      "cursor-pointer rounded-md border px-3 py-1 font-mono text-xs transition-all active:scale-[0.95] " +
                      (activeTag === tag
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground")
                    }
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Grid */}
          {projects === undefined ? (
            <div className="mt-16 flex items-center gap-3 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading projects…
            </div>
          ) : filtered.length === 0 ? (
            <div className="mt-16 border border-dashed border-border/60 p-12 text-center">
              <p className="text-sm text-muted-foreground">
                No projects match your search.
              </p>
            </div>
          ) : (
            <motion.div layout className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border/60 bg-border/60 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout" initial={false}>
                {filtered.map((p, i) => (
                  <motion.div
                    key={p._id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{
                      duration: 0.3,
                      ease: EASE,
                      delay: Math.min(i * 0.04, 0.24),
                      // Reflow immediately; only entrances/exits get the stagger.
                      layout: { duration: 0.35, ease: EASE },
                    }}
                  >
                    <Link
                      to={"/projects/" + p.slug}
                      className="group flex h-full cursor-pointer flex-col bg-background p-7 transition-colors hover:bg-muted/50"
                    >
                      {p.cover && (
                        <img
                          src={p.cover}
                          alt=""
                          loading="lazy"
                          className="mb-6 aspect-video w-full rounded-lg border border-border/50 object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                        />
                      )}
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs tabular-nums text-muted-foreground">
                          {p.year}
                        </span>
                        <ArrowUpRight className="size-4 text-muted-foreground transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-foreground" />
                      </div>
                      <h2 className="mt-5 text-base font-semibold tracking-tight">
                        {p.title}
                      </h2>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                        {p.summary}
                      </p>
                      <div className="mt-auto flex items-end justify-between gap-3 pt-6">
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                          {p.stack.slice(0, 3).map((s) => (
                            <span key={s} className="font-mono text-xs text-muted-foreground">
                              {s}
                            </span>
                          ))}
                        </div>
                        {(p.appStoreUrl || p.playUrl) && (
                          <span
                            className="flex shrink-0 items-center gap-1.5 text-muted-foreground"
                            title={
                              [p.appStoreUrl ? "App Store" : null, p.playUrl ? "Google Play" : null]
                                .filter(Boolean)
                                .join(" · ") + " — on the store"
                            }
                          >
                            {p.appStoreUrl && <AppStoreGlyph className="size-3.5" />}
                            {p.playUrl && <PlayStoreGlyph className="size-3.5" />}
                          </span>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
