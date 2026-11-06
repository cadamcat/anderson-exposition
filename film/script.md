# Script: Extended states in the Anderson model

Narration written for the ear: short sentences, one idea per sentence, formulas said the way a lecturer says them at the board. Each beat is one line: `- **id** `status` text`. Status is one of `definition`, `context`, `proved`, `claimed`, `heuristic`, `lean` and sets the status strip. The subtitles use exactly these words.

The voice reads one passage per chapter (chapters 4 and 6 in two halves); a line `<!-- passage -->` starts a passage. Beats on consecutive lines form one paragraph; a blank line starts a new paragraph. The voice is asked to pause naturally between paragraphs (`audio/instructions.txt`), and every pause in the film is the voice's own. Picture time comes from build-ups under the narration. Where a scene declares that a motion needs more time than the voice gives (`need("beat", "word", seconds, "reason")` in its `scene.js`, with the duration the animation itself uses), `tools/narrate.py` lengthens the natural pause at the end of that beat by exactly the missing time.

Notation, each symbol defined once: `d` dimension; `H` the operator; `u` a wave; `n` a site; `V(n)` the energy of site `n`; `[a, b]` the range of the energies; `λ` half the width `b − a`; `z = E + iη` an energy `E` with damping `η`; `G` the Green function; `κ` a small positive exponent; `I_d` the interval of Theorem 1.1; `δ` the width bound of the Lean statement.

On-screen end card (not spoken): the references, then "Prepared by Yao Xu with AI assistance; the narration voice is synthesized with an OpenAI speech model."

## c1 · Cold open

<!-- passage -->
- **c1b1** `heuristic` Give every site of a three-dimensional grid its own random energy. Here we show one layer.
- **c1b2** `heuristic` Now release a quantum wave. When the disorder is strong, the wave stays where it started.
- **c1b3** `heuristic` But when the disorder is weak, in three or more dimensions, some waves should travel forever.

- **c1b4** `context` Proving this has long resisted mathematics. Here is a claimed proof, and what a proof checker has verified.

## c2 · The question

<!-- passage -->
- **c2b1** `definition` The setting is the Anderson model. The sites form the integer lattice in d dimensions. A wave assigns a number to every site.
- **c2b2** `definition` The operator H acts on a wave u. At each site n, it adds up the values of u at the neighbours of n.
- **c2b3** `definition` Then it adds V of n, times u of n. Here V of n is the energy of site n.

- **c2b4** `definition` The energies are independent random numbers, uniform between a and b. The width, b minus a, measures the disorder. We call half the width lambda.

- **c2b5** `definition` Every wave has a spectral measure. It spreads the wave's weight over the energies.
- **c2b6** `definition` Point masses are eigenvalues; their eigenvectors are bound states. The part with a density is the absolutely continuous part. It is carried by states that spread through the lattice.

- **c2b7** `context` In the year two thousand, Barry Simon listed this as Problem one. In three or more dimensions, for suitable disorder, prove purely absolutely continuous spectrum in some range of energies.
- **c2b8** `definition` Purely means no eigenvalues, and no singular part, in that range. And the range must lie in the spectrum, with nonzero weight.

## c3 · Why it is hard

<!-- passage -->
- **c3b1** `proved` Every proved result about the kind of spectrum on the lattice pointed the other way. In one dimension, all states are localized. In any dimension, strong disorder gives localization too, and so do energies near the edge of the spectrum.
- **c3b2** `proved` Extended states had been proved only on trees, such as the Bethe lattice. That was the work of Abel Klein, in the nineteen nineties.

- **c3b3** `definition` The main tool is the Green function, G of z. It is the inverse of H minus z. Here z is an energy E, plus a small imaginary part, eta. Eta acts as a damping.

- **c3b4** `heuristic` On a tree, removing one site splits the graph into independent branches. So the Green function at that site obeys an exact recursion, in terms of the branches.
- **c3b5** `heuristic` On the lattice, loops tie the neighbours back together. No such equation closes.

- **c3b6** `proved` Perturbation theory follows the wave for long, but finite, times, of order lambda to the minus two minus kappa. Here kappa is a small positive number. As the disorder goes to zero, after rescaling, the averaged density of the wave spreads like heat over those times. That is the work of Erdős, Salmhofer and Yau.
- **c3b7** `heuristic` Following a wave up to some time is comparable to damping the Green function by one over that time. So these results correspond to a damping of about lambda to the two plus kappa.
- **c3b8** `heuristic` But spectral type is a statement about all times. The damping must go to zero, at fixed disorder. That last limit is the obstacle.

## c4 · The idea of the proof

<!-- passage -->
- **c4b1** `claimed` In September twenty twenty-six, OpenAI posted a manuscript of ninety-three pages. It claims a proof for the uniform model, in every dimension from three up. It has not been independently refereed.
- **c4b2** `claimed` Its Theorem one point one centres the energies, so they lie between minus lambda and lambda. For small enough lambda, almost surely, a fixed interval just above the bottom of the band lies in the spectrum. And there, the spectrum is purely absolutely continuous.

- **c4b3** `claimed` Here is the plan of the argument, as a map. Each box is a stage, and we will visit them in order. Everything aims at one finite certificate.
- **c4b4** `claimed` The certificate lives on a large periodic box. Add a tiny damping on at least half of the sites. Then the Green function at those sites keeps an imaginary part bounded below, however large the box. And the damping shrinks as the box grows.
- **c4b5** `heuristic` A lower bound that survives as the damping goes to zero is the signature of absolutely continuous spectrum.

- **c4b6** `claimed` To build the certificate, the construction starts with no disorder at all. Then it reveals each random energy one binary digit at a time. Each digit is a fair coin, and moves the energy up or down by half the previous step.
- **c4b7** `heuristic` The digits not yet revealed are replaced by a damping, of the same size as their variance. It is a mean-field stand-in for the hidden disorder. Each revealed digit trades damping for true randomness.

<!-- passage -->
- **c4b8** `claimed` Three controls are carried through every stage. First, at the end of each stage, the damping at each site must match the Green function it produces. That self-consistent equation can be restored, because its feedback stays below one third, together with further bounds.
- **c4b9** `claimed` Second, no row of the Green function concentrates on a few sites. So no single update can move much.
- **c4b10** `claimed` Third, an exact identity, the Ward identity, turns the Green function into a weighted graph. Its Laplacian adds up many small local changes into one bound.

- **c4b11** `claimed` Updates are tested on finite tiles. A failed trial is rolled back. Its sites are marked pending.
- **c4b12** `claimed` Later, small clusters of pending sites are cleared. A scattering matrix identifies the directions through which a cluster reaches the sites around it. When those directions carry only weak weight at every remaining site, completing the cluster changes the rest only a little.
- **c4b13** `claimed` With high probability, nothing is pending at the end. The last digits go in, and the certificate holds.

- **c4b14** `claimed` A final spectral argument reads the certificate. It gives absolutely continuous spectrum on the interval, almost surely, with no eigenvalues and no singular part. That is Theorem one point one.

## c5 · The ledger

<!-- passage -->
- **c5b1** `context` So what is established? Here is the ledger.
- **c5b2** `proved` Proved, and peer reviewed: localization, in one dimension and at strong disorder. Extended states on trees. And diffusion up to long, finite times, in a scaling limit.
- **c5b3** `claimed` Claimed: the manuscript itself. Its text has not been refereed.
- **c5b4** `lean` Checked by the Lean proof assistant: the whole argument, formalized from start to finish. It proves Theorem one point one, and from it, a precise statement of Simon's problem.
- **c5b5** `heuristic` And the pictures in this film are explanations, including the mean-field reading of the damping. They prove nothing.

- **c5b6** `context` In short: Simon's Problem one, as formalized in Lean, has a complete machine-checked proof. The manuscript behind it is still unrefereed.

## c6 · What Lean checked

<!-- passage -->
- **c6b1** `lean` Here is the plan again. Every box is formalized in Lean, and every step is proved. A blue seal marks a proved box.
- **c6b2** `lean` Two boxes follow Theorem one point one. The first restates it in Simon's conventions. The second is Simon's problem, stated with Mathlib alone, the standard library of formal mathematics.
- **c6b3** `lean` In all, the proof has eight hundred and fifty-three files, with no unfinished steps.

- **c6b4** `lean` Now the final statement, clause by clause. In every dimension d of at least three, there is a width bound, delta.
- **c6b5** `lean` For every interval from a to b narrower than delta, there is an open energy interval, from E one to E two.
- **c6b6** `lean` Take any independent family of energies, uniform on a to b. Then, almost surely, the operator exists,
- **c6b7** `lean` the energy interval lies in its spectrum, every spectral measure is absolutely continuous there, and some wave has nonzero weight there.

<!-- passage -->
- **c6b8** `lean` The final theorem uses only Lean's three standard axioms. Lean's replay tool checked every step again, from scratch. And nanoda, an independently written checker, confirmed that the proved statement matches an independent copy.
- **c6b9** `lean` In a control, two replaces three. Then the statement no longer matches the one proved. The proof covers three dimensions and up.
- **c6b10** `lean` Formalizing every step found one literal omission in the manuscript. Its Lemma six point two needs the damping scale to be at most one. That holds wherever the lemma is used.

- **c6b11** `context` What does the check not certify? That these definitions say what we claim; you can judge that by reading them. The correctness of the library's own definitions. And every sentence of the manuscript.
- **c6b12** `context` One more caution. The exported statement lets the energy interval depend on the width, b minus a. Theorem one point one fixes the interval, just above the bottom of the band. That fixed form is proved too, but it is stated in the terms of OpenAI's Lean library, not Mathlib alone.

## c7 · What remains open

<!-- passage -->
- **c7b1** `context` Even granting the theorem, much remains open. The full mobility edge. Quantum diffusion. Two dimensions. Other random laws. And explicit constants.

<!-- The recording of this passage continues with the paragraph below, which the film does not use;
     tools/narrate.py cuts the audio in the voice's pause after "constants." (recorded tail). -->
<!-- recorded-tail: The manuscript is OpenAI's, published under an open licence. The formalization and this film are by Yao Xu. The accompanying article gives every source. -->
