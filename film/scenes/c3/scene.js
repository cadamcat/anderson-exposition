/* Chapter 3. Picture is a function of t. Cue times come from the narration. */
installBeats(window.__BEATS__);

const events = [];
function mark(t, beat, what) {
  events.push({ t: Math.round(t * 1000) / 1000, beat: beat, what: what });
}

function ns(name) {
  return document.createElementNS("http://www.w3.org/2000/svg", name);
}

function setOp(el, v) {
  const o = v <= 0 ? 0 : v >= 1 ? 1 : v;
  el.style.opacity = o === 0 ? "0" : o === 1 ? "1" : o.toFixed(4);
}

function setAttr(el, v) {
  const o = v <= 0 ? 0 : v >= 1 ? 1 : v;
  el.setAttribute("opacity", o === 0 ? "0" : o === 1 ? "1" : o.toFixed(4));
}

function place(el, x, y, w, h) {
  el.style.left = Math.round(x) + "px";
  el.style.top = Math.round(y) + "px";
  if (w != null) el.style.width = Math.round(w) + "px";
  if (h != null) el.style.height = Math.round(h) + "px";
}

function poseOf(el, p) {
  el.style.transformOrigin = "0 0";
  el.style.transform = "translate(" + p.tx.toFixed(2) + "px," + p.ty.toFixed(2) + "px) scale(" + p.s.toFixed(4) + ")";
}

function mixPose(a, b, u) {
  return {
    tx: lerp(a.tx, b.tx, u),
    ty: lerp(a.ty, b.ty, u),
    s: lerp(a.s, b.s, u),
  };
}

function hardStep(u, i, n) {
  if (u >= 1) return 1;
  if (u <= 0) return 0;
  return u * n >= i + 1 ? 1 : 0;
}

const C = {
  every: cue("c3b1", "Every"),
  one: cue("c3b1", "one"),
  strong: cue("c3b1", "strong"),
  extended: cue("c3b2", "Extended"),
  trees: cue("c3b2", "trees"),
  klein: cue("c3b2", "Klein"),
  the: cue("c3b3", "The"),
  inverse: cue("c3b3", "inverse"),
  energy: cue("c3b3", "energy"),
  eta: cue("c3b3", "eta"),
  damping3: cue("c3b3", "damping"),
  on4: cue("c3b4", "On"),
  tree: cue("c3b4", "tree"),
  removing: cue("c3b4", "removing"),
  recursion: cue("c3b4", "recursion"),
  terms: cue("c3b4", "terms"),
  on5: cue("c3b5", "On"),
  lattice: cue("c3b5", "lattice"),
  loops: cue("c3b5", "loops"),
  perturbation: cue("c3b6", "Perturbation"),
  follows: cue("c3b6", "follows"),
  lambda6: cue("c3b6", "lambda"),
  kappa: cue("c3b6", "kappa"),
  heat: cue("c3b6", "heat"),
  erdos: cue("c3b6", "Erdős"),
  following: cue("c3b7", "Following"),
  damping7: cue("c3b7", "damping"),
  over: cue("c3b7", "over"),
  lambda7: cue("c3b7", "lambda"),
  all: cue("c3b8", "all"),
  zero: cue("c3b8", "zero"),
  obstacle: cue("c3b8", "obstacle"),
};
C.resolvent = cue("c3b3", "Gree\
n");

const INTRO = need("c3b1", "lead", 1.6, "chapter title settles");
const AXIS_IN = need("c3b1", "Every", 0.5, "energy axis appears");
const CARD_ONE = need("c3b1", "one", 0.4, "one-dimension ledger rises");
const BANDS = need("c3b1", "strong", 0.8, "localized bands at the edges");
const CARD_STRONG = need("c3b1", "strong", 0.4, "band-edge ledger rises");
const LEAVE1 = need("c3b2", "Extended", 0.4, "spectrum cards leave");
const TREE_DRAW = need("c3b2", "trees", 1.1, "tree drawn from the root");
const CARD_KLEIN = need("c3b2", "Klein", 0.4, "tree ledger rises");
const LEAVE2 = need("c3b3", "The", 0.4, "tree ledger leaves");
const BACK = need("c3b3", "The", 0.8, "tree steps back");
const RESOLVENT = need("c3b3", "Gree\
n", 0.6, "resolvent symbol appears");
const INVERSE = need("c3b3", "inverse", 0.8, "inverse appears");
const ENERGY_Z = need("c3b3", "energy", 0.5, "energy term appears");
const ETA_IN = need("c3b3", "eta", 0.5, "damping symbol appears");
const DAMP_LAB = need("c3b3", "damping", 0.4, "damping label appears");
const RETURN = need("c3b4", "On", 0.8, "tree returns to the centre");
const BADGE_IN = need("c3b4", "On", 0.4, "heuristic badge appears");
const CUT = need("c3b4", "removing", 0.8, "root removed and branches separate");
const REC_IN = need("c3b4", "recursion", 1.0, "recursion builds");
const TERMS = need("c3b4", "terms", 0.7, "branch terms link to the tree");
const CLEAR = need("c3b5", "On", 0.4, "recursion leaves the lattice");
const LAT_IN = need("c3b5", "lattice", 0.6, "lattice appears");
const LOOPS_IN = need("c3b5", "loops", 0.8, "three loops appear");
const SWAP = need("c3b6", "Perturbation", 0.8, "graphs give way to the time axis");
const SPREAD = need("c3b6", "follows", 1.2, "wave spreads along the time axis");
const TICK_IN = need("c3b6", "lambda", 0.6, "time tick appears");
const KAPPA_IN = need("c3b6", "kappa", 0.5, "kappa label appears");
const HEAT_IN = need("c3b6", "heat", 0.6, "heat label appears");
const CARD_DIFF = need("c3b6", "Erdős", 0.4, "diffusion ledger rises");
const LEAVE3 = need("c3b7", "Following", 0.4, "diffusion ledger leaves");
const AXIS2 = need("c3b7", "damping", 0.8, "damping axis appears");
const OVER_IN = need("c3b7", "over", 0.6, "one-over-time label");
const LINK_IN = need("c3b7", "lambda", 0.6, "connector meets the damping tick");
const ALL_IN = need("c3b8", "all", 0.8, "time axis reaches infinity");
const ZERO_IN = need("c3b8", "zero", 0.6, "damping axis reaches zero");
const OB_IN = need("c3b8", "obstacle", 0.6, "obstacle bracket appears");
const OUT = need("c3b8", "tail", 0.8, "picture fades out");

const label = chapterLabel({ n: 3, title: "Why it is hard", intro: INTRO });
const strip = mountStrip(document.body);
const subs = mountSubtitles(document.body, window.__BEATS__);

function host(name, x, y, w, h) {
  const el = document.createElement("div");
  el.className = "stage-abs";
  el.dataset.box = name;
  el.dataset.words = "per-text";
  place(el, x, y, w, h);
  const svg = ns("svg");
  svg.setAttribute("width", String(w));
  svg.setAttribute("height", String(h));
  svg.setAttribute("viewBox", "0 0 " + w + " " + h);
  el.appendChild(svg);
  document.body.appendChild(el);
  return { el: el, svg: svg, x: x, y: y, w: w, h: h };
}

function svgText(parent, x, y, str, fill, anchor) {
  const text = ns("text");
  text.setAttribute("class", "t-label");
  text.setAttribute("x", String(x));
  text.setAttribute("y", String(y));
  text.setAttribute("text-anchor", anchor || "middle");
  text.setAttribute("dominant-baseline", "middle");
  text.setAttribute("fill", fill);
  text.textContent = str;
  parent.appendChild(text);
  return text;
}

function line(parent, x1, y1, x2, y2, stroke, width, extra) {
  const el = ns("line");
  el.setAttribute("x1", String(x1));
  el.setAttribute("y1", String(y1));
  el.setAttribute("x2", String(x2));
  el.setAttribute("y2", String(y2));
  el.setAttribute("stroke", stroke);
  el.setAttribute("stroke-width", String(width));
  if (extra) Object.keys(extra).forEach(function (k) { el.setAttribute(k, extra[k]); });
  parent.appendChild(el);
  return el;
}

function rect(parent, x, y, w, h, fill) {
  const el = ns("rect");
  el.setAttribute("x", String(x));
  el.setAttribute("y", String(y));
  el.setAttribute("width", String(w));
  el.setAttribute("height", String(h));
  el.setAttribute("fill", fill);
  parent.appendChild(el);
  return el;
}

function labelBox(name, x, y, w, h, parts) {
  const el = document.createElement("div");
  el.className = "stage-abs t-label";
  el.dataset.box = name;
  place(el, x, y, w, h);
  el.style.color = "var(--ink)";
  parts.forEach(function (p) {
    const s = document.createElement("span");
    if (p.token) s.style.color = "var(" + p.token + ")";
    s.textContent = p.text;
    el.appendChild(s);
  });
  document.body.appendChild(el);
  setOp(el, 0);
  return el;
}

function eqBox(box, x, y, w, h, tex, schedule) {
  const eq = mountEquation({
    parent: document.body,
    box: box,
    x: x,
    y: y,
    w: w,
    h: h,
    tex: tex,
    schedule: schedule,
  });
  eq.el.dataset.words = "per-text";
  setOp(eq.el, 0);
  return eq;
}

/* Energy axis and the spectrum. */
const energy = host("energy", 170, 160, 1500, 270);
(function (svg) {
  line(svg, 40, 168, 1460, 168, "var(--ink)", 2);
  rect(svg, 120, 152, 1260, 32, "var(--rule)");
  line(svg, 120, 136, 120, 200, "var(--ink)", 2);
  line(svg, 1380, 136, 1380, 200, "var(--ink)", 2);
})(energy.svg);
const bands = ns("g");
energy.svg.appendChild(bands);
rect(bands, 120, 112, 220, 112, "var(--obj-energy)");
rect(bands, 1160, 112, 220, 112, "var(--obj-energy)");
svgText(bands, 230, 78, "localized", "var(--ink)");
svgText(bands, 1270, 78, "localized", "var(--ink)");

const cardOne = ledgerCard({
  parent: document.body,
  box: "card-one",
  status: "proved",
  title: "Localization: d = 1",
  lines: ["Kunz\u2013Souillard 1980"],
  x: 170,
  y: 480,
  w: 780,
  tIn: C.one,
  tOut: C.extended,
});
const cardStrong = ledgerCard({
  parent: document.body,
  box: "card-strong",
  status: "proved",
  title: "Strong disorder, band edges",
  lines: ["Fr\u00f6hlich\u2013Spencer 1983; Aizenman\u2013Molchanov 1993"],
  x: 170,
  y: 670,
  w: 1560,
  tIn: C.strong,
  tOut: C.extended,
});

/* Degree 3, four generations, one element that moves between poses. */
const TREE = { x: 160, y: 140, w: 560, h: 500 };
const POSE_B2 = { tx: -20, ty: -30, s: 1.15 };
const POSE_B3 = { tx: -20, ty: 20, s: 0.8 };
const POSE_B4 = { tx: -20, ty: -20, s: 1 };
const tree = host("tree", TREE.x, TREE.y, TREE.w, TREE.h);
const treeParts = [];
const treeBranches = [];
const treeAnchors = [];
(function () {
  const radii = [88, 64, 44];
  const spreads = [0, 0.48, 0.32];
  const dirs = [-Math.PI / 2, Math.PI / 6, (5 * Math.PI) / 6];
  const cx = 280;
  const cy = 250;
  let seq = 0;
  dirs.forEach(function (dir) {
    const g = ns("g");
    tree.svg.appendChild(g);
    treeBranches.push({ g: g, ang: dir });
    let first = true;
    function walk(x, y, ang, depth) {
      if (depth >= 3) return;
      const count = depth === 0 ? 1 : 2;
      const spread = depth === 0 ? 0 : spreads[depth];
      const r = radii[depth];
      for (let k = 0; k < count; k++) {
        const a = depth === 0 ? dir : ang + (k === 0 ? -spread : spread);
        const nx = x + Math.cos(a) * r;
        const ny = y + Math.sin(a) * r;
        const edge = line(g, x, y, nx, ny, "var(--obj-hopping)", 2);
        const dot = ns("circle");
        dot.setAttribute("cx", nx.toFixed(2));
        dot.setAttribute("cy", ny.toFixed(2));
        dot.setAttribute("r", "5");
        dot.setAttribute("fill", "var(--paper)");
        dot.setAttribute("stroke", "var(--ink)");
        dot.setAttribute("stroke-width", "2");
        g.appendChild(dot);
        const part = { edge: edge, dot: dot, gen: depth, idx: seq++ };
        treeParts.push(part);
        if (first) {
          treeAnchors.push({ x: nx, y: ny });
          first = false;
        }
        walk(nx, ny, a, depth + 1);
      }
    }
    walk(cx, cy, dir, 0);
  });
  const root = ns("circle");
  root.setAttribute("cx", String(cx));
  root.setAttribute("cy", String(cy));
  root.setAttribute("r", "5");
  root.setAttribute("fill", "var(--paper)");
  root.setAttribute("stroke", "var(--ink)");
  root.setAttribute("stroke-width", "2");
  tree.svg.appendChild(root);
  const cross = ns("g");
  line(cross, cx - 8, cy - 8, cx + 8, cy + 8, "var(--ink)", 2);
  line(cross, cx - 8, cy + 8, cx + 8, cy - 8, "var(--ink)", 2);
  tree.svg.appendChild(cross);
  tree.root = root;
  tree.cross = cross;
  tree.cx = cx;
  tree.cy = cy;
})();
treeParts.sort(function (a, b) { return a.gen - b.gen || a.idx - b.idx; });

const links = ns("g");
tree.svg.appendChild(links);
const linkLines = [];
treeAnchors.forEach(function (a, i) {
  linkLines.push(line(links, a.x, a.y, 548, 400 + i * 28, "var(--ink)", 1.5));
});

const cardTree = ledgerCard({
  parent: document.body,
  box: "card-tree",
  status: "proved",
  title: "Extended states on trees",
  lines: ["Klein 1994, 1998"],
  x: 880,
  y: 200,
  w: 860,
  tIn: C.klein,
  tOut: C.the,
});

const col = document.createElement("div");
col.className = "stage-abs";
place(col, 0, 0, 1920, 1080);
document.body.appendChild(col);

function mountIn(parent, box, x, y, w, h, tex, schedule) {
  const eq = mountEquation({
    parent: parent,
    box: box,
    x: x,
    y: y,
    w: w,
    h: h,
    tex: tex,
    schedule: schedule,
  });
  eq.el.dataset.words = "per-text";
  setOp(eq.el, 0);
  return eq;
}

const recAt = function (k) { return C.recursion + REC_IN * k; };
const gEq = mountIn(col, "green-fn", 760, 168, 980, 120,
  "\\htmlClass{term-G}{G(z)}\\htmlClass{term-eq}{=}\\htmlClass{term-lp}{(}\\htmlClass{term-H}{H}\\htmlClass{term-minus}{-}\\htmlClass{term-z}{z}\\htmlClass{term-rp}{)^{-1}}",
  {
    G: C.resolvent,
    eq: C.inverse,
    lp: C.inverse + INVERSE * 0.15,
    H: C.inverse + INVERSE * 0.3,
    minus: C.inverse + INVERSE * 0.45,
    z: C.inverse + INVERSE * 0.6,
    rp: C.inverse + INVERSE * 0.75,
  });
colorTerm(gEq, "G", "--obj-wave");
colorTerm(gEq, "z", "--obj-energy");

const zEq = mountIn(col, "z-def", 760, 300, 980, 120,
  "\\htmlClass{term-z}{z}\\htmlClass{term-eq}{=}\\htmlClass{term-E}{E}\\htmlClass{term-plus}{+}\\htmlClass{term-i}{i}\\htmlClass{term-eta}{\\eta}",
  {
    z: C.energy,
    eq: C.energy,
    E: C.energy,
    plus: C.energy,
    i: C.energy,
    eta: C.eta,
  });
colorTerm(zEq, "z", "--obj-energy");
colorTerm(zEq, "E", "--obj-energy");
colorTerm(zEq, "eta", "--obj-damping");

const dampLab = labelBox("damp-word", 760, 432, 420, 52, [
  { text: "\u03b7", token: "--obj-damping" },
  { text: ": damping" },
]);
col.appendChild(dampLab);

const chipTex = "\\htmlClass{term-g}{G^{(0)}_{jj}}";
const chips = [];
for (let i = 0; i < 3; i++) {
  const chip = mountIn(col, "branch-" + i, 760 + i * 260, 500, 240, 100, chipTex, { g: C.terms });
  colorTerm(chip, "g", "--obj-wave");
  chips.push(chip);
}

const branchLab = labelBox("branch-note", 760, 612, 780, 52, [
  { text: "G\u207d\u2070\u207e: a branch, root removed" },
]);

const recEq = eqBox("recursion", 140, 684, 1620, 150,
  "\\htmlClass{term-G}{G_{00}}\\htmlClass{term-eq}{=}\\htmlClass{term-open}{\\bigl(}\\htmlClass{term-V}{V(0)}\\htmlClass{term-mz}{-z}\\htmlClass{term-ms}{-\\sum_{j\\sim 0}}\\htmlClass{term-Gj}{G^{(0)}_{jj}}\\htmlClass{term-close}{\\bigr)^{-1}}",
  {
    G: recAt(0),
    eq: recAt(0.08),
    open: recAt(0.16),
    V: recAt(0.24),
    mz: recAt(0.36),
    ms: recAt(0.46),
    Gj: recAt(0.56),
    close: recAt(0.56),
  });
colorTerm(recEq, "G", "--obj-wave");
colorTerm(recEq, "Gj", "--obj-wave");
colorTerm(recEq, "V", "--obj-potential");
colorTerm(recEq, "mz", "--obj-energy");

/* Lattice, right half, with three cycles. */
const LAT_SP = 76;
const latGeom = latticeSize({ n: 6, spacing: LAT_SP });
const LAT = { x: 1140, y: 168 };
const lat = lattice({
  parent: document.body,
  box: "lattice",
  x: LAT.x,
  y: LAT.y,
  n: 6,
  spacing: LAT_SP,
  origin: { x: 0, y: 0 },
  seed: 3016,
  marks: {},
  amp: function () { return 0; },
});
const latSvg = lat.el.querySelector("svg");
function siteXY(i, j) {
  return [latGeom.pad + i * LAT_SP, latGeom.pad + j * LAT_SP];
}
const cycles = [];
[[[2, 2], [3, 2], [3, 1], [2, 1]],
 [[2, 2], [3, 2], [3, 3], [2, 3]],
 [[2, 2], [1, 2], [1, 3], [2, 3]]].forEach(function (pts) {
  let d = "";
  pts.forEach(function (ij, k) {
    const xy = siteXY(ij[0], ij[1]);
    d += (k === 0 ? "M" : "L") + xy[0].toFixed(2) + " " + xy[1].toFixed(2);
  });
  d += "Z";
  const p = ns("path");
  p.setAttribute("d", d);
  p.setAttribute("fill", "none");
  p.setAttribute("stroke", "var(--obj-wave)");
  p.setAttribute("stroke-width", "4");
  p.setAttribute("stroke-linejoin", "round");
  p.setAttribute("stroke-linecap", "round");
  latSvg.appendChild(p);
  cycles.push(p);
});
const centre = siteXY(2, 2);
const siteCross = ns("g");
line(siteCross, centre[0] - 8, centre[1] - 8, centre[0] + 8, centre[1] + 8, "var(--ink)", 2);
line(siteCross, centre[0] - 8, centre[1] + 8, centre[0] + 8, centre[1] - 8, "var(--ink)", 2);
latSvg.appendChild(siteCross);
const loopsLab = labelBox("loops", LAT.x, 700, latGeom.w, 52, [
  { text: "loops", token: "--obj-wave" },
]);
loopsLab.style.textAlign = "center";

const badge = heuristicBadge({ parent: document.body, x: 1280, y: 90 });
setOp(badge.el, 0);

/* Time axis, gaussian, then the damping axis under it. */
const gauss = host("wave", 170, 260, 1240, 140);
const gaussPath = ns("path");
gaussPath.setAttribute("fill", "var(--obj-wave)");
gauss.svg.appendChild(gaussPath);
const marker = line(gauss.svg, 80, 8, 80, 132, "var(--ink)", 2);

const timeAxis = host("time-axis", 150, 412, 1620, 28);
const timeSolid = line(timeAxis.svg, 10, 14, 750, 14, "var(--ink)", 2);
const timeDash = line(timeAxis.svg, 750, 14, 1090, 14, "var(--ink-muted)", 2, { "stroke-dasharray": "10 8" });
const timeTick = line(timeAxis.svg, 750, 2, 750, 26, "var(--ink)", 2);

const etaAxis = host("eta-axis", 150, 628, 1620, 28);
const etaSolid = line(etaAxis.svg, 10, 14, 750, 14, "var(--obj-damping)", 2);
const etaDash = line(etaAxis.svg, 750, 14, 1090, 14, "var(--obj-damping)", 2, { "stroke-dasharray": "10 8" });
const etaTick = line(etaAxis.svg, 750, 2, 750, 26, "var(--obj-damping)", 2);

const connector = host("connector", 894, 440, 12, 180);
line(connector.svg, 6, 0, 6, 180, "var(--ink)", 1.5);

const timeWord = labelBox("time-word", 160, 452, 160, 48, [{ text: "time" }]);
const kappaLab = labelBox("kappa-note", 340, 452, 480, 48, [{ text: "\u03ba > 0 small" }]);
const heatLab = labelBox("heat-note", 1100, 168, 520, 52, [{ text: "spreads like heat" }]);
const overLab = labelBox("over-note", 160, 560, 560, 52, [{ text: "damping \u2248 1 / time" }]);
const dampName = labelBox("damp-axis", 160, 668, 480, 52, [
  { text: "damping " },
  { text: "\u03b7", token: "--obj-damping" },
]);
const infLab = labelBox("infinity", 1660, 348, 90, 48, [{ text: "\u221e" }]);
const neededLab = labelBox("needed", 160, 804, 540, 52, [{ text: "needed for spectral type" }]);
const etaZero = labelBox("eta-zero", 1280, 804, 300, 52, [
  { text: "\u03b7", token: "--obj-damping" },
  { text: " \u2192 0" },
]);

const timeEq = eqBox("time-mark", 940, 448, 820, 120,
  "\\htmlClass{term-m}{\\text{time}\\approx\\lambda^{-2-\\kappa}}",
  { m: C.lambda6 });
const etaEq = eqBox("eta-mark", 940, 664, 700, 108,
  "\\htmlClass{term-e}{\\eta}\\htmlClass{term-r}{\\approx\\lambda^{2+\\kappa}}",
  { e: C.lambda7, r: C.lambda7 });
colorTerm(etaEq, "e", "--obj-damping");

const obstacle = host("obstacle", 740, 792, 500, 72);
obstacle.el.style.transformOrigin = "0 0";
const br = ns("path");
br.setAttribute("d", "M8,64 L8,16 L492,16 L492,64");
br.setAttribute("fill", "none");
br.setAttribute("stroke", "var(--ink)");
br.setAttribute("stroke-width", "2");
obstacle.svg.appendChild(br);
svgText(obstacle.svg, 250, 44, "the obstacle", "var(--ink)");

const cardDiff = ledgerCard({
  parent: document.body,
  box: "card-diffusion",
  status: "proved",
  title: "Diffusion to long finite times",
  lines: ["Erd\u0151s, Salmhofer, Yau 2007, 2008"],
  x: 160,
  y: 96,
  w: 900,
  tIn: C.erdos,
  tOut: C.following,
});

function gaussD(cx, sigma, amp, base) {
  const x0 = Math.max(8, cx - 3.1 * sigma);
  const x1 = Math.min(1232, cx + 3.1 * sigma);
  const n = 36;
  let d = "M" + x0.toFixed(2) + " " + base.toFixed(2);
  for (let i = 0; i <= n; i++) {
    const x = x0 + (x1 - x0) * (i / n);
    const z = (x - cx) / sigma;
    const y = base - amp * Math.exp(-0.5 * z * z);
    d += " L" + x.toFixed(2) + " " + y.toFixed(2);
  }
  d += " L" + x1.toFixed(2) + " " + base.toFixed(2) + " Z";
  return d;
}

mark(INTRO, "c3b1", "chapter title settles");
mark(C.every + INTRO, "c3b1", "energy axis");
mark(C.one, "c3b1", "ledger one dimension");
mark(C.strong, "c3b1", "localized bands");
mark(C.extended, "c3b2", "spectrum leaves");
mark(C.trees, "c3b2", "tree");
mark(C.klein, "c3b2", "ledger trees");
mark(C.the, "c3b3", "tree steps back");
mark(C.resolvent, "c3b3", "resolvent symbol");
mark(C.inverse, "c3b3", "inverse");
mark(C.energy, "c3b3", "energy term");
mark(C.eta, "c3b3", "damping symbol");
mark(C.damping3, "c3b3", "damping label");
mark(C.on4, "c3b4", "tree returns");
mark(C.removing, "c3b4", "root removed");
mark(C.recursion, "c3b4", "recursion");
mark(C.terms, "c3b4", "branch terms");
mark(C.on5, "c3b5", "recursion leaves");
mark(C.lattice, "c3b5", "lattice");
mark(C.loops, "c3b5", "loops");
mark(C.perturbation, "c3b6", "time axis");
mark(C.follows, "c3b6", "wave");
mark(C.lambda6, "c3b6", "time tick");
mark(C.kappa, "c3b6", "kappa label");
mark(C.heat, "c3b6", "heat label");
mark(C.erdos, "c3b6", "ledger diffusion");
mark(C.damping7, "c3b7", "damping axis");
mark(C.over, "c3b7", "one over time");
mark(C.lambda7, "c3b7", "damping tick");
mark(C.all, "c3b8", "infinity");
mark(C.zero, "c3b8", "damping to zero");
mark(C.obstacle, "c3b8", "obstacle");
mark(beatEnd("c3b8"), "c3b8", "picture fades out");

window.sceneEvents = events;
window.sceneDuration = window.__BEATS__.duration;

window.setTime = function (t) {
  // The picture fades out for OUT after the last word (the narration gives that time, need() above).
  const tail = 1 - fade(t, beatEnd("c3b8"), OUT);
  const alive = fade(t, INTRO, AXIS_IN);
  const leave1 = fade(t, C.extended, LEAVE1);
  const uBack = fade(t, C.the, BACK);
  const uReturn = fade(t, C.on4, RETURN);
  const pose = mixPose(mixPose(POSE_B2, POSE_B3, uBack), POSE_B4, uReturn);
  const shift = lerp(-140, 0, uReturn);
  const clear = fade(t, C.on5, CLEAR);
  const swap = fade(t, C.perturbation, SWAP);
  const spreadU = fade(t, C.follows, Math.max(SPREAD, C.kappa - C.follows));
  const reach = fade(t, C.all, ALL_IN);
  const zeroU = fade(t, C.zero, ZERO_IN);
  const cutU = t >= C.removing ? fade(t, C.removing, CUT) : 0;

  const energyOn = alive * (1 - leave1) * tail;
  const treeOn = (t >= C.trees ? 1 : 0) * (1 - swap) * tail;
  const defOn = (t >= C.resolvent ? 1 : 0) * (1 - clear) * tail;
  const latOn = fade(t, C.lattice, LAT_IN) * (1 - swap) * tail;
  const axisOn = swap * tail;
  const etaOn = fade(t, C.damping7, AXIS2) * axisOn;

  setOp(energy.el, energyOn);
  setAttr(bands, energyOn > 0 ? fade(t, C.strong, BANDS) : 0);
  setOp(tree.el, treeOn);
  poseOf(tree.el, pose);
  col.style.transform = "translate(" + shift.toFixed(2) + "px,0)";

  const drawn = t >= C.trees ? fade(t, C.trees, TREE_DRAW) : 0;
  const nSteps = treeParts.length + 1;
  setAttr(tree.root, hardStep(drawn, 0, nSteps) * (1 - cutU));
  setAttr(tree.cross, drawn >= 1 ? cutU : 0);
  treeParts.forEach(function (part, i) {
    const v = hardStep(drawn, i + 1, nSteps);
    setAttr(part.edge, v);
    setAttr(part.dot, v);
  });
  treeBranches.forEach(function (brn) {
    const dx = Math.cos(brn.ang) * 28 * cutU;
    const dy = Math.sin(brn.ang) * 28 * cutU;
    brn.g.setAttribute("transform", "translate(" + dx.toFixed(2) + " " + dy.toFixed(2) + ")");
  });
  const linkOn = fade(t, C.terms, TERMS) * defOn;
  setAttr(links, linkOn > 0 ? fade(t, C.terms, TERMS) : 0);

  setOp(gEq.el, defOn);
  setOp(zEq.el, (t >= C.energy ? 1 : 0) * (1 - clear) * tail);
  setOp(dampLab, (t >= C.damping3 ? fade(t, C.damping3, DAMP_LAB) : 0) * (1 - clear) * tail);
  chips.forEach(function (chip) {
    setOp(chip.el, (t >= C.terms ? 1 : 0) * (1 - clear) * tail);
  });
  setOp(branchLab, fade(t, C.terms, TERMS) * (1 - clear) * tail);
  setOp(recEq.el, (t >= C.recursion ? 1 : 0) * (1 - clear) * tail);

  setOp(lat.el, latOn);
  cycles.forEach(function (p, i) {
    const slot = LOOPS_IN / 3;
    setAttr(p, latOn > 0 ? fade(t, C.loops + i * slot, slot) : 0);
  });
  setAttr(siteCross, latOn > 0 ? 1 : 0);
  setOp(loopsLab, fade(t, C.loops, LOOPS_IN) * (latOn > 0 ? 1 : 0));

  let badgeV = 0;
  if (t >= beatStart("c3b7")) badgeV = 1;
  else if (t >= C.on4 && t < C.perturbation) badgeV = fade(t, C.on4, BADGE_IN);
  else if (t >= C.perturbation) badgeV = 1 - swap;
  setOp(badge.el, badgeV * tail);

  setOp(gauss.el, fade(t, C.follows, SPREAD) * axisOn);
  const gx = lerp(90, 730, spreadU);
  const sigma = lerp(26, 108, spreadU);
  const amp = lerp(118, 72, spreadU);
  gaussPath.setAttribute("d", gaussD(gx, Math.max(8, sigma), amp, 128));
  marker.setAttribute("x1", gx.toFixed(2));
  marker.setAttribute("x2", gx.toFixed(2));

  setOp(timeAxis.el, axisOn);
  setOp(timeWord, axisOn);
  const dashEnd = lerp(1090, 1570, reach);
  timeDash.setAttribute("x2", dashEnd.toFixed(2));
  setOp(timeEq.el, fade(t, C.lambda6, TICK_IN) * axisOn);
  setOp(kappaLab, fade(t, C.kappa, KAPPA_IN) * axisOn);
  setOp(heatLab, fade(t, C.heat, HEAT_IN) * axisOn);
  setOp(infLab, fade(t, C.all, ALL_IN) * axisOn);

  setOp(etaAxis.el, etaOn);
  setOp(dampName, etaOn);
  const etaEnd = lerp(1090, 1570, zeroU);
  etaDash.setAttribute("x2", etaEnd.toFixed(2));
  setOp(connector.el, fade(t, C.lambda7, LINK_IN) * etaOn);
  setOp(etaEq.el, fade(t, C.lambda7, LINK_IN) * etaOn);
  setOp(overLab, fade(t, C.over, OVER_IN) * etaOn);
  setOp(etaZero, fade(t, C.zero, ZERO_IN) * etaOn);
  setOp(neededLab, fade(t, C.zero, ZERO_IN) * etaOn);

  const ob = fade(t, C.obstacle, OB_IN);
  setOp(obstacle.el, (t >= C.obstacle ? 1 : 0) * etaOn);
  obstacle.el.style.transform = "scale(" + (ob <= 0 ? 0 : ob).toFixed(4) + ",1)";

  cardOne.setTime(t);
  cardStrong.setTime(t);
  cardTree.setTime(t);
  cardDiff.setTime(t);
  [cardOne, cardStrong, cardTree, cardDiff].forEach(function (card) {
    const base = parseFloat(card.el.style.opacity) || 0;
    setOp(card.el, base * tail);
  });

  label.setTime(t);
  if (t >= INTRO) setOp(label.el, tail);
  strip.setTime(t);
  subs.setTime(t);
  lat.setTime(t);
  gEq.setTime(t);
  zEq.setTime(t);
  recEq.setTime(t);
  chips.forEach(function (chip) { chip.setTime(t); });
  timeEq.setTime(t);
  etaEq.setTime(t);

  void CARD_ONE;
  void CARD_STRONG;
  void CARD_KLEIN;
  void LEAVE2;
  void LEAVE3;
  void RESOLVENT;
  void ENERGY_Z;
  void ETA_IN;
  void CARD_DIFF;
};

window.setTime(0);
