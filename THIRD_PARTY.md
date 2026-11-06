# Third-party material

## Pages of the OpenAI manuscript

`film/scenes/paper/` holds images of the pages of OpenAI, *Absolutely Continuous Spectrum for Weak-Disorder Anderson Models in Dimensions at Least Three*, manuscript dated September 23, 2026, 93 pages, from the repository `openai/math` at commit `adc7f1241b42e322a6451854ab7e4b4c146bf78a`, which is published under the Apache License 2.0 (copy: [LICENSE-APACHE-2.0.txt](LICENSE-APACHE-2.0.txt)).

- `thumbs/p001.png` … `thumbs/p093.png`: every page, rasterised at 40 dpi and reduced to an ink mask (alpha channel only).
- `p001.svg`, `p003.svg`, `p052.svg`: the title page, the page with Theorem 1.1 and the page with Lemma 6.2, as vector drawings.
- `pages.json`: the page count and the highlighted regions, found in the text layer.

Changes: the pages were converted from the PDF by `film/tools/paper_pages.py` (poppler `pdftoppm`, `pdftocairo`, `pdftotext`). The film draws them as masks in the house colours, so the text appears pale on the paper ground; the content of the pages is not altered. The film shows them as an object (the stack of 93 pages, the title page, Theorem 1.1 and Lemma 6.2); it does not reproduce the manuscript for reading.

## Lean source and build output

`film/scenes/c6/leantext.js` quotes `AndersonAC/Blueprint/Main.lean` of [anderson-ac-lean4](https://github.com/cadamcat/anderson-ac-lean4) v1.0.0 and six lines of the axiom report of its release build log, written by `film/tools/lean_text.py`. anderson-ac-lean4 is published under the Apache License 2.0; its own `THIRD_PARTY.md` credits the code it ports.

## Installed, not copied

KaTeX (MIT), Playwright (Apache-2.0), Source Sans 3 and JetBrains Mono (SIL Open Font License 1.1) are installed by the commands in `README.md`.
