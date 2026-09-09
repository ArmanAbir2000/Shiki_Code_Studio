// Generates the folio plate set: editorial 16:9 SVG artwork used wherever a
// project has no uploaded cover or screenshots. Run with `npm run plates`.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../public/plates");
mkdirSync(OUT, { recursive: true });

const W = 800;
const H = 450;
const PAPER = "#E9E5D8";
const INK = "#17150F";
const RED = "#E23A21";
const MUTE = "#6B6557";

const rand = (seed) => {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 10000) / 10000;
  };
};

const mono = (x, y, text, size = 18, fill = MUTE, weight = 700) =>
  `<text x="${x}" y="${y}" font-family="'Space Mono',Courier,monospace" font-size="${size}" font-weight="${weight}" letter-spacing="${(size * 0.12).toFixed(1)}" fill="${fill}">${text}</text>`;

const display = (x, y, text, size, fill = INK) =>
  `<text x="${x}" y="${y}" font-family="'Archivo','Arial Black',Arial" font-size="${size}" font-weight="900" letter-spacing="${(-size * 0.03).toFixed(1)}" fill="${fill}">${text}</text>`;

const rect = (x, y, w, h, fill, extra = "") =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra}/>`;

/** Paper ground + registration grid + corner marks, shared by every plate. */
function ground(seed) {
  const r = rand(seed);
  const lines = [];
  for (let x = 100; x < W; x += 100) lines.push(`M${x} 0v${H}`);
  for (let y = 90; y < H; y += 90) lines.push(`M0 ${y}h${W}`);
  return [
    rect(0, 0, W, H, PAPER),
    `<g stroke="${INK}" stroke-opacity=".1"><path d="${lines.join("")}"/></g>`,
    `<g stroke="${INK}" stroke-opacity=".45" stroke-width="1.5">
      <path d="M24 16v16M16 24h16M${W - 24} 16v16M${W - 32} 24h16M24 ${H - 32}v16M16 ${H - 24}h16M${W - 24} ${H - 32}v16M${W - 32} ${H - 24}h16"/>
    </g>`,
    r() > 0.5
      ? rect(0, H - 6, W, 6, RED)
      : rect(0, 0, 6, H, RED),
  ].join("");
}

/** Bottom-left caption block every plate carries — the editorial signature. */
function caption(label, index) {
  return [
    `<g stroke="${INK}" stroke-opacity=".35"><path d="M44 ${H - 74}h240"/></g>`,
    mono(44, H - 48, label, 17, INK),
    mono(44, H - 26, `PLATE ${String(index).padStart(2, "0")} — SHIKI CODE STUDIO`, 12, MUTE),
  ].join("");
}

/* The caption block owns the lower-left corner, so art left of x=300 has to
   stop above this line; art to the right of it may run further down. */
const SAFE = 348;

/** A phone body with a status bar and an app bar, ready for content. */
function phone(x, y, w, h, tint = INK) {
  const r = 18;
  return `<g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${PAPER}" stroke="${tint}" stroke-width="3"/>
    <rect x="${x + 10}" y="${y + 10}" width="${w - 20}" height="${h - 20}" rx="${r - 8}" fill="none" stroke="${tint}" stroke-opacity=".25"/>
    <rect x="${x + w / 2 - 24}" y="${y + 16}" width="48" height="6" rx="3" fill="${tint}" opacity=".55"/>
  </g>`;
}

const PLATES = [
  {
    name: "mobile",
    label: "MOBILE BUILD",
    art(seed) {
      const r = rand(seed);
      const rows = [];
      for (let i = 0; i < 5; i++) {
        const w = 96 + Math.round(r() * 46);
        rows.push(rect(300, 128 + i * 40, 26, 26, i === 1 ? RED : INK, 'opacity=".82"'));
        rows.push(rect(338, 134 + i * 40, w, 8, INK, 'opacity=".7"'));
        rows.push(rect(338, 148 + i * 40, w * 0.62, 6, MUTE, 'opacity=".6"'));
      }
      return [
        phone(74, 56, 182, 292),
        rect(92, 92, 116, 14, INK),
        rect(92, 120, 146, 76, RED, 'opacity=".9"'),
        rect(92, 210, 146, 9, INK, 'opacity=".55"'),
        rect(92, 228, 104, 9, INK, 'opacity=".35"'),
        rect(92, 256, 146, 40, INK, 'opacity=".12"'),
        rect(92, 310, 66, 18, INK),
        `<g stroke="${INK}" stroke-opacity=".3" stroke-dasharray="6 6"><path d="M280 96h430"/></g>`,
        mono(300, 88, "FEATURE-FIRST / STATE / UI", 13),
        ...rows,
        display(596, 148, "APP", 84),
      ].join("");
    },
  },
  {
    name: "commerce",
    label: "COMMERCE FLOW",
    art(seed) {
      const r = rand(seed);
      const cards = [];
      for (let i = 0; i < 6; i++) {
        const cx = 300 + (i % 3) * 152;
        const cy = 92 + Math.floor(i / 3) * 150;
        cards.push(rect(cx, cy, 128, 126, PAPER, `stroke="${INK}" stroke-opacity=".55"`));
        cards.push(rect(cx + 12, cy + 12, 104, 62, i === 2 ? RED : INK, `opacity="${(0.2 + r() * 0.55).toFixed(2)}"`));
        cards.push(rect(cx + 12, cy + 86, 72, 7, INK, 'opacity=".7"'));
        cards.push(rect(cx + 12, cy + 100, 44, 7, MUTE, 'opacity=".6"'));
      }
      return [
        phone(74, 52, 176, 292),
        rect(92, 88, 140, 52, INK, 'opacity=".85"'),
        rect(92, 154, 140, 8, INK, 'opacity=".5"'),
        rect(92, 172, 96, 8, INK, 'opacity=".3"'),
        rect(92, 198, 140, 30, RED),
        mono(104, 219, "ADD TO CART", 12, PAPER),
        rect(92, 244, 66, 8, MUTE, 'opacity=".5"'),
        ...cards,
        `<circle cx="726" cy="60" r="19" fill="${RED}"/>`,
        mono(719, 66, "3", 16, PAPER, 700),
        mono(300, 76, "CATALOG · CART · CHECKOUT", 13),
      ].join("");
    },
  },
  {
    name: "marketplace",
    label: "LISTING FEED",
    art(seed) {
      const r = rand(seed);
      const feed = [];
      for (let i = 0; i < 4; i++) {
        const y = 132 + i * 66;
        feed.push(rect(300, y, 400, 54, PAPER, `stroke="${INK}" stroke-opacity=".45"`));
        feed.push(rect(310, y + 10, 52, 34, i === 0 ? RED : INK, `opacity="${(0.25 + r() * 0.5).toFixed(2)}"`));
        feed.push(rect(376, y + 15, 150 + Math.round(r() * 110), 8, INK, 'opacity=".7"'));
        feed.push(rect(376, y + 31, 92, 6, MUTE, 'opacity=".6"'));
        feed.push(mono(650, y + 34, "SAVE", 11, MUTE));
      }
      return [
        phone(70, 52, 180, 292),
        rect(86, 88, 148, 24, PAPER, `stroke="${INK}" stroke-width="2"`),
        mono(96, 105, "SEARCH…", 12, MUTE),
        ...[0, 1, 2].map((i) => rect(86 + i * 51, 124, 43, 16, INK, i === 0 ? "" : 'opacity=".2"')),
        ...[0, 1, 2].map((i) => rect(86, 156 + i * 58, 148, 48, INK, `opacity="${(0.1 + i * 0.1).toFixed(2)}"`)),
        rect(300, 88, 400, 2, INK, 'opacity=".55"'),
        mono(300, 78, "FEED · CATEGORIES · SAVED", 13),
        display(566, 414, "FEED", 44, INK),
        ...feed,
      ].join("");
    },
  },
  {
    name: "dashboard",
    label: "DATA CONSOLE",
    art(seed) {
      const r = rand(seed);
      const bars = [];
      for (let i = 0; i < 12; i++) {
        const h = 24 + Math.round(r() * 128);
        bars.push(rect(316 + i * 32, 268 - h, 20, h, i === 8 ? RED : INK, i === 8 ? "" : 'opacity=".72"'));
      }
      const rows = [];
      for (let i = 0; i < 4; i++) {
        rows.push(rect(316, 300 + i * 28, 380, 1, INK, 'opacity=".3"'));
        rows.push(rect(316, 308 + i * 28, 120 + Math.round(r() * 90), 7, INK, 'opacity=".55"'));
        rows.push(rect(600, 308 + i * 28, 52, 7, MUTE, 'opacity=".6"'));
      }
      return [
        rect(70, 62, 190, 286, PAPER, `stroke="${INK}" stroke-width="2"`),
        mono(86, 92, "OVERVIEW", 13, INK),
        ...[0, 1, 2, 3].map((i) =>
          [
            rect(86, 108 + i * 58, 158, 44, INK, `opacity="${i === 1 ? 0.9 : 0.12}"`),
            mono(98, 137 + i * 58, ["1.2K", "98%", "24H", "512"][i], 19, i === 1 ? PAPER : INK),
          ].join(""),
        ),
        mono(316, 96, "THROUGHPUT / 12 WEEKS", 13),
        rect(316, 270, 380, 2, INK, 'opacity=".6"'),
        ...bars,
        ...rows,
        display(560, 128, "OPS", 66),
      ].join("");
    },
  },
  {
    name: "api",
    label: "API SURFACE",
    art() {
      const nodes = [
        [340, 120],
        [520, 96],
        [520, 196],
        [688, 148],
      ];
      const edges = nodes
        .slice(0, 3)
        .map(([x, y], i) => `M${x + 46} ${y + 18}L${nodes[i + 1][0]} ${nodes[i + 1][1] + 18}`)
        .join("");
      return [
        rect(70, 62, 190, 286, PAPER, `stroke="${INK}" stroke-width="2"`),
        mono(86, 92, "POST /v1/orders", 13, INK),
        ...[0, 1, 2, 3, 4].map((i) =>
          rect(86, 110 + i * 26, [140, 108, 158, 92, 124][i], 8, i === 2 ? RED : INK, i === 2 ? "" : 'opacity=".55"'),
        ),
        rect(86, 258, 158, 1, INK, 'opacity=".4"'),
        mono(86, 286, "200 OK · 84MS", 13, MUTE),
        `<g stroke="${INK}" stroke-opacity=".6" stroke-width="2" stroke-dasharray="7 7"><path d="${edges}"/></g>`,
        ...nodes.map(([x, y], i) =>
          [
            rect(x, y, 92, 36, i === 3 ? RED : PAPER, `stroke="${INK}" stroke-width="2"`),
            mono(x + 12, y + 24, ["APP", "GATE", "AUTH", "DB"][i], 12, i === 3 ? PAPER : INK),
          ].join(""),
        ),
        display(340, 330, "{ }", 120, INK),
        mono(470, 320, "VERSIONED REST · JSON", 13),
        mono(470, 344, "LARAVEL · SANCTUM · QUEUE", 13),
      ].join("");
    },
  },
  {
    name: "tooling",
    label: "INTERNAL TOOLING",
    art(seed) {
      const r = rand(seed);
      const lines = [];
      for (let i = 0; i < 8; i++) {
        lines.push(mono(126, 142 + i * 24, i % 3 === 0 ? "$" : "›", 14, i % 3 === 0 ? RED : MUTE));
        lines.push(rect(148, 133 + i * 24, 140 + Math.round(r() * 300), 8, INK, `opacity="${(0.3 + r() * 0.45).toFixed(2)}"`));
      }
      return [
        rect(104, 62, 596, 262, PAPER, `stroke="${INK}" stroke-width="3"`),
        rect(104, 62, 596, 32, INK),
        mono(120, 83, "SHIKI://BUILD-PIPELINE", 13, PAPER),
        `<circle cx="672" cy="78" r="6" fill="${RED}"/>`,
        ...lines,
        rect(148, 330, 12, 14, RED),
        display(330, 400, "CLI", 44, INK),
      ].join("");
    },
  },
  {
    name: "realtime",
    label: "REALTIME LAYER",
    art(seed) {
      const r = rand(seed);
      const bubbles = [];
      for (let i = 0; i < 5; i++) {
        const right = i % 2 === 1;
        const w = 150 + Math.round(r() * 130);
        const x = right ? 700 - w : 300;
        const y = 116 + i * 54;
        bubbles.push(rect(x, y, w, 40, right ? INK : PAPER, right ? "" : `stroke="${INK}" stroke-width="2"`));
        bubbles.push(rect(x + 14, y + 14, w - 60, 7, right ? PAPER : INK, 'opacity=".6"'));
      }
      return [
        phone(70, 52, 180, 292),
        rect(86, 86, 148, 22, INK, 'opacity=".85"'),
        ...[0, 1, 2, 3].map((i) =>
          rect(86, 120 + i * 42, i % 2 ? 106 : 148, 30, i % 2 ? RED : INK, i % 2 ? 'opacity=".85"' : 'opacity=".14"'),
        ),
        rect(86, 296, 148, 26, PAPER, `stroke="${INK}" stroke-width="2"`),
        mono(300, 92, "SOCKET · FCM · PRESENCE", 13),
        ...bubbles,
        `<g stroke="${RED}" stroke-width="3"><path d="M300 400h400"/></g>`,
        mono(300, 424, "DELIVERED — 32MS ROUND TRIP", 12, MUTE),
      ].join("");
    },
  },
  {
    name: "field",
    label: "FIELD OPERATIONS",
    art(seed) {
      const r = rand(seed);
      const streets = [];
      for (let i = 1; i < 7; i++) streets.push(`M${300 + i * 66} 70v300`);
      for (let i = 1; i < 5; i++) streets.push(`M300 ${70 + i * 62}h396`);
      const pins = [0, 1, 2].map((i) => {
        const x = 340 + Math.round(r() * 320);
        const y = 120 + Math.round(r() * 200);
        return `<g><circle cx="${x}" cy="${y}" r="9" fill="${i === 0 ? RED : INK}"/><circle cx="${x}" cy="${y}" r="19" fill="none" stroke="${i === 0 ? RED : INK}" stroke-opacity=".5"/></g>`;
      });
      return [
        phone(70, 52, 180, 292),
        rect(86, 86, 148, 138, INK, 'opacity=".14"'),
        `<circle cx="160" cy="155" r="12" fill="${RED}"/>`,
        ...[0, 1, 2].map((i) => rect(86, 238 + i * 32, 148, 22, INK, `opacity="${(0.5 - i * 0.14).toFixed(2)}"`)),
        rect(300, 70, 396, 300, PAPER, `stroke="${INK}" stroke-width="2"`),
        `<g stroke="${INK}" stroke-opacity=".28"><path d="${streets.join("")}"/></g>`,
        `<g stroke="${RED}" stroke-width="4" fill="none"><path d="M330 340C420 320 430 180 540 168 620 160 640 120 676 104"/></g>`,
        ...pins,
        mono(300, 402, "ATTENDANCE · GEOFENCE · SYNC", 13),
      ].join("");
    },
  },
  {
    name: "author",
    label: "THE AUTHOR",
    art() {
      const rules = [];
      for (let i = 0; i < 9; i++) {
        rules.push(`M470 ${104 + i * 26}h${230 - (i % 3) * 54}`);
      }
      return [
        rect(70, 40, 330, 306, INK, 'opacity=".08"'),
        `<circle cx="235" cy="168" r="76" fill="${INK}" opacity=".82"/>`,
        `<path d="M129 346c0-58 47-104 106-104s106 46 106 104z" fill="${INK}" opacity=".82"/>`,
        `<circle cx="235" cy="168" r="76" fill="none" stroke="${RED}" stroke-width="4"/>`,
        rect(70, 40, 330, 6, RED),
        mono(470, 74, "PORTRAIT — DHAKA, BANGLADESH", 13, INK),
        `<g stroke="${INK}" stroke-opacity=".38"><path d="${rules.join("")}"/></g>`,
        display(470, 396, "ARMAN", 58),
      ].join("");
    },
  },
];

const svg = (body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img">${body}</svg>\n`;

PLATES.forEach((plate, i) => {
  const seed = 1234 + i * 977;
  const body = ground(seed) + plate.art(seed) + caption(plate.label, i + 1);
  writeFileSync(`${OUT}/plate-${plate.name}.svg`, svg(body));
});

/** Screenshot placeholders — cropped UI details for project galleries. */
const SHOTS = [
  {
    name: "ui",
    label: "SHOT — UI DETAIL",
    art() {
      return [
        rect(60, 62, 320, 284, PAPER, `stroke="${INK}" stroke-width="3"`),
        rect(60, 62, 320, 36, INK),
        mono(78, 86, "COMPONENTS", 13, PAPER),
        ...[0, 1, 2, 3, 4].map((i) =>
          [
            rect(84, 116 + i * 44, 272, 34, PAPER, `stroke="${INK}" stroke-opacity=".4"`),
            rect(96, 127 + i * 44, 20, 12, i === 1 ? RED : INK, 'opacity=".8"'),
            rect(128, 129 + i * 44, 150, 8, INK, 'opacity=".5"'),
          ].join(""),
        ),
        rect(420, 62, 320, 150, RED, 'opacity=".9"'),
        rect(420, 232, 320, 60, INK, 'opacity=".16"'),
        rect(420, 312, 200, 14, INK, 'opacity=".6"'),
        rect(420, 340, 130, 14, INK, 'opacity=".35"'),
      ].join("");
    },
  },
  {
    name: "flow",
    label: "SHOT — USER FLOW",
    art() {
      const boxes = [0, 1, 2, 3].map((i) => {
        const x = 70 + i * 178;
        return [
          rect(x, 150, 140, 120, i === 2 ? RED : PAPER, `stroke="${INK}" stroke-width="3"`),
          mono(x + 16, 186, ["OPEN", "BROWSE", "BUY", "TRACK"][i], 14, i === 2 ? PAPER : INK),
          ...[0, 1, 2].map((j) =>
            rect(x + 16, 202 + j * 18, 108 - j * 26, 7, i === 2 ? PAPER : INK, 'opacity=".55"'),
          ),
          i < 3
            ? `<g stroke="${INK}" stroke-width="3"><path d="M${x + 146} 210h24"/></g>`
            : "",
        ].join("");
      });
      return [mono(70, 108, "PRIMARY JOURNEY — FOUR STEPS", 15, INK), ...boxes].join("");
    },
  },
  {
    name: "metrics",
    label: "SHOT — RELEASE METRICS",
    art(seed) {
      const r = rand(seed);
      const pts = [];
      for (let i = 0; i <= 10; i++) {
        pts.push(`${70 + i * 66},${SAFE - 18 - Math.round(50 + r() * 160)}`);
      }
      return [
        mono(70, 108, "CRASH-FREE SESSIONS / RELEASE", 15, INK),
        `<g stroke="${INK}" stroke-opacity=".55" stroke-width="2"><path d="M70 ${SAFE}h660"/></g>`,
        `<polyline points="${pts.join(" ")}" fill="none" stroke="${RED}" stroke-width="4"/>`,
        ...pts.map((p) => {
          const [x, y] = p.split(",");
          return `<circle cx="${x}" cy="${y}" r="5" fill="${INK}"/>`;
        }),
        mono(430, 400, "V1.0 → V1.9", 13, MUTE),
        display(560, 150, "99.4", 64, INK),
      ].join("");
    },
  },
  {
    name: "type",
    label: "SHOT — DESIGN SYSTEM",
    art() {
      return [
        display(64, 190, "Aa", 150, INK),
        mono(64, 240, "ARCHIVO · INSTRUMENT SERIF · SPACE MONO", 14, MUTE),
        ...[0, 1, 2, 3, 4].map((i) =>
          rect(64 + i * 78, 274, 62, 62, [INK, RED, MUTE, INK, RED][i], `opacity="${[1, 1, 0.8, 0.3, 0.35][i]}"`),
        ),
        rect(470, 70, 266, 160, PAPER, `stroke="${INK}" stroke-width="3"`),
        ...[0, 1, 2, 3].map((i) =>
          rect(490, 96 + i * 32, 226 - i * 40, 12, INK, `opacity="${(0.75 - i * 0.16).toFixed(2)}"`),
        ),
      ].join("");
    },
  },
];

SHOTS.forEach((shot, i) => {
  const seed = 9001 + i * 733;
  const body = ground(seed) + shot.art(seed) + caption(shot.label, i + 1);
  writeFileSync(`${OUT}/shot-${shot.name}.svg`, svg(body));
});

console.log(
  `Wrote ${PLATES.length} plates + ${SHOTS.length} shot placeholders to public/plates/`,
);
