// Generates brand-consistent typographic covers (2:3 portrait) for the Future
// Worlds. SVG -> PNG via sharp. Run: node scripts/gen-covers.mjs
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const OUT = process.env.COVERS_OUT || "hok-covers";
await mkdir(OUT, { recursive: true });

const projects = [
  { slug: "the-quantum-omen", title: "The Quantum Omen", tag: "AFROFUTURIST EPIC", accent: "#d4af37", logline: "Igbo myth meets ancestral tech. Nnennaya awakens the power to weave voices into strength." },
  { slug: "the-veiled-divinity", title: "The Veiled Divinity", tag: "URBAN FANTASY", accent: "#6ea8ff", logline: "In a city where gods walk among humans, one breaks the ancient rule to befriend a mortal." },
  { slug: "the-veiled-flame-saga", title: "The Veiled Flame Saga", tag: "MULTIVERSE SAGA", accent: "#ff7a3c", logline: "Five fragments of the Origin Flame. Five realms. One collapse to stop: the Hollow God." },
  { slug: "alabaster-egg", title: "The Alabaster Egg", tag: "PROGRESSION FANTASY", accent: "#e8e2d0", logline: "Betrayed and left for dead, a cynic reawakens with the Oracle egg and the power of Anima." },
  { slug: "creature-of-aelyria", title: "Creatures of Aelyria", tag: "MYTHIC WORLDBUILDING", accent: "#7ee787", logline: "A world of sentient species - water-singers and tree-shapers - in fragile harmony." },
  { slug: "the-eternal-balance", title: "The Eternal Balance", tag: "MORAL EPIC", accent: "#c8102e", logline: "Seven sins against seven virtues. One soul must hold the balance of the world." },
  { slug: "the-salt-market-witch", title: "The Salt Market Witch", tag: "MYTHIC FANTASY", accent: "#4fd1c5", logline: "The river remembers. A market witch learns to make the waters listen again." },
  { slug: "last-messages", title: "Last Messages", tag: "SHORT-FILM ANTHOLOGY", accent: "#b0b0b0", logline: "Every message hides a reckoning. A thriller anthology of final words." },
];

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function wrap(text, max) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > max) {
      if (line) lines.push(line.trim());
      line = w;
    } else {
      line += " " + w;
    }
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}

function svgFor(p) {
  const W = 800, H = 1200;
  const titleLines = wrap(p.title, 15);
  const logLines = wrap(p.logline, 38);
  const tfs = titleLines.length > 2 ? 60 : 74;
  const titleSpans = titleLines
    .map((l, i) => `<tspan x="72" dy="${i === 0 ? 0 : Math.round(tfs * 1.05)}">${esc(l)}</tspan>`)
    .join("");
  const logSpans = logLines
    .map((l, i) => `<tspan x="72" dy="${i === 0 ? 0 : 36}">${esc(l)}</tspan>`)
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b0b0c"/><stop offset="1" stop-color="#15151b"/>
    </linearGradient>
    <radialGradient id="orb" cx="0.82" cy="0.18" r="0.7">
      <stop offset="0" stop-color="${p.accent}" stop-opacity="0.30"/>
      <stop offset="1" stop-color="${p.accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#orb)"/>
  <rect x="0" y="0" width="10" height="${H}" fill="${p.accent}"/>
  <circle cx="650" cy="220" r="150" fill="none" stroke="${p.accent}" stroke-opacity="0.28" stroke-width="2"/>
  <circle cx="650" cy="220" r="90" fill="none" stroke="${p.accent}" stroke-opacity="0.18" stroke-width="1.5"/>
  <text x="72" y="130" font-family="Georgia, 'DejaVu Serif', serif" font-size="20" letter-spacing="6" fill="${p.accent}">${esc(p.tag)}</text>
  <text x="72" y="470" font-family="Georgia, 'DejaVu Serif', serif" font-size="${tfs}" font-weight="700" fill="#ede7d6">${titleSpans}</text>
  <text x="72" y="720" font-family="Georgia, 'DejaVu Serif', serif" font-size="27" fill="#c9c3b4">${logSpans}</text>
  <line x1="72" y1="1060" x2="230" y2="1060" stroke="${p.accent}" stroke-width="3"/>
  <text x="72" y="1112" font-family="Georgia, 'DejaVu Serif', serif" font-size="27" letter-spacing="4" fill="#ede7d6">HUIS OF KAY</text>
  <text x="72" y="1144" font-family="Georgia, 'DejaVu Serif', serif" font-size="16" fill="#9a9a9a">huisofkay.studio</text>
</svg>`;
}

for (const p of projects) {
  await sharp(Buffer.from(svgFor(p))).png().toFile(`${OUT}/${p.slug}.png`);
  console.log("cover:", p.slug);
}
console.log("done ->", OUT);
