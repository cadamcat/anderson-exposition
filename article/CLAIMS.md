# Claims of the article: sources and status

Each mathematical or factual claim of the article, its source, and its status: **proved** (peer-reviewed literature or textbook), **claimed** (manuscript, not independently reviewed), **Lean** (checked by the Lean kernel in the stated form), **heuristic** (explanation only), or **record** (a fact about software, documents or checks, verified from the record named). Section numbers refer to the article. Manuscript locators are to OpenAI2026 at commit `adc7f124`; Lean declarations are in `anderson-ac-lean4` v1.0.1 (proofs identical to v1.0.0).

| # | Article | Claim | Source | Status |
|---|---|---|---|---|
| 1 | Summary, 1.3 | Simon's Problem 1 asks, for $\nu\ge3$ and suitable $b-a$, for purely a.c. spectrum in some energy range | Simon2000 p. 284 | record |
| 2 | 1.1 | Simon's operator $h_\omega$ with i.i.d. uniform $[a,b]$ potentials | Simon2000 Example 2.1, p. 283 | record |
| 3 | 1.1 | Almost surely $\sigma(h_\omega)=[a-2\nu,b+2\nu]$ | Simon2000 p. 284 (stated as known) | proved |
| 4 | 1.1 | Manuscript model $H_{\lambda,\omega}=-A+\lambda V$, $V$ uniform $[-1,1]$ | OpenAI2026 eq. (1) | record |
| 5 | 1.1 | $h_\omega\cong H_{\lambda,\omega}+c$ with $\lambda=(b-a)/2$, $c=(a+b)/2$, via $(-1)^{x_1+\dots+x_d}$ | OpenAI2026 §1.1 (sign); elementary (affine law); Lean `Packages.lawTransport`, `signTransport`, `challengeBridge` | proved (elementary) and Lean |
| 6 | 1.2 | Lebesgue decomposition of spectral measures; definitions of purely a.c. and nontrivial | standard | proved |
| 7 | 1.2 | RAGE / transport interpretation of spectral types | standard physics reading | heuristic |
| 8 | 1.2 | $\mathrm{Im}\,F(E+i0)$ is $\pi\times$ a.c. density; singular part where it is infinite; criterion via finite $\limsup$ | Teschl2009 Theorem 3.23, Corollary 3.24 | proved |
| 9 | 1.3 | Simon's expected picture (a.c. subinterval, dense pure point complement, shrinking with $b-a$); "any a.c. spectrum would cause a stir" (paraphrase) | Simon2000 p. 284 | record |
| 10 | 1.3 | Problems 2 and 3 as stated | Simon2000 p. 284 | record |
| 11 | 2.1 | Pure point spectrum for every disorder in $d=1$ | KunzSouillard1980; Simon2000 p. 284 | proved |
| 12 | 2.1 | Localization at large disorder or near spectral edges, all $d$ | FrohlichSpencer1983; FMSS1985; AizenmanMolchanov1993 | proved |
| 13 | 2.1 | Simon–Wolff rank-one theory converts Green-function decay to pure point spectrum | SimonWolff1986 | proved |
| 14 | 2.1 | Localization in an interval at the bottom of the spectrum at fixed disorder, laws including uniform | ElgartKlein2019 (abstract; Theorem 2.2 and Corollary 1.8 as used in OpenAI2026 Corollary 1.2 proof) | proved |
| 15 | 2.2 | a.c. spectrum at weak disorder on the Bethe lattice | Klein1994; Klein1998 | proved |
| 16 | 2.2 | Stability of a.c. spectrum on trees; resonant delocalization | AizenmanSimsWarzel2006; AizenmanWarzel2013 | proved |
| 17 | 2.2 | Mobility edge on high-degree trees; tree argument and conditional lattice criterion | AggarwalLopatto2025; JaksicLastWarzel2026 (preprints, described as such) | claimed (preprints) |
| 18 | 2.3 | Diffusion at times $\lambda^{-2-\kappa}$, heat equation for the expected Wigner distribution, on $\mathbb Z^d$ and in the continuum | ErdosSalmhoferYau2007, 2008 | proved |
| 19 | 2.3 | Gaussian model at long finite times | BlackDroginHernandez2025 (preprint) | claimed (preprint) |
| 20 | 2.4 | Tree recursion for $G_{00}$ closes; loops on $\mathbb Z^d$ prevent it | standard; description only | heuristic |
| 21 | 2.4 | Time $T\leftrightarrow$ damping $1/T$; finite-time results reach $\eta\approx\lambda^{2+\kappa}$ | interpretation | heuristic |
| 22 | Fig. 2 | Energy axis: spectrum $[-2d-\lambda,2d+\lambda]$, $J$ pure point (proved), $I_d$ above $-2d$ (claimed) | OpenAI2026 Theorem 1.1, Corollary 1.2 and its proof (ElgartKlein2019 eq. (1.17)) | proved / claimed as labelled |
| 23 | 3 | Theorem 1.1 statement, $I_d$, $\lambda_d=\sqrt3\,2^{-n_*(d)}$ | OpenAI2026 Theorem 1.1, eq. (2), Definition 8.2 | claimed |
| 24 | 3 | Interval independent of $\lambda$; event depends on coupling; nothing uniform in $d$; threshold not effective | OpenAI2026 §1.1 (paragraph after Theorem 1.1) | claimed |
| 25 | 3 | Corollary 1.2 (coexistence); not formalized | OpenAI2026 Corollary 1.2; Lean tree has no such declaration | claimed |
| 26 | 4.1 | Scales $n_0,s_n,\eta,t_n$, torus $L=4^{20m}$ | OpenAI2026 eq. (3) | record |
| 27 | 4.1 | Finite-volume certificate | OpenAI2026 Proposition 2.1; Lean `Packages.certificates` | claimed; Lean (as formalized) |
| 28 | 4.2 | Binary-digit representation; remainder after $h$ digits uniform with variance $\lambda^24^{-h}/3$; equals $s_n$ after $n-n_0$ digits | OpenAI2026 eq. (4) and §2.2; checked by hand: $\sum_{k>h}\lambda^24^{-k}=\lambda^24^{-h}/3$; Lean `Packages.binary` | proved (elementary) |
| 29 | 4.2 | Unrevealed remainder replaced by damping $t_n$; final damping $\eta=s_m$ with complete true potentials | OpenAI2026 §§2.1–2.3, §8.3 | claimed |
| 30 | 4.2 | Self-energy / mean-field reading of $r_i=g_{ii}$ | ours | heuristic |
| 31 | 4.3 | Active/terminal split; Schur complement at real $E$; state $g,h,K,F,q$ | OpenAI2026 §2.3 | record (definitions) |
| 32 | 4.3 | Ward identity $h\,\mathrm{diag}(p)h^*=\mathrm{Im}\,g$, $Fp=q$ | OpenAI2026 eq. (5); derivation checked by hand in the article; Lean `Packages.ward` | proved (elementary) |
| 33 | 4.3 | $\partial g_{ii}/\partial r_j=K_{ij}$; linearization $I-K$; carried bounds $\|K\|\le1/3$, row fourth moments $\le t^{1+\delta}$, $\delta=0.01$ | OpenAI2026 §2.3–2.4 | claimed (bounds); derivative elementary |
| 34 | 4.3 | $D$ is a graph Laplacian with weights $p_ip_jF_{ij}$; comparisons with $\Lambda$ | OpenAI2026 §2.3, eq. (7) | claimed (comparisons); Laplacian structure elementary |
| 35 | 4.3 | Related controls in BDH and EKYY | OpenAI2026 §1.3 | record (manuscript's attribution) |
| 36 | 4.4 | Scalar equation for $r$; change of variables $x_j=2\sin(k_j/2)$; smooth positive density; initial bounds $\|K\|\le1/10$, fourth moments $\le t^{1+\delta}/10$ | OpenAI2026 Lemma 3.5, Proposition 3.6; Lean `Packages.initialization` | claimed; Lean (as formalized) |
| 37 | 4.5 | Sweeps: one digit per stage; ports and deletion; Proposition 4.8 estimates | OpenAI2026 §§4.1–4.2, Proposition 4.8; Lean `Packages.concentration`, `deletion` | claimed; Lean |
| 38 | 4.5 | Tile trials, rollback, pending marks, auxiliary digits; Proposition 5.8 | OpenAI2026 §1.3, §2.2, §5, Proposition 5.8 | claimed |
| 39 | 4.5 | Conditional freshness at stopping times | OpenAI2026 Lemma 2.2 | claimed |
| 40 | Fig. 5 | Site-state transitions | OpenAI2026 Figure 1 | record |
| 41 | 4.6 | Clearing: scattering matrix, cross-block range, Lemmas 6.1, 6.2, 6.4, 6.5, Proposition 6.6 | OpenAI2026 §6; Lean `Packages.scattering` | claimed; Lean |
| 42 | 4.7 | Assembly, diagonal reset, uniform stage bounds | OpenAI2026 Propositions 7.3–7.5; Lean `Packages.reset` | claimed; Lean |
| 43 | 4.8 | Failure histories, cutoff at $J=\lfloor m/2\rfloor$, final sweep, threshold | OpenAI2026 §2.3 (stage rules), Proposition 8.1, Definition 8.2, Proposition 8.3 | claimed |
| 44 | 4.8 | Three places where dimension enters | OpenAI2026 §1.3 | claimed |
| 45 | 4.9 | Proposition 9.2 (conditional transfer), Lemma 9.1 (own-site averaging), four steps | OpenAI2026 Lemma 9.1, Proposition 9.2 and §9 paragraphs; Lean `Packages.spectral`, `boundary`, `averaging`, `readout`, `purity` | claimed; Lean |
| 46 | 4.9 | Proof of Theorem 1.1 from Proposition 2.1 ($d=3$) and the threshold ($d\ge4$) | OpenAI2026 proof of Theorem 1.1 (§9); Lean `paperTheorem_blueprint` | claimed; Lean |
| 47 | 5.1 | Manuscript date, repository and commit; abstract's "settles" claim; not refereed to our knowledge | OpenAI2026 title page and abstract; project records | record |
| 48 | 5.2 | v1.0.0 commit and date; 853 modules, about 212,000 lines; Lean 4.34.1, Mathlib `d13f23b7`, OAI `adc7f124`; v1.0.1 changes comments and adds non-vacuity only | `anderson-ac-lean4` tree and tags; `lake-manifest.json`; `lean-toolchain`; release records (comment diff) | record |
| 49 | 5.2 | Final theorem name and type; `Challenge.lean` imports only Mathlib | `AndersonAC/Blueprint/Main.lean`, `AndersonAC/Challenge.lean` | Lean / record |
| 50 | 5.2 | Check table: clean build; axioms; `leanchecker --fresh`; Comparator with nanoda; `2 ≤ d` control rejected; non-vacuity | post-release check record of 2026-10-14 (fresh clone of the tag; logs `build.log`, `axioms.txt`, `leanchecker.log`, `comparator2-challenge.log`, `comparator2-tampered.log`, `nonvacuity.log`) | Lean / record |
| 51 | 5.2 | `PaperTheorem` is Theorem 1.1 in OAI vocabulary with fixed window and threshold | `AndersonAC/Blueprint/Target.lean` | Lean (statement reviewed at source level) |
| 52 | 5.2 | One literal omission: Lemma 6.2 needs $t\le1$; formal statement adds it; no other discrepancy recorded | project manuscript-issues ledger (entry 1); `AndersonAC.S6.range_localization` | record |
| 53 | 5.3 | Internal statement review: faithful with notes | statement review record of 2026-10-14 | record (internal, not peer review) |
| 54 | 5.3 | Exported type lets the interval depend on width; fixed interval in internal declarations | `Challenge.lean` quantifier order; `Bridge/Bridge.lean`; statement review | Lean / record |
| 55 | 6.1 | `IsAndersonOperator` reading; existence, uniqueness, self-adjointness proved in the repository | `Challenge.lean`; `Bridge/Operator.lean` | Lean |
| 56 | 6.1 | Moment definition determines the spectral measure (geometric moment growth) | standard (compact support ⇒ determinate); `Bridge/Characterization.lean` | proved; Lean |
| 57 | 6.1 | Pinned Mathlib has no construction of spectral measures for bounded self-adjoint operators on infinite-dimensional spaces | feasibility probe of 2026-10-13 (searches of the pinned Mathlib); the repository ports a Borel functional calculus for this reason | record |
| 58 | 6.2 | Clause table | `Challenge.lean` vs Simon2000, OpenAI2026 Theorem 1.1 | Lean / record |
| 59 | 6.2 | Universal probability space equals product law for independent fixed marginals; bridge proves it | standard; `Packages.lawTransport` | proved; Lean |
| 60 | 6.2 | Lean spectrum is complex Banach-algebra spectrum; self-adjoint spectrum real; moments real | Mathlib `spectrum`; standard | proved |
| 61 | 6.3 | Proof chooses $E_i=(a+b)/2+$ endpoints of $I_d$; exported type omits $e_2$, explicit $I_d$, threshold | `Bridge/Bridge.lean` (`challengeBridge`), `Blueprint/Target.lean` | Lean / record |
| 62 | 7 | Open: mobility edge, diffusion, $d=2$, other laws, effective constants, review of text | Simon2000 p. 284; OpenAI2026 §1.1–1.2 | record |
| 63 | 8 | Attribution: OpenAI's library supplies definitions but no proof of the theorem; LeanPool and Tau Ceti ports | `THIRD_PARTY.md`; feasibility probe of 2026-10-13 (OAI `Certificates.lean` contents) | record |
| 64 | App. A | Section-to-package map | `README.md` package table and module paths of the Lean tree | record |
| 65 | App. B | Commands; SWH snapshot identifiers | `README.md`; release records | record |

## Checks performed on the article

- Every citation key resolves in `refs.bib` (the PDF build has no unresolved citations).
- Formulas proofread against the manuscript: eqs. (1)–(5), Proposition 2.1, Proposition 3.6, Lemma 9.1, Theorem 1.1 and the scales; the Ward identity and $\partial g_{ii}/\partial r_j=K_{ij}$ re-derived by hand.
- No claim calls the problem solved without "claimed" or "as formalized in Lean"; no wording implies peer review of the manuscript.
- Quotations from sources are at most a short phrase; Simon's problem and remarks are paraphrased.
