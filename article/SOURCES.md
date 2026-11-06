# Sources

Every work cited in `exposition.md`, with the locator used and how it was verified. Bibliographic data are in `refs.bib`. Verification was done in November 2026: journal articles through their DOI metadata (Crossref), preprints through the arXiv record, and the passages cited by number or page by reading the source itself.

## Primary sources

| Key | Work | Locators used | Verified |
|---|---|---|---|
| Simon2000 | B. Simon, *Schrödinger operators in the twenty-first century*, in *Mathematical Physics 2000*, Imperial College Press, 2000, pp. 283–288 | Example 2.1 (p. 283); spectrum $[a-2\nu,b+2\nu]$, pure point in $\nu=1$, large disorder, near the edges (p. 284); Problem 1 and the expected picture after it (p. 284); Problems 2 and 3 (p. 284) | Read in the author's scanned copy (Caltech, `SimonPapers/R40.pdf`); mp_arc 00-78 record confirms title and date |
| OpenAI2026 | OpenAI, *Absolutely Continuous Spectrum for Weak-Disorder Anderson Models in Dimensions at Least Three*, manuscript dated September 23, 2026, 93 pp., `openai/math` commit `adc7f1241b42e322a6451854ab7e4b4c146bf78a` | abstract; §1.1, eq. (1), Theorem 1.1, eq. (2); §1.2; §1.3; Corollary 1.2; §2.1, eq. (3), Proposition 2.1; §2.2, eq. (4), Lemma 2.2, Figure 1; §2.3, eq. (5); §2.4, eq. (7); Lemma 3.5, Proposition 3.6; §§4.1–4.2, Proposition 4.8; §5, Proposition 5.8; §6, Lemmas 6.1, 6.2, 6.4, 6.5, Proposition 6.6; Propositions 7.3, 7.4, 7.5; §8, Proposition 8.1, Definition 8.2, Proposition 8.3; Lemma 9.1, Proposition 9.2, proof of Theorem 1.1 | Read in the TeX source and the PDF text of the pinned commit |
| AndersonLean | Y. Xu, `anderson-ac-lean4`, v1.0.0 = `38116e1a08b2b3427f24d6043fffd5560fba6905` (2026-10-14), v1.0.1 = `37cacdb1098857d82fe71793fc0afbcf56d723f3`, v1.0.2 = `51e7e5f40bbbe47e6be3f05eb0baac3081b12969` (adds `docs/verification.md`, the record of the checks in §5.2); SWH `swh:1:snp:54653186a021ec4547ea70c275cf678e74636910` (v1.0.0), `swh:1:snp:f630e64b26d420c36bc20b08b061865ba622f929` (v1.0.1) | `AndersonAC/Challenge.lean` (`Statement`, `IsAndersonOperator`, `IsSpectralMeasure`); `AndersonAC/Blueprint/Main.lean` (`anderson_challenge`, `paperTheorem_blueprint`, `simonProblem_blueprint`); `AndersonAC/Blueprint/Target.lean` (`PaperTheorem`); `Verification/NonVacuity.lean`; `README.md` package table; `THIRD_PARTY.md` | Read in the v1.0.1 tree; module count (853) and line count (212,076 lines under `AndersonAC/`) measured on that tree |

## Literature

| Key | Work | Used for | Verified |
|---|---|---|---|
| Anderson1958 | P. W. Anderson, Phys. Rev. 109 (1958) 1492–1505, doi:10.1103/PhysRev.109.1492 | origin of the model | Crossref |
| KunzSouillard1980 | H. Kunz, B. Souillard, Comm. Math. Phys. 78 (1980) 201–246, doi:10.1007/BF01942371 | pure point spectrum in one dimension | Crossref |
| FrohlichSpencer1983 | J. Fröhlich, T. Spencer, Comm. Math. Phys. 88 (1983) 151–184, doi:10.1007/BF01209475 | multiscale analysis, large disorder or low energy | Crossref |
| FMSS1985 | J. Fröhlich, F. Martinelli, E. Scoppola, T. Spencer, Comm. Math. Phys. 101 (1985) 21–46, doi:10.1007/BF01212355 | pure point spectrum with exponential decay | Crossref |
| SimonWolff1986 | B. Simon, T. Wolff, Comm. Pure Appl. Math. 39 (1986) 75–90, doi:10.1002/cpa.3160390105 | rank-one theory, spectral averaging tradition | Crossref |
| AizenmanMolchanov1993 | M. Aizenman, S. Molchanov, Comm. Math. Phys. 157 (1993) 245–278, doi:10.1007/BF02099760 | fractional-moment localization | Crossref |
| Klein1994 | A. Klein, Math. Res. Lett. 1 (1994) 399–407, doi:10.4310/MRL.1994.v1.n4.a1 | a.c. spectrum on the Bethe lattice | Crossref |
| Klein1998 | A. Klein, Adv. Math. 133 (1998) 163–184, doi:10.1006/aima.1997.1688 | extended states on the Bethe lattice | Crossref |
| AizenmanSimsWarzel2006 | M. Aizenman, R. Sims, S. Warzel, Probab. Theory Related Fields 136 (2006) 363–394, doi:10.1007/s00440-005-0486-8 | stability of a.c. spectrum on trees | Crossref, arXiv math-ph/0502006 |
| ErdosSalmhoferYau2007 | L. Erdős, M. Salmhofer, H.-T. Yau, Ann. Henri Poincaré 8 (2007) 621–685, doi:10.1007/s00023-006-0318-0 | lattice diffusion at times $\lambda^{-2-\kappa}$ | Crossref; arXiv math-ph/0502025 abstract (time scale, heat equation, $\mathbb Z^d$) |
| ErdosSalmhoferYau2008 | L. Erdős, M. Salmhofer, H.-T. Yau, Acta Math. 200 (2008) 211–277, doi:10.1007/s11511-008-0027-2 | continuum diffusion | Crossref |
| Teschl2009 | G. Teschl, *Mathematical Methods in Quantum Mechanics*, GSM 99, AMS 2009 | Theorem 3.23 and Corollary 3.24 (boundary values of Borel transforms) | Read in the author-posted online edition (version February 12, 2009) |
| AizenmanWarzel2013 | M. Aizenman, S. Warzel, J. Eur. Math. Soc. 15 (2013) 1167–1222, doi:10.4171/JEMS/389 | resonant delocalization on trees | Crossref, arXiv 1104.0969 |
| ErdosKnowlesYauYin2013 | L. Erdős, A. Knowles, H.-T. Yau, J. Yin, Comm. Math. Phys. 323 (2013) 367–416, doi:10.1007/s00220-013-1773-3 | band-matrix precursor of the controls (as noted by the manuscript) | Crossref |
| ElgartKlein2019 | A. Elgart, A. Klein, J. Spectral Theory 9 (2019) 711–765, doi:10.4171/JST/261 | localization in an interval at the bottom of the spectrum | Crossref; arXiv 1611.02650 abstract |
| AggarwalLopatto2025 | A. Aggarwal, P. Lopatto, arXiv:2503.08949 (preprint) | mobility edge on high-degree trees | arXiv record (title, authors, date) |
| BlackDroginHernandez2025 | A. Black, R. Drogin, F. Hernández, arXiv:2506.06468 (preprint) | Gaussian Anderson model at long finite times | arXiv record |
| JaksicLastWarzel2026 | V. Jakšić, Y. Last, S. Warzel, arXiv:2609.06987 (preprint) | tree argument and conditional lattice criterion | arXiv record |

The descriptions of the three preprints follow the manuscript's §1.2 and their arXiv titles; their content was not reviewed beyond that, and the article labels them as preprints.

## Problem catalogue

- MathDB problem 389103, "Extended states in the Anderson model": `https://mathdb.com/p/389103/extended-states-in-the-anderson-model`. Its wording paraphrases Simon's sentence; the article quotes and cites Simon directly.
