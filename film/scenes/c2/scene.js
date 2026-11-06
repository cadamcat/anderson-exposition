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

function showAt(el, v) {
  setOp(el, v);
  el.style.display = v < 0.02 ? "none" : "block";
}

function place(el, x, y, w) {
  el.style.left = Math.round(x) + "px";
  el.style.top = Math.round(y) + "px";
  el.style.width = Math.round(w) + "px";
}

function scaleY(el, y, s) {
  const yy = y.toFixed(2);
  const sy = s <= 0 ? 0 : s;
  el.setAttribute(
    "transform",
    "translate(0 " + yy + ") scale(1 " + sy.toFixed(4) + ") translate(0 " + (-y).toFixed(2) + ")"
  );
}

function setLine(el, x1, y1, x2, y2) {
  el.setAttribute("x1", x1.toFixed(2));
  el.setAttribute("y1", y1.toFixed(2));
  el.setAttribute("x2", x2.toFixed(2));
  el.setAttribute("y2", y2.toFixed(2));
}

function setRect(el, x, y, w, h) {
  el.setAttribute("x", x.toFixed(2));
  el.setAttribute("y", y.toFixed(2));
  el.setAttribute("width", Math.max(0, w).toFixed(2));
  el.setAttribute("height", Math.max(0, h).toFixed(2));
}

const C = {
  lattice: cue("c2b1", "lattice"),
  wave: cue("c2b1", "wave"),
  operator: cue("c2b2", "operator"),
  site: cue("c2b2", "site"),
  adds: cue("c2b2", "adds"),
  neighbours: cue("c2b2", "neighbours"),
  then: cue("c2b3", "Then"),
  energies: cue("c2b4", "energies"),
  uniform: cue("c2b4", "uniform"),
  width: cue("c2b4", "width"),
  disorder: cue("c2b4", "disorder"),
  lambda: cue("c2b4", "lambda"),
  every: cue("c2b5", "Every"),
  spectral: cue("c2b5", "spectral"),
  point: cue("c2b6", "Point"),
  smooth: cue("c2b6", "density"),
  barry: cue("c2b7", "Barry"),
  eigenvalues: cue("c2b8", "eigenvalues"),
  range: cue("c2b8", "range"),
  spectrum: cue("c2b8", "spectrum"),
  weight: cue("c2b8", "weight"),
};

const INTRO = need("c2b1", "lead", 1.6, "chapter title settles");
const LATTICE_IN = need("c2b1", "lattice", 0.6, "lattice appears");
const WAVE_IN = need("c2b1", "wave", 0.8, "wave discs grow");
const OP = need("c2b2", "operator", 0.4, "operator term appears");
const SITE_IN = need("c2b2", "site", 0.5, "site n ring");
const SUM = need("c2b2", "adds", 0.4, "neighbour sum appears");
const NEIGH_IN = need("c2b2", "neighbours", 0.5, "neighbours and arrows");
const POT = need("c2b3", "Then", 0.4, "potential term appears");
const PULSE = need("c2b3", "Then", 0.6, "site bar pulses");
const SLIDE = need("c2b4", "energies", 0.9, "site bar slides onto the line");
const DENS = need("c2b4", "uniform", 0.8, "density box rises");
const WIDTH_IN = need("c2b4", "width", 0.5, "width bracket");
const DIS_IN = need("c2b4", "disorder", 0.4, "disorder label");
const LAM_IN = need("c2b4", "lambda", 0.5, "half width lambda");
const SHIFT = need("c2b5", "Every", 0.8, "lattice leaves and axis widens");
const MEASURE = need("c2b5", "spectral", 0.8, "spectral measure grows");
const POINT_IN = need("c2b6", "Point", 0.5, "eigenvalue spikes highlight");
const SMOOTH_IN = need("c2b6", "density", 0.5, "continuous density highlights");
const CARD_IN = need("c2b7", "Barry", 0.4, "problem card slides in");
const SPIKE_OUT = need("c2b8", "eigenvalues", 0.6, "spikes inside the range fade");
const RANGE_IN = need("c2b8", "range", 0.6, "interval bracket settles");
const SPEC_IN = need("c2b8", "spectrum", 0.5, "interval outline thickens");
const WEIGHT_IN = need("c2b8", "weight", 0.4, "nonzero weight fills");
const OUT = need("c2b8", "tail", 0.8, "picture fades out");

const label = chapterLabel({
  n: 2,
  title: "The question",
  intro: INTRO,
});
const strip = mountStrip(document.body);
const subs = mountSubtitles(document.body, window.__BEATS__);

const N = 7;
const SPACING = 86;
const SITE = 3;
const geom = latticeSize({ n: N, spacing: SPACING });
const left = span(0, 6);
const latX = Math.round(left.x + (left.w - geom.w) / 2);
const latY = 204;
const siteLocal = geom.pad + SITE * SPACING;

const waveAmp = [];
const waveRng = mulberry32(1036);
for (let j = 0; j < N; j++) {
  const row = [];
  for (let i = 0; i < N; i++) row.push(0.42 + 0.58 * waveRng());
  waveAmp.push(row);
}

const lat = lattice({
  parent: document.body,
  x: latX,
  y: latY,
  n: N,
  spacing: SPACING,
  origin: { x: 0, y: 0 },
  seed: 1036,
  amp: function (x, y, t) {
    if (y < 0 || y >= N || x < 0 || x >= N) return 0;
    return fade(t, C.wave, WAVE_IN) * waveAmp[y][x];
  },
});

const vN = lat.values[SITE * N + SITE];
const barH = 4 + vN * geom.bar;
const barX0 = latX + siteLocal - 2;
const barY0 = latY + siteLocal - barH;

const zdW = 280;
const zd = mountEquation({
  parent: document.body,
  x: Math.round(latX + (geom.w - zdW) / 2),
  y: 100,
  w: zdW,
  h: 88,
  box: "zd",
  tex: "\\mathbb{Z}^{d}",
});
zd.el.dataset.words = "per-text";

const TEX = "\\begin{aligned}"
  + "\\htmlClass{term-lp}{(}\\htmlClass{term-H}{H}\\htmlClass{term-u}{u}\\htmlClass{term-rp}{)(n)}"
  + "&\\htmlClass{term-eq}{=}\\htmlClass{term-sum}{\\sum_{|j|=1}}\\htmlClass{term-uj}{u(n+j)}\\\\"
  + "&\\htmlClass{term-plus}{+}\\htmlClass{term-V}{V(n)}\\htmlClass{term-un}{\\,u(n)}"
  + "\\end{aligned}";

const EQ = { x: 972, y: 96, w: 828, h: 250 };
const eq = mountEquation({
  parent: document.body,
  x: EQ.x,
  y: EQ.y,
  w: EQ.w,
  h: EQ.h,
  tex: TEX,
  schedule: {
    lp: C.operator,
    H: C.operator,
    u: C.operator,
    rp: C.operator,
    eq: C.operator,
    sum: C.adds,
    uj: C.adds,
    plus: C.then,
    V: C.then,
    un: C.then,
  },
});
colorTerm(eq, "H", "--obj-hopping");
colorTerm(eq, "u", "--obj-wave");
colorTerm(eq, "sum", "--obj-hopping");
colorTerm(eq, "uj", "--obj-wave");
colorTerm(eq, "V", "--obj-potential");
colorTerm(eq, "un", "--obj-wave");
eq.el.dataset.words = "per-text";
eq.el.style.transformOrigin = "0 0";

const BOX0 = { x: 972, y: 430, w: 828, h: 430, axis: 230, a: 200, b: 630, pad: 32 };
const BOX1 = { x: 120, y: 424, w: 1680, h: 440, axis: 348, pad: 44 };
const IV0 = 1000;
const IV1 = 1240;
const HUMP = { cx: 1120, half: 300, h: 156 };

const landX = BOX0.x + lerp(BOX0.a, BOX0.b, vN) - 2;
const landY = BOX0.y + BOX0.axis - barH;

const axis = (function mountAxis() {
  const el = document.createElement("div");
  el.className = "stage-abs";
  el.dataset.box = "measure";
  el.dataset.words = "per-text";
  const svg = ns("svg");
  svg.style.display = "block";
  el.appendChild(svg);
  document.body.appendChild(el);
  return { el: el, svg: svg };
})();

function putLabel(text) {
  const el = document.createElement("div");
  el.className = "t-label";
  el.style.position = "absolute";
  el.style.textAlign = "center";
  el.textContent = text;
  axis.el.appendChild(el);
  return el;
}

function mountMath(tex) {
  const el = document.createElement("div");
  el.className = "t-label";
  el.style.position = "absolute";
  el.style.textAlign = "center";
  const sym = document.createElement("span");
  sym.className = "lean-sym";
  el.appendChild(sym);
  axis.el.appendChild(el);
  katex.render(tex, sym, {
    throwOnError: false,
    trust: true,
    strict: false,
    displayMode: false,
    output: "html",
  });
  return el;
}

const labA = putLabel("a");
const labB = putLabel("b");
const labWidth = putLabel("b \u2212 a");
const labDisorder = putLabel("disorder");
const labLambda = mountMath("\\lambda");
const labHalf = mountMath("\\lambda = (b-a)/2");
const labEnergy = putLabel("energy");
const labEigen = putLabel("eigenvalues: localized states");
const labSmooth = putLabel("absolutely continuous: spreading states");
const labInside = putLabel("inside the spectrum");
const labWeight = putLabel("nonzero weight");

place(labEigen, 36, 14, 700);
place(labSmooth, 860, 14, 780);
place(labInside, 900, 70, 560);
place(labWeight, 900, 116, 420);

const inkLine = ns("line");
inkLine.setAttribute("stroke", "var(--ink)");
inkLine.setAttribute("stroke-width", "2");
const energyLine = ns("line");
energyLine.setAttribute("stroke", "var(--obj-energy)");
energyLine.setAttribute("stroke-width", "3");
energyLine.setAttribute("shape-rendering", "crispEdges");
axis.svg.appendChild(inkLine);
axis.svg.appendChild(energyLine);

const gTicks = ns("g");
const gDensity = ns("g");
const gWidth = ns("g");
const gHalf = ns("g");
const gMarker = ns("g");
axis.svg.appendChild(gTicks);
axis.svg.appendChild(gDensity);
axis.svg.appendChild(gWidth);
axis.svg.appendChild(gHalf);
axis.svg.appendChild(gMarker);

const density = ns("rect");
density.setAttribute("fill", "var(--obj-potential)");
gDensity.appendChild(density);
const tickA = ns("line");
const tickB = ns("line");
[tickA, tickB].forEach(function (tick) {
  tick.setAttribute("stroke", "var(--ink)");
  tick.setAttribute("stroke-width", "2");
  gTicks.appendChild(tick);
});
const widthPath = ns("path");
widthPath.setAttribute("fill", "none");
widthPath.setAttribute("stroke", "var(--ink)");
widthPath.setAttribute("stroke-width", "2");
gWidth.appendChild(widthPath);
const halfPath = ns("path");
halfPath.setAttribute("fill", "none");
halfPath.setAttribute("stroke", "var(--ink)");
halfPath.setAttribute("stroke-width", "2");
gHalf.appendChild(halfPath);

const marker = ns("rect");
marker.setAttribute("fill", "var(--obj-potential)");
marker.setAttribute("width", "4");
gMarker.appendChild(marker);

function humpOpen(cx, ay, half, h) {
  const x0 = cx - half;
  const x1 = cx + half;
  const y1 = ay - h;
  const c = half * 0.55;
  return "M" + x0 + " " + ay
    + " C" + (x0 + c) + " " + ay + " " + (cx - c) + " " + y1 + " " + cx + " " + y1
    + " C" + (cx + c) + " " + y1 + " " + (x1 - c) + " " + ay + " " + x1 + " " + ay;
}

function humpClosed(cx, ay, half, h) {
  return humpOpen(cx, ay, half, h) + " Z";
}

function spikeD(x, ay, h, half) {
  return "M" + (x - half) + " " + ay + " L" + x + " " + (ay - h) + " L" + (x + half) + " " + ay + " Z";
}

const defs = ns("defs");
const clip = ns("clipPath");
clip.setAttribute("id", "bandClip");
clip.setAttribute("clipPathUnits", "userSpaceOnUse");
const clipRect = ns("rect");
clipRect.setAttribute("x", String(IV0));
clipRect.setAttribute("y", "0");
clipRect.setAttribute("width", String(IV1 - IV0));
clipRect.setAttribute("height", "600");
clip.appendChild(clipRect);
defs.appendChild(clip);
axis.svg.appendChild(defs);

const gOutside = ns("g");
const gInside = ns("g");
const gHump = ns("g");
const gFill = ns("g");
gFill.setAttribute("clip-path", "url(#bandClip)");
axis.svg.appendChild(gOutside);
axis.svg.appendChild(gInside);
axis.svg.appendChild(gHump);
axis.svg.appendChild(gFill);

function addPath(parent, d, fill) {
  const path = ns("path");
  path.setAttribute("d", d);
  path.setAttribute("fill", fill);
  parent.appendChild(path);
  return path;
}

const ay = BOX1.axis;
const outsideSpike = addPath(gOutside, spikeD(340, ay, 210, 8), "var(--obj-wave)");
const insideSpikes = [
  addPath(gInside, spikeD(1060, ay, 140, 8), "var(--obj-wave)"),
  addPath(gInside, spikeD(1170, ay, 186, 8), "var(--obj-wave)"),
];
[outsideSpike].concat(insideSpikes).forEach(function (path) {
  path.setAttribute("stroke", "var(--ink)");
  path.setAttribute("stroke-width", "0");
});
const humpStroke = ns("path");
humpStroke.setAttribute("d", humpOpen(HUMP.cx, ay, HUMP.half, HUMP.h));
humpStroke.setAttribute("fill", "none");
humpStroke.setAttribute("stroke", "var(--obj-wave)");
humpStroke.setAttribute("stroke-width", "3");
humpStroke.setAttribute("stroke-linecap", "round");
humpStroke.setAttribute("vector-effect", "non-scaling-stroke");
gHump.appendChild(humpStroke);
const humpFill = addPath(gFill, humpClosed(HUMP.cx, ay, HUMP.half, HUMP.h), "var(--obj-wave)");
humpFill.setAttribute("stroke", "none");

const gBracket = ns("g");
axis.svg.appendChild(gBracket);
const bracket = ns("rect");
bracket.setAttribute("x", String(IV0));
bracket.setAttribute("y", "176");
bracket.setAttribute("width", String(IV1 - IV0));
bracket.setAttribute("height", String(ay - 176));
bracket.setAttribute("fill", "none");
bracket.setAttribute("stroke", "var(--obj-energy)");
bracket.setAttribute("stroke-width", "3");
bracket.setAttribute("shape-rendering", "crispEdges");
gBracket.appendChild(bracket);

const latSvg = lat.el.querySelector("svg");
const nBar = latSvg.querySelectorAll("rect")[SITE * N + SITE];

const latDefs = ns("defs");
const markerDef = ns("marker");
markerDef.setAttribute("id", "hopMark");
markerDef.setAttribute("markerUnits", "userSpaceOnUse");
markerDef.setAttribute("markerWidth", "12");
markerDef.setAttribute("markerHeight", "12");
markerDef.setAttribute("refX", "11");
markerDef.setAttribute("refY", "6");
markerDef.setAttribute("orient", "auto");
const markerShape = ns("path");
markerShape.setAttribute("d", "M0,0 L12,6 L0,12 Z");
markerShape.setAttribute("fill", "var(--obj-hopping)");
markerDef.appendChild(markerShape);
latDefs.appendChild(markerDef);
latSvg.insertBefore(latDefs, latSvg.firstChild);

const gSite = ns("g");
const gNeigh = ns("g");
const gArrows = ns("g");
const inkRing = ns("circle");
inkRing.setAttribute("cx", String(siteLocal));
inkRing.setAttribute("cy", String(siteLocal));
inkRing.setAttribute("r", "24");
inkRing.setAttribute("fill", "none");
inkRing.setAttribute("stroke", "var(--ink)");
inkRing.setAttribute("stroke-width", "3");
inkRing.setAttribute("shape-rendering", "crispEdges");
gSite.appendChild(inkRing);

[[SITE, SITE - 1], [SITE - 1, SITE], [SITE + 1, SITE], [SITE, SITE + 1]].forEach(function (pair) {
  const qx = geom.pad + pair[0] * SPACING;
  const qy = geom.pad + pair[1] * SPACING;
  const ring = ns("circle");
  ring.setAttribute("cx", String(qx));
  ring.setAttribute("cy", String(qy));
  ring.setAttribute("r", "24");
  ring.setAttribute("fill", "none");
  ring.setAttribute("stroke", "var(--obj-hopping)");
  ring.setAttribute("stroke-width", "3");
  ring.setAttribute("shape-rendering", "crispEdges");
  gNeigh.appendChild(ring);
  const dx = siteLocal - qx;
  const dy = siteLocal - qy;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const line = ns("line");
  line.setAttribute("x1", (qx + ux * 30).toFixed(2));
  line.setAttribute("y1", (qy + uy * 30).toFixed(2));
  line.setAttribute("x2", (siteLocal - ux * 32).toFixed(2));
  line.setAttribute("y2", (siteLocal - uy * 32).toFixed(2));
  line.setAttribute("stroke", "var(--obj-hopping)");
  line.setAttribute("stroke-width", "3");
  line.setAttribute("shape-rendering", "crispEdges");
  line.setAttribute("marker-end", "url(#hopMark)");
  gArrows.appendChild(line);
});
latSvg.appendChild(gNeigh);
latSvg.appendChild(gSite);
latSvg.appendChild(gArrows);

const card = ledgerCard({
  parent: document.body,
  status: "context",
  title: "Problem 1 (Simon, 2000)",
  lines: [
    "d \u2265 3, suitable disorder b \u2212 a",
    "purely absolutely continuous spectrum in some energy range",
  ],
  x: 500,
  y: 208,
  w: 1240,
  tIn: C.barry,
});
card.el.dataset.words = "per-text";
(function paintCardLine() {
  const line = card.el.querySelector(".ledger-line");
  line.textContent = "";
  const sym = document.createElement("span");
  sym.className = "lean-sym";
  line.appendChild(sym);
  katex.render("d \\ge 3,", sym, {
    throwOnError: false,
    trust: true,
    strict: false,
    displayMode: false,
    output: "html",
  });
  line.appendChild(document.createTextNode(" suitable disorder b \u2212 a"));
})();

const fly = ns("svg");
fly.setAttribute("width", "1920");
fly.setAttribute("height", "1080");
fly.style.position = "absolute";
fly.style.left = "0";
fly.style.top = "0";
const flyRect = ns("rect");
flyRect.setAttribute("fill", "var(--obj-potential)");
flyRect.setAttribute("width", "4");
flyRect.setAttribute("height", String(barH));
fly.appendChild(flyRect);
document.body.appendChild(fly);

mark(C.lattice, "c2b1", "lattice and label");
mark(C.wave, "c2b1", "wave discs");
mark(C.operator, "c2b2", "operator term");
mark(C.site, "c2b2", "site n ring");
mark(C.adds, "c2b2", "neighbour sum");
mark(C.neighbours, "c2b2", "neighbours and arrows");
mark(C.then, "c2b3", "potential term");
mark(C.then, "c2b3", "site bar pulses");
mark(C.energies, "c2b4", "bar slides onto the line");
mark(C.uniform, "c2b4", "density box");
mark(C.width, "c2b4", "width bracket");
mark(C.disorder, "c2b4", "disorder label");
mark(C.lambda, "c2b4", "half width lambda");
mark(C.every, "c2b5", "lattice leaves and axis widens");
mark(C.spectral, "c2b5", "spectral measure");
mark(C.point, "c2b6", "eigenvalue label");
mark(C.smooth, "c2b6", "continuous label");
mark(C.barry, "c2b7", "problem card");
mark(C.eigenvalues, "c2b8", "spikes inside the range fade");
mark(C.range, "c2b8", "interval bracket");
mark(C.spectrum, "c2b8", "interval outline");
mark(C.weight, "c2b8", "nonzero weight");
mark(beatEnd("c2b8"), "c2b8", "picture fades out");

window.sceneEvents = events;
window.sceneDuration = window.__BEATS__.duration;

function mixBox(k) {
  return {
    x: lerp(BOX0.x, BOX1.x, k),
    y: lerp(BOX0.y, BOX1.y, k),
    w: lerp(BOX0.w, BOX1.w, k),
    h: lerp(BOX0.h, BOX1.h, k),
    axis: lerp(BOX0.axis, BOX1.axis, k),
    pad: lerp(BOX0.pad, BOX1.pad, k),
  };
}

function applyBox(L) {
  axis.el.style.left = L.x.toFixed(1) + "px";
  axis.el.style.top = L.y.toFixed(1) + "px";
  axis.el.style.width = L.w.toFixed(1) + "px";
  axis.el.style.height = L.h.toFixed(1) + "px";
  axis.svg.setAttribute("width", L.w.toFixed(1));
  axis.svg.setAttribute("height", L.h.toFixed(1));
  axis.svg.setAttribute("viewBox", "0 0 " + L.w.toFixed(1) + " " + L.h.toFixed(1));
}

function feetUp(x0, x1, y) {
  return "M" + x0.toFixed(1) + " " + y.toFixed(1)
    + " L" + x0.toFixed(1) + " " + (y + 16).toFixed(1)
    + " L" + x1.toFixed(1) + " " + (y + 16).toFixed(1)
    + " L" + x1.toFixed(1) + " " + y.toFixed(1);
}

function feetDown(x0, x1, y) {
  return "M" + x0.toFixed(1) + " " + (y + 16).toFixed(1)
    + " L" + x0.toFixed(1) + " " + y.toFixed(1)
    + " L" + x1.toFixed(1) + " " + y.toFixed(1)
    + " L" + x1.toFixed(1) + " " + (y + 16).toFixed(1);
}

window.setTime = function (t) {
  const k = fade(t, C.every, SHIFT);
  const kLat = clamp(k / 0.42, 0, 1);
  const kMove = clamp((k - 0.38) / 0.62, 0, 1);
  const tail = 1 - fade(t, beatEnd("c2b8"), OUT);
  const deco = 1 - clamp(k / 0.28, 0, 1);
  const L = mixBox(kMove);
  const slideU = fade(t, C.energies, SLIDE);
  const axisIn = slideU;

  applyBox(L);
  setOp(axis.el, axisIn * tail);

  const xL = L.pad;
  const xR = L.w - L.pad;
  setLine(inkLine, xL, L.axis, xR, L.axis);
  setLine(energyLine, xL, L.axis, xR, L.axis);
  setOp(inkLine, 1 - kMove);
  setOp(energyLine, kMove);

  const aX = BOX0.a;
  const bX = BOX0.b;
  const mid = (aX + bX) / 2;
  const densU = fade(t, C.uniform, DENS);
  const densH = 88;
  setRect(density, aX, L.axis - densH, bX - aX, densH);
  scaleY(density, L.axis, densU);
  setOp(gDensity, deco);

  setLine(tickA, aX, L.axis - 12, aX, L.axis + 12);
  setLine(tickB, bX, L.axis - 12, bX, L.axis + 12);
  setOp(gTicks, densU * deco);

  widthPath.setAttribute("d", feetUp(aX, bX, L.axis + 48));
  setOp(gWidth, fade(t, C.width, WIDTH_IN) * deco);
  halfPath.setAttribute("d", feetDown(mid, bX, L.axis - 124));
  setOp(gHalf, fade(t, C.lambda, LAM_IN) * deco);

  const markerX = lerp(aX, bX, vN) - 2;
  setRect(marker, markerX, L.axis - barH, 4, barH);
  setOp(gMarker, (slideU >= 1 ? 1 : 0) * deco);

  showAt(labA, densU * deco);
  showAt(labB, densU * deco);
  place(labA, aX - 40, L.axis + 16, 80);
  place(labB, bX - 40, L.axis + 16, 80);
  showAt(labWidth, fade(t, C.width, WIDTH_IN) * deco);
  place(labWidth, (aX + bX) / 2 - 120, L.axis + 68, 240);
  showAt(labDisorder, fade(t, C.disorder, DIS_IN) * deco);
  place(labDisorder, (aX + bX) / 2 - 160, L.axis + 116, 320);
  const lamU = fade(t, C.lambda, LAM_IN) * deco;
  showAt(labLambda, lamU);
  place(labLambda, (mid + bX) / 2 - 40, L.axis - 168, 80);
  showAt(labHalf, lamU);
  place(labHalf, 40, 6, L.w - 80);

  const energyOp = kMove;
  place(labEnergy, 48, lerp(BOX0.axis + 18, 360, kMove), 260);
  showAt(labEnergy, energyOp);

  const showFull = k >= 1 ? 1 : 0;
  showAt(labEigen, showFull * fade(t, C.point, POINT_IN));
  showAt(labSmooth, showFull * fade(t, C.smooth, SMOOTH_IN));
  showAt(labInside, showFull * fade(t, C.spectrum, SPEC_IN));
  showAt(labWeight, showFull * fade(t, C.weight, WEIGHT_IN));

  const m = showFull * fade(t, C.spectral, MEASURE);
  const pointK = fade(t, C.point, POINT_IN);
  const smoothK = fade(t, C.smooth, SMOOTH_IN);
  const spikeS = m * (1 + 0.14 * pointK);
  const humpS = m * (1 + 0.12 * smoothK);
  scaleY(gOutside, ay, spikeS);
  scaleY(gInside, ay, spikeS);
  scaleY(gHump, ay, humpS);
  scaleY(gFill, ay, humpS);
  setOp(gInside, 1 - fade(t, C.eigenvalues, SPIKE_OUT));
  const sw = (3 * pointK).toFixed(2);
  outsideSpike.setAttribute("stroke-width", sw);
  for (let i = 0; i < insideSpikes.length; i++) insideSpikes[i].setAttribute("stroke-width", sw);
  humpStroke.setAttribute("stroke-width", (3 + 2.5 * smoothK).toFixed(2));
  gFill.style.opacity = (0.4 * showFull * fade(t, C.weight, WEIGHT_IN)).toFixed(4);

  const settle = fade(t, C.range, RANGE_IN);
  setOp(gBracket, showFull * settle);
  gBracket.setAttribute("transform", "translate(0 " + ((1 - settle) * -26).toFixed(2) + ")");
  bracket.setAttribute("stroke-width", lerp(3, 7, fade(t, C.spectrum, SPEC_IN)).toFixed(2));

  const latIn = fade(t, C.lattice, LATTICE_IN) * (1 - kLat) * tail;
  setOp(lat.el, latIn);
  setOp(zd.el, latIn);
  const slideX = (-260 * kLat).toFixed(2);
  const latMove = kLat ? "translate(" + slideX + "px,0)" : "none";
  lat.el.style.transform = latMove;
  zd.el.style.transform = latMove;

  setOp(gSite, fade(t, C.site, SITE_IN));
  const neighOp = fade(t, C.neighbours, NEIGH_IN);
  setOp(gNeigh, neighOp);
  setOp(gArrows, neighOp);

  if (t >= C.energies) {
    nBar.style.opacity = "0";
    nBar.removeAttribute("transform");
  } else {
    nBar.style.opacity = "1";
    let ps = 1;
    if (t >= C.then && t < C.then + PULSE) {
      const u = (t - C.then) / PULSE;
      ps = 1 + 0.35 * Math.sin(Math.PI * u);
    }
    if (ps === 1) nBar.removeAttribute("transform");
    else {
      nBar.setAttribute(
        "transform",
        "translate(" + siteLocal.toFixed(2) + " " + siteLocal.toFixed(2)
        + ") scale(1 " + ps.toFixed(4)
        + ") translate(" + (-siteLocal).toFixed(2) + " " + (-siteLocal).toFixed(2) + ")"
      );
    }
  }

  const eqOn = t >= C.operator ? 1 : 0;
  setOp(eq.el, eqOn * tail);
  if (kMove <= 0) eq.el.style.transform = "none";
  else {
    const s = lerp(1, 0.4, kMove);
    const dx = lerp(0, 120 - EQ.x, kMove);
    const dy = lerp(0, 84 - EQ.y, kMove);
    eq.el.style.transform = "translate(" + dx.toFixed(2) + "px," + dy.toFixed(2) + "px) scale(" + s.toFixed(4) + ")";
  }

  const flyOn = t >= C.energies && slideU < 1 ? 1 : 0;
  setOp(fly, flyOn * tail);
  if (flyOn) {
    flyRect.setAttribute("x", lerp(barX0, landX, slideU).toFixed(2));
    flyRect.setAttribute("y", lerp(barY0, landY, slideU).toFixed(2));
  }

  label.setTime(t);
  if (t >= INTRO) label.el.style.opacity = tail <= 0 ? "0" : tail >= 1 ? "1" : tail.toFixed(4);

  strip.setTime(t);
  subs.setTime(t);
  lat.setTime(t);
  eq.setTime(t);
  zd.setTime(t);
  card.setTime(t);
  const cardBase = parseFloat(card.el.style.opacity) || 0;
  setOp(card.el, cardBase * tail);

  // The equation component and the ledger card each fade over the same span these declare.
  void OP;
  void SUM;
  void POT;
  void CARD_IN;
};

window.setTime(0);
