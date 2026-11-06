installBeats(window.__BEATS__);

const events = [];
function mark(t, beat, what) {
  events.push({ t: Math.round(t * 1000) / 1000, beat: beat, what: what });
}

// Motions started on narrated words, with their lengths (read by the narration tool).
const D = {
  intro: need("c7b1", "lead", 1.6, "chapter title settles"),
  mobility: need("c7b1", "mobility", 0.6, "item: the full mobility edge"),
  diffusion: need("c7b1", "diffusion", 0.6, "item: quantum diffusion"),
  two: need("c7b1", "two", 0.6, "item: two dimensions"),
  other: need("c7b1", "other", 0.6, "item: other random laws"),
  explicit: need("c7b1", "explicit", 0.6, "item: explicit constants"),
  end: need("c7b1", "tail", 11.8, "items held 1.0 s and leave in 0.8 s; the end card is shown for 10 s; the music swells and fades out under it"),
};
const label = chapterLabel({ n: 7, title: "What remains open", intro: D.intro });
const strip = mountStrip(document.body);
const subs = mountSubtitles(document.body, window.__BEATS__);

const FADE = D.mobility;
const RISE = 12;

const T = {
  mobility: cue("c7b1", "mobility"),
  diffusion: cue("c7b1", "diffusion"),
  two: cue("c7b1", "two"),
  other: cue("c7b1", "other"),
  explicit: cue("c7b1", "explicit"),
  leave: beatEnd("c7b1") + 1.0,
};
const LEAVE = 0.8;
T.endCard = T.leave + LEAVE;

function mountLine(name, text, y, muted, cls) {
  const box = span(1, 10);
  const el = document.createElement("div");
  el.className = (cls || "t-body") + " stage-abs";
  el.dataset.box = name;
  el.textContent = text;
  el.style.left = box.x + "px";
  el.style.top = y + "px";
  el.style.width = box.w + "px";
  el.style.textAlign = "center";
  el.style.whiteSpace = "nowrap";
  if (muted) el.style.color = "var(--ink-muted)";
  el.style.opacity = "0";
  document.body.appendChild(el);
  return el;
}

const opens = [
  { el: mountLine("open-mobility", "the full mobility edge", 268), t: T.mobility },
  { el: mountLine("open-diffusion", "quantum diffusion (Problem 3)", 356), t: T.diffusion },
  { el: mountLine("open-two", "two dimensions (Problem 2)", 444), t: T.two },
  { el: mountLine("open-other", "other random laws", 532), t: T.other },
  { el: mountLine("open-explicit", "explicit constants", 620), t: T.explicit },
];

// End card, not spoken: the works the film names, then the one AI note. One line per box (at most
// twelve words each), so the long manuscript title and the AI sentence take two lines. The references
// are a left-aligned block, centred on the frame as one unit (layoutRefs); the second line of the
// manuscript entry hangs by INDENT. The AI sentence is centred below.
const REFS = [
  ["ref-anderson", "P. W. Anderson, 1958"],
  ["ref-kunz", "H. Kunz, B. Souillard, 1980"],
  ["ref-frohlich", "J. Fr\u00f6hlich, T. Spencer, 1983"],
  ["ref-aizenman", "M. Aizenman, S. Molchanov, 1993"],
  ["ref-klein", "A. Klein, 1994, 1998"],
  ["ref-erdos", "L. Erd\u0151s, M. Salmhofer, H.-T. Yau, 2007, 2008"],
  ["ref-simon", "B. Simon, Schr\u00f6dinger operators in the twenty-first century, 2000, Problem 1"],
  ["ref-openai-1", "OpenAI, Absolutely Continuous Spectrum for Weak-Disorder Anderson Models", 12],
  ["ref-openai-2", "in Dimensions at Least Three, manuscript, 2026 (pages shown under Apache-2.0)", 0, false, true],
  ["ref-xu", "Y. Xu, anderson-ac-lean4, Lean formalization, 2026", 12],
  ["ref-full", "Full list with locators: the accompanying article.", 12, true],
];
const INDENT = 32;
const heading = mountLine("end-heading", "References", 104);
const card = [heading];
const block = [{ el: heading, indent: 0 }];
let y = 176;
REFS.forEach(function (r) {
  y += r[2] || 0;
  const el = mountLine(r[0], r[1], y, r[3], "t-label");
  card.push(el);
  block.push({ el: el, indent: r[4] ? INDENT : 0 });
  y += 44;
});
block.forEach(function (b) {
  b.el.style.width = "auto";
  b.el.style.textAlign = "left";
});

// Widths are read from the laid-out text (transforms do not change offsetWidth), so the block is
// placed the same way in every frame.
function layoutRefs() {
  let w = 0;
  block.forEach(function (b) { w = Math.max(w, b.indent + b.el.offsetWidth); });
  const left = Math.round((1920 - w) / 2);
  block.forEach(function (b) { b.el.style.left = left + b.indent + "px"; });
}
card.push(mountLine("end-ai-1", "Prepared by Yao Xu with AI assistance;", 752, false, "t-label"));
card.push(mountLine("end-ai-2", "the narration voice is synthesized with an OpenAI speech model.", 796, false, "t-label"));

function paintLine(el, t, tIn, tOut, outDur) {
  const inn = fade(t, tIn, FADE);
  const out = tOut == null ? 0 : fade(t, tOut, outDur);
  const v = inn * (1 - out);
  el.style.opacity = v <= 0 ? "0" : v >= 1 ? "1" : v.toFixed(4);
  if (tOut != null && t >= tOut) {
    el.style.transform = "none";
    return;
  }
  const dy = (1 - inn) * RISE;
  el.style.transform = dy <= 0.01 ? "none" : "translateY(" + dy.toFixed(2) + "px)";
}

mark(T.mobility, "c7b1", "the full mobility edge");
mark(T.diffusion, "c7b1", "quantum diffusion (Problem 3)");
mark(T.two, "c7b1", "two dimensions (Problem 2)");
mark(T.other, "c7b1", "other random laws");
mark(T.explicit, "c7b1", "explicit constants");
mark(T.leave, "c7b1", "open items leave");
mark(T.endCard, "c7b1", "end card: references and the AI note");

window.sceneEvents = events;
window.sceneDuration = window.__BEATS__.duration;

window.setTime = function (t) {
  opens.forEach(function (item) {
    paintLine(item.el, t, item.t, T.leave, LEAVE);
  });
  layoutRefs();
  card.forEach(function (el) {
    paintLine(el, t, T.endCard, null, 0);
  });

  label.setTime(t);
  strip.setTime(t);
  subs.setTime(t);
};
