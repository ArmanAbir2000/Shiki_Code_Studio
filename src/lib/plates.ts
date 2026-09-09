/** Editorial stand-in artwork for projects with no uploaded media.
 *  The plate is chosen from what the project actually is (category, tags,
 *  stack) so a commerce app never draws the terminal plate, and falls back to
 *  a stable hash so two neighbouring projects don't collide. */

const PLATES = [
  "mobile",
  "commerce",
  "marketplace",
  "dashboard",
  "api",
  "tooling",
  "realtime",
  "field",
] as const;

const SHOTS = ["ui", "flow", "metrics", "type"] as const;

/* Word-anchored so a substring can't hijack the match — "riverpod" used to
   trip the dashboard pattern through "erp". Order is priority: the first
   pattern that matches wins. */
const MATCHERS: [(typeof PLATES)[number], RegExp][] = [
  ["commerce", /\b(commerce|shop|store|cart|checkout|retail|payments?)\b/],
  ["marketplace", /\b(marketplace|listings?|classifieds?|feed|directory)\b/],
  ["dashboard", /\b(dashboard|admin|analytics?|reporting|panel|erp|hr|payroll)\b/],
  ["realtime", /\b(chat|realtime|real-time|socket|messaging|presence)\b/],
  ["field", /\b(maps?|location|delivery|courier|attendance|logistics?|geo|fleet)\b/],
  ["tooling", /\b(tooling|internal|cli|pipeline|devops|automation|in-house)\b/],
  ["api", /\b(api|laravel|backend|rest|server|node|php|graphql)\b/],
  ["mobile", /\b(flutter|android|ios|mobile|app)\b/],
];

function assetUrl(file: string): string {
  const base = import.meta.env.VITE_BASE_PATH || "/";
  return (base.endsWith("/") ? base : base + "/") + "plates/" + file;
}

function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export type PlateSubject = {
  slug?: string;
  title?: string;
  category?: string;
  tags?: string[];
  stack?: string[];
};

/** Cover plate for a project — matched on subject, stable per project. */
export function plateFor(subject: PlateSubject, index = 0): string {
  const haystack = [
    subject.category,
    subject.slug,
    subject.title,
    ...(subject.tags ?? []),
    ...(subject.stack ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  for (const [name, pattern] of MATCHERS) {
    if (pattern.test(haystack)) return assetUrl("plate-" + name + ".svg");
  }
  const seed = subject.slug || subject.title || String(index);
  return assetUrl("plate-" + PLATES[hash(seed) % PLATES.length] + ".svg");
}

/** Portrait stand-in for the about section until a real photo is uploaded. */
export function authorPlate(): string {
  return assetUrl("plate-author.svg");
}

/** Gallery stand-ins so a case study always has a plate sequence to read.
 *  `nudge` shifts the sequence so adjacent projects on one page don't all
 *  land on the same stand-in. */
export function shotsFor(
  subject: PlateSubject,
  count = 3,
  nudge = 0,
): string[] {
  const offset = hash(subject.slug || subject.title || "shot") + nudge;
  return Array.from({ length: Math.min(count, SHOTS.length) }, (_, i) =>
    assetUrl("shot-" + SHOTS[(offset + i) % SHOTS.length] + ".svg"),
  );
}
