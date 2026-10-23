/* Atahualpa Chess · move choice "al estilo de Kasparov"
 *
 * 1. Opening book (book.json): Kasparov's own moves from his classical games; where he never
 *    reached the position, moves of the other nine world champions; then named theory lines
 *    (lichess-org/chess-openings, CC0). Every book move is checked by Stockfish before it is played.
 * 2. After the book: Stockfish at the level's limited strength proposes a move. Among the moves of
 *    the SAME quality (within ±eps centipawns of that move, full-strength evaluation) Atahualpa
 *    prefers Kasparov's traits: initiative, checks, pieces aimed at the enemy king, pawn storms,
 *    activity, keeping queens and bishops on the board. The level's strength is therefore kept.
 *
 * Works in the browser (window.AtahualpaAI) and in Node (module.exports) with chess.js 0.10.
 */
(function (root) {
  "use strict";
  let BOOK = null;
  const LEVEL_BOOK_PLIES = { basico: 12, intermedio: 18, avanzado: 24 };
  const LEVEL_EPS = { basico: 30, intermedio: 25, avanzado: 20 };       // same-quality window (cp)
  const LEVEL_ANALYSIS = { basico: 8, intermedio: 9, avanzado: 10 };    // full-strength depth
  const ADVANTAGE = 50;      // cp: from here on Atahualpa considers itself better and refuses repetitions
  const KEEP = 15;           // cp: a non-repeating alternative must still be at least this good
  const BOOK_TOLERANCE = { k: 60, c: 40, t: 30 };                       // cp below best allowed
  const VAL = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

  const posKey = g => g.fen().split(" ").slice(0, 4).join(" ");
  const sq = s => [s.charCodeAt(0) - 97, +s[1] - 1];
  const dist = (a, b) => { const [x1, y1] = sq(a), [x2, y2] = sq(b); return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2)); };
  const uciOf = m => m.from + m.to + (m.promotion || "");

  function kingSquare(g, color) {
    const b = g.board();
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
      const p = b[r][c]; if (p && p.type === "k" && p.color === color) return "abcdefgh"[c] + (8 - r);
    }
    return null;
  }
  // Mobility of `color` in the current position (side to move swapped when needed).
  function mobility(Chess, g, color) {
    if (g.turn() === color) return g.moves().length;
    const f = g.fen().split(" "); f[1] = color; f[3] = "-";
    const h = new Chess(); if (!h.load(f.join(" "))) return 0;
    return h.moves().length;
  }

  /** Style bonus in centipawns for move m (verbose chess.js move) in position g. */
  function styleBonus(Chess, g, m, mobBefore) {
    const me = g.turn(), opp = me === "w" ? "b" : "w";
    const K = kingSquare(g, opp); if (!K) return { bonus: 0, why: [] };
    const fwd = me === "w" ? 1 : -1;
    let b = 0, why = [];
    const h = new Chess(g.fen()); const r = h.move({ from: m.from, to: m.to, promotion: m.promotion });
    if (!r) return { bonus: 0, why: [] };
    if (r.san.includes("#")) return { bonus: 500, why: ["mate"] };
    if (r.san.includes("+")) { b += 10; why.push("check"); }
    if (m.piece !== "k" && m.piece !== "p") {
      const dTo = dist(m.to, K), dFrom = dist(m.from, K);
      if (dTo <= 2) { b += m.piece === "q" ? 10 : 8; why.push("near_king"); }
      else if (dTo < dFrom) b += 3;
      const back = (sq(m.from)[1] - sq(m.to)[1]) * fwd;   // ranks moved toward own side
      if (!m.captured && back >= 2) { b -= 6; why.push("retreat"); }
    }
    if (m.captured && dist(m.to, K) <= 2) { b += 5; why.push("opens_king"); }
    if (m.piece === "p") {
      const kf = sq(K)[0], pf = sq(m.from)[0];
      const kingOnWing = kf <= 2 || kf >= 5, myK = kingSquare(g, me);
      const myWingSafe = myK && Math.abs(sq(myK)[0] - kf) >= 3;
      if (kingOnWing && Math.abs(pf - kf) <= 1 && !m.captured && myWingSafe) { b += 7; why.push("pawn_storm"); }
      const tr = sq(m.to)[1], tf = sq(m.to)[0];
      if (tf >= 2 && tf <= 5 && tr >= 3 && tr <= 4) b += 3;   // central space (ranks 4-5)
    }
    if (m.captured === "q" && m.piece === "q") { b -= 12; why.push("keeps_queens"); }
    if (m.piece === "b" && m.captured === "n") b -= 5;   // keeps the bishop pair
    if (mobBefore != null) {
      const after = mobility(Chess, h, me);
      b += Math.max(-10, Math.min(10, (after - mobBefore) * 0.6));
    }
    return { bonus: b, why };
  }

  function pickWeighted(list, rng) {
    const tot = list.reduce((s, x) => s + x.w, 0); let t = rng() * tot;
    for (const x of list) { t -= x.w; if (t <= 0) return x; }
    return list[list.length - 1];
  }

  /** Book candidates for the position, or [] when out of book for this level. */
  function bookCandidates(g, level) {
    if (!BOOK) return [];
    const plies = g.history().length;
    if (plies >= Math.min(BOOK.maxPly, LEVEL_BOOK_PLIES[level] || 18)) return [];
    const e = BOOK.pos[posKey(g)]; if (!e) return [];
    const layer = e[0], moves = e.slice(1);
    const top = moves[0][1];
    return moves.filter(([, w]) => w >= Math.max(layer === "t" ? 1 : 2, top * 0.1))
      .map(([u, w]) => ({ uci: u, w: Math.pow(w, 1.2), layer }));
  }

  /** Name of the opening reached so far: [eco, name] or null. */
  function openingOf(Chess, history) {
    if (!BOOK) return null;
    const g = new Chess(); let found = BOOK.names[posKey(g)] || null;
    for (const san of history) { if (!g.move(san)) break; const n = BOOK.names[posKey(g)]; if (n) found = n; }
    return found;
  }

  /**
   * Decide Atahualpa's move.
   * engine.limited(fen) -> uci   (Stockfish with the level's UCI_Elo, as calibrated)
   * engine.analyse(fen, depth, multipv) -> [{uci, cp}] best first, cp from side to move (full strength)
   */
  async function chooseMove(args) {
    const r = await pickMove(args);
    try { return await avoidRepetition(args, r); } catch (e) { return r; }
  }

  // Positions already seen in this game (first four FEN fields, as in the threefold-repetition rule).
  function seenPositions(Chess, history) {
    const g = new Chess(), seen = new Set([posKey(g)]);
    for (const san of history) { if (!g.move(san)) break; seen.add(posKey(g)); }
    return seen;
  }
  function repeats(Chess, fen, uci, seen) {
    const h = new Chess(fen); const m = h.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
    return !!m && seen.has(posKey(h));
  }

  /** When Atahualpa is better, never steer into a position that already occurred (repetition draw). */
  async function avoidRepetition({ Chess, fen, history, level, engine, hurry }, r) {
    if (!r || !r.uci || r.source === "forced") return r;
    const seen = seenPositions(Chess, history);
    if (!repeats(Chess, fen, r.uci, seen)) return r;
    if (hurry) return r;
    const an = await engine.analyse(fen, LEVEL_ANALYSIS[level] || 9, 5);
    if (!an || !an.length) return r;
    const legal = new Chess(fen).moves({ verbose: true }).map(uciOf);
    const fresh = legal.filter(u => !repeats(Chess, fen, u, seen));
    if (!fresh.length) return r;
    let best = an.filter(a => fresh.includes(a.uci)).sort((a, b) => b.cp - a.cp)[0];
    if (!best) {   // every move in the top 5 repeats: search only the non-repeating moves
      const one = await engine.analyse(fen, LEVEL_ANALYSIS[level] || 9, 1, fresh.join(" "));
      best = one && one[0];
    }
    const top = Math.max(an[0].cp, best ? best.cp : -Infinity);
    if (top < ADVANTAGE) return r;                 // not better: a repetition is acceptable
    if (!best || best.cp < KEEP) return r;         // only alternatives lose the advantage: keep the draw
    return { uci: best.uci, source: "norepeat", cp: best.cp };
  }

  async function pickMove({ Chess, fen, history, level, engine, rng = Math.random, hurry = false }) {
    const g = new Chess(fen);
    // replay history so the book sees the right ply count
    const gh = new Chess(); for (const san of history) gh.move(san);
    if (gh.fen() !== fen) { gh.load(fen); }
    const legal = g.moves({ verbose: true });
    if (legal.length === 1) return { uci: uciOf(legal[0]), source: "forced" };

    // 1) Opening book
    const cands = hurry ? [] : bookCandidates(gh, level);
    if (cands.length) {
      const pick = pickWeighted(cands, rng);
      let ok = true;
      try {
        const an = await engine.analyse(fen, 10, 4);
        if (an && an.length) {
          const best = an[0].cp, mine = an.find(x => x.uci === pick.uci);
          const tol = BOOK_TOLERANCE[pick.layer];
          ok = mine ? best - mine.cp <= tol : false;
          if (!mine) {   // not in top 4: evaluate it alone
            const one = await engine.analyse(fen, 10, 1, pick.uci);
            ok = !!(one && one[0] && best - one[0].cp <= tol);
          }
        }
      } catch (e) { ok = true; }
      if (ok) return { uci: pick.uci, source: "book", layer: pick.layer };
    }

    // 2) Level move from Stockfish (calibrated strength)
    const M = await engine.limited(fen);
    if (!M || hurry) return { uci: M, source: "engine" };

    // 3) Kasparov tie-break among moves of the same quality
    let an = null;
    try { an = await engine.analyse(fen, LEVEL_ANALYSIS[level] || 9, 5); } catch (e) { an = null; }
    if (!an || !an.length) return { uci: M, source: "engine" };
    const mEntry = an.find(x => x.uci === M);
    if (!mEntry) return { uci: M, source: "engine" };          // level move is outside top 5: keep it
    const eps = LEVEL_EPS[level] || 25;
    const mobBefore = mobility(Chess, g, g.turn());
    let best = null;
    for (const a of an) {
      if (Math.abs(a.cp - mEntry.cp) > eps) continue;
      const mv = legal.find(x => uciOf(x) === a.uci); if (!mv) continue;
      const sb = styleBonus(Chess, g, mv, mobBefore);
      const val = sb.bonus + 0.5 * (a.cp - mEntry.cp) + (a.uci === M ? 4 : 0);   // small preference for the level move
      if (!best || val > best.val) best = { uci: a.uci, val, why: sb.why };
    }
    if (!best || best.uci === M) return { uci: M, source: "engine" };
    return { uci: best.uci, source: "style", why: best.why };
  }

  const api = {
    setBook(b) { BOOK = b; }, hasBook() { return !!BOOK; },
    bookCandidates, openingOf, chooseMove, styleBonus, seenPositions, repeats,
    LEVEL_BOOK_PLIES, LEVEL_EPS,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.AtahualpaAI = api;
})(typeof self !== "undefined" ? self : this);
