# AGENT.md

## Purpose

This file is the persistent engineering log for the `code-vis` project.
It records why the project exists, how the current architecture is organized, what has been implemented so far, and what verification has been run.

This file should be updated whenever the project changes in a meaningful way.

## Project Goal

Build a Remotion-based template system for code and algorithm visualization videos.

The project is intended to support:
- science communication videos
- teaching videos
- developer education videos

The architecture is designed around:
- reusable scene-level templates
- a typed TypeScript DSL for authoring
- theme and motion customization
- separable UI/component responsibilities

## Current Repository State

This repository started from an empty directory on 2026-03-24.

It is currently:
- a local project directory
- not a Git repository
- implemented as a fresh Remotion project scaffold

## Architecture Snapshot

### Content layer

The author-facing API is a TypeScript DSL:
- `defineVideo(...)`
- scene objects for `chapter`, `code`, and `algorithm`

The DSL is implemented in:
- `src/core/dsl.ts`
- `src/core/types.ts`

### Presentation layer

Reusable scene and layout components are split by function:
- `src/components/layout/Stage.tsx`
- `src/components/scenes/ChapterScene.tsx`
- `src/components/scenes/CodeScene.tsx`
- `src/components/scenes/AlgorithmScene.tsx`
- `src/components/composition/VideoComposition.tsx`

### Visualization layer

Current visualization adapters:
- `src/components/visualizers/ArrayVisualizer.tsx`
- `src/components/visualizers/GraphVisualizer.tsx`
- `src/components/visualizers/TreeVisualizer.tsx`
- `src/visualizers/build-visualization-model.ts`
- `src/visualizers/array-state-style.ts`

The structure now uses a graph-backed abstraction:
- arrays are rendered from DSL-defined per-item states and state-style maps
- trees are rendered via a tree-specialized visualizer on top of graph semantics
- general graph support exists at the state/model layer but is not yet a polished template

### Theme and motion layer

Theme tokens and merge logic are separated from scene code:
- `src/themes/default-theme.ts`
- `src/themes/create-theme.ts`

Animation primitives currently start with:
- `src/components/primitives/Reveal.tsx`

### Entry and examples

Registered example compositions:
- `CodeWalkthrough`
- `SortingAlgorithm`
- `QuickSortAlgorithm`
- `TreeTraversal`
- `GraphTraversal`
- `SlidingWindowSequence`
- `StringMatchingSequence`

Defined in:
- `src/examples/code-walkthrough.ts`
- `src/examples/sorting-algorithm.ts`
- `src/index.tsx`

## Iteration Log

### 2026-03-24 - Initial implementation

Starting point:
- empty directory
- no git metadata
- no Remotion scaffold

Work completed:
- created `package.json`, `tsconfig.json`, `vitest.config.ts`
- installed Remotion, React, TypeScript, and Vitest dependencies
- added tests for:
  - video duration derivation
  - scene timeline accumulation
  - theme override merging
  - composition registration
- implemented the core DSL and shared type system
- implemented a default theme and theme override helper
- implemented reusable scene components for:
  - chapter scenes
  - code explanation scenes
  - algorithm scenes
- implemented an array visualization component for algorithm playback
- registered two example Remotion compositions
- resolved a JSX entrypoint issue by moving the root entry file from `src/index.ts` to `src/index.tsx`
- resolved Remotion bundler alias issues by switching runtime imports from `@/...` aliases to relative imports
- added TypeScript compatibility config for current compiler deprecation handling

Key design decisions made during this iteration:
- authoring is centered on a typed TS DSL instead of raw JSON
- code walkthroughs and algorithm visualizations are first-class siblings
- scene orchestration, theme tokens, and visualization adapters are kept separate
- first release targets `16:9`
- default theme should be visually opinionated, but implementation remains configurable

## Verification History

### 2026-03-24

Verification run after implementation:
- `npm test`
  - result: passed
  - evidence: 4 test files passed, 4 tests passed
- `npm run typecheck`
  - result: passed
- `npm run build`
  - result: passed
  - output directory: `build/`

Verification run after tree visualization support:
- `npm test`
  - result: passed
  - evidence: 5 test files passed, 6 tests passed
- `npm run typecheck`
  - result: passed

Verification run after graph foundation support:
- `npm test`
  - result: passed
  - evidence: 6 test files passed, 7 tests passed
- `npm run typecheck`
  - result: passed

Verification run after sequence foundation support:
- `npm test`
  - result: passed
  - evidence: 7 test files passed, 9 tests passed
- `npm run typecheck`
  - result: passed

Verification run after motion foundation support:
- `npm test`
  - result: passed
  - evidence: 8 test files passed, 11 tests passed
- `npm run typecheck`
  - result: passed

Verification run after range motion support:
- `npm test`
  - result: passed
  - evidence: 9 test files passed, 13 tests passed
- `npm run typecheck`
  - result: passed

Verification run after motion polish:
- `npm test`
  - result: passed
  - evidence: 10 test files passed, 16 tests passed
- `npm run typecheck`
  - result: passed

Verification run after edge sweep support:
- `npm test`
  - result: passed
  - evidence: 11 test files passed, 17 tests passed
- `npm run typecheck`
  - result: passed

Verification run after full bubble sort example expansion:
- `npm test`
  - result: passed
  - evidence: 12 test files passed, 18 tests passed
- `npm run typecheck`
  - result: passed
- `npm run build`
  - result: passed

Verification run after DSL timing support:
- `npm test`
  - result: passed
  - evidence: 13 test files passed, 19 tests passed
- `npm run typecheck`
  - result: passed
- `npm run build`
  - result: passed

Verification run after compare handoff support:
- `npm test`
  - result: passed
  - evidence: 14 test files passed, 20 tests passed
- `npm run typecheck`
  - result: passed
- `npm run build`
  - result: passed

## Known Limitations

- array and tree visualization are implemented
- graph visualization foundation is implemented with a BFS example, but advanced graph-algorithm presentation patterns are not yet built
- general sequence visualization is implemented for array-content and string-content algorithms
- basic reusable motion primitives are implemented for reorder and focus transitions
- range-based sequence motion is implemented for sliding windows and substring-style overlays
- motion styling includes reorder lift, focus spotlight, and moving range labels
- graph/tree path progression includes progressive edge reveal highlights
- sorting example now includes a full 10-element bubble sort walkthrough
- algorithm scenes now support DSL-level timing weights for compare/swap/finale pacing
- array scenes now support DSL-defined item states, state-style maps, and per-step state-transition timing
- the project is not under git version control yet
- runtime code uses relative imports because Remotion bundling did not resolve the `@/...` alias by default

## Maintenance Rules

When making future changes, update this file in the same task if any of the following happen:
- architecture changes
- public authoring API changes
- new scene types are added
- new visualizers are added
- theme or motion conventions change
- verification commands or outcomes change
- major bugs are fixed that affect authoring or rendering behavior

Each update should append:
- date
- what changed
- why it changed
- what verification was run

If a future change invalidates any section above, correct the section instead of only appending a note.

### 2026-03-24 - Documentation pass

Work completed:
- added `README.md` as the primary author and developer onboarding document
- documented:
  - setup commands
  - build and render commands
  - the TypeScript DSL authoring model
  - how to add a new video spec

### 2026-03-24 - Compare handoff regression fix

Work completed:
- added a render-level regression test for `ArrayVisualizer` compare handoff completion
- fixed the leaving-column visual state so fade-out styles only apply while handoff is active
- ensured completed handoffs return leaving bars to the normal base style before the next swap or compare begins
- narrowed compare handoff so it only applies between overlapping compare pairs, preventing cross-pass carry-over from the previous bubble-sort comparison

Why it changed:
- the previous implementation left a compare-leaving bar in a half-faded highlighted state after handoff completion
- this made the transition visually leak into the following action and broke the intended compare cadence
- the previous distinct compare pair lookup also allowed a new pass to inherit the last pair from the previous pass even when the pairs had no shared index

Verification run after compare handoff regression fix:
- `npm test`
  - result: passed
  - evidence: 17 test files passed, 24 tests passed
- `npm run typecheck`
  - result: passed
- `npm run build`
  - result: passed
  - output directory: `build/`

### 2026-03-24 - DSL-only quicksort example

Work completed:
- added a new `QuickSortAlgorithm` built-in composition
- implemented a full 10-element quicksort walkthrough using only the existing array algorithm DSL
- generated quicksort steps through state snapshots, compare steps, reorder motions, and finalized pivot indices
- added regression coverage for the new composition registration and final sorted output

Why it changed:
- this validates that the current framework can express a second major sorting algorithm without adding new scene types or visualizer-specific APIs
- the example gives a concrete extensibility benchmark for future array-based algorithm templates

Verification run after DSL-only quicksort example:
- `npm test`
  - result: passed
  - evidence: 18 test files passed, 25 tests passed
- `npm run typecheck`
  - result: passed
- `npm run build`
  - result: passed
  - output directory: `build/`

### 2026-03-25 - Compare highlight interpolation

Work completed:
- replaced the array compare handoff rendering model from boolean leaving/entering emphasis to interpolated compare highlight strength
- added regression coverage for compare highlight strength across overlapping and unrelated compare pairs
- kept cross-pass compare resets hard-cut while making adjacent compare steps transition smoothly

Why it changed:
- the previous compare handoff logic switched to the new compare state immediately and only layered subtle entering/leaving effects on top
- this made adjacent compares in bubble sort and quicksort still feel like hard cuts instead of a continuous handoff

Verification run after compare highlight interpolation:
- `npm test`
  - result: passed
  - evidence: 19 test files passed, 27 tests passed
- `npm run typecheck`
  - result: passed
- `npm run build`
  - result: passed
  - output directory: `build/`

### 2026-03-25 - Pivot highlighting and active handoff

Work completed:
- extended `ArrayStateSpec` with `pivotIndices` so array-based DSL examples can express a persistent pivot role
- updated `QuickSortAlgorithm` to mark the pivot explicitly during partition, compare, swap, and pivot-placement steps
- added an active-set highlight interpolation path so swap-to-compare transitions can hand off smoothly through shared active indices instead of hard-cutting
- added regression coverage for active highlight strength and explicit pivot marking in the quicksort example

Why it changed:
- quicksort needed a stable pivot highlight with a distinct visual role instead of treating the pivot as a generic active bar
- swap steps were breaking visual continuity because only compare-to-compare transitions were interpolated

### 2026-03-25 - Array DSL state-style refactor

Work completed:
- replaced array-specific highlight semantics in the renderer with a generic DSL model based on `itemStates`, `stateStyles`, and `stateTransition`
- added `src/visualizers/array-state-style.ts` to resolve per-item styles and interpolate complete visual states between steps
- updated `ArrayVisualizer` to render only from DSL-provided styles plus reorder motion, instead of interpreting active/compare/pivot roles internally
- migrated the bubble sort and quicksort examples to the new array state-style DSL
- rewrote array-focused regression tests to validate state-style resolution, previous-step lookup, style interpolation, and example coverage under the new model

Why it changed:
- the previous `pivotIndices` approach leaked quicksort-specific semantics into the base array DSL
- the previous transition system layered separate compare/active effects instead of interpolating whole item styles, which still produced hard cuts
- the new model keeps semantic naming and visual styling in the DSL while constraining the visualizer to pure rendering and interpolation

Verification run after array DSL state-style refactor:
- `npm test`
  - result: passed
  - evidence: 20 test files passed, 29 tests passed
- `npm run typecheck`
  - result: passed
- `npm run build`
  - result: passed
  - output directory: `build/`

Verification run after pivot highlighting and active handoff:
- `npm test`
  - result: passed
  - evidence: 20 test files passed, 30 tests passed
- `npm run typecheck`
  - result: passed
- `npm run build`
  - result: passed
  - output directory: `build/`
  - how to write algorithm scene state
  - how to extend the system with new scenes or visualizers

Why this changed:
- the project needed an author-facing guide alongside `AGENT.md`
- `AGENT.md` stores engineering memory, but it is not the right place for day-one usage instructions

Verification:
- no code behavior changed
- no additional test run was required for this documentation-only change

### 2026-03-24 - Tree visualization support

Work completed:
- extended the algorithm state model from array-only to:
  - `ArrayStateSpec`
  - `GraphStateSpec`
  - `TreeStateSpec`
- added a graph-backed normalization layer in `src/visualizers/build-visualization-model.ts`
- added `GraphVisualizer` as the generic node-edge renderer
- added `TreeVisualizer` as the tree-specialized layout and path-highlighting renderer
- updated `AlgorithmScene` to dispatch by normalized structure kind instead of assuming arrays only
- added a new example composition:
  - `TreeTraversal`
- added tests for:
  - tree state normalization
  - graph state normalization
  - tree composition registration

Why this changed:
- trees should be supported as a specialization of graph semantics, not as a disconnected one-off renderer
- this keeps the architecture extensible for future graph-algorithm templates while preserving tree-specific teaching affordances

Verification:
- `npm test` passed
- `npm run typecheck` passed

### 2026-03-24 - Graph foundation support

Work completed:
- expanded `GraphStateSpec` to support:
  - stable video-oriented layouts
  - legend items
  - path node and edge highlighting
  - directed edges
  - edge weights
  - graph node grouping for layered layouts
- upgraded `GraphVisualizer` to render:
  - layered/circle/grid/manual layouts
  - path highlighting
  - edge arrows
  - edge weight pills
  - legend chips
- kept tree visualization layered on top of the graph abstraction
- added a new example composition:
  - `GraphTraversal`
- added tests for graph normalization and composition registration

Why this changed:
- the project needs a real graph-video foundation before polishing per-algorithm details
- video generation needs deterministic layouts and explicit semantic state, not interactive graph tooling

Verification:
- `npm test` passed
- `npm run typecheck` passed

### 2026-03-24 - Sequence foundation support

Work completed:
- clarified that `array` is now the sort-specific numeric bar visualization path
- added `SequenceStateSpec` as the shared base for linear, non-sorting algorithms
- added sequence-specific concepts:
  - items
  - pointer markers
  - highlighted ranges
  - annotations
  - matched and dimmed indices
- added `SequenceVisualizer`
- updated the normalization layer to emit a dedicated `sequence` branch
- updated `AlgorithmScene` to dispatch sequence visualizations
- added two example compositions:
  - `SlidingWindowSequence`
  - `StringMatchingSequence`
- added tests for sequence normalization and composition registration

Why this changed:
- sorting and general sequence algorithms need different visual grammars
- strings should be treated as a sequence specialization, not as a disconnected visualization family

Verification:
- `npm test` passed
- `npm run typecheck` passed

### 2026-03-24 - Motion foundation support

Work completed:
- added explicit motion metadata to algorithm state:
  - `reorder`
  - `focus`
- updated normalization so every step now exposes:
  - motion payload
  - motion progress within the current step
- added reorder support for sort-specific arrays
- added focus support for:
  - sequence items
  - graph nodes
  - tree nodes through the shared graph renderer
- updated the sorting and sliding-window examples to demonstrate the new motion layer
- added tests for motion normalization

Why this changed:
- algorithm visualizers need explicit action semantics instead of hard-coded, structure-specific animation guesses
- swap and focus animations are foundational and should be reusable across multiple algorithm families

Verification:
- `npm test` passed
- `npm run typecheck` passed

### 2026-03-24 - Range motion support

Work completed:
- expanded the motion model to include `range`
- added `src/visualizers/sequence-motion.ts` to interpolate moving interval boundaries
- updated `SequenceVisualizer` to render an animated overlay for moving ranges
- updated the sliding-window example to use real range motion for expansion and shrinkage
- added tests for range interpolation

Why this changed:
- focus alone is not enough for high-quality linear-algorithm videos
- sliding windows and substring algorithms need visible boundary motion, not only per-cell emphasis

Verification:
- `npm test` passed
- `npm run typecheck` passed

### 2026-03-24 - Motion polish

Work completed:
- added `src/visualizers/motion-style.ts` for reusable motion-style helpers
- upgraded reorder motion with a lifted arc instead of flat translation
- upgraded focus motion with stronger spotlight/glow emphasis
- upgraded range motion with a label that follows the moving interval
- added tests for:
  - reorder lift shape
  - focus pulse/spotlight helpers
  - animated range label position

Why this changed:
- the motion foundation was functionally correct but still too plain for polished teaching videos
- improving the existing three motion families is more valuable than introducing new motion types too early

Verification:
- `npm test` passed
- `npm run typecheck` passed

### 2026-03-24 - Edge reveal support

Work completed:
- added `src/visualizers/graph-motion.ts` for path-edge reveal geometry
- upgraded `GraphVisualizer` to progressively reveal `pathEdgeIds` from source to target
- tree visualizations inherit the same effect automatically through the shared graph renderer
- added tests for edge reveal segment calculation

Why this changed:
- path highlighting alone was too static for traversal-style videos
- graph and tree scenes benefit from a visible sense of directional progression along edges, closer to a path being grown than a light sweep sliding over it

Verification:
- `npm test` passed
- `npm run typecheck` passed

### 2026-03-24 - Full bubble sort walkthrough

Work completed:
- replaced the small bubble sort demo with a generated 10-element example
- expanded the algorithm scene to cover the full compare-and-swap process across all passes
- ensured the final scene state reaches a fully sorted array with all indices marked sorted
- added a test that checks:
  - 10-element input
  - sufficient step count
  - final sorted output

Why this changed:
- a short partial sort is not enough to judge the current visual design
- a full walkthrough is needed to evaluate pacing, swap motion, and overall legibility

Verification:
- `npm test` passed
- `npm run typecheck` passed
- `npm run build` passed

### 2026-03-24 - DSL timing support

Work completed:
- added scene-level `timing` controls to `AlgorithmSceneSpec`
- added step-level `timingKey` and `durationWeight`
- updated algorithm step resolution to use weighted timing instead of uniform timing
- wired the bubble sort example to use explicit timing presets:
  - compare
  - swap
  - passComplete
  - finale
- added tests for weighted timing and timing presence in the sorting example

Why this changed:
- compare and swap beats should not consume equal time by default
- timing should be adjustable in the DSL instead of being hard-coded in render logic

Verification:
- `npm test` passed
- `npm run typecheck` passed
- `npm run build` passed

### 2026-03-24 - Compare handoff support

Work completed:
- added `src/visualizers/array-motion.ts` for compare handoff classification
- upgraded `ArrayVisualizer` so adjacent comparison pairs now transition via:
  - leaving element fade-out
  - staying element continuity
  - entering element fade-in / brighten
- updated `AlgorithmScene` to provide previous array comparison context for handoff rendering
- added tests for compare handoff classification

Why this changed:
- direct hard cuts between adjacent comparison pairs made the sorting rhythm feel abrupt
- handoff transitions preserve continuity when one compared element remains active across consecutive steps

Verification:
- `npm test` passed
- `npm run typecheck` passed
- `npm run build` passed
