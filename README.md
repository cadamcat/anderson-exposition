# Extended states in the Anderson model: an exposition

An article (16 pages) and a narrated film (9 min, in 4K, with subtitles in the picture and a quiet music bed) on Barry Simon's Problem 1 (absolutely continuous spectrum for the Anderson model in dimensions three and higher), on the claimed proof in OpenAI's 2026 manuscript, and on what the Lean formalization `anderson-ac-lean4` checks.

Prepared by Yao Xu with AI assistance; the narration voice is synthesized with an OpenAI speech model.

## Status of the result

- **Simon's Problem 1** (B. Simon, *Schrödinger operators in the twenty-first century*, 2000, Example 2.1 and Problem 1) asks for purely absolutely continuous spectrum in some energy range, for $\nu\ge3$ and suitable disorder widths.
- **Claimed:** Theorem 1.1 of OpenAI, *Absolutely Continuous Spectrum for Weak-Disorder Anderson Models in Dimensions at Least Three* (manuscript dated September 23, 2026). The manuscript has not been independently refereed.
- **Checked in Lean:** a Mathlib-only statement of Simon's problem for the uniform model, derived from Theorem 1.1, is proved in [anderson-ac-lean4](https://github.com/cadamcat/anderson-ac-lean4) v1.0.0 with only the standard axioms `propext`, `Classical.choice`, `Quot.sound`. Section 5 of the article states exactly what this does and does not certify.

## Contents

| Path | What it is |
|---|---|
| `article/exposition.md` | the article (Markdown with LaTeX math; the PDF is built from it) |
| `article/CLAIMS.md` | every claim of the article with its source and status (proved, claimed, Lean, heuristic, record) |
| `article/SOURCES.md` | every citation with its locator and how it was verified |
| `article/figures/` | the figures as SVG and their generator |
| `film/script.md` | the narration, beat by beat, with the claim status of each beat |
| `film/narration.txt`, `film/subtitles.srt` | the spoken text and the subtitles of the whole film |
| `film/audio/*.beats.json` | word timings of the narration, which set the timing of every scene |
| `film/audio/narration.json`, `film/audio/instructions.txt`, `film/audio/takes.json` | length and checksum of each chapter's narration; the delivery text the voice was given; the take used for each passage |
| `film/scenes/` | the scenes: HTML/SVG pages whose picture is a function of time; `film/scenes/paper/` holds the manuscript's pages (see [THIRD_PARTY.md](THIRD_PARTY.md)) |
| `film/tools/` | narration (`narrate.py`, `narration_flac.py`), assembly with the music bed (`assemble.py`, `music_bed.py`), the film checks, and the generators of the manuscript pages and the Lean text |
| `studio/` | the scene components, render and check tools, pinned |

Attached to the release, not stored in Git:

| File | What it is |
|---|---|
| `anderson-exposition-film-4k.mp4` | the film, 3840×2160 (the 1920×1080 layout rendered at twice the pixel density), with the subtitles in the picture; their text is `film/subtitles.srt` |
| `anderson-exposition-narration.flac` | the narration (voice only), lossless, all seven chapters in order; the film is rebuilt from it, and the build adds the music bed |
| `anderson-exposition-article.pdf` | the article |

The narration was synthesized once, passage by passage, with the settings in `film/tools/narrate.py` and `film/audio/instructions.txt`; word timings come from automatic transcription of that audio, mapped onto the script. The music bed is composed in code (`film/tools/music_bed.py`, fixed seed) and mixed under the narration when the film is joined. The build reuses the saved narration and does not call the speech service.

## Rebuild

Requirements: Node.js 20 or later, Python 3.12 with the packages in `studio/requirements.txt` (`python3 -m pip install -r studio/requirements.txt`; `PYTHON=...` selects another interpreter for `build.sh`), ffmpeg, pandoc 3 with XeLaTeX (TeX Live with the Libertinus and GNU FreeFont fonts).

```sh
cd studio && npm ci && npx playwright install chromium     # pinned versions from package-lock.json
cd ..
./build.sh article                                          # article/build/exposition.pdf
./build.sh narration anderson-exposition-narration.flac     # film/audio/c1..c7.wav, checked against narration.json
./build.sh film             # renders every chapter at 4K, runs the checks, joins film/out/film-4k.mp4 (and film-1080p.mp4, a downscaled copy for qc_strip.py)
```

Every scene is deterministic: a frame depends only on its time, and a full rebuild reproduces the frames byte for byte (a single frame rendered on its own can differ in edge anti-aliasing by a few pixels). `./build.sh narration` restores the chapter audio from the FLAC file and refuses audio that differs from the recorded checksums. `./build.sh film` also runs every scene check. From `film/`, `python3 tools/qc_strip.py` checks the status strip of the finished film against the script, `python3 tools/check_needs.py` checks that every timed motion a scene declares finishes before its beat ends, and `python3 tools/check_cues.py` that every picture cue is a word spoken in its beat.

## Licences

- Article, film, script, narration text, subtitles and figures: [CC BY 4.0](LICENSE-CC-BY-4.0.txt).
- Code (studio components, scenes, build scripts): [Apache-2.0](LICENSE-APACHE-2.0.txt).
- The pages of OpenAI's manuscript shown in the film (`film/scenes/paper/`) are from `openai/math` under the Apache License 2.0; see [THIRD_PARTY.md](THIRD_PARTY.md).
- Third-party components keep their own licences: KaTeX (MIT), Playwright (Apache-2.0), Source Sans 3 and JetBrains Mono (SIL Open Font License 1.1). They are installed by the commands above, not copied here.
