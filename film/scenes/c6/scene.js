/* Chapter 6: the plan again with every box proved in Lean, the real source of the final
   assembly, the statement clause by clause, the real axiom report, the omission on the manuscript's
   page, what the check does not certify, and the caution about the interval. Picture is a function of t. */
const tl = installBeats(window.__BEATS__);
const events = [];
function mark(t, beat, what) {
  events.push({ t: Math.round(t * 1000) / 1000, beat: beat, what: what });
}

const KATEX_OPTS = { throwOnError: false, trust: true, strict: false, displayMode: false, output: "html" };
const TEX = {
  "δ": "\\delta",
  "Ω": "\\Omega",
  "μ": "\\mu",
  "≥": "\\ge",
  "≤": "\\le",
  "…": "\\ldots",
  "≪": "\\ll",
  "≠": "\\neq",
  "∈": "\\in",
  "∀": "\\forall",
  "∃": "\\exists",
  "∧": "\\land",
  "→": "\\to",
  "ℕ": "\\mathbb{N}",
  "ℝ": "\\mathbb{R}",
  "ℂ": "\\mathbb{C}",
  "ᵐ": "^{m}",
};

function mathSpan(tex) {
  const wrap = document.createElement("span");
  wrap.className = "t-code";
  const sym = document.createElement("span");
  sym.className = "lean-sym";
  katex.render(tex, sym, KATEX_OPTS);
  wrap.appendChild(sym);
  return wrap;
}

function fillRich(el) {
  const text = el.textContent;
  if (!text) return;
  let special = false;
  const chars = Array.from(text);
  for (let i = 0; i < chars.length; i++) {
    if (TEX[chars[i]] || chars[i] === "₁" || chars[i] === "₂") special = true;
  }
  if (!special) return;
  el.textContent = "";
  let buf = "";
  function flush() {
    if (!buf) return;
    el.appendChild(document.createTextNode(buf));
    buf = "";
  }
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const next = chars[i + 1];
    if (ch === "E" && (next === "₁" || next === "₂")) {
      flush();
      el.appendChild(mathSpan(next === "₁" ? "E_{1}" : "E_{2}"));
      i += 1;
      continue;
    }
    if (TEX[ch]) {
      flush();
      el.appendChild(mathSpan(TEX[ch]));
      continue;
    }
    buf += ch;
  }
  flush();
}

function fixLean(root) {
  const lines = root.querySelectorAll(".lean-line");
  for (let i = 0; i < lines.length; i++) {
    const kids = Array.prototype.slice.call(lines[i].childNodes);
    for (let k = 0; k < kids.length; k++) {
      const sym = kids[k];
      if (!sym.classList || !sym.classList.contains("lean-sym")) continue;
      const raw = sym.textContent.trim();
      const prev = sym.previousSibling;
      if ((raw === "₁" || raw === "₂") && prev && prev.classList && !prev.classList.contains("lean-sym")) {
        const prevText = prev.textContent;
        if (prevText.charAt(prevText.length - 1) === "E") {
          prev.textContent = prevText.slice(0, -1);
          sym.textContent = "";
          katex.render(raw === "₁" ? "E_{1}" : "E_{2}", sym, KATEX_OPTS);
          continue;
        }
      }
      if (TEX[raw]) {
        sym.textContent = "";
        katex.render(TEX[raw], sym, KATEX_OPTS);
      }
    }
  }
}

function richLines(root) {
  const nodes = root.querySelectorAll(".plain-line, .strong, .ledger-line");
  for (let i = 0; i < nodes.length; i++) fillRich(nodes[i]);
  fixLean(root);
}

// ---------------------------------------------------------------- c6b4-c6b7: clause by clause
const stage = document.createElement("div");
stage.style.position = "absolute";
stage.style.left = "0";
stage.style.top = "0";
stage.style.width = "1920px";
stage.style.height = "1080px";
stage.style.visibility = "hidden";
document.body.appendChild(stage);

const colW = Math.floor((span(0, 12).w - 48) / 2);
function clauseRow(y, h, left, right) {
  return sideBySide({
    parent: stage,
    x: span(0, 12).x,
    y: y,
    colW: colW,
    rowH: h,
    gap: 0,
    left: [left],
    right: [right],
    pairs: [[left.id, right.id]],
    schedule: {},
  });
}

let rowY = 96;
clauseRow(rowY, 78, { id: "c1", lines: ["every d ≥ 3 has a width bound δ"] }, { id: "r1", lines: ["∀ d : ℕ, 3 ≤ d → ∃ δ : ℝ, 0 < δ ∧"] });
rowY += 78 + 10;
clauseRow(rowY, 78, { id: "c2a", lines: ["every [a, b] narrower than δ"] }, { id: "r2a", lines: ["∀ a b : ℝ, a < b → b - a < δ →"] });
rowY += 78 + 8;
clauseRow(rowY, 78, { id: "c2b", lines: ["has an interval (E₁, E₂)"] }, { id: "r2b", lines: ["∃ E₁ E₂ : ℝ, E₁ < E₂ ∧"] });
rowY += 78 + 10;
clauseRow(rowY, 160, {
  id: "c3",
  lines: ["any independent uniform energies;", "almost surely the operator exists"],
}, {
  id: "r3",
  lines: [
    "∀ Ω … V, iIndepFun V volume →",
    "(∀ n, pdf.IsUniform (V n) …) →",
    "∀ᵐ ω, (∃ T, IsAndersonOperator …) ∧",
  ],
});
rowY += 160 + 10;
clauseRow(rowY, 76, { id: "sp", lines: ["interval in the spectrum"] }, { id: "rsp", lines: ["(∀ E ∈ Ioo E₁ E₂, E ∈ spectrum ℂ T) ∧"] });
rowY += 76 + 8;
clauseRow(rowY, 116, { id: "ac", lines: ["absolutely continuous there"] }, {
  id: "rac",
  lines: ["(∀ v μ, … μ.restrict", "(Ioo E₁ E₂) ≪ volume) ∧"],
});
rowY += 116 + 8;
clauseRow(rowY, 76, { id: "wt", lines: ["nonzero weight there"] }, { id: "rwt", lines: ["(∃ v, … μ (Ioo E₁ E₂) ≠ 0)"] });

// ---------------------------------------------------------------- motion lengths (read by the narration tool)
const D = {
  intro: need("c6b1", "lead", 1.6, "chapter title settles"),
  mapIn: need("c6b1", "plan", 0.6, "proof map returns"),
  status: need("c6b1", "formalized", 1.5, "boxes take the Lean status colour one by one"),
  seal: need("c6b1", "seal", 1.0, "seals appear one by one, with the legend"),
  t1: need("c6b2", "first", 0.4, "box: restate for Simon"),
  t2: need("c6b2", "second", 0.4, "box: Simon's Problem 1"),
  ml: need("c6b2", "Mathlib", 0.4, "label: only Mathlib"),
  code: need("c6b3", "files", 3.0, "Main.lean scrolls to the final theorem"),
  card: need("c6b3", "unfinished", 0.4, "repository card"),
  side: need("c6b4", "final", 0.6, "code gives way to the side-by-side statement"),
  log: need("c6b8", "final", 2.0, "axiom report scrolls to the final theorem's line"),
  rep: need("c6b8", "replay", 0.4, "check: Lean replay"),
  nan: need("c6b8", "nanoda", 0.4, "check: nanoda"),
  ctl: need("c6b9", "control", 0.4, "check: the d = 2 control"),
  three: need("c6b9", "covers", 0.4, "label: the proof covers d >= 3"),
  stack: need("c6b10", "Formalizing", 0.8, "page stack enters"),
  lem: need("c6b10", "Lemma", 1.0, "page 52 forward, Lemma 6.2 highlighted"),
  zoom: need("c6b10", "needs", 0.8, "zoom on Lemma 6.2"),
  note: need("c6b10", "most", 0.4, "margin note"),
  head11: need("c6b11", "certify", 0.4, "heading: what the check does not certify"),
  holds: need("c6b10", "holds", 0.4, "label: holds wherever it is used"),
  rows: need("c6b12", "caution", 0.6, "two widths, two spectrum bars"),
  dep: need("c6b12", "depend", 0.6, "dashed intervals at different places"),
  fix: need("c6b12", "Theorem", 0.5, "fixed interval in both rows"),
  lean: need("c6b12", "Lean", 0.4, "note: fixed form proved in OpenAI's library terms"),
  out: need("c6b12", "tail", 0.8, "picture fades out"),
};
const C = {
  plan: cue("c6b1", "plan"), formalized: cue("c6b1", "formalized"), seal: cue("c6b1", "seal"),
  first: cue("c6b2", "first"), second: cue("c6b2", "second"), mathlib: cue("c6b2", "Mathlib"),
  files: cue("c6b3", "files"), unfinished: cue("c6b3", "unfinished"),
  final: cue("c6b4", "final"),
  spectrum: cue("c6b7", "spectrum"), continuous: cue("c6b7", "continuous"), weight: cue("c6b7", "weight"),
  final8: cue("c6b8", "final"), replay: cue("c6b8", "replay"), nanoda: cue("c6b8", "nanoda"),
  control: cue("c6b9", "control"), three: cue("c6b9", "covers"),
  omission: cue("c6b10", "Formalizing"), lemma: cue("c6b10", "Lemma"), needs: cue("c6b10", "needs"),
  one: cue("c6b10", "most"), certify: cue("c6b11", "certify"), holds: cue("c6b10", "holds"),
  definitions: cue("c6b11", "definitions"), library: cue("c6b11", "library's"), manuscript: cue("c6b11", "manuscript"),
  caution: cue("c6b12", "caution"), depend: cue("c6b12", "depend"), theorem: cue("c6b12", "Theorem"), lean: cue("c6b12", "Lean"),
  end: beatEnd("c6b12"),
};
function beatNow(t) {
  const b = beatAt(t);
  return b ? b.id : "";
}
function on(id, t) { return beatNow(t) === id; }

const label = chapterLabel({ n: 6, title: "What Lean checked", intro: D.intro });
const strip = mountStrip(document.body);
const subs = mountSubtitles(document.body, window.__BEATS__);
const CONTENT = [];

// ---------------------------------------------------------------- c6b1-c6b2: the plan again
const MAPN = ["sweep", "clear", "cert", "readout", "thm"];
const map = proofMap({
  parent: document.body, box: "proofmap",
  x: 120, y: 280, w: 1680, h: 300,
  nodes: [
    { id: "sweep", label: "Reveal digits", col: 0, row: 0, status: "claimed" },
    { id: "clear", label: "Clear pending sites", col: 1, row: 0, status: "claimed" },
    { id: "cert", label: "Certificate", col: 2, row: 0, status: "claimed" },
    { id: "readout", label: "Spectral readout", col: 3, row: 0, status: "claimed" },
    { id: "thm", label: "Theorem 1.1", col: 4, row: 0, status: "claimed" },
    { id: "transport", label: "Restate for Simon", col: 3, row: 1, status: "lean", seal: true },
    { id: "simon", label: "Simon's Problem 1", col: 4, row: 1, status: "lean", seal: true },
  ],
  edges: [["sweep", "clear"], ["clear", "cert"], ["cert", "readout"], ["readout", "thm"], ["thm", "transport"], ["transport", "simon"]],
  stateAt: function (t) { return mapStates(t); },
});
CONTENT.push(map.el);
function mapStates(t) {
  const st = {};
  MAPN.forEach(function (k, i) {
    const lit = t >= C.formalized + i * D.status / MAPN.length;
    const sealed = t >= C.seal + i * D.seal / MAPN.length;
    st[k] = { state: "done", status: lit ? "lean" : "claimed", seal: sealed };
  });
  st.transport = t >= C.first ? "active" : "hidden";
  st.simon = t >= C.second ? "active" : "hidden";
  if (t >= C.second) st.transport = "done";
  return st;
}
const legend = textLabel(document.body, "seal: proved in Lean", 120, 640, "--ink-muted");
const onlyML = textLabel(document.body, "only Mathlib", 1560, 600, "--ink-muted");
CONTENT.push(legend, onlyML);

// ---------------------------------------------------------------- c6b3: the real source of the final assembly
const code = document.createElement("div");
code.className = "clause";
code.dataset.box = "main-lean";
code.dataset.words = "skip";
code.style.left = "120px";
code.style.top = "110px";
code.style.width = "1680px";
code.style.height = "560px";
document.body.appendChild(code);
CONTENT.push(code);
const codeTitle = document.createElement("div");
codeTitle.className = "t-code";
codeTitle.style.color = "var(--ink-muted)";
codeTitle.textContent = window.LEAN_MAIN_PATH;
code.appendChild(codeTitle);
const codeClip = document.createElement("div");      // inner clip: the measured box never overflows
codeClip.style.position = "absolute";
codeClip.style.left = "18px";
codeClip.style.top = "64px";
codeClip.style.right = "16px";
codeClip.style.bottom = "16px";
codeClip.style.overflow = "hidden";
code.appendChild(codeClip);
const codeRoll = document.createElement("div");
codeClip.appendChild(codeRoll);
const codeLines = window.LEAN_MAIN.map(function (s) {
  const line = renderLeanLine(s.length ? s : " ");
  codeRoll.appendChild(line);
  return line;
});
fixSubscripts(codeRoll);
const FINAL_LINES = codeLines.slice(-4, -2);    // "theorem anderson_challenge ..." and its proof line
const cardRepo = ledgerCard({
  parent: document.body, status: "lean",
  title: "anderson-ac-lean4, version 1.0.0",
  lines: ["853 files", "no sorry, no added axioms"],
  x: 120, y: 700, w: 900, tIn: C.files,
});
const lineUnfinished = cardRepo.el.querySelectorAll(".ledger-line")[1];

// ---------------------------------------------------------------- c6b8-c6b9: the axiom report and the checks
const logPanel = document.createElement("div");
logPanel.className = "clause";
logPanel.dataset.box = "axiom-log";
logPanel.dataset.words = "skip";
logPanel.style.left = "120px";
logPanel.style.top = "100px";
logPanel.style.width = "1680px";
logPanel.style.height = "400px";
document.body.appendChild(logPanel);
CONTENT.push(logPanel);
const logTitle = document.createElement("div");
logTitle.className = "t-code";
logTitle.style.color = "var(--ink-muted)";
logTitle.textContent = "fresh-clone build, axiom report (last entries)";
logPanel.appendChild(logTitle);
const logClip = document.createElement("div");
logClip.style.position = "absolute";
logClip.style.left = "18px";
logClip.style.top = "64px";
logClip.style.right = "16px";
logClip.style.bottom = "16px";
logClip.style.overflow = "hidden";
logPanel.appendChild(logClip);
const logRoll = document.createElement("div");
logClip.appendChild(logRoll);
const logEntries = window.LEAN_AXIOMS.map(function (s) {
  const k = s.indexOf(" depends on axioms: ");
  const box = document.createElement("div");
  box.appendChild(renderLeanLine(s.slice(0, k)));
  box.appendChild(renderLeanLine("  " + s.slice(k + 1)));
  logRoll.appendChild(box);
  return box;
});
const lastEntry = logEntries[logEntries.length - 1];
const cardReplay = ledgerCard({ parent: document.body, status: "lean", title: "Lean replay (leanchecker --fresh): accepted", lines: [], x: 120, y: 530, w: 1100, tIn: C.replay });
const cardNanoda = ledgerCard({ parent: document.body, status: "lean", title: "nanoda, independent checker: statement matches", lines: [], x: 120, y: 640, w: 1100, tIn: C.nanoda });
const cardControl = ledgerCard({ parent: document.body, status: "lean", title: "control, 2 ≤ d instead of 3 ≤ d: no match", lines: [], x: 120, y: 750, w: 1100, tIn: C.control });
const lineThree = textLabel(document.body, "the proof covers d ≥ 3", 1290, 772);
lineThree.classList.add("plain-line");   // richLines renders ≥ as a KaTeX glyph

// ---------------------------------------------------------------- c6b10: the page with Lemma 6.2
const LEMMA = { x0: 0.1237, y0: 0.6246, x1: 0.8759, y1: 0.7682 };   // scenes/paper/pages.json
function pad3(n) { return String(n).padStart(3, "0"); }
const paper = paperStack({
  parent: document.body, box: "paper", x: 120, y: 96, w: 1100, h: 784,
  count: 93, aspect: 841.89 / 595.276,
  thumb: function (n) { return "../paper/thumbs/p" + pad3(n) + ".png"; },
  closeup: { 52: "../paper/p052.svg" },
});
CONTENT.push(paper.el);
const cardNote = ledgerCard({ parent: document.body, status: "lean", title: "Lemma 6.2", lines: ["needs: damping scale ≤ 1"], x: 1260, y: 330, w: 540, tIn: C.one });
const labHolds = textLabel(document.body, "holds wherever it is used", 1260, 520, "--ink-muted");
CONTENT.push(labHolds);

// ---------------------------------------------------------------- c6b11: what the check does not certify
const head11 = textLabel(document.body, "What the check does not certify", 380, 160, "--ink-muted");
CONTENT.push(head11);
const cardDef = ledgerCard({ parent: document.body, status: "context", title: "meaning of the definitions — read them", lines: [], x: 380, y: 250, w: 1160, tIn: C.definitions });
const cardLib = ledgerCard({ parent: document.body, status: "context", title: "Mathlib's definitions — trusted", lines: [], x: 380, y: 420, w: 1160, tIn: C.library });
const cardMs = ledgerCard({ parent: document.body, status: "context", title: "the manuscript's text — not checked", lines: [], x: 380, y: 590, w: 1160, tIn: C.manuscript });

// ---------------------------------------------------------------- c6b12: the caution about the interval
const cau = document.createElement("div");
cau.dataset.box = "caution";
cau.dataset.words = "per-text";
cau.style.position = "absolute";
cau.style.left = "120px";
cau.style.top = "110px";
cau.style.width = "1680px";
cau.style.height = "740px";
document.body.appendChild(cau);
CONTENT.push(cau);
const csvg = svgEl("svg");
csvg.setAttribute("width", "1680");
csvg.setAttribute("height", "740");
csvg.setAttribute("viewBox", "0 0 1680 740");
cau.appendChild(csvg);
const ROWS = [{ y: 200, left: 400, name: "narrower b − a" }, { y: 470, left: 250, name: "wider b − a" }];
const BOTTOM_X = 520;                         // the band bottom, -2d, at the same place in both rows
const FIXED = { x: 560, w: 120 };             // Theorem 1.1's interval: same place in both rows
const MOVED = [{ x: 820, w: 120 }, { x: 1180, w: 120 }];   // what the exported statement allows
function svgRect(x, y, w, h, fill, stroke, dash) {
  const r = svgEl("rect");
  r.setAttribute("x", String(x)); r.setAttribute("y", String(y));
  r.setAttribute("width", String(w)); r.setAttribute("height", String(h));
  r.setAttribute("rx", "4");
  r.setAttribute("fill", fill);
  if (stroke) { r.setAttribute("stroke", stroke); r.setAttribute("stroke-width", "4"); }
  if (dash) r.setAttribute("stroke-dasharray", "10 7");
  csvg.appendChild(r);
  return r;
}
const rowEls = ROWS.map(function (row) {
  const g = svgEl("g");
  csvg.appendChild(g);
  const bar = svgEl("rect");
  bar.setAttribute("x", String(row.left)); bar.setAttribute("y", String(row.y - 8));
  bar.setAttribute("width", String(1600 - row.left)); bar.setAttribute("height", "16");
  bar.setAttribute("fill", "var(--rule)");
  g.appendChild(bar);
  return g;
});
const rule = svgEl("line");
rule.setAttribute("x1", String(BOTTOM_X)); rule.setAttribute("x2", String(BOTTOM_X));
rule.setAttribute("y1", "120"); rule.setAttribute("y2", "560");
rule.setAttribute("stroke", "var(--ink-muted)"); rule.setAttribute("stroke-width", "2");
rule.setAttribute("stroke-dasharray", "6 6");
csvg.appendChild(rule);
const fixedRects = ROWS.map(function (row) { return svgRect(FIXED.x, row.y - 24, FIXED.w, 48, "var(--obj-energy)"); });
const movedRects = ROWS.map(function (row, i) { return svgRect(MOVED[i].x, row.y - 24, MOVED[i].w, 48, "none", "var(--obj-energy)", true); });
const rowLabels = ROWS.map(function (row) { return textLabel(cau, row.name, 0, row.y - 60, "--ink-muted"); });
const labBottom = katexLabel(cau, "-2d", BOTTOM_X - 28, 580);
const labCentre = textLabel(cau, "energies centred at 0", 1200, 580, "--ink-muted");
const labFixedI = textLabel(cau, "Theorem 1.1: fixed interval", 330, 620);
const labMoved = textLabel(cau, "exported statement: may change with the width", 760, 40);
const labLeanNote = textLabel(cau, "fixed form: proved, in OpenAI's library terms", 330, 676, "--ink-muted");

richLines(document.body);

// ---------------------------------------------------------------- helpers
function svgEl(name) {
  return document.createElementNS("http://www.w3.org/2000/svg", name);
}
function textLabel(parent, text, x, y, token) {
  const d = document.createElement("div");
  d.className = "t-label";
  d.style.position = "absolute";
  d.style.left = x + "px";
  d.style.top = y + "px";
  d.style.color = token ? "var(" + token + ")" : "var(--ink)";
  d.style.whiteSpace = "nowrap";
  d.textContent = text;
  if (parent === document.body) {
    d.dataset.box = "label-" + text.replace(/[^a-z]+/gi, "-").toLowerCase();
    d.dataset.words = "per-text";
  }
  parent.appendChild(d);
  return d;
}
function katexLabel(parent, tex, x, y, token) {
  const d = document.createElement("div");
  d.className = "t-label";
  d.style.position = "absolute";
  d.style.left = x + "px";
  d.style.top = y + "px";
  d.style.color = token ? "var(" + token + ")" : "var(--ink)";
  katex.render(tex, d, KATEX_OPTS);
  parent.appendChild(d);
  return d;
}
// Subscript digits after a letter (e₂ in the Lean source) as KaTeX glyphs, like E₁ in the clauses.
function fixSubscripts(root) {
  const syms = root.querySelectorAll(".lean-sym");
  for (let i = 0; i < syms.length; i++) {
    const sym = syms[i];
    const raw = sym.textContent;
    if (!/[₀-₉]/.test(raw)) continue;
    const prev = sym.previousSibling;
    if (!prev || !prev.textContent) continue;
    const letter = prev.textContent.slice(-1);
    prev.textContent = prev.textContent.slice(0, -1);
    sym.textContent = "";
    katex.render(letter + "_{" + String.fromCharCode(raw.trim().charCodeAt(0) - 0x2080 + 48) + "}", sym, KATEX_OPTS);
  }
}
function runCard(card, t, active) {
  card.setTime(active ? t : -1);
  card.el.style.visibility = active ? "visible" : "hidden";
}
function setVis(el, u) { el.style.opacity = String(u); el.style.visibility = u > 0 ? "visible" : "hidden"; }

// clause highlighting (c6b4-c6b7)
function litAt(t) {
  const id = beatNow(t);
  const lit = {};
  if (id === "c6b4") { lit.c1 = lit.r1 = true; }
  else if (id === "c6b5") { lit.c2a = lit.r2a = lit.c2b = lit.r2b = true; }
  else if (id === "c6b6") { lit.c3 = lit.r3 = true; }
  else if (id === "c6b7") {
    if (t >= C.spectrum) lit.sp = lit.rsp = true;
    if (t >= C.continuous) lit.ac = lit.rac = true;
    if (t >= C.weight) lit.wt = lit.rwt = true;
  }
  return lit;
}
function paintClauses(t) {
  const lit = litAt(t);
  const nodes = stage.querySelectorAll(".clause");
  for (let i = 0; i < nodes.length; i++) {
    const key = nodes[i].dataset.box.replace("clause-", "");
    nodes[i].className = lit[key] ? "clause on" : "clause";
  }
}

// ---------------------------------------------------------------- the picture at time t
window.sceneEvents = events;
window.sceneDuration = window.__BEATS__.duration;

window.setTime = function (t) {
  const id = beatNow(t);
  label.setTime(t);

  // map: c6b1-c6b2, fades at [files]
  const mapU = id === "c6b1" ? fade(t, C.plan, D.mapIn) : (id === "c6b2" ? 1 : (id === "c6b3" ? 1 - fade(t, C.files, D.code / 6) : 0));
  setVis(map.el, mapU);
  map.setTime(t);
  setVis(legend, (id === "c6b1" ? fade(t, C.seal, D.seal) : (id === "c6b2" ? 1 : 0)) * mapU);
  setVis(onlyML, id === "c6b2" ? fade(t, C.mathlib, D.ml) : 0);

  // Main.lean scroll (c6b3), then it gives way to the clauses (c6b4)
  const codeOn = id === "c6b3" || (id === "c6b4" && t < C.final + D.side);
  const codeU = id === "c6b3" ? fade(t, C.files + D.code / 6, D.code / 6) : (id === "c6b4" ? 1 - fade(t, C.final, D.side) : 0);
  setVis(code, codeOn ? codeU : 0);
  const rollMax = Math.max(0, codeRoll.scrollHeight - codeClip.clientHeight);
  const roll = id === "c6b3" ? clamp((t - C.files - D.code / 6) / (D.code * 5 / 6), 0, 1) : 1;
  codeRoll.style.transform = "translateY(" + (-rollMax * ease(roll)).toFixed(2) + "px)";
  FINAL_LINES.forEach(function (l) { l.style.color = roll >= 1 ? "var(--status-lean)" : ""; });
  code.style.transform = id === "c6b4" ? "translateY(" + (lerp(0, -40, fade(t, C.final, D.side))).toFixed(1) + "px)" : "none";
  runCard(cardRepo, t, id === "c6b3");
  lineUnfinished.style.opacity = String(fade(t, C.unfinished, D.card));

  // clauses (c6b4-c6b7)
  const clauses = id === "c6b4" || id === "c6b5" || id === "c6b6" || id === "c6b7";
  stage.style.visibility = clauses ? "visible" : "hidden";
  stage.style.opacity = clauses ? String(id === "c6b4" ? fade(t, C.final, D.side) : 1) : "0";
  paintClauses(t);

  // axiom report and checks (c6b8-c6b9)
  const logOn = id === "c6b8" || id === "c6b9";
  setVis(logPanel, logOn ? (id === "c6b8" ? fade(t, C.final8, D.log / 4) : 1) : 0);
  const logMax = Math.max(0, logRoll.scrollHeight - logClip.clientHeight);
  const lr = id === "c6b8" ? clamp((t - C.final8) / D.log, 0, 1) : 1;
  logRoll.style.transform = "translateY(" + (-logMax * ease(lr)).toFixed(2) + "px)";
  lastEntry.style.color = lr >= 1 ? "var(--status-lean)" : "";
  runCard(cardReplay, t, logOn && t >= C.replay);
  runCard(cardNanoda, t, logOn && t >= C.nanoda);
  runCard(cardControl, t, id === "c6b9" && t >= C.control);
  setVis(lineThree, id === "c6b9" ? fade(t, C.three, D.three) : 0);

  // Lemma 6.2 (c6b10)
  const on10 = id === "c6b10";
  if (on10) {
    const back = 0;
    paper.show({
      enter: fade(t, C.omission, D.stack),
      fan: 0,
      forward: { page: 52, k: clamp((t - C.lemma) / D.lem, 0, 1) + back },
      highlight: { region: LEMMA, k: clamp((t - C.lemma - D.lem / 2) / (D.lem / 2), 0, 1), status: "lean" },
      zoom: { region: LEMMA, k: clamp((t - C.needs) / D.zoom, 0, 1) },
    });
  }
  setVis(paper.el, on10 ? 1 : 0);
  runCard(cardNote, t, on10 && t >= C.one);
  setVis(labHolds, on10 ? fade(t, C.holds, D.holds) : 0);

  // does not certify (c6b11)
  const on11 = id === "c6b11";
  setVis(head11, on11 ? fade(t, C.certify, D.head11) : 0);
  runCard(cardDef, t, on11 && t >= C.definitions);
  runCard(cardLib, t, on11 && t >= C.library);
  runCard(cardMs, t, on11 && t >= C.manuscript);

  // the caution (c6b12)
  const on12 = id === "c6b12";
  setVis(cau, on12 ? fade(t, C.caution, D.rows) : 0);
  const depU = on12 ? fade(t, C.depend, D.dep) : 0;
  const fixU = on12 ? fade(t, C.theorem, D.fix) : 0;
  movedRects.forEach(function (r) { r.setAttribute("opacity", String(depU)); });
  fixedRects.forEach(function (r) { r.setAttribute("opacity", String(fixU)); });
  labMoved.style.opacity = String(depU);
  labFixedI.style.opacity = String(fixU);
  labLeanNote.style.opacity = String(on12 ? fade(t, C.lean, D.lean) : 0);

  // the chapter's end
  const outK = 1 - fade(t, C.end, D.out);
  if (outK < 1) CONTENT.forEach(function (el) { el.style.opacity = String(parseFloat(el.style.opacity || "1") * outK); });

  strip.setTime(t);
  subs.setTime(t);
};

mark(C.plan, "c6b1", "proof map returns");
mark(C.formalized, "c6b1", "boxes take the Lean status");
mark(C.seal, "c6b1", "seals and legend");
mark(C.first, "c6b2", "restate for Simon");
mark(C.second, "c6b2", "Simon's Problem 1");
mark(C.mathlib, "c6b2", "only Mathlib");
mark(C.files, "c6b3", "Main.lean scrolls");
mark(C.unfinished, "c6b3", "no unfinished steps");
mark(C.final, "c6b4", "clause 1, code gives way");
mark(beatStart("c6b5"), "c6b5", "clause 2");
mark(beatStart("c6b6"), "c6b6", "clause 3");
mark(C.spectrum, "c6b7", "spectrum");
mark(C.continuous, "c6b7", "continuous");
mark(C.weight, "c6b7", "weight");
mark(C.final8, "c6b8", "axiom report");
mark(C.replay, "c6b8", "replay");
mark(C.nanoda, "c6b8", "nanoda");
mark(C.control, "c6b9", "control");
mark(C.three, "c6b9", "proof covers d >= 3");
mark(C.omission, "c6b10", "page stack");
mark(C.lemma, "c6b10", "page 52, Lemma 6.2");
mark(C.needs, "c6b10", "zoom");
mark(C.one, "c6b10", "margin note");
mark(C.holds, "c6b10", "holds");
mark(C.certify, "c6b11", "heading");
mark(C.definitions, "c6b11", "definitions");
mark(C.library, "c6b11", "library");
mark(C.manuscript, "c6b11", "manuscript");
mark(C.caution, "c6b12", "two widths");
mark(C.depend, "c6b12", "intervals may move");
mark(C.theorem, "c6b12", "fixed interval");
mark(C.lean, "c6b12", "fixed form note");

window.setTime(0);
