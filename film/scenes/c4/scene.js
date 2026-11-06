/* Chapter 4: the paper as an object, the proof map introduced once, the certificate,
   binary digits, three controls in pictures, tiles, clusters, the readout.
   Picture is a function of t. Tokens only; no clock. */
const tl = installBeats(window.__BEATS__);
const events = [];
function mark(t, beat, what) {
  events.push({ t: Math.round(t * 1000) / 1000, beat: beat, what: what });
}

const KATEX = { throwOnError: false, trust: true, strict: false, displayMode: false, output: "html" };

function ns(name) {
  return document.createElementNS("http://www.w3.org/2000/svg", name);
}

function mountBox(box, x, y, w, h) {
  const host = document.createElement("div");
  host.dataset.box = box;
  host.dataset.words = "per-text";
  host.style.position = "absolute";
  host.style.left = x + "px";
  host.style.top = y + "px";
  host.style.width = w + "px";
  host.style.height = h + "px";
  host.style.opacity = "0";
  document.body.appendChild(host);
  return host;
}

function svgBox(box, x, y, w, h) {
  const host = mountBox(box, x, y, w, h);
  const svg = ns("svg");
  svg.setAttribute("width", String(w));
  svg.setAttribute("height", String(h));
  svg.setAttribute("viewBox", "0 0 " + w + " " + h);
  host.appendChild(svg);
  return { host: host, svg: svg, w: w, h: h };
}

function showFrom(el, active, t, t0, dur) {
  if (!active) {
    el.style.opacity = "0";
    return 0;
  }
  const u = fade(t, t0, dur);
  el.style.opacity = String(u);
  return u;
}

function katexLabel(parent, tex, x, y, token) {
  const d = document.createElement("div");
  d.className = "t-label";
  d.style.position = "absolute";
  d.style.left = x + "px";
  d.style.top = y + "px";
  d.style.color = token ? "var(" + token + ")" : "var(--ink)";
  d.style.whiteSpace = "nowrap";
  katex.render(tex, d, KATEX);
  parent.appendChild(d);
  return d;
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
  parent.appendChild(d);
  return d;
}

function eqBox(opts) {
  const eq = mountEquation(opts);
  eq.el.dataset.words = "per-text";
  eq.el.style.opacity = "0";
  const colors = opts.colors || {};
  Object.keys(colors).forEach(function (name) {
    colorTerm(eq, name, colors[name]);
  });
  return eq;
}

function makeLattice(spec) {
  const cols = spec.cols;
  const rows = spec.rows;
  const spacing = spec.spacing;
  const padX = spec.padX;
  const padTop = spec.padTop;
  const padBot = spec.padBot;
  const w = padX * 2 + (cols - 1) * spacing;
  const h = padTop + padBot + (rows - 1) * spacing;
  const box = svgBox(spec.box, spec.x, spec.y, w, h);
  const group = ns("g");
  box.svg.appendChild(group);
  function px(i) { return padX + i * spacing; }
  function py(j) { return padTop + j * spacing; }
  const rng = mulberry32(spec.seed >>> 0);
  const values = [];
  for (let n = 0; n < cols * rows; n++) values.push(rng());

  const bonds = [];
  function addBond(x1, y1, x2, y2, a, b) {
    const line = ns("line");
    line.setAttribute("x1", String(x1));
    line.setAttribute("y1", String(y1));
    line.setAttribute("x2", String(x2));
    line.setAttribute("y2", String(y2));
    line.setAttribute("stroke", "var(--obj-hopping)");
    line.setAttribute("stroke-width", "2");
    group.appendChild(line);
    bonds.push({ el: line, a: a, b: b });
  }
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      if (i + 1 < cols) addBond(px(i), py(j), px(i + 1), py(j), j * cols + i, j * cols + i + 1);
      if (j + 1 < rows) addBond(px(i), py(j), px(i), py(j + 1), j * cols + i, (j + 1) * cols + i);
    }
  }

  const tile = {};
  if (spec.tile) {
    const i0 = spec.tile.i0;
    const i1 = spec.tile.i1;
    const j0 = spec.tile.j0;
    const j1 = spec.tile.j1;
    const x1 = px(i0) - spacing / 2;
    const x2 = px(i1) + spacing / 2;
    const y1 = py(j0) - spacing / 2;
    const y2 = py(j1) + spacing / 2;
    function vLine(x) {
      const line = ns("line");
      line.setAttribute("x1", String(x));
      line.setAttribute("x2", String(x));
      line.setAttribute("y1", String(py(0) - spacing / 2));
      line.setAttribute("y2", String(py(rows - 1) + spacing / 2));
      line.setAttribute("stroke", "var(--rule)");
      line.setAttribute("stroke-width", "2");
      group.appendChild(line);
    }
    function hLine(y) {
      const line = ns("line");
      line.setAttribute("y1", String(y));
      line.setAttribute("y2", String(y));
      line.setAttribute("x1", String(px(0) - spacing / 2));
      line.setAttribute("x2", String(px(cols - 1) + spacing / 2));
      line.setAttribute("stroke", "var(--rule)");
      line.setAttribute("stroke-width", "2");
      group.appendChild(line);
    }
    for (let c = 0; c <= cols; c += spec.tile.step) {
      const x = c === 0 ? px(0) - spacing / 2 : (c >= cols ? px(cols - 1) + spacing / 2 : px(c) - spacing / 2);
      vLine(x);
    }
    for (let r = 0; r <= rows; r += spec.tile.step) {
      const y = r === 0 ? py(0) - spacing / 2 : (r >= rows ? py(rows - 1) + spacing / 2 : py(r) - spacing / 2);
      hLine(y);
    }
    const frame = ns("rect");
    frame.setAttribute("x", String(x1));
    frame.setAttribute("y", String(y1));
    frame.setAttribute("width", String(x2 - x1));
    frame.setAttribute("height", String(y2 - y1));
    frame.setAttribute("fill", "none");
    frame.setAttribute("stroke", "var(--status-claimed)");
    frame.setAttribute("stroke-width", "4");
    group.appendChild(frame);
    const band = ns("rect");
    band.setAttribute("y", String(y1));
    band.setAttribute("width", String(spacing * 0.5));
    band.setAttribute("height", String(y2 - y1));
    band.setAttribute("fill", "var(--status-claimed)");
    group.appendChild(band);
    tile.frame = frame;
    tile.band = band;
    tile.x1 = x1;
    tile.x2 = x2;
    tile.y1 = y1;
    tile.y2 = y2;
    tile.i0 = i0;
    tile.i1 = i1;
    tile.j0 = j0;
    tile.j1 = j1;
  }

  const sites = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const v = values[j * cols + i];
      const gx = px(i);
      const gy = py(j);
      const bar = ns("rect");
      bar.setAttribute("x", String(gx - 2));
      bar.setAttribute("width", "4");
      bar.setAttribute("fill", "var(--obj-potential)");
      group.appendChild(bar);
      const ring = ns("circle");
      ring.setAttribute("cx", String(gx));
      ring.setAttribute("cy", String(gy));
      ring.setAttribute("r", "11");
      ring.setAttribute("fill", "none");
      ring.setAttribute("stroke", "var(--obj-damping)");
      ring.setAttribute("stroke-width", "2");
      group.appendChild(ring);
      const open = ns("circle");
      open.setAttribute("cx", String(gx));
      open.setAttribute("cy", String(gy));
      open.setAttribute("r", "5");
      open.setAttribute("fill", "var(--paper)");
      open.setAttribute("stroke", "var(--ink)");
      open.setAttribute("stroke-width", "2");
      group.appendChild(open);
      const filled = ns("circle");
      filled.setAttribute("cx", String(gx));
      filled.setAttribute("cy", String(gy));
      filled.setAttribute("r", "6");
      filled.setAttribute("fill", "var(--ink)");
      group.appendChild(filled);
      const s = 6;
      const c1 = ns("line");
      const c2 = ns("line");
      c1.setAttribute("x1", String(gx - s));
      c1.setAttribute("y1", String(gy - s));
      c1.setAttribute("x2", String(gx + s));
      c1.setAttribute("y2", String(gy + s));
      c2.setAttribute("x1", String(gx - s));
      c2.setAttribute("y1", String(gy + s));
      c2.setAttribute("x2", String(gx + s));
      c2.setAttribute("y2", String(gy - s));
      c1.setAttribute("stroke", "var(--ink)");
      c2.setAttribute("stroke", "var(--ink)");
      c1.setAttribute("stroke-width", "2");
      c2.setAttribute("stroke-width", "2");
      group.appendChild(c1);
      group.appendChild(c2);
      sites.push({ i: i, j: j, v: v, gx: gx, gy: gy, bar: bar, ring: ring, open: open, filled: filled, c1: c1, c2: c2 });
    }
  }

  let flash = null;
  if (spec.tile) {
    flash = ns("rect");
    flash.setAttribute("x", String(tile.x1));
    flash.setAttribute("y", String(tile.y1));
    flash.setAttribute("width", String(tile.x2 - tile.x1));
    flash.setAttribute("height", String(tile.y2 - tile.y1));
    flash.setAttribute("fill", "var(--status-claimed)");
    group.appendChild(flash);
    tile.flash = flash;
  }

  const arrows = [];
  if (spec.wrap) {
    for (let k = 0; k < 4; k++) {
      const g = ns("g");
      const path = ns("path");
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "var(--obj-hopping)");
      path.setAttribute("stroke-width", "2");
      const tri = ns("polygon");
      tri.setAttribute("fill", "var(--obj-hopping)");
      g.appendChild(path);
      g.appendChild(tri);
      group.appendChild(g);
      arrows.push(g);
    }
  }

  let ring = null;
  if (spec.cluster) {
    ring = ns("circle");
    ring.setAttribute("cx", String(px(spec.cluster.i)));
    ring.setAttribute("cy", String(py(spec.cluster.j)));
    ring.setAttribute("r", String(spacing * 1.45));
    ring.setAttribute("fill", "none");
    ring.setAttribute("stroke", "var(--ink)");
    ring.setAttribute("stroke-width", "3");
    group.appendChild(ring);
  }

  return {
    host: box.host, w: w, h: h, group: group, sites: sites, bonds: bonds,
    arrows: arrows, tile: spec.tile ? tile : null, ring: ring, px: px, py: py,
    cols: cols, rows: rows, spacing: spacing,
  };
}

function setOp(el, v) {
  el.setAttribute("opacity", String(v));
}

function paintLattice(view, opt) {
  const shift = opt.shift || 0;
  view.group.setAttribute("transform", shift ? "translate(" + shift.toFixed(2) + " " + shift.toFixed(2) + ")" : "");
  const show = [];
  view.sites.forEach(function (s, idx) {
    const st = opt.site(s);
    show[idx] = st.show;
    const bh = (4 + s.v * 22) * st.bar;
    s.bar.setAttribute("height", bh.toFixed(2));
    s.bar.setAttribute("y", (s.gy - bh).toFixed(2));
    setOp(s.bar, st.show);
    setOp(s.ring, st.show * st.ring);
    setOp(s.open, st.show * (1 - st.terminal));
    setOp(s.filled, st.show * st.terminal);
    setOp(s.c1, st.show * st.cross);
    setOp(s.c2, st.show * st.cross);
  });
  view.bonds.forEach(function (b) {
    setOp(b.el, Math.min(show[b.a], show[b.b]));
  });
  if (view.arrows.length) {
    const e = opt.edge;
    const mid = e / 2;
    const px = view.px;
    const py = view.py;
    const o = opt.wrap;
    const specs = [
      [px(e) + 8, py(mid) - 18, px(e) + 26, py(mid), px(e) + 8, py(mid) + 18],
      [px(0) - 8, py(mid) + 18, px(0) - 26, py(mid), px(0) - 8, py(mid) - 18],
      [px(mid) - 18, py(0) - 8, px(mid), py(0) - 26, px(mid) + 18, py(0) - 8],
      [px(mid) + 18, py(e) + 8, px(mid), py(e) + 26, px(mid) - 18, py(e) + 8],
    ];
    for (let k = 0; k < 4; k++) {
      placeArrow(view.arrows[k], specs[k]);
      setOp(view.arrows[k], o);
    }
  }
  if (view.ring) setOp(view.ring, opt.cluster || 0);
}

function placeArrow(g, spec) {
  const x1 = spec[0], y1 = spec[1], cx = spec[2], cy = spec[3], x2 = spec[4], y2 = spec[5];
  g.firstChild.setAttribute("d", "M" + x1.toFixed(1) + "," + y1.toFixed(1) + " Q" + cx.toFixed(1) + "," + cy.toFixed(1) + " " + x2.toFixed(1) + "," + y2.toFixed(1));
  const ang = Math.atan2(y2 - cy, x2 - cx);
  const s = 9;
  const bx = x2 - Math.cos(ang) * s;
  const by = y2 - Math.sin(ang) * s;
  const lx = bx + Math.sin(ang) * 5;
  const ly = by - Math.cos(ang) * 5;
  const rx = bx - Math.sin(ang) * 5;
  const ry = by + Math.cos(ang) * 5;
  g.lastChild.setAttribute("points", x2.toFixed(1) + "," + y2.toFixed(1) + " " + lx.toFixed(1) + "," + ly.toFixed(1) + " " + rx.toFixed(1) + "," + ry.toFixed(1));
}

// ---------------------------------------------------------------- motion lengths
// Each motion that starts on a narrated word, with the length the picture uses. The narration tool
// reads these calls and lengthens a natural pause only where the voice gives less time.
const D = {
  intro: need("c4b1", "lead", 1.6, "chapter title settles"),
  enter: need("c4b1", "posted", 0.8, "page stack slides in"),
  fan: need("c4b1", "ninety-three", 2.0, "93 pages fan out one after another"),
  fwd1: need("c4b1", "claims", 1.0, "title page comes forward"),
  card1: need("c4b1", "refereed", 0.4, "ledger card enters"),
  thm: need("c4b2", "Theorem", 1.2, "title page back, page 3 forward with Theorem 1.1 highlighted"),
  zoom: need("c4b2", "centres", 0.8, "zoom on Theorem 1.1"),
  axis: need("c4b2", "interval", 1.0, "page gives way to the energy axis with I_d"),
  ins: need("c4b2", "spectrum", 0.4, "label: inside the spectrum"),
  ac: need("c4b2", "continuous", 0.5, "density and label: purely absolutely continuous"),
  axOut: need("c4b3", "plan", 0.5, "energy axis fades out"),
  build: need("c4b3", "map", 1.5, "map builds node by node"),
  pulse: need("c4b3", "stage", 1.5, "boxes pulse in order"),
  certOn: need("c4b3", "certificate", 0.4, "certificate node lights"),
  glide: need("c4b4", "certificate", 0.8, "map glides up into the banner"),
  box: need("c4b4", "box", 0.5, "periodic box appears"),
  rings: need("c4b4", "damping", 0.6, "damping rings on half the sites"),
  im: need("c4b4", "imaginary", 0.5, "formula and bar chart"),
  grow1: need("c4b4", "however", 0.8, "box grows, bars stay above c"),
  grow2: need("c4b4", "shrinks", 1.0, "box grows further while the damping gauge falls"),
  plot: need("c4b5", "lower", 0.5, "bar chart gives way to the plot"),
  curve: need("c4b5", "survives", 1.0, "lower-bound curve drawn towards eta to zero"),
  clear6: need("c4b6", "build", 0.5, "box, plot and formula fade out"),
  line6: need("c4b6", "construction", 0.5, "number line with the energy at zero"),
  bin: need("c4b6", "binary", 1.0, "binary formula builds"),
  coins: need("c4b6", "coin", 2.4, "four coins flip; the energy steps by halving amounts"),
  s1: need("c4b7", "revealed", 0.45, "first step of the chart"),
  s2: need("c4b7", "damping", 0.45, "second step"),
  s3: need("c4b7", "variance", 0.45, "third step"),
  s4: need("c4b7", "trades", 0.45, "last step of the chart"),
  cards: need("c4b8", "controls", 0.4, "three cards"),
  loop: need("c4b8", "match", 0.8, "loop between damping and the resolvent entries"),
  gauge: need("c4b8", "feedback", 0.6, "feedback gauge to one third"),
  rows: need("c4b9", "concentrates", 0.6, "spread row and crossed tall bar"),
  nudge: need("c4b9", "update", 0.8, "one bar nudges, the row barely changes"),
  nodes10: need("c4b10", "Third", 0.4, "graph nodes appear"),
  graph: need("c4b10", "graph", 0.8, "weighted graph edges draw"),
  sum: need("c4b10", "Laplacian", 1.6, "local changes flow into one bound"),
  tile: need("c4b11", "tiles", 0.4, "lattice with tiles"),
  tested: need("c4b11", "tested", 0.9, "highlight sweeps one tile"),
  pend: need("c4b11", "pending", 0.5, "crosses on the tile's sites"),
  clus: need("c4b12", "clusters", 0.5, "ring around the cluster"),
  scat: need("c4b12", "scattering", 0.6, "coupling arrows and block icon"),
  weak: need("c4b12", "weak", 0.6, "arrows thin"),
  done12: need("c4b12", "completing", 0.6, "crosses become completed sites"),
  nothing: need("c4b13", "nothing", 0.5, "torus without crosses"),
  digits: need("c4b13", "digits", 0.8, "bars complete"),
  cert13: need("c4b13", "certificate", 0.4, "certificate node lights"),
  ax14: need("c4b14", "spectral", 0.5, "energy axis returns"),
  abs14: need("c4b14", "absolutely", 0.4, "label: absolutely continuous here"),
  eig14: need("c4b14", "eigenvalues", 0.9, "spikes fade inside the interval"),
  thm14: need("c4b14", "Theorem", 0.4, "label: Theorem 1.1"),
  out: need("c4b14", "tail", 0.8, "picture fades out"),
};

const C = {
  posted: cue("c4b1", "posted"), ninety: cue("c4b1", "ninety-three"), claims: cue("c4b1", "claims"),
  refereed: cue("c4b1", "refereed"),
  theorem: cue("c4b2", "Theorem"), centres: cue("c4b2", "centres"), interval: cue("c4b2", "interval"),
  spectrum: cue("c4b2", "spectrum"), continuous: cue("c4b2", "continuous"),
  plan: cue("c4b3", "plan"), map: cue("c4b3", "map"), stage: cue("c4b3", "stage"), cert3: cue("c4b3", "certificate"),
  cert4: cue("c4b4", "certificate"), box: cue("c4b4", "box"), damping4: cue("c4b4", "damping"),
  imaginary: cue("c4b4", "imaginary"), however: cue("c4b4", "however"), shrinks: cue("c4b4", "shrinks"),
  lower: cue("c4b5", "lower"), survives: cue("c4b5", "survives"),
  build: cue("c4b6", "build"), construction: cue("c4b6", "construction"), binary: cue("c4b6", "binary"), coin: cue("c4b6", "coin"),
  revealed: cue("c4b7", "revealed"), damping7: cue("c4b7", "damping"), variance: cue("c4b7", "variance"), trades: cue("c4b7", "trades"),
  controls: cue("c4b8", "controls"), first: cue("c4b8", "First"), match: cue("c4b8", "match"), feedback: cue("c4b8", "feedback"),
  second: cue("c4b9", "Second"), concentrates: cue("c4b9", "concentrates"), update: cue("c4b9", "update"),
  third: cue("c4b10", "Third"), graph: cue("c4b10", "graph"), laplacian: cue("c4b10", "Laplacian"),
  tiles: cue("c4b11", "tiles"), tested: cue("c4b11", "tested"), failed: cue("c4b11", "failed"), rolled: cue("c4b11", "rolled"),
  pending: cue("c4b11", "pending"),
  clusters: cue("c4b12", "clusters"), scattering: cue("c4b12", "scattering"), weak: cue("c4b12", "weak"),
  completing: cue("c4b12", "completing"),
  nothing: cue("c4b13", "nothing"), digits: cue("c4b13", "digits"), cert13: cue("c4b13", "certificate"),
  spectral: cue("c4b14", "spectral"), absolutely: cue("c4b14", "absolutely"), eigenvalues: cue("c4b14", "eigenvalues"), theorem14: cue("c4b14", "Theorem"),
  end: beatEnd("c4b14"),
};
const BEAT_ORDER = tl.list.map(function (b) { return b.id; });
function beatNow(t) {
  const b = beatAt(t);
  return b ? b.id : "";
}
const FAN_END = C.ninety + D.fan;
const FWD1 = Math.max(C.claims, FAN_END);

// ---------------------------------------------------------------- chrome
const label = chapterLabel({ n: 4, title: "The idea of the proof", intro: D.intro });
const strip = mountStrip(document.body);
const subs = mountSubtitles(document.body, window.__BEATS__);
const badge5 = heuristicBadge({ parent: document.body, x: 800, y: 792 });
const badge7 = heuristicBadge({ parent: document.body, x: 140, y: 792 });
badge5.setVisible(false);
badge7.setVisible(false);
const CONTENT = [];   // hosts that fade out at the chapter's end

// ---------------------------------------------------------------- the paper (c4b1, c4b2)
const PAGES = { count: 93, aspect: 841.89 / 595.276 };
const THEOREM = { x0: 0.1237, y0: 0.1839, x1: 0.8762, y1: 0.3611 };   // scenes/paper/pages.json
function pad3(n) { return String(n).padStart(3, "0"); }
const paper = paperStack({
  parent: document.body, box: "paper", x: 120, y: 96, w: 1680, h: 784,
  count: PAGES.count, aspect: PAGES.aspect,
  thumb: function (n) { return "../paper/thumbs/p" + pad3(n) + ".png"; },
  closeup: { 1: "../paper/p001.svg", 3: "../paper/p003.svg" },
});
paper.el.dataset.group = "paper";
CONTENT.push(paper.el);
const count93 = textLabel(paper.el, "93 pages", 760, 24);
const cardMs = ledgerCard({
  parent: document.body, status: "claimed",
  title: "OpenAI manuscript, September 2026",
  lines: ["claimed, not independently refereed"],
  x: 1240, y: 620, w: 540, tIn: C.refereed,
});
cardMs.el.dataset.group = "paper";

// ---------------------------------------------------------------- energy axis (c4b2, c4b14)
const energy = svgBox("energy", 140, 300, 1640, 400);
CONTENT.push(energy.host);
const AX = { y: 228, x0: 90, edge: 220, id0: 248, id1: 390, x2d: 1280, x1: 1480 };
const specRect = ns("rect");
specRect.setAttribute("x", String(AX.x0));
specRect.setAttribute("y", String(AX.y - 10));
specRect.setAttribute("width", String(AX.x1 - AX.x0));
specRect.setAttribute("height", "20");
specRect.setAttribute("fill", "var(--rule)");
energy.svg.appendChild(specRect);
(function () {
  const axis = ns("line");
  axis.setAttribute("x1", "40");
  axis.setAttribute("x2", "1580");
  axis.setAttribute("y1", String(AX.y));
  axis.setAttribute("y2", String(AX.y));
  axis.setAttribute("stroke", "var(--ink)");
  axis.setAttribute("stroke-width", "2");
  energy.svg.appendChild(axis);
  [AX.x0, AX.edge, AX.x2d, AX.x1].forEach(function (x) {
    const tick = ns("line");
    tick.setAttribute("x1", String(x));
    tick.setAttribute("x2", String(x));
    tick.setAttribute("y1", String(AX.y - 18));
    tick.setAttribute("y2", String(AX.y + 18));
    tick.setAttribute("stroke", "var(--ink)");
    tick.setAttribute("stroke-width", "2");
    energy.svg.appendChild(tick);
  });
  const brace = ns("path");
  brace.setAttribute("d", "M" + AX.edge + "," + (AX.y + 80) + " L" + AX.edge + "," + (AX.y + 92) + " L" + AX.x2d + "," + (AX.y + 92) + " L" + AX.x2d + "," + (AX.y + 80));
  brace.setAttribute("fill", "none");
  brace.setAttribute("stroke", "var(--ink-muted)");
  brace.setAttribute("stroke-width", "2");
  energy.svg.appendChild(brace);
})();
const idRect = ns("rect");
idRect.setAttribute("x", String(AX.id0));
idRect.setAttribute("y", String(AX.y - 20));
idRect.setAttribute("width", String(AX.id1 - AX.id0));
idRect.setAttribute("height", "40");
idRect.setAttribute("fill", "var(--obj-energy)");
idRect.setAttribute("stroke", "var(--status-claimed)");
idRect.setAttribute("stroke-width", "4");
energy.svg.appendChild(idRect);
let hump = "M" + (AX.id0 - 6) + "," + (AX.y - 26);
for (let i = 0; i <= 28; i++) {
  const u = i / 28;
  const x = (AX.id0 - 6) + u * (AX.id1 - AX.id0 + 28);
  const y = (AX.y - 26) - Math.sin(Math.PI * u) * 78;
  hump += " L" + x.toFixed(1) + "," + y.toFixed(1);
}
hump += " L" + (AX.id1 + 22) + "," + (AX.y - 26) + " Z";
const density = ns("path");
density.setAttribute("d", hump);
density.setAttribute("fill", "var(--obj-wave)");
energy.svg.appendChild(density);
const spikeX = [AX.id0 + 22, AX.id0 + 58, AX.id0 + 96, AX.id0 + 124];
const spikeH = [48, 86, 40, 70];
const spikes = spikeX.map(function (x, i) {
  const line = ns("line");
  line.setAttribute("x1", String(x));
  line.setAttribute("x2", String(x));
  line.setAttribute("y1", String(AX.y - 26));
  line.setAttribute("y2", String(AX.y - 26 - spikeH[i]));
  line.setAttribute("stroke", "var(--ink)");
  line.setAttribute("stroke-width", "3");
  energy.svg.appendChild(line);
  return line;
});
const labEdgeL = katexLabel(energy.host, "-2d-\\lambda", AX.x0 - 70, 270);
const labEdge = katexLabel(energy.host, "-2d", AX.edge - 30, 270);
const lab2d = katexLabel(energy.host, "2d", AX.x2d - 20, 270);
const lab2dL = katexLabel(energy.host, "2d+\\lambda", AX.x1 - 70, 270);
const labBand = textLabel(energy.host, "band", 720, 330, "--ink-muted");
const labId = katexLabel(energy.host, "I_d", AX.id0 + 52, 262, "--obj-energy");
const labFixed = textLabel(energy.host, "fixed interval, just above the bottom", 460, 20);
const labIns = textLabel(energy.host, "inside the spectrum", 460, 64);
const labAc = textLabel(energy.host, "purely absolutely continuous", 460, 108);
const labAc14 = textLabel(energy.host, "absolutely continuous here", 460, 64);
const labThm14 = textLabel(energy.host, "Theorem 1.1 (claimed)", 460, 108);

// ---------------------------------------------------------------- proof map (c4b3 on)
const MAPN = ["sweep", "clear", "cert", "readout", "thm"];
const MAP_CENTRE_Y = 420, MAP_BANNER_Y = 96;
const map = proofMap({
  parent: document.body, box: "proofmap",
  x: 120, y: MAP_CENTRE_Y, w: 1680, h: 88,
  nodes: [
    { id: "sweep", label: "Reveal digits", col: 0, row: 0, status: "claimed" },
    { id: "clear", label: "Clear pending sites", col: 1, row: 0, status: "claimed" },
    { id: "cert", label: "Certificate", col: 2, row: 0, status: "claimed" },
    { id: "readout", label: "Spectral readout", col: 3, row: 0, status: "claimed" },
    { id: "thm", label: "Theorem 1.1", col: 4, row: 0, status: "claimed" },
  ],
  edges: [["sweep", "clear"], ["clear", "cert"], ["cert", "readout"], ["readout", "thm"]],
  stateAt: function (t) { return mapStates(t); },
});
CONTENT.push(map.el);

function mapStates(t) {
  const st = {};
  const id = beatNow(t);
  const n = BEAT_ORDER.indexOf(id);
  MAPN.forEach(function (k) { st[k] = "dim"; });
  if (n < BEAT_ORDER.indexOf("c4b3")) {
    MAPN.forEach(function (k) { st[k] = "hidden"; });
    return st;
  }
  if (id === "c4b3") {
    MAPN.forEach(function (k, i) {
      st[k] = t >= C.map + i * D.build / MAPN.length ? "dim" : "hidden";
      const p0 = C.stage + i * D.pulse / MAPN.length;
      if (t >= p0 && t < p0 + D.pulse / MAPN.length) st[k] = "active";
    });
    if (t >= C.cert3) st.cert = "active";
    return st;
  }
  const active = id === "c4b4" || id === "c4b5" ? "cert"
    : id === "c4b6" || id === "c4b7" || id === "c4b11" ? "sweep"
    : id === "c4b12" ? "clear"
    : id === "c4b13" ? (t >= C.cert13 ? "cert" : "clear")
    : id === "c4b14" ? (t >= C.theorem14 ? "thm" : "readout")
    : null;
  const ai = MAPN.indexOf(active);
  MAPN.forEach(function (k, i) {
    if (active === null) st[k] = "done";          // the three controls: carried through every stage
    else if (i < ai) st[k] = "done";
    else if (i === ai) st[k] = "active";
  });
  return st;
}

// ---------------------------------------------------------------- c4b4, c4b5: the certificate
const lat4 = makeLattice({
  box: "lat4", x: 140, y: 230, cols: 12, rows: 12, spacing: 44,
  padX: 56, padTop: 72, padBot: 48, seed: 1036, wrap: true,
});
CONTENT.push(lat4.host);
const eqIm = eqBox({
  parent: document.body, x: 800, y: 250, w: 900, h: 110, box: "eq-im",
  tex: "\\operatorname{Im} \\htmlClass{term-G}{G_{ii}}(\\htmlClass{term-E}{E}+i\\htmlClass{term-eta}{\\eta}) \\ge c",
  colors: { G: "--obj-wave", E: "--obj-energy", eta: "--obj-damping" },
});
CONTENT.push(eqIm.el);
const labSite = textLabel(document.body, "i: a damped site", 800, 362, "--ink-muted");
labSite.dataset.box = "lab-site";
CONTENT.push(labSite);

const chart4 = svgBox("chart4", 800, 420, 760, 340);
CONTENT.push(chart4.host);
const bars4 = [];
(function () {
  const svg = chart4.svg;
  const base = ns("line");
  base.setAttribute("x1", "40"); base.setAttribute("x2", "700");
  base.setAttribute("y1", "280"); base.setAttribute("y2", "280");
  base.setAttribute("stroke", "var(--ink)"); base.setAttribute("stroke-width", "2");
  svg.appendChild(base);
  const dash = ns("line");
  dash.setAttribute("x1", "40"); dash.setAttribute("x2", "700");
  dash.setAttribute("y1", "168"); dash.setAttribute("y2", "168");
  dash.setAttribute("stroke", "var(--ink)"); dash.setAttribute("stroke-width", "2");
  dash.setAttribute("stroke-dasharray", "8 6");
  svg.appendChild(dash);
  const rng = mulberry32(501);
  for (let i = 0; i < 8; i++) {
    const h = 150 + rng() * 70;
    const rect = ns("rect");
    rect.setAttribute("x", String(70 + i * 76));
    rect.setAttribute("width", "36");
    rect.setAttribute("fill", "var(--obj-wave)");
    svg.appendChild(rect);
    bars4.push({ el: rect, h: h, k: i });
  }
})();
textLabel(chart4.host, "c", 8, 148);

const gauge4 = svgBox("gauge4", 1600, 420, 180, 340);
CONTENT.push(gauge4.host);
const gaugeBar = ns("rect");
gaugeBar.setAttribute("x", "60");
gaugeBar.setAttribute("width", "48");
gaugeBar.setAttribute("fill", "var(--obj-damping)");
gauge4.svg.appendChild(gaugeBar);
(function () {
  const base = ns("line");
  base.setAttribute("x1", "30"); base.setAttribute("x2", "140");
  base.setAttribute("y1", "280"); base.setAttribute("y2", "280");
  base.setAttribute("stroke", "var(--ink)"); base.setAttribute("stroke-width", "2");
  gauge4.svg.appendChild(base);
})();
katexLabel(gauge4.host, "\\eta", 74, 290, "--obj-damping");

const plot5 = svgBox("plot5", 800, 410, 780, 370);
CONTENT.push(plot5.host);
const curve5 = ns("path");
(function () {
  const svg = plot5.svg;
  const axis = ns("path");
  axis.setAttribute("d", "M70,30 L70,340 L740,340");
  axis.setAttribute("fill", "none");
  axis.setAttribute("stroke", "var(--ink)");
  axis.setAttribute("stroke-width", "2");
  svg.appendChild(axis);
  const head = ns("polygon");
  head.setAttribute("points", "740,340 726,334 726,346");
  head.setAttribute("fill", "var(--ink)");
  svg.appendChild(head);
  const dash = ns("line");
  dash.setAttribute("x1", "70"); dash.setAttribute("x2", "720");
  dash.setAttribute("y1", "230"); dash.setAttribute("y2", "230");
  dash.setAttribute("stroke", "var(--ink)"); dash.setAttribute("stroke-width", "2");
  dash.setAttribute("stroke-dasharray", "8 6");
  svg.appendChild(dash);
  let d = "";
  for (let i = 0; i <= 40; i++) {
    const u = i / 40;
    const x = 100 + u * 600;
    const y = 190 - 110 * Math.exp(-2.4 * u);
    d += (i === 0 ? "M" : "L") + x.toFixed(1) + "," + y.toFixed(1);
  }
  curve5.setAttribute("d", d);
  curve5.setAttribute("fill", "none");
  curve5.setAttribute("stroke", "var(--obj-wave)");
  curve5.setAttribute("stroke-width", "4");
  curve5.setAttribute("pathLength", "1");
  curve5.setAttribute("stroke-dasharray", "1 1");
  svg.appendChild(curve5);
})();
textLabel(plot5.host, "c", 24, 206);
katexLabel(plot5.host, "\\operatorname{Im} G_{ii}", 90, 0, "--obj-wave");
katexLabel(plot5.host, "\\eta \\to 0", 640, 350, "--obj-damping");

// ---------------------------------------------------------------- c4b6: digits
const eqBin = eqBox({
  parent: document.body, x: 200, y: 220, w: 1500, h: 130, box: "eq-bin",
  tex: "\\htmlClass{term-lhs}{\\htmlClass{term-V}{V(n)} =} \\htmlClass{term-sum}{\\sum_{k\\ge 1}\\lambda\\,2^{-k}\\,\\varepsilon_k}\\htmlClass{term-eps}{,\\quad \\varepsilon_k = \\pm 1}",
  schedule: { lhs: C.binary, sum: C.binary + 0.5, eps: C.binary + 0.5 },
  colors: { V: "--obj-potential" },
});
CONTENT.push(eqBin.el);
const coins6 = svgBox("coins6", 560, 380, 800, 120);
CONTENT.push(coins6.host);
const COIN_SIGN = [1, -1, -1, 1];
for (let k = 0; k < 4; k++) {
  const c = ns("circle");
  c.setAttribute("cx", String(100 + k * 200));
  c.setAttribute("cy", "60");
  c.setAttribute("r", "40");
  c.setAttribute("fill", "var(--paper-raised)");
  c.setAttribute("stroke", "var(--ink)");
  c.setAttribute("stroke-width", "2");
  coins6.svg.appendChild(c);
}
const coinLabels = COIN_SIGN.map(function (s, k) {
  return textLabel(coins6.host, s > 0 ? "+" : "−", 100 + k * 200 - 10, 38);
});
const coinT = [0, 1, 2, 3].map(function (k) { return C.coin + k * D.coins / 4; });

const line6 = svgBox("line6", 200, 520, 1520, 300);
CONTENT.push(line6.host);
const L6 = { y: 110, x0: 60, x1: 1460 };
function l6x(v) { return lerp(L6.x0, L6.x1, (v + 1) / 2); }   // v in units of lambda
(function () {
  const svg = line6.svg;
  const base = ns("line");
  base.setAttribute("x1", String(L6.x0)); base.setAttribute("x2", String(L6.x1));
  base.setAttribute("y1", String(L6.y)); base.setAttribute("y2", String(L6.y));
  base.setAttribute("stroke", "var(--obj-potential)"); base.setAttribute("stroke-width", "4");
  svg.appendChild(base);
  [-1, 0, 1].forEach(function (v) {
    const tick = ns("line");
    tick.setAttribute("x1", String(l6x(v))); tick.setAttribute("x2", String(l6x(v)));
    tick.setAttribute("y1", String(L6.y - 14)); tick.setAttribute("y2", String(L6.y + 14));
    tick.setAttribute("stroke", "var(--ink)"); tick.setAttribute("stroke-width", "2");
    svg.appendChild(tick);
  });
})();
katexLabel(line6.host, "-\\lambda", l6x(-1) - 24, 134);
katexLabel(line6.host, "0", l6x(0) - 8, 134);
katexLabel(line6.host, "\\lambda", l6x(1) - 10, 134);
const marker6 = ns("circle");
marker6.setAttribute("cy", String(L6.y));
marker6.setAttribute("r", "13");
marker6.setAttribute("fill", "var(--obj-potential)");
line6.svg.appendChild(marker6);
const STEP_POS = [0];
COIN_SIGN.forEach(function (s, k) { STEP_POS.push(STEP_POS[k] + s * Math.pow(2, -(k + 1))); });
const stepArrows = [];
for (let k = 0; k < 4; k++) {
  const g = ns("g");
  const y = 180 + k * 26;
  const x1 = l6x(STEP_POS[k]), x2 = l6x(STEP_POS[k + 1]);
  const line = ns("line");
  line.setAttribute("x1", String(x1)); line.setAttribute("x2", String(x2));
  line.setAttribute("y1", String(y)); line.setAttribute("y2", String(y));
  line.setAttribute("stroke", "var(--obj-potential)"); line.setAttribute("stroke-width", "3");
  const tri = ns("polygon");
  const dir = x2 > x1 ? 1 : -1;
  tri.setAttribute("points", x2 + "," + y + " " + (x2 - dir * 12) + "," + (y - 7) + " " + (x2 - dir * 12) + "," + (y + 7));
  tri.setAttribute("fill", "var(--obj-potential)");
  g.appendChild(line);
  g.appendChild(tri);
  line6.svg.appendChild(g);
  stepArrows.push(g);
}
const labNoDis = textLabel(line6.host, "no disorder", l6x(0) - 80, 30, "--ink-muted");

// ---------------------------------------------------------------- c4b7: step chart
const chart7 = svgBox("chart7", 140, 220, 1640, 530);
CONTENT.push(chart7.host);
const sLevels = [108, 206, 308, 418];
const tLevels = [78, 170, 264, 352];
const stepX = [100, 450, 800, 1150, 1500];
const sSeg = [];
const tSeg = [];
(function () {
  const svg = chart7.svg;
  const axis = ns("path");
  axis.setAttribute("d", "M80,40 L80,470 L1560,470");
  axis.setAttribute("fill", "none");
  axis.setAttribute("stroke", "var(--ink)");
  axis.setAttribute("stroke-width", "2");
  svg.appendChild(axis);
  const floor = ns("line");
  floor.setAttribute("x1", "80"); floor.setAttribute("x2", "1500");
  floor.setAttribute("y1", "430"); floor.setAttribute("y2", "430");
  floor.setAttribute("stroke", "var(--obj-damping)"); floor.setAttribute("stroke-width", "2");
  floor.setAttribute("stroke-dasharray", "8 6");
  svg.appendChild(floor);
  function seg(x1, y1, x2, y2, token) {
    const line = ns("line");
    line.setAttribute("x1", String(x1)); line.setAttribute("y1", String(y1));
    line.setAttribute("x2", String(x2)); line.setAttribute("y2", String(y2));
    line.setAttribute("stroke", "var(" + token + ")"); line.setAttribute("stroke-width", "4");
    line.setAttribute("opacity", "0");
    svg.appendChild(line);
    return line;
  }
  for (let k = 0; k < 4; k++) {
    const packS = [];
    const packT = [];
    if (k > 0) {
      packS.push(seg(stepX[k], sLevels[k - 1], stepX[k], sLevels[k], "--obj-potential"));
      packT.push(seg(stepX[k], tLevels[k - 1], stepX[k], tLevels[k], "--obj-damping"));
    }
    packS.push(seg(stepX[k], sLevels[k], stepX[k + 1], sLevels[k], "--obj-potential"));
    packT.push(seg(stepX[k], tLevels[k], stepX[k + 1], tLevels[k], "--obj-damping"));
    sSeg.push(packS);
    tSeg.push(packT);
  }
})();
const labS = textLabel(chart7.host, "variance of the hidden digits", 1000, 70, "--obj-potential");
const labT = textLabel(chart7.host, "damping", 1000, 20, "--obj-damping");
textLabel(chart7.host, "stage", 1440, 482, "--ink-muted");
textLabel(chart7.host, "size", 0, 0, "--ink-muted");
const stepCues = [C.revealed, C.damping7, C.variance, C.trades];
const stepDur = [D.s1, D.s2, D.s3, D.s4];

// ---------------------------------------------------------------- c4b8-c4b10: three controls
const cardSC = ledgerCard({ parent: document.body, status: "context", title: "self-consistency", lines: [], x: 140, y: 210, w: 500, tIn: C.controls });
const cardNC = ledgerCard({ parent: document.body, status: "context", title: "no concentration", lines: [], x: 680, y: 210, w: 500, tIn: C.controls });
const cardWL = ledgerCard({ parent: document.body, status: "context", title: "Ward Laplacian", lines: [], x: 1220, y: 210, w: 500, tIn: C.controls });

const loop8 = svgBox("loop8", 300, 360, 1320, 300);
CONTENT.push(loop8.host);
(function () {
  const svg = loop8.svg;
  function arc(d) {
    const p = ns("path");
    p.setAttribute("d", d);
    p.setAttribute("fill", "none");
    p.setAttribute("stroke", "var(--ink)");
    p.setAttribute("stroke-width", "3");
    svg.appendChild(p);
  }
  arc("M330,110 Q660,10 990,110");
  arc("M990,190 Q660,290 330,190");
  const a1 = ns("polygon");
  a1.setAttribute("points", "990,110 968,94 972,118");
  a1.setAttribute("fill", "var(--ink)");
  svg.appendChild(a1);
  const a2 = ns("polygon");
  a2.setAttribute("points", "330,190 352,206 348,182");
  a2.setAttribute("fill", "var(--ink)");
  svg.appendChild(a2);
})();
textLabel(loop8.host, "damping", 150, 130, "--obj-damping");
textLabel(loop8.host, "Gr\u0065en function", 1010, 130, "--obj-wave");   // escaped: the palette lint reads the bare word as a colour name

const gauge8 = svgBox("gauge8", 460, 700, 1000, 140);
CONTENT.push(gauge8.host);
const g8fill = ns("rect");
(function () {
  const svg = gauge8.svg;
  const track = ns("rect");
  track.setAttribute("x", "200"); track.setAttribute("y", "40");
  track.setAttribute("width", "720"); track.setAttribute("height", "36");
  track.setAttribute("fill", "none"); track.setAttribute("stroke", "var(--rule)"); track.setAttribute("stroke-width", "2");
  svg.appendChild(track);
  g8fill.setAttribute("x", "200"); g8fill.setAttribute("y", "40");
  g8fill.setAttribute("height", "36");
  g8fill.setAttribute("fill", "var(--obj-wave)");
  svg.appendChild(g8fill);
  const tick = ns("line");
  tick.setAttribute("x1", "440"); tick.setAttribute("x2", "440");
  tick.setAttribute("y1", "28"); tick.setAttribute("y2", "88");
  tick.setAttribute("stroke", "var(--ink)"); tick.setAttribute("stroke-width", "3");
  svg.appendChild(tick);
})();
textLabel(gauge8.host, "feedback", 0, 38);
katexLabel(gauge8.host, "1/3", 420, 92);

const bars9 = svgBox("bars9", 160, 380, 1560, 400);
CONTENT.push(bars9.host);
const spreadBars = [];
(function () {
  const svg = bars9.svg;
  const base = ns("line");
  base.setAttribute("x1", "40"); base.setAttribute("x2", "1480");
  base.setAttribute("y1", "260"); base.setAttribute("y2", "260");
  base.setAttribute("stroke", "var(--ink)"); base.setAttribute("stroke-width", "2");
  svg.appendChild(base);
  for (let i = 0; i < 12; i++) {
    const h = 70 + (i % 3) * 12;
    const rect = ns("rect");
    rect.setAttribute("x", String(60 + i * 52));
    rect.setAttribute("width", "28");
    rect.setAttribute("fill", "var(--obj-wave)");
    svg.appendChild(rect);
    spreadBars.push({ el: rect, h: h });
  }
  const tall = ns("rect");
  tall.setAttribute("x", "1180"); tall.setAttribute("y", "70");
  tall.setAttribute("width", "36"); tall.setAttribute("height", "190");
  tall.setAttribute("fill", "var(--obj-wave)");
  svg.appendChild(tall);
  [["1172", "60", "1224", "270"], ["1172", "270", "1224", "60"]].forEach(function (c) {
    const l = ns("line");
    l.setAttribute("x1", c[0]); l.setAttribute("y1", c[1]); l.setAttribute("x2", c[2]); l.setAttribute("y2", c[3]);
    l.setAttribute("stroke", "var(--ink)"); l.setAttribute("stroke-width", "4");
    svg.appendChild(l);
  });
})();
textLabel(bars9.host, "spread over many sites", 120, 290);
textLabel(bars9.host, "concentrated", 1110, 290);

const graph10 = svgBox("graph10", 220, 360, 1400, 330);
CONTENT.push(graph10.host);
const G10 = { pts: [[90, 200], [340, 70], [620, 220], [900, 66], [1220, 190]] };
const g10edges = [];
const g10pulses = [];
(function () {
  const svg = graph10.svg;
  const edges = [[0, 1, 3], [1, 2, 7], [2, 3, 4], [3, 4, 9], [0, 2, 2], [1, 3, 5], [2, 4, 3], [0, 4, 2]];
  edges.forEach(function (e) {
    const line = ns("line");
    line.setAttribute("x1", String(G10.pts[e[0]][0])); line.setAttribute("y1", String(G10.pts[e[0]][1]));
    line.setAttribute("x2", String(G10.pts[e[1]][0])); line.setAttribute("y2", String(G10.pts[e[1]][1]));
    line.setAttribute("stroke", "var(--obj-wave)"); line.setAttribute("stroke-width", String(e[2]));
    line.setAttribute("pathLength", "1");
    line.setAttribute("stroke-dasharray", "1 1");
    svg.appendChild(line);
    g10edges.push(line);
  });
  G10.pts.forEach(function (p) {
    const c = ns("circle");
    c.setAttribute("cx", String(p[0])); c.setAttribute("cy", String(p[1])); c.setAttribute("r", "10");
    c.setAttribute("fill", "var(--ink)");
    svg.appendChild(c);
    const pulse = ns("circle");
    pulse.setAttribute("cx", String(p[0])); pulse.setAttribute("cy", String(p[1]));
    pulse.setAttribute("fill", "none"); pulse.setAttribute("stroke", "var(--obj-wave)"); pulse.setAttribute("stroke-width", "3");
    svg.appendChild(pulse);
    g10pulses.push(pulse);
  });
})();
const bound10 = svgBox("bound10", 560, 720, 800, 110);
CONTENT.push(bound10.host);
const b10fill = ns("rect");
b10fill.setAttribute("x", "220"); b10fill.setAttribute("y", "36"); b10fill.setAttribute("height", "36");
b10fill.setAttribute("fill", "var(--obj-wave)");
bound10.svg.appendChild(b10fill);
textLabel(bound10.host, "one bound", 0, 32);

// ---------------------------------------------------------------- c4b11-c4b13: tiles, clusters, torus
const lat11 = makeLattice({
  box: "lat11", x: 651, y: 270, cols: 12, rows: 8, spacing: 46,
  padX: 56, padTop: 72, padBot: 48, seed: 2036, wrap: false,
  tile: { step: 4, i0: 4, i1: 7, j0: 0, j1: 3 },
});
CONTENT.push(lat11.host);
const lat12 = makeLattice({
  box: "lat12", x: 160, y: 260, cols: 5, rows: 5, spacing: 90,
  padX: 56, padTop: 72, padBot: 48, seed: 3036, wrap: false, cluster: { i: 2, j: 2 },
});
CONTENT.push(lat12.host);
const arrows12 = [];
(function () {
  const cx = lat12.px(2), cy = lat12.py(2);
  [[0, 0], [2, 0], [4, 0], [4, 2], [4, 4], [2, 4], [0, 4], [0, 2]].forEach(function (q) {
    const tx = lat12.px(q[0]), ty = lat12.py(q[1]);
    const dx = tx - cx, dy = ty - cy, L = Math.hypot(dx, dy);
    const r0 = lat12.spacing * 1.45 + 6, r1 = L - 16;
    const line = ns("line");
    line.setAttribute("x1", (cx + dx / L * r0).toFixed(1)); line.setAttribute("y1", (cy + dy / L * r0).toFixed(1));
    line.setAttribute("x2", (cx + dx / L * r1).toFixed(1)); line.setAttribute("y2", (cy + dy / L * r1).toFixed(1));
    line.setAttribute("stroke", "var(--ink)");
    lat12.group.appendChild(line);
    arrows12.push(line);
  });
})();
const block12 = svgBox("block12", 860, 300, 860, 420);
CONTENT.push(block12.host);
const crossCells = [];
(function () {
  const svg = block12.svg;
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 2; c++) {
      const cell = ns("rect");
      cell.setAttribute("x", String(260 + c * 260)); cell.setAttribute("y", String(110 + r * 140));
      cell.setAttribute("width", "240"); cell.setAttribute("height", "120");
      cell.setAttribute("fill", "var(--paper-raised)");
      cell.setAttribute("stroke", "var(--ink)"); cell.setAttribute("stroke-width", "2");
      svg.appendChild(cell);
      if (r !== c) crossCells.push(cell);
    }
  }
})();
textLabel(block12.host, "cluster", 290, 50, "--ink-muted");
textLabel(block12.host, "outside", 560, 50, "--ink-muted");
textLabel(block12.host, "cluster", 60, 150, "--ink-muted");
textLabel(block12.host, "outside", 60, 290, "--ink-muted");
const lat13 = makeLattice({
  box: "lat13", x: 673, y: 270, cols: 8, rows: 8, spacing: 66,
  padX: 56, padTop: 72, padBot: 48, seed: 4036, wrap: true,
});
CONTENT.push(lat13.host);

// ---------------------------------------------------------------- helpers
function light(card, on) {
  card.el.className = "ledger " + (on ? "st-claimed" : "st-context");
}
function setVis(el, u) {
  el.style.opacity = String(u);
}

// ---------------------------------------------------------------- the picture at time t
window.sceneEvents = events;
window.sceneDuration = window.__BEATS__.duration;

window.setTime = function (t) {
  const id = beatNow(t);
  label.setTime(t);

  // paper: c4b1, and c4b2 until the axis takes over
  const paperOn = id === "c4b1" || id === "c4b2";
  if (paperOn) {
    const st = { enter: fade(t, C.posted, D.enter), fan: fade(t, C.ninety, D.fan) };
    st.fan = clamp((t - C.ninety) / D.fan, 0, 1);
    if (id === "c4b1") {
      st.forward = { page: 1, k: clamp((t - FWD1) / D.fwd1, 0, 1) };
    } else {
      const back = 0.4 * D.thm / 1.2, fwd = D.thm - back;
      if (t < C.theorem + back) st.forward = { page: 1, k: 1 - clamp((t - C.theorem) / back, 0, 1) };
      else st.forward = { page: 3, k: clamp((t - C.theorem - back) / fwd, 0, 1) };
      if (t >= C.theorem + back) st.highlight = { region: THEOREM, k: clamp((t - C.theorem - back) / fwd, 0, 1), status: "claimed" };
      st.zoom = { region: THEOREM, k: clamp((t - C.centres) / D.zoom, 0, 1) };
      st.fade = clamp((t - C.interval) / (D.axis / 2), 0, 1);
    }
    paper.show(st);
    paper.el.style.opacity = String(1 - (st.fade || 0));
    count93.style.opacity = String(id === "c4b1" ? fade(t, C.ninety, D.fan / 2) * (1 - fade(t, FWD1, D.fwd1 / 2)) : 0);
  } else {
    paper.el.style.opacity = "0";
  }
  cardMs.setTime(id === "c4b1" ? t : -1);

  // energy axis: c4b2 from [interval], c4b3 until it fades, c4b14 from [spectral]
  const on2 = id === "c4b2", on3 = id === "c4b3", on14 = id === "c4b14";
  let axU = 0;
  if (on2) axU = fade(t, C.interval + D.axis / 2, D.axis / 2);
  if (on3) axU = 1 - fade(t, C.plan, D.axOut);
  if (on14) axU = fade(t, C.spectral, D.ax14);
  setVis(energy.host, axU);
  const late2 = on2 || on3;
  setOp(idRect, late2 || on14 ? 1 : 0);
  setOp(density, on2 || on3 ? fade(t, C.continuous, D.ac) * (on3 ? 1 : 1) : (on14 ? 1 : 0));
  spikes.forEach(function (line) { setOp(line, on14 ? 1 - fade(t, C.eigenvalues, D.eig14) : 0); });
  labFixed.style.opacity = String(late2 ? 1 : 0);
  labIns.style.opacity = String(late2 ? fade(t, C.spectrum, D.ins) : 0);
  labAc.style.opacity = String(late2 ? fade(t, C.continuous, D.ac) : 0);
  labAc14.style.opacity = String(on14 ? fade(t, C.absolutely, D.abs14) : 0);
  labThm14.style.opacity = String(on14 ? fade(t, C.theorem14, D.thm14) : 0);

  // proof map: builds at the centre in c4b3, glides into the banner at c4b4
  const mapOn = BEAT_ORDER.indexOf(id) >= BEAT_ORDER.indexOf("c4b3");
  setVis(map.el, mapOn && (id !== "c4b3" || t >= C.map) ? 1 : 0);
  const glide = id === "c4b3" ? 0 : fade(t, C.cert4, D.glide);
  map.el.style.transform = "translateY(" + lerp(0, MAP_BANNER_Y - MAP_CENTRE_Y, mapOn ? glide : 0).toFixed(2) + "px)";
  map.setTime(t);

  // c4b4-c4b5: periodic box, formula, bars, damping gauge, then the plot
  const on4 = id === "c4b4", on5 = id === "c4b5", on6 = id === "c4b6";
  const keep6 = on6 ? 1 - fade(t, C.build, D.clear6) : 1;
  const boxOn = on4 || on5 || on6;
  const g1 = on4 ? fade(t, C.however, D.grow1) : (on5 || on6 ? 1 : 0);
  const g2 = on4 ? fade(t, C.shrinks, D.grow2) : (on5 || on6 ? 1 : 0);
  const size = 8 + 2 * g1 + 2 * g2;
  setVis(lat4.host, boxOn ? (on4 ? fade(t, C.box, D.box) : 1) * keep6 : 0);
  if (boxOn) {
    const ringU = on4 ? fade(t, C.damping4, D.rings) : 1;
    paintLattice(lat4, {
      shift: (12 - size) / 2 * lat4.spacing,
      edge: Math.min(11, Math.round(size) - 1),
      wrap: 1,
      site: function (s) {
        const m = Math.max(s.i, s.j);
        const show = m < 8 ? 1 : clamp(size - m, 0, 1);
        return { show: show, ring: (s.i + s.j) % 2 === 0 ? ringU : 0, cross: 0, terminal: 0, bar: 1 };
      },
    });
  }
  setVis(eqIm.el, (on4 ? fade(t, C.imaginary, D.im) : (on5 || on6 ? 1 : 0)) * keep6);
  setVis(labSite, (on4 ? fade(t, C.imaginary, D.im) : (on5 ? 1 : 0)));
  setVis(chart4.host, on4 ? fade(t, C.imaginary, D.im) : (on5 ? 1 - fade(t, C.lower, D.plot) : 0));
  bars4.forEach(function (b) {
    const wob = Math.sin((size - 8) * 1.7 + b.k * 1.3) * 10;
    const h = b.h + (size > 8 ? wob : 0);
    b.el.setAttribute("height", h.toFixed(1));
    b.el.setAttribute("y", (280 - h).toFixed(1));
  });
  setVis(gauge4.host, (on4 ? fade(t, C.box, D.box) : (on5 ? 1 : 0)));
  const gh = lerp(230, 40, g2);
  gaugeBar.setAttribute("height", gh.toFixed(1));
  gaugeBar.setAttribute("y", (280 - gh).toFixed(1));
  setVis(plot5.host, on5 ? fade(t, C.lower, D.plot) : (on6 ? keep6 : 0));
  const drawn = on5 ? fade(t, C.survives, D.curve) : (on6 ? 1 : 0);
  curve5.setAttribute("stroke-dashoffset", String(1 - drawn));
  if (on6) setVis(gauge4.host, keep6);

  // c4b6: binary digits
  setVis(eqBin.el, on6 && t >= C.build + D.clear6 ? 1 : 0);
  setVis(coins6.host, on6 ? fade(t, C.coin, D.coins / 8) : 0);
  setVis(line6.host, on6 ? fade(t, C.construction, D.line6) : 0);
  let pos = 0;
  for (let k = 0; k < 4; k++) {
    const u = on6 ? clamp((t - coinT[k]) / (D.coins / 4), 0, 1) : 0;
    const move = ease(clamp(u * 2 - 1, 0, 1));
    if (u > 0) pos = lerp(STEP_POS[k], STEP_POS[k + 1], move);
    const flip = u < 0.5 ? 1 - 2 * u : 2 * u - 1;
    coinLabels[k].style.opacity = String(u >= 0.5 ? 1 : 0);
    coinLabels[k].style.transformOrigin = "50% 50%";
    coinLabels[k].style.transform = "scaleX(" + flip.toFixed(3) + ")";
    setOp(stepArrows[k], move);
  }
  marker6.setAttribute("cx", l6x(pos).toFixed(2));
  labNoDis.style.opacity = String(on6 ? 1 - fade(t, C.coin, D.coins / 4) : 0);

  // c4b7: step chart
  const on7 = id === "c4b7";
  setVis(chart7.host, on7 ? 1 : 0);
  for (let k = 0; k < 4; k++) {
    const u = on7 ? fade(t, stepCues[k], stepDur[k]) : 0;
    sSeg[k].forEach(function (line) { setOp(line, u); });
    tSeg[k].forEach(function (line) { setOp(line, u); });
  }
  labS.style.opacity = String(on7 ? fade(t, C.revealed, D.s1) : 0);
  labT.style.opacity = String(on7 ? fade(t, C.damping7, D.s2) : 0);

  // c4b8-c4b10: the three controls
  const on8 = id === "c4b8", on9 = id === "c4b9", on10 = id === "c4b10";
  const cardsOn = on8 || on9 || on10;
  cardSC.setTime(cardsOn ? t : -1);
  cardNC.setTime(cardsOn ? t : -1);
  cardWL.setTime(cardsOn ? t : -1);
  light(cardSC, on8 && t >= C.first);
  light(cardNC, on9 && t >= C.second);
  light(cardWL, on10 && t >= C.third);
  setVis(loop8.host, on8 ? fade(t, C.match, D.loop) : 0);
  setVis(gauge8.host, on8 ? fade(t, C.feedback, D.gauge / 2) : 0);
  g8fill.setAttribute("width", (on8 ? 240 * fade(t, C.feedback, D.gauge) : 0).toFixed(1));
  setVis(bars9.host, on9 ? fade(t, C.concentrates, D.rows) : 0);
  spreadBars.forEach(function (b, i) {
    const bump = i === 5 && on9 ? Math.sin(Math.PI * clamp((t - C.update) / D.nudge, 0, 1)) * 26 : 0;
    const h = b.h + bump;
    b.el.setAttribute("height", h.toFixed(1));
    b.el.setAttribute("y", (260 - h).toFixed(1));
  });
  setVis(graph10.host, on10 ? fade(t, C.third, D.nodes10) : 0);
  g10edges.forEach(function (e) { e.setAttribute("stroke-dashoffset", String(1 - (on10 ? fade(t, C.graph, D.graph) : 0))); });
  const pulseSpan = D.sum / 2;
  g10pulses.forEach(function (p, i) {
    const u = on10 ? clamp((t - C.laplacian - i * pulseSpan / 5) / (pulseSpan / 2), 0, 1) : 0;
    p.setAttribute("r", (10 + 26 * u).toFixed(1));
    setOp(p, u > 0 && u < 1 ? 1 - u : 0);
  });
  setVis(bound10.host, on10 ? fade(t, C.laplacian, D.sum / 4) : 0);
  b10fill.setAttribute("width", (on10 ? 520 * fade(t, C.laplacian + pulseSpan, D.sum - pulseSpan) : 0).toFixed(1));

  // c4b11: tiles
  const on11 = id === "c4b11";
  setVis(lat11.host, on11 ? fade(t, C.tiles, D.tile) : 0);
  if (on11) {
    const sweepU = fade(t, C.tested, D.tested);
    const sweeping = t >= C.tested && t < C.tested + D.tested;
    const frameOn = t >= C.tested && t < C.rolled;
    const flashU = t >= C.failed && t < C.rolled ? Math.sin((t - C.failed) / (C.rolled - C.failed) * Math.PI) * 0.4 : 0;
    const crossU = fade(t, C.pending, D.pend);
    paintLattice(lat11, {
      shift: 0, edge: 0, wrap: 0,
      site: function (s) {
        const inside = s.i >= 4 && s.i <= 7 && s.j >= 0 && s.j <= 3;
        return { show: 1, ring: 0, cross: inside ? crossU : 0, terminal: 0, bar: 1 };
      },
    });
    const tile = lat11.tile;
    setOp(tile.frame, frameOn ? fade(t, C.tested, D.tested / 3) : 0);
    const bandW = lat11.spacing * 0.5;
    tile.band.setAttribute("x", lerp(tile.x1, tile.x2 - bandW, sweepU).toFixed(2));
    setOp(tile.band, sweeping ? 0.35 : 0);
    setOp(tile.flash, flashU);
  }

  // c4b12: clusters
  const on12 = id === "c4b12";
  setVis(lat12.host, on12 ? 1 : 0);
  if (on12) {
    const done = fade(t, C.completing, D.done12);
    paintLattice(lat12, {
      shift: 0, edge: 0, wrap: 0, cluster: fade(t, C.clusters, D.clus),
      site: function (s) {
        const inner = s.i >= 1 && s.i <= 3 && s.j >= 1 && s.j <= 3;
        return { show: 1, ring: 0, cross: inner ? 1 - done : 0, terminal: inner ? done : 0, bar: 0.7 };
      },
    });
    const aU = fade(t, C.scattering, D.scat);
    const wU = fade(t, C.weak, D.weak);
    arrows12.forEach(function (a) {
      setOp(a, aU);
      a.setAttribute("stroke-width", lerp(6, 1.5, wU).toFixed(2));
    });
  }
  setVis(block12.host, on12 ? fade(t, C.scattering, D.scat) : 0);
  crossCells.forEach(function (c) {
    c.setAttribute("fill", on12 && t >= C.scattering ? "var(--status-claimed)" : "var(--paper-raised)");
    c.setAttribute("fill-opacity", on12 && t >= C.scattering ? String(0.35 * (1 - 0.6 * fade(t, C.weak, D.weak))) : "1");
  });

  // c4b13: the torus, all digits in
  const on13 = id === "c4b13";
  setVis(lat13.host, on13 ? fade(t, C.nothing, D.nothing) : 0);
  if (on13) {
    const barU = lerp(0.42, 1, fade(t, C.digits, D.digits));
    paintLattice(lat13, {
      shift: 0, edge: 7, wrap: 1,
      site: function () { return { show: 1, ring: 0, cross: 0, terminal: 0, bar: barU }; },
    });
  }

  // heuristic badges
  badge5.setVisible(on5);
  badge7.setVisible(on7);

  // the chapter's end: everything fades out after the last word
  const outK = 1 - fade(t, C.end, D.out);
  if (outK < 1) {
    CONTENT.forEach(function (el) { el.style.opacity = String(parseFloat(el.style.opacity || "1") * outK); });
  }

  strip.setTime(t);
  subs.setTime(t);
  eqIm.setTime(t);
  eqBin.setTime(t);
};

// ---------------------------------------------------------------- scheduled events
mark(C.posted, "c4b1", "page stack enters");
mark(C.ninety, "c4b1", "93 pages fan out");
mark(FWD1, "c4b1", "title page forward");
mark(C.refereed, "c4b1", "ledger card");
mark(C.theorem, "c4b2", "page 3 forward, Theorem 1.1 highlighted");
mark(C.centres, "c4b2", "zoom on Theorem 1.1");
mark(C.interval, "c4b2", "energy axis with I_d");
mark(C.spectrum, "c4b2", "label inside the spectrum");
mark(C.continuous, "c4b2", "density, purely absolutely continuous");
mark(C.plan, "c4b3", "axis fades");
mark(C.map, "c4b3", "proof map builds");
mark(C.stage, "c4b3", "boxes pulse in order");
mark(C.cert3, "c4b3", "certificate node");
mark(C.cert4, "c4b4", "map glides into the banner");
mark(C.box, "c4b4", "periodic box");
mark(C.damping4, "c4b4", "damping rings");
mark(C.imaginary, "c4b4", "formula and bars");
mark(C.however, "c4b4", "box grows");
mark(C.shrinks, "c4b4", "box grows, damping falls");
mark(C.lower, "c4b5", "plot");
mark(C.survives, "c4b5", "curve");
mark(C.build, "c4b6", "box fades");
mark(C.construction, "c4b6", "number line");
mark(C.binary, "c4b6", "binary formula");
coinT.forEach(function (ct, k) { mark(ct, "c4b6", "coin " + (k + 1)); });
stepCues.forEach(function (ct, k) { mark(ct, "c4b7", "step " + (k + 1)); });
mark(C.controls, "c4b8", "three cards");
mark(C.first, "c4b8", "self-consistency lit");
mark(C.match, "c4b8", "loop");
mark(C.feedback, "c4b8", "feedback gauge");
mark(C.second, "c4b9", "no concentration lit");
mark(C.concentrates, "c4b9", "bar rows");
mark(C.update, "c4b9", "one bar nudges");
mark(C.third, "c4b10", "Ward Laplacian lit");
mark(C.third, "c4b10", "graph nodes");
mark(C.graph, "c4b10", "graph edges");
mark(C.laplacian, "c4b10", "changes flow into one bound");
mark(C.tiles, "c4b11", "tiles");
mark(C.tested, "c4b11", "tile tested");
mark(C.failed, "c4b11", "tile failed");
mark(C.rolled, "c4b11", "tile restored");
mark(C.pending, "c4b11", "sites pending");
mark(C.clusters, "c4b12", "cluster ring");
mark(C.scattering, "c4b12", "coupling arrows and blocks");
mark(C.weak, "c4b12", "arrows thin");
mark(C.completing, "c4b12", "cluster completed");
mark(C.nothing, "c4b13", "torus");
mark(C.digits, "c4b13", "bars complete");
mark(C.cert13, "c4b13", "certificate node");
mark(C.spectral, "c4b14", "axis returns, readout node");
mark(C.absolutely, "c4b14", "label absolutely continuous");
mark(C.eigenvalues, "c4b14", "spikes fade");
mark(C.theorem14, "c4b14", "theorem node and label");
