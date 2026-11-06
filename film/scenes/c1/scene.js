/* Chapter 1, cold open. One layer of a three-dimensional lattice, drawn for this scene. */
const tl = installBeats(window.__BEATS__);
const events = [];

function mark(t, beat, what) {
  events.push({ t: Math.round(t * 1000) / 1000, beat: beat, what: what });
}

function ns(name) {
  return document.createElementNS("http://www.w3.org/2000/svg", name);
}

const NX = 15;
const NY = 8;
const COUNT = NX * NY;
const SP = 90;
const PAD_X = 46;
const PAD_TOP = 50;
const PAD_BOT = 42;
const BAR_W = 4;
const BAR_BASE = 10;
const BAR_UNIT = 12;
const BAR_SHIFT = 8;
const HOST_W = PAD_X + (NX - 1) * SP + PAD_X;
const HOST_H = PAD_TOP + (NY - 1) * SP + PAD_BOT;
const HOST_X = (1920 - HOST_W) / 2;
const HOST_Y = 154;
const CX = 7;
const CY = 3.5;
const CENTER_X = HOST_X + PAD_X + CX * SP;
const CENTER_Y = HOST_Y + PAD_TOP + CY * SP;
const FRAME_R = Math.min(CENTER_X, 1920 - CENTER_X, CENTER_Y, 1080 - CENTER_Y) / SP;
const SIGMA0 = 1.2 / Math.sqrt(2);

// Motions started on narrated words, with their lengths (read by the narration tool).
const D = {
  bonds: need("c1b1", "lead", 0.6, "bonds fade in before the first word"),
  bars: need("c1b1", "energy", 0.9, "the last site bars grow"),
  layer: need("c1b1", "layer", 0.6, "label and the layers behind"),
  wave: need("c1b2", "wave", 0.6, "wave packet appears"),
  strong: need("c1b2", "strong", 0.8, "bars double, the packet contracts"),
  weak: need("c1b3", "weak", 0.8, "bars shrink, the packet starts to widen"),
  travel: need("c1b3", "travel", 1.5, "the packet spreads to the frame edge"),
  title: need("c1b4", "Proving", 0.8, "lattice dims, title appears"),
  claimed: need("c1b4", "claimed", 0.5, "second title line"),
  out: need("c1b4", "tail", 0.8, "picture fades out"),
};

const T = {
  bonds: 0,
  site: cue("c1b1", "site"),
  energy: cue("c1b1", "energy"),
  wave: cue("c1b2", "wave"),
  strong: cue("c1b2", "strong"),
  layer: cue("c1b1", "layer"),
  weak: cue("c1b3", "weak"),
  travel: cue("c1b3", "travel"),
  spreadEnd: beatHoldEnd("c1b3"),
  proving: cue("c1b4", "Proving"),
  claimed: cue("c1b4", "claimed"),
  end: beatEnd("c1b4"),
};
T.barsDone = T.energy + D.bars;
T.spreadEnd = Math.max(T.spreadEnd, T.travel + D.travel);
T.growDur = 0.45;

const rng = mulberry32(1036);
const values = [];
for (let k = 0; k < COUNT; k++) values.push(rng());
const rankOf = [];
const order = [];
for (let k = 0; k < COUNT; k++) order.push(k);
for (let i = COUNT - 1; i > 0; i--) {
  const j = Math.floor(rng() * (i + 1));
  const swap = order[i];
  order[i] = order[j];
  order[j] = swap;
}
for (let r = 0; r < COUNT; r++) rankOf[order[r]] = r;

function px(i) { return PAD_X + i * SP; }
function py(j) { return PAD_TOP + j * SP; }

const strip = mountStrip(document.body);
const subs = mountSubtitles(document.body, window.__BEATS__);

const host = document.createElement("div");
host.className = "lattice";
host.dataset.box = "lattice";
host.dataset.group = "stage";
host.style.left = HOST_X + "px";
host.style.top = HOST_Y + "px";
host.style.width = HOST_W + "px";
host.style.height = HOST_H + "px";

const svg = ns("svg");
svg.setAttribute("width", String(HOST_W));
svg.setAttribute("height", String(HOST_H));
svg.setAttribute("viewBox", "0 0 " + HOST_W + " " + HOST_H);

const bonds = ns("g");
for (let j = 0; j < NY; j++) {
  for (let i = 0; i < NX; i++) {
    if (i + 1 < NX) {
      const line = ns("line");
      line.setAttribute("x1", String(px(i)));
      line.setAttribute("y1", String(py(j)));
      line.setAttribute("x2", String(px(i + 1)));
      line.setAttribute("y2", String(py(j)));
      line.setAttribute("stroke", "var(--obj-hopping)");
      line.setAttribute("stroke-width", "2");
      bonds.appendChild(line);
    }
    if (j + 1 < NY) {
      const line = ns("line");
      line.setAttribute("x1", String(px(i)));
      line.setAttribute("y1", String(py(j)));
      line.setAttribute("x2", String(px(i)));
      line.setAttribute("y2", String(py(j + 1)));
      line.setAttribute("stroke", "var(--obj-hopping)");
      line.setAttribute("stroke-width", "2");
      bonds.appendChild(line);
    }
  }
}
// two faint layers behind, offset up and right, so the picture reads as one layer of a 3D grid
const layers = [1, 2].map(function (k) {
  const g = bonds.cloneNode(true);
  g.setAttribute("transform", "translate(" + (34 * k) + " " + (-30 * k) + ")");
  svg.appendChild(g);
  return g;
});
svg.appendChild(bonds);

const waves = [];
for (let j = 0; j < NY; j++) {
  for (let i = 0; i < NX; i++) {
    const wave = ns("circle");
    wave.setAttribute("cx", String(px(i)));
    wave.setAttribute("cy", String(py(j)));
    wave.setAttribute("r", "0");
    wave.setAttribute("fill", "var(--obj-wave)");
    svg.appendChild(wave);
    waves.push(wave);
  }
}

const bars = [];
for (let j = 0; j < NY; j++) {
  for (let i = 0; i < NX; i++) {
    const bar = ns("rect");
    bar.setAttribute("x", String(px(i) + BAR_SHIFT));
    bar.setAttribute("y", String(py(j)));
    bar.setAttribute("width", String(BAR_W));
    bar.setAttribute("height", "0");
    bar.setAttribute("fill", "var(--obj-potential)");
    svg.appendChild(bar);
    bars.push(bar);
  }
}

for (let j = 0; j < NY; j++) {
  for (let i = 0; i < NX; i++) {
    const dot = ns("circle");
    dot.setAttribute("cx", String(px(i)));
    dot.setAttribute("cy", String(py(j)));
    dot.setAttribute("r", "5");
    dot.setAttribute("fill", "var(--paper)");
    dot.setAttribute("stroke", "var(--ink)");
    dot.setAttribute("stroke-width", "2");
    svg.appendChild(dot);
  }
}

host.appendChild(svg);
document.body.appendChild(host);

function makeLine(className, text, x, y, w, h, box) {
  const el = document.createElement("div");
  el.className = className;
  el.dataset.box = box;
  el.dataset.group = "stage";
  el.style.position = "absolute";
  el.style.left = x + "px";
  el.style.top = y + "px";
  el.style.width = w + "px";
  el.style.height = h + "px";
  el.style.textAlign = "center";
  el.style.opacity = "0";
  el.textContent = text;
  document.body.appendChild(el);
  return el;
}

const label = document.createElement("div");
label.className = "t-label";
label.dataset.box = "label";
label.style.position = "absolute";
label.style.left = "720px";
label.style.top = "84px";
label.style.width = "480px";
label.style.height = "48px";
label.style.textAlign = "center";

function labelSpan(text) {
  const span = document.createElement("span");
  span.textContent = text;
  span.style.position = "absolute";
  span.style.left = "0px";
  span.style.top = "0px";
  span.style.width = "480px";
  span.style.opacity = "0";
  label.appendChild(span);
  return span;
}

const labelLayer = labelSpan("one layer of a 3D grid");
const labelStrong = labelSpan("strong disorder");
const labelWeak = labelSpan("weak disorder");
document.body.appendChild(label);

const title = makeLine("t-title", "Extended states in the Anderson model", 120, 388, 1680, 80, "title");
const claim = makeLine("t-body", "a claimed proof, and what Lean checked", 120, 484, 1680, 64, "claim");

const badge = heuristicBadge({ parent: document.body, x: 1200, y: 84 });
badge.el.style.left = "auto";
badge.el.style.right = "120px";
badge.el.style.top = "84px";

function phaseFactor(r, t) {
  const u = (t - T.strong) / 1.5;
  if (u <= 0 || u >= 1) return 1;
  const depth = Math.sin(Math.PI * u) * 0.16;
  const wobble = Math.cos(r * 2.1 - 2 * Math.PI * u);
  return 1 - depth * (1 - wobble);
}

function spreadU(t) {
  if (t <= T.travel) return 0;
  if (t >= T.spreadEnd) return 1;
  return (t - T.travel) / (T.spreadEnd - T.travel);
}

function envelope(r, t) {
  // the packet starts medium, contracts under strong disorder, widens a little under weak
  // disorder, and from [travel] spreads to the frame edge
  const len = 2.5 - 1.3 * fade(t, T.strong, D.strong) + 0.5 * fade(t, T.weak, D.weak);
  const local = Math.exp(-r / len) * phaseFactor(r, t);
  if (t <= T.travel) return local;
  const sigma = SIGMA0 + (FRAME_R - SIGMA0) * spreadU(t);
  const gaussian = Math.exp(-(r * r) / (2 * sigma * sigma));
  const morph = fade(t, T.travel, 0.4);
  return local * (1 - morph) + gaussian * morph;
}

function amplitude(i, j, t) {
  const appear = fade(t, T.wave, D.wave);
  if (appear <= 0) return 0;
  const r = Math.hypot(i - CX, j - CY);
  return appear * envelope(r, t);
}

function discRadius(a) {
  if (a <= 0.02) return 0;
  return (0.09 + 0.32 * Math.min(1, a)) * SP;
}

function barScale(t) {
  const up = fade(t, T.strong, D.strong);
  const down = fade(t, T.weak, D.weak);
  return (1 + up) * (1 - down) + 0.4 * down;
}

function barGrow(rank, t) {
  const span = T.barsDone - T.growDur - T.site;
  const start = T.site + (rank / (COUNT - 1)) * span;
  return fade(t, start, T.growDur);
}

function dimK(t) {
  return fade(t, T.proving, D.title);
}

mark(beatStart("c1b1"), "c1b1", "bonds (fading in from the chapter start)");
mark(T.site, "c1b1", "bars");
mark(T.barsDone, "c1b1", "bars grown");
mark(T.wave, "c1b2", "wave");
mark(T.strong, "c1b2", "strong disorder");
mark(T.strong + 1.5, "c1b2", "shimmer ends");
mark(T.layer, "c1b1", "one layer of a 3D grid");
mark(T.weak, "c1b3", "weak disorder");
mark(T.travel, "c1b3", "spread");
mark(T.proving, "c1b4", "title");
mark(T.claimed, "c1b4", "claimed line");

window.sceneEvents = events;
window.sceneDuration = tl.data.duration;

window.setTime = function (t) {
  const bondOp = fade(t, T.bonds, D.bonds);
  bonds.setAttribute("opacity", bondOp.toFixed(3));
  const layerIn = fade(t, T.layer, D.layer);
  layers[0].setAttribute("opacity", (0.3 * layerIn).toFixed(3));
  layers[1].setAttribute("opacity", (0.15 * layerIn).toFixed(3));

  const scale = barScale(t);
  for (let k = 0; k < COUNT; k++) {
    const h = barGrow(rankOf[k], t) * scale * (BAR_BASE + values[k] * BAR_UNIT);
    const j = Math.floor(k / NX);
    bars[k].setAttribute("height", h.toFixed(2));
    bars[k].setAttribute("y", (py(j) - h).toFixed(2));
    const a = amplitude(k % NX, j, t);
    waves[k].setAttribute("r", discRadius(a).toFixed(2));
  }

  const kDim = dimK(t);
  host.style.opacity = String(1 - 0.9 * kDim);
  svg.setAttribute("shape-rendering", kDim > 0 ? "crispEdges" : "auto");

  const strongIn = fade(t, T.strong, 0.5);
  const weakIn = fade(t, T.weak, 0.5);
  const labelOut = fade(t, T.proving, 0.45);
  const strongOp = strongIn * (1 - weakIn) * (1 - labelOut);
  const weakOp = weakIn * (1 - labelOut);
  const layerOp = layerIn * (1 - strongIn) * (1 - labelOut);
  labelLayer.style.opacity = layerOp.toFixed(3);
  labelStrong.style.opacity = strongOp.toFixed(3);
  labelWeak.style.opacity = weakOp.toFixed(3);
  label.style.opacity = (strongOp < 0.02 && weakOp < 0.02 && layerOp < 0.02) ? "0" : "1";

  const outK = 1 - fade(t, T.end, D.out);
  if (outK < 1) host.style.opacity = String(parseFloat(host.style.opacity) * outK);
  title.style.opacity = (fade(t, T.proving, D.title) * outK).toFixed(3);
  claim.style.opacity = (fade(t, T.claimed, D.claimed) * outK).toFixed(3);
  badge.el.style.opacity = (1 - fade(t, T.proving, 0.6)).toFixed(3);

  strip.setTime(t);
  subs.setTime(t);
  // Rebuild the picture node so a seek paints the same pixels as a sweep.
  svg.remove();
  host.appendChild(svg);
};

window.setTime(0);
