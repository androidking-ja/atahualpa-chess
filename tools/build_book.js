// Builds book.json for Atahualpa Chess.
// Layer 1 "k": Kasparov's own moves (classical games only), weighted by frequency and result.
// Layer 2 "c": moves by the other nine world champions in their classical games.
// Layer 3 "t": named theory lines from lichess-org/chess-openings (CC0), also gives ECO + names.
// Key = first 4 FEN fields as produced by chess.js 0.10 (the same library the game uses).
const fs = require("fs");
const { Chess } = require("/home/claude/atahualpa/app/chess.js");
const DIR = "/home/claude/book/atm/";
const MAX_PLY = 24;
const FAST = /blitz|rapid|simul|internet|blind|exhib|clock|active|speed|bullet|armageddon|bundesliga.*rapid|tv|online|odds|consult|knock.?out.*tie|playoff|play-off|tiebreak|tie-break|960|fischerandom|fischer random/i;

const key = g => g.fen().split(" ").slice(0, 4).join(" ");
function parsePgn(text) {
  const games = [];
  for (const block of text.split(/\n(?=\[Event )/)) {
    const tags = {};
    block.replace(/^\[(\w+) "(.*)"\]/gm, (_, k, v) => (tags[k] = v));
    const body = block.replace(/^\[.*\]$/gm, "").replace(/\{[^}]*\}/g, " ").replace(/\([^()]*\)/g, " ")
      .replace(/\$\d+/g, " ").replace(/\d+\.(\.\.)?/g, " ");
    const toks = body.split(/\s+/).filter(t => t && !/^(1-0|0-1|1\/2-1\/2|\*)$/.test(t));
    games.push({ tags, sans: toks.slice(0, MAX_PLY) });
  }
  return games;
}
const score = (res, color) => res === "1/2-1/2" ? 0.5 : (res === "1-0") === (color === "w") ? 1 : 0;
const add = (book, layer, k, uci, w) => {
  const e = (book[k] = book[k] || {}); const l = (e[layer] = e[layer] || {});
  l[uci] = (l[uci] || 0) + w;
};
const isK = n => /^Kasparov, ?(Gary|Garry|G)\b|^Kasparov,G$/.test(n || "");

const book = {}; const names = {};
let used = { k: 0, c: 0 }, skipped = 0;
for (const f of fs.readdirSync(DIR).filter(f => f.endsWith(".pgn"))) {
  const champ = f.replace(".pgn", "");
  for (const gm of parsePgn(fs.readFileSync(DIR + f, "latin1"))) {
    const t = gm.tags;
    if (!t.Result || t.Result === "*" || FAST.test(t.Event || "") || (t.FEN)) { skipped++; continue; }
    if (+((t.Date || "").slice(0, 4)) < 1900) { skipped++; continue; }
    const kasp = f === "Kasparov.pgn";
    const champColor = kasp ? (isK(t.White) ? "w" : isK(t.Black) ? "b" : null)
      : (new RegExp("^"+champ, "i").test(t.White) ? "w" : new RegExp("^"+champ, "i").test(t.Black) ? "b" : null);
    if (!champColor) { skipped++; continue; }
    const g = new Chess(); const layer = kasp ? "k" : "c";
    for (const san of gm.sans) {
      const k = key(g); const turn = g.turn(); const m = g.move(san, { sloppy: true });
      if (!m) break;
      if (turn === champColor) add(book, layer, k, m.from + m.to + (m.promotion || ""), 1 + score(t.Result, champColor));
    }
    used[layer]++;
  }
}
// Theory lines + opening names
let lines = 0;
for (const f of "abcde") {
  for (const row of fs.readFileSync(`/home/claude/book/chess-openings/${f}.tsv`, "utf8").split("\n").slice(1)) {
    const [eco, name, pgn] = row.split("\t"); if (!pgn) continue;
    const g = new Chess(); let ok = true;
    for (const san of pgn.replace(/\d+\.(\.\.)?/g, " ").split(/\s+/).filter(Boolean)) {
      const k = key(g); const m = g.move(san, { sloppy: true }); if (!m) { ok = false; break; }
      add(book, "t", k, m.from + m.to + (m.promotion || ""), 1);
    }
    if (ok) { names[key(g)] = [eco, name]; lines++; }
  }
}
// Compact: per position keep the best layer's moves, drop one-off champion moves (noise), round weights
const out = {}; let pos = { k: 0, c: 0, t: 0 };
for (const [k, e] of Object.entries(book)) {
  let layer = null, moves = null;
  if (e.k) { layer = "k"; moves = e.k; }
  else if (e.c) { const f = Object.entries(e.c).filter(([, w]) => w >= 3); if (f.length) { layer = "c"; moves = Object.fromEntries(f); } }
  if (!layer && e.t) { layer = "t"; moves = e.t; }
  if (!layer) continue;
  out[k] = [layer, ...Object.entries(moves).sort((a, b) => b[1] - a[1]).map(([u, w]) => [u, Math.round(w * 2) / 2])];
  pos[layer]++;
}
fs.writeFileSync("/home/claude/book/book.json", JSON.stringify({ v: 1, maxPly: MAX_PLY, pos: out, names }));
console.log({ games: used, skipped, theoryLines: lines, positions: pos, names: Object.keys(names).length,
  bytes: fs.statSync("/home/claude/book/book.json").size });
