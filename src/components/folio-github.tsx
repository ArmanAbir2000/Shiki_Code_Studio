import { useEffect, useMemo, useRef } from "react";

export type FolioGhDay = { date: string; count: number };

export type FolioGhCache = {
  totalContributions?: number;
  days?: FolioGhDay[];
  contributedTo?: string[];
  contributedToTotal?: number;
  publicRepos?: number;
  memberSince?: string;
  topRepos?: string[];
} | null;

function level(count: number): number {
  if (!count) return 0;
  if (count < 3) return 1;
  if (count < 6) return 2;
  if (count < 10) return 3;
  return 4;
}

const MONTHS = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
] as const;

type Day = { key: string; count: number } | null;

export function FolioGithub({ cache }: { cache: FolioGhCache }) {
  const model = useMemo(() => {
    const days = (cache?.days ?? []).filter(
      (d) => typeof d.date === "string" && typeof d.count === "number",
    );
    const byDate = new Map(days.map((d) => [d.date, d.count]));
    const now = new Date();
    const end = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
    );
    const start = new Date(end - 364 * 86400000);
    const list: { key: string; count: number }[] = [];
    const t = new Date(start);
    while (t.getTime() <= end) {
      const key = t.toISOString().slice(0, 10);
      list.push({ key, count: byDate.get(key) ?? 0 });
      t.setUTCDate(t.getUTCDate() + 1);
    }

    let sum = 0;
    let longest = 0;
    let run = 0;
    for (const d of list) {
      if (d.count > 0) {
        sum += d.count;
        run++;
        if (run > longest) longest = run;
      } else {
        run = 0;
      }
    }
    let current = 0;
    for (let i = list.length - 1; i >= 0 && list[i].count > 0; i--) current++;

    const dow = start.getUTCDay();
    const padded: Day[] = [];
    for (let i = 0; i < dow; i++) padded.push(null);
    for (const d of list) padded.push(d);
    while (padded.length % 7) padded.push(null);

    const weeks: Day[][] = [];
    for (let i = 0; i < padded.length; i += 7) {
      weeks.push(padded.slice(i, i + 7));
    }
    const labels: string[] = [];
    let prev = -1;
    for (const w of weeks) {
      const first = w.find(Boolean) as { key: string } | undefined;
      const m = first
        ? new Date(first.key + "T00:00:00Z").getUTCMonth()
        : prev;
      labels.push(m !== prev ? MONTHS[m] : "");
      prev = m;
    }
    return { weeks, labels, sum, longest, current };
  }, [cache]);

  const total =
    typeof cache?.totalContributions === "number"
      ? cache.totalContributions
      : model.sum;
  const since =
    cache?.memberSince != null && cache.memberSince !== ""
      ? String(new Date(cache.memberSince).getUTCFullYear())
      : "—";
  const publicRepos =
    typeof cache?.publicRepos === "number" ? cache.publicRepos : "—";
  const clientRepos =
    typeof cache?.contributedToTotal === "number"
      ? cache.contributedToTotal
      : (cache?.contributedTo ?? []).length || "—";

  const stats: [string, string][] = [
    [total.toLocaleString("en-US"), "CONTRIBUTIONS / 12 MO"],
    [model.longest + " DAYS", "LONGEST STREAK"],
    [model.current + " DAYS", "CURRENT STREAK"],
    [String(publicRepos), "PUBLIC REPOS"],
    [String(clientRepos), "CLIENT REPOS"],
    [since, "ON GITHUB SINCE"],
  ];

  const repos = (cache?.topRepos?.length
    ? cache.topRepos
    : (cache?.contributedTo ?? [])
  ).slice(0, 5);

  // The calendar is 53 weeks wide and only the last few fit on a phone, so
  // open it on the most recent weeks rather than a year ago.
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [model]);

  return (
    <div>
      <p className="fl-gh-lede">
        Pulled live from the public GitHub API — a year of contributions,
        the streaks, and the public work sitting behind it.
      </p>
      <div className="fl-gh-stats">
        {stats.map(([v, label]) => (
          <div key={label} className="fl-gh-stat">
            <b>{v}</b>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <p className="fl-gh-hint fl-mono" aria-hidden="true">
        DRAG TO SCAN THE FULL YEAR ←
      </p>
      <div className="fl-gh-scroll" ref={scroller}>
        <div className="fl-gh-map" role="img" aria-label={"GitHub contribution calendar — " + total + " contributions, longest streak " + model.longest + " days"}>
          <div className="fl-gh-days" aria-hidden="true">
            <span>MON</span>
            <span>WED</span>
            <span>FRI</span>
          </div>
          <div className="fl-gh-cols">
            {model.weeks.map((w, i) => (
              <span key={i} className="fl-gh-col">
                <span className="fl-gh-m">{model.labels[i]}</span>
                {w.map((d, j) =>
                  !d ? (
                    <i key={j} className="fl-ghc fl-off" />
                  ) : (
                    <i
                      key={j}
                      className={"fl-ghc fl-l" + level(d.count)}
                      title={
                        (d.count
                          ? d.count +
                            " contribution" +
                            (d.count > 1 ? "s" : "")
                          : "No contributions") + " on " + d.key
                      }
                    />
                  ),
                )}
              </span>
            ))}
          </div>
        </div>
        <div className="fl-gh-legend" aria-hidden="true">
          <span>LESS</span>
          <i className="fl-ghc fl-l0" />
          <i className="fl-ghc fl-l1" />
          <i className="fl-ghc fl-l2" />
          <i className="fl-ghc fl-l3" />
          <i className="fl-ghc fl-l4" />
          <span>MORE</span>
        </div>
      </div>
      <p className="fl-gh-cta">
        <a
          href="https://github.com/ArmanAbir2000"
          target="_blank"
          rel="noreferrer"
          data-cursor="OPEN"
        >
          VIEW PROFILE ↗
        </a>
      </p>
      {repos.length > 0 && (
        <div className="fl-gh-repos-full">
          <div className="fl-gh-repos-head">
            <span>RECENT PUBLIC WORK</span>
            <span>{String(repos.length).padStart(2, "0")} REPOS</span>
          </div>
          {repos.map((repo) => {
            const name = repo.includes("/")
              ? repo.split("/")[1]
              : repo;
            return (
              <a
                key={repo}
                className="fl-gh-repo"
                href={"https://github.com/" + repo}
                target="_blank"
                rel="noreferrer"
                data-cursor="OPEN"
              >
                <b>{name.toUpperCase()}</b>
                <span className="fl-gr-url">{repo.toUpperCase()}</span>
                <span className="fl-gr-link">OPEN ↗</span>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
