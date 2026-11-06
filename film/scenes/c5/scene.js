/* Chapter 5: the ledger. Four status cards fill as narrated; the summary of c5b6 sits under them. */
installBeats(window.__BEATS__);

const events = [];
function mark(t, beat, what) {
  events.push({ t: Math.round(t * 1000) / 1000, beat: beat, what: what });
}
function setOp(el, v) {
  el.style.opacity = v <= 0 ? "0" : v >= 1 ? "1" : v.toFixed(4);
}
function ns(name) {
  return document.createElementNS("http://www.w3.org/2000/svg", name);
}

// Motions started on narrated words, with their lengths (read by the narration tool).
const D = {
  intro: need("c5b1", "lead", 1.6, "chapter title settles"),
  outlines: need("c5b1", "Here", 0.9, "four empty card outlines, one after another"),
  proved: need("c5b2", "Proved", 0.4, "proved card fills"),
  claimed: need("c5b3", "Claimed", 0.4, "claimed card fills"),
  checked: need("c5b4", "Checked", 0.4, "Lean card fills"),
  whole: need("c5b4", "whole", 0.4, "item: whole argument"),
  theorem: need("c5b4", "Theorem", 0.4, "item: Theorem 1.1"),
  simon: need("c5b4", "Simon's", 0.4, "item: Simon's Problem 1"),
  pictures: need("c5b5", "pictures", 0.4, "heuristic card and badge"),
  back: need("c5b6", "short", 0.6, "cards step back, summary line"),
  unref: need("c5b6", "manuscript", 0.4, "second summary line"),
  out: need("c5b6", "tail", 0.8, "picture fades out"),
};
const C = {
  here: cue("c5b1", "Here"),
  whole: cue("c5b4", "whole"), theorem: cue("c5b4", "Theorem"), simon: cue("c5b4", "Simon's"),
  pictures: cue("c5b5", "pictures"),
  short: cue("c5b6", "short"), unref: cue("c5b6", "manuscript"),
  end: beatEnd("c5b6"),
};

const label = chapterLabel({ n: 5, title: "The ledger", intro: D.intro });
const strip = mountStrip(document.body);
const subs = mountSubtitles(document.body, window.__BEATS__);

/* Empty rule-colour card outline. The ledger component has no empty state. */
function mountOutline(name, x, y, w, h) {
  const el = document.createElement("div");
  el.className = "stage-abs";
  el.dataset.box = name;
  el.style.left = x + "px";
  el.style.top = y + "px";
  el.style.width = w + "px";
  el.style.height = h + "px";
  const svg = ns("svg");
  svg.setAttribute("width", String(w));
  svg.setAttribute("height", String(h));
  svg.setAttribute("viewBox", "0 0 " + w + " " + h);
  svg.style.display = "block";
  const rect = ns("rect");
  rect.setAttribute("x", "1.5");
  rect.setAttribute("y", "1.5");
  rect.setAttribute("width", String(w - 3));
  rect.setAttribute("height", String(h - 3));
  rect.setAttribute("rx", "6");
  rect.setAttribute("fill", "none");
  rect.setAttribute("stroke", "var(--rule)");
  rect.setAttribute("stroke-width", "2");
  svg.appendChild(rect);
  el.appendChild(svg);
  document.body.appendChild(el);
  return el;
}

const grid = span(0, 12);
const CARD_Y = [100, 240, 380, 520];
const CARD_H = 114;

const SLOTS = [
  { status: "proved", title: "Proved, peer reviewed", line: "localization; trees; diffusion to finite times",
    tIn: cue("c5b2", "Proved"), beat: "c5b2" },
  { status: "claimed", title: "Claimed", line: "the manuscript's text, not refereed",
    tIn: cue("c5b3", "Claimed"), beat: "c5b3" },
  { status: "lean", title: "Checked in Lean", line: "whole argument; Theorem 1.1; Simon's Problem 1",
    tIn: cue("c5b4", "Checked"), beat: "c5b4" },
  { status: "heuristic", title: "Heuristic", line: "pictures, analogies, the mean-field reading",
    tIn: C.pictures, beat: "c5b5" },
];

const outlines = [];
const cards = [];
SLOTS.forEach(function (slot, i) {
  const outline = mountOutline("outline-" + i, grid.x, CARD_Y[i], grid.w, CARD_H);
  outline.dataset.group = "slot-" + i;
  outlines.push(outline);
  const card = ledgerCard({
    parent: document.body, status: slot.status, title: slot.title, lines: [slot.line],
    x: grid.x, y: CARD_Y[i], w: grid.w, tIn: slot.tIn, tOut: null, box: "card-" + i,
  });
  card.el.dataset.group = "slot-" + i;
  cards.push(card);
  mark(slot.tIn, slot.beat, slot.title);
});

// the Lean card's three items light in turn
const leanLine = cards[2].el.querySelector(".ledger-line");
leanLine.textContent = "";
const ITEMS = [["whole argument", C.whole], ["Theorem 1.1", C.theorem], ["Simon's Problem 1", C.simon]];
const itemEls = ITEMS.map(function (it, i) {
  if (i > 0) leanLine.appendChild(document.createTextNode("; "));
  const s = document.createElement("span");
  s.textContent = it[0];
  leanLine.appendChild(s);
  mark(it[1], "c5b4", "item: " + it[0]);
  return s;
});

const badge = heuristicBadge({ parent: document.body, x: grid.x, y: 656 });
mark(C.pictures, "c5b5", "heuristic badge");

function mountLine(name, text, y) {
  const el = document.createElement("div");
  el.className = "t-body stage-abs";
  el.dataset.box = name;
  el.textContent = text;
  el.style.left = grid.x + "px";
  el.style.top = y + "px";
  el.style.width = grid.w + "px";
  el.style.whiteSpace = "nowrap";
  el.style.opacity = "0";
  document.body.appendChild(el);
  return el;
}
const sum1 = mountLine("summary-lean", "Simon's Problem 1, as formalized: machine-checked proof", 736);
const sum2 = mountLine("summary-paper", "the manuscript: unrefereed", 806);
mark(C.here, "c5b1", "empty outlines");
mark(C.short, "c5b6", "cards step back; summary line");
mark(C.unref, "c5b6", "the manuscript: unrefereed");

window.sceneEvents = events;
window.sceneDuration = window.__BEATS__.duration;

window.setTime = function (t) {
  const out = 1 - fade(t, C.end, D.out);
  const back = 1 - 0.4 * fade(t, C.short, D.back);
  for (let i = 0; i < SLOTS.length; i++) {
    const shown = fade(t, C.here + i * (D.outlines - 0.3) / 3, 0.3);
    const fill = fade(t, SLOTS[i].tIn, D.proved);
    setOp(outlines[i], shown * (1 - fill) * out);
    cards[i].setTime(t);
    setOp(cards[i].el, parseFloat(cards[i].el.style.opacity) * back * out);
  }
  itemEls.forEach(function (el, i) {
    el.style.color = fade(t, ITEMS[i][1], D.whole) > 0.5 ? "var(--ink)" : "var(--ink-muted)";
  });
  setOp(badge.el, fade(t, C.pictures, D.pictures) * back * out);
  setOp(sum1, fade(t, C.short, D.back) * out);
  setOp(sum2, fade(t, C.unref, D.unref) * out);
  label.setTime(t);
  strip.setTime(t);
  subs.setTime(t);
};

window.setTime(0);
