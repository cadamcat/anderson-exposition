#!/usr/bin/env python3
"""Generate the article's SVG figures in the house palette (deterministic; no dependencies).

Colours mirror the studio tokens (STYLE.md): paper ground, ink, status colours, object colours.
Text: "Source Sans 3"; variables: "KaTeX_Math" (italic), both loaded by build.sh when making the PDF.
"""
import math, random
from pathlib import Path

C = dict(paper="#F7F4EC", raised="#FBF8F1", ink="#1C1B19", muted="#5E5B55", rule="#D8D2C4",
         proved="#2F6B4F", claimed="#B7791F", heuristic="#8A8780", lean="#2B5C9E",
         hopping="#4F5D8A", potential="#A34F3A", energy="#7A4A6E", wave="#2E7D86", damping="#8E8458")
SANS = "'Source Sans 3', KaTeX_MainFB, sans-serif"
MATH = "KaTeX_Math, KaTeX_MainFB, serif"
OUT = Path(__file__).resolve().parent


def svg(w, h, body):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">\n'
            f'<rect width="{w}" height="{h}" fill="{C["paper"]}"/>\n{body}\n</svg>\n')


def text(x, y, s, size=22, fill=None, anchor="start", weight=400, family=SANS, italic=False):
    st = ' font-style="italic"' if italic else ''
    return (f'<text x="{x}" y="{y}" font-family="{family}" font-size="{size}" font-weight="{weight}"'
            f' fill="{fill or C["ink"]}" text-anchor="{anchor}"{st}>{s}</text>')


def var(s, sub=None, size=24):
    """Inline math variable with optional subscript, as tspans."""
    t = f'<tspan font-family="{MATH}" font-style="italic">{s}</tspan>'
    if sub:
        t += f'<tspan font-family="{MATH}" font-style="italic" font-size="{int(size*0.7)}" dy="6">{sub}</tspan><tspan dy="-6"> </tspan>'
    return t


def seal(x, y, s=12):
    return f'<rect x="{x}" y="{y}" width="{s}" height="{s}" fill="{C["lean"]}"/>'


def lattice():
    rnd = random.Random(1036)
    nx, ny, sp, x0, y0 = 9, 6, 96, 96, 84
    b = []
    for j in range(ny):
        for i in range(nx):
            x, y = x0 + i * sp, y0 + j * sp
            if i < nx - 1:
                b.append(f'<line x1="{x}" y1="{y}" x2="{x+sp}" y2="{y}" stroke="{C["hopping"]}" stroke-width="2.5"/>')
            if j < ny - 1:
                b.append(f'<line x1="{x}" y1="{y}" x2="{x}" y2="{y+sp}" stroke="{C["hopping"]}" stroke-width="2.5"/>')
    for j in range(ny):
        for i in range(nx):
            x, y = x0 + i * sp, y0 + j * sp
            v = rnd.uniform(-1, 1)
            hgt = 34 * v
            top = y - max(hgt, 0)
            b.append(f'<rect x="{x+9}" y="{top:.1f}" width="10" height="{abs(hgt):.1f}" fill="{C["potential"]}"/>')
            b.append(f'<circle cx="{x}" cy="{y}" r="6.5" fill="{C["ink"]}"/>')
    W = x0 * 2 + (nx - 1) * sp
    H = y0 + (ny - 1) * sp + 90
    b.append(text(x0 - 6, H - 30, "bonds: hopping between neighbours", 22, C["hopping"]))
    b.append(text(W - x0 + 6, H - 30, "bars: independent random site energies", 22, C["potential"], "end"))
    return svg(W, H, "\n".join(b))


def energy_axis():
    W, H = 1400, 330
    xL, xR = 80, 1320
    lo, hi = -7.2, 7.2       # schematic units: d=3, lambda=1.2
    X = lambda e: xL + (e - lo) / (hi - lo) * (xR - xL)
    y = 170
    b = [f'<line x1="{xL-30}" y1="{y}" x2="{xR+30}" y2="{y}" stroke="{C["ink"]}" stroke-width="2"/>']
    # almost-sure spectrum
    b.append(f'<rect x="{X(lo):.1f}" y="{y-10}" width="{X(hi)-X(lo):.1f}" height="20" fill="{C["rule"]}"/>')
    # free band marks
    for e, lab in [(lo, "−2d−λ"), (-6.0, "−2d"), (6.0, "2d"), (hi, "2d+λ")]:
        b.append(f'<line x1="{X(e):.1f}" y1="{y-18}" x2="{X(e):.1f}" y2="{y+18}" stroke="{C["ink"]}" stroke-width="2"/>')
        b.append(text(f"{X(e):.1f}", y + 50, f'<tspan font-family="{MATH}" font-style="italic">{lab}</tspan>', 24, anchor="middle"))
    # J: pure point (proved)
    jx0, jx1 = X(lo), X(-6.55)
    b.append(f'<rect x="{jx0:.1f}" y="{y-14}" width="{jx1-jx0:.1f}" height="28" fill="{C["proved"]}"/>')
    b.append(f'<line x1="{(jx0+jx1)/2:.1f}" y1="{y-16}" x2="{(jx0+jx1)/2:.1f}" y2="{y-70}" stroke="{C["proved"]}" stroke-width="2"/>')
    b.append(text(f"{jx0:.1f}", y - 80, "J: pure point near the edge — proved", 22, C["proved"], weight=600))
    # I_d: claimed a.c.
    ix0, ix1 = X(-5.85), X(-5.55)
    b.append(f'<rect x="{ix0:.1f}" y="{y-14}" width="{ix1-ix0:.1f}" height="28" fill="{C["energy"]}" stroke="{C["claimed"]}" stroke-width="4"/>')
    b.append(f'<line x1="{(ix0+ix1)/2:.1f}" y1="{y+16}" x2="{(ix0+ix1)/2:.1f}" y2="{y+86}" stroke="{C["energy"]}" stroke-width="2"/>')
    b.append(text(f"{ix0-4:.1f}", y + 112, 'I<tspan font-size="16" dy="5">d</tspan><tspan dy="-5">: purely absolutely continuous — claimed (Theorem 1.1)</tspan>', 22, C["claimed"], weight=600))
    b.append(seal(ix0 - 4, y + 128, 14))
    b.append(text(f"{ix0+18:.1f}", y + 141, "its consequence for Simon's problem: checked in Lean", 20, C["lean"]))
    # rest not addressed
    b.append(f'<rect x="{X(-5.3):.1f}" y="{y-12}" width="{X(5.8)-X(-5.3):.1f}" height="24" fill="none" stroke="{C["heuristic"]}" stroke-width="2" stroke-dasharray="8 6"/>')
    b.append(text(f"{X(0.25):.1f}", y - 26, "rest of the spectrum: not addressed", 22, C["muted"], "middle"))
    b.append(text(xR + 30, H - 12, "schematic, not to scale", 18, C["muted"], "end"))
    b.append(text(xL - 30, 34, "energy", 22, C["muted"]))
    return svg(W, H, "\n".join(b))


def node(x, y, w, h, title, sub, border, seal_on=False, dashed=False):
    d = ' stroke-dasharray="8 6"' if dashed else ''
    s = [f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="{C["raised"]}" stroke="{border}" stroke-width="3"{d}/>',
         text(x + w / 2, y + h / 2 - 4, title, 23, C["ink"], "middle", 600),
         text(x + w / 2, y + h / 2 + 24, sub, 19, C["muted"], "middle")]
    if seal_on:
        s.append(seal(x + w - 20, y + 8, 12))
    return "\n".join(s)


def arrow(x1, y1, x2, y2, col=None):
    col = col or C["ink"]
    ang = math.atan2(y2 - y1, x2 - x1)
    a1 = (x2 - 12 * math.cos(ang - 0.4), y2 - 12 * math.sin(ang - 0.4))
    a2 = (x2 - 12 * math.cos(ang + 0.4), y2 - 12 * math.sin(ang + 0.4))
    return (f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{col}" stroke-width="2"/>'
            f'<polygon points="{x2},{y2} {a1[0]:.1f},{a1[1]:.1f} {a2[0]:.1f},{a2[1]:.1f}" fill="{col}"/>')


def proof_map():
    W, H = 1580, 560
    w, h, gx = 250, 92, 52
    xs = [60 + i * (w + gx) for i in range(5)]
    r1, r2 = 90, 330
    top = [("Initialization", "free resolvent, §3"), ("Ordinary sweeps", "digits revealed, §§4–5"),
           ("Clearing", "pending components, §6"), ("Assembly, reset", "stage bounds, §7"),
           ("Failure histories", "cutoff, last sweep, §8")]
    bot = [("Certificate", "Proposition 2.1"), ("Spectral readout", "Proposition 9.2, §9"),
           ("Theorem 1.1", "manuscript"), ("Transport", "conventions, law, sign"),
           ("Simon's Problem 1", "Mathlib-only statement")]
    b = []
    for i, (t, s) in enumerate(top):
        b.append(node(xs[i], r1, w, h, t, s, C["claimed"], True))
        if i:
            b.append(arrow(xs[i - 1] + w, r1 + h / 2, xs[i] - 4, r1 + h / 2))
    for i, (t, s) in enumerate(bot):
        lean_only = i >= 3
        b.append(node(xs[i], r2, w, h, t, s, C["lean"] if lean_only else C["claimed"], True))
        if i:
            b.append(arrow(xs[i - 1] + w, r2 + h / 2, xs[i] - 4, r2 + h / 2))
    # from failure histories down to certificate
    b.append(f'<path d="M {xs[4]+w/2} {r1+h} L {xs[4]+w/2} {(r1+h+r2)/2} L {xs[0]+w/2} {(r1+h+r2)/2} L {xs[0]+w/2} {r2-4}" fill="none" stroke="{C["ink"]}" stroke-width="2"/>')
    b.append(arrow(xs[0] + w / 2, r2 - 20, xs[0] + w / 2, r2 - 3))
    b.append(text(60, 50, "certificate construction (finite volume)", 22, C["muted"]))
    b.append(text(60, r2 - 50 + 10, "", 20))
    ly = 500
    b.append(f'<rect x="60" y="{ly-16}" width="26" height="18" rx="3" fill="{C["raised"]}" stroke="{C["claimed"]}" stroke-width="3"/>')
    b.append(text(96, ly, "claimed in the manuscript", 20, C["claimed"]))
    b.append(f'<rect x="420" y="{ly-16}" width="26" height="18" rx="3" fill="{C["raised"]}" stroke="{C["lean"]}" stroke-width="3"/>')
    b.append(text(456, ly, "added by the formalization", 20, C["lean"]))
    b.append(seal(780, ly - 14, 12))
    b.append(text(800, ly, "step proved in the Lean formalization", 20, C["lean"]))
    return svg(W, H, "\n".join(b))


def digits():
    W, H = 1100, 470
    x0, x1, y0, y1 = 120, 1040, 60, 380
    n0, m = 0, 8
    X = lambda n: x0 + (n - n0) / (m - n0) * (x1 - x0)
    # log scale: s_n = 4^{-n}; eta = 4^{-m}
    lo, hi = -m - 0.6, 0.3
    Y = lambda e: y1 - (e - lo) / (hi - lo) * (y1 - y0)   # e = log4 value
    b = [f'<line x1="{x0}" y1="{y1}" x2="{x1+20}" y2="{y1}" stroke="{C["ink"]}" stroke-width="2"/>',
         f'<line x1="{x0}" y1="{y1}" x2="{x0}" y2="{y0-20}" stroke="{C["ink"]}" stroke-width="2"/>']
    # eta floor
    b.append(f'<line x1="{x0}" y1="{Y(-m):.1f}" x2="{x1}" y2="{Y(-m):.1f}" stroke="{C["damping"]}" stroke-width="2" stroke-dasharray="8 6"/>')
    b.append(text(x1 - 130, Y(-m) + 30, 'final damping floor η = s<tspan font-size="15" dy="5">m</tspan><tspan dy="-5"> </tspan>', 21, C["damping"], "end"))
    # s_n steps (variance of unrevealed part) and t_n = s_n + eta
    ps, pt = [], []
    for n in range(n0, m + 1):
        xa, xb = X(n), X(n + 1) if n < m else X(n) + 0.001
        sv = -n
        tv = math.log(4 ** (-n) + 4 ** (-m), 4)
        ps += [f"{xa:.1f},{Y(sv):.1f}", f"{min(xb, x1):.1f},{Y(sv):.1f}"]
        pt += [f"{xa:.1f},{Y(tv):.1f}", f"{min(xb, x1):.1f},{Y(tv):.1f}"]
    b.append(f'<polyline points="{" ".join(ps)}" fill="none" stroke="{C["potential"]}" stroke-width="3"/>')
    b.append(f'<polyline points="{" ".join(pt)}" fill="none" stroke="{C["damping"]}" stroke-width="3" stroke-dasharray="2 5"/>')
    b.append(text(X(1.15), Y(-1) - 14, 'variance of the unrevealed part: s<tspan font-size="15" dy="5">n</tspan><tspan dy="-5"> = (λ²/3)·4</tspan><tspan font-size="15" dy="-9">n</tspan><tspan font-size="11" dy="3">0</tspan><tspan font-size="15" dy="-3">−n</tspan><tspan dy="9"> </tspan>', 21, C["potential"]))
    b.append(text(X(4.2), Y(-3.4), 'artificial damping t<tspan font-size="15" dy="5">n</tspan><tspan dy="-5"> = s</tspan><tspan font-size="15" dy="5">n</tspan><tspan dy="-5"> + η</tspan>', 21, C["damping"]))
    for n in range(n0, m + 1, 2):
        n0lab = 'n<tspan font-size="14" dy="5">0</tspan><tspan dy="-5"></tspan>'
        lab = n0lab if n == 0 else ("m" if n == m else f"{n0lab}+{n}")
        b.append(text(X(n), y1 + 32, lab, 20, C["muted"], "middle", family=MATH, italic=True))
    b.append(text((x0 + x1) / 2, y1 + 70, "stage n: one more binary digit of every potential is revealed", 21, C["muted"], "middle"))
    b.append(text(x0 - 14, y0 - 30, "size (log scale)", 20, C["muted"]))
    b.append(text(x1 + 20, 30, "schematic", 18, C["muted"], "end"))
    return svg(W, H, "\n".join(b))


def site_states():
    W, H = 1150, 470
    b = []
    bx, bw, bh = 70, 330, 110
    b.append(f'<rect x="40" y="60" width="390" height="360" rx="8" fill="none" stroke="{C["damping"]}" stroke-width="2" stroke-dasharray="8 6"/>')
    b.append(text(235, 46, "active sites keep artificial damping", 21, C["damping"], "middle"))
    def box(x, y, t, s1, s2=None, fill=None):
        out = [f'<rect x="{x}" y="{y}" width="{bw}" height="{bh}" rx="8" fill="{fill or C["raised"]}" stroke="{C["ink"]}" stroke-width="2"/>',
               text(x + bw / 2, y + 40, t, 24, weight=600, anchor="middle"),
               text(x + bw / 2, y + 72, s1, 20, C["muted"], "middle")]
        if s2:
            out.append(text(x + bw / 2, y + 98, s2, 20, C["muted"], "middle"))
        return "\n".join(out)
    b.append(box(bx, 90, "Coupled active", "true digits only"))
    b.append(box(bx, 290, "Pending active", "may use auxiliary digits"))
    b.append(box(760, 185, "Committed terminal", "complete true potential,", "permanent", C["rule"]))
    b.append(arrow(bx + bw / 2, 200, bx + bw / 2, 286))
    b.append(text(bx + bw / 2 + 12, 250, "failed trial", 20, anchor="start"))
    b.append(arrow(bx + bw + 4, 135, 756, 215))
    b.append(text(585, 128, "included in a successful clearing", 20, anchor="middle"))
    b.append(arrow(bx + bw + 4, 345, 756, 275))
    b.append(text(585, 362, "successful clearing", 20, anchor="middle"))
    b.append(text(W - 20, H - 14, "after Figure 1 of the manuscript", 18, C["muted"], "end"))
    return svg(W, H, "\n".join(b))


def ledger():
    W, H = 1200, 420
    rows = [("proved", C["proved"], "Localization at large disorder or near the edges; extended states on trees", False),
            ("claimed", C["claimed"], "Theorem 1.1: pure absolutely continuous spectrum on I_d, d ≥ 3", False),
            ("Lean", C["lean"], "The Mathlib-only statement of Simon's Problem 1: kernel-checked", True),
            ("heuristic", C["heuristic"], "Pictures, analogies and the mean-field reading of the damping", False)]
    b = []
    for i, (lab, col, desc, s) in enumerate(rows):
        y = 40 + i * 92
        dash = ' stroke-dasharray="8 6"' if lab == "heuristic" else ''
        b.append(f'<rect x="40" y="{y}" width="{W-80}" height="72" rx="6" fill="{C["raised"]}" stroke="{col if lab=="heuristic" else C["rule"]}" stroke-width="2"{dash}/>')
        b.append(f'<rect x="40" y="{y}" width="8" height="72" fill="{col}"/>')
        b.append(text(72, y + 45, lab, 26, col, weight=600))
        if s:
            b.append(seal(140, y + 26, 16))
        b.append(text(250, y + 45, desc, 23))
    return svg(W, H, "\n".join(b))


if __name__ == "__main__":
    for name, f in [("lattice", lattice), ("energy-axis", energy_axis), ("proof-map", proof_map),
                    ("digits", digits), ("site-states", site_states), ("ledger", ledger)]:
        (OUT / f"{name}.svg").write_text(f())
        print("wrote", name)
