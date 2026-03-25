# AlgoCanvas

Remotion-based templates for code walkthrough and algorithm visualization videos.

The project is designed around a typed TypeScript DSL, reusable scene components, and a separable theme/motion system so the same rendering core can support multiple video styles.

## What Is Included

- a typed authoring DSL for video specs
- chapter, code, and algorithm scenes
- a default branded theme with override support
- an array-based algorithm visualizer
- two example videos:
  - `CodeWalkthrough`
  - `SortingAlgorithm`

## Quick Start

Install dependencies:

```bash
npm install
```

Open Remotion Studio:

```bash
npm run dev
```

Build the project bundle:

```bash
npm run build
```

Render the included examples:

```bash
npm run render:code
npm run render:algorithm
```

## Project Structure

Key directories:

- `src/core`
  - DSL and shared type definitions
- `src/components`
  - reusable layout, scene, composition, and primitive UI components
- `src/visualizers`
  - adapters that convert algorithm state into renderable views
- `src/themes`
  - default theme tokens and theme merge helpers
- `src/examples`
  - example video specs used as compositions
- `tests`
  - DSL, theme, timeline, and composition registration tests

## Authoring Model

The author-facing API is a TypeScript config, not raw animation code.

You write a video with `defineVideo(...)`, then describe it as a sequence of scenes. Each scene declares what should be shown and for how long. The rendering internals, transitions, and UI composition stay inside the template system.

Current scene types:

- `chapter`
- `code`
- `algorithm`

Current algorithm structures:

- `array`
- `tree`
- `graph` as a shared state/model foundation
- `sequence` for general linear content such as arrays and strings

## Minimal Example

```ts
import {defineVideo} from '../core/dsl';
import {createTheme} from '../themes/create-theme';

export const myVideo = defineVideo({
  id: 'MyVideo',
  title: 'Binary Search Walkthrough',
  theme: createTheme({
    name: 'custom-theme',
    colors: {
      accent: '#ff6b57',
    },
  }),
  scenes: [
    {
      type: 'chapter',
      id: 'intro',
      durationInFrames: 60,
      title: 'Binary Search',
      eyebrow: 'Algorithm',
      summary: 'Introduce the problem and when binary search applies.',
    },
    {
      type: 'code',
      id: 'code',
      durationInFrames: 180,
      title: 'Iterative implementation',
      language: 'ts',
      focusLines: [2, 5, 8],
      callout: 'Explain how the midpoint and bounds move each round.',
      code: [
        'function binarySearch(nums: number[], target: number) {',
        '  let left = 0;',
        '  let right = nums.length - 1;',
        '  while (left <= right) {',
        '    const mid = Math.floor((left + right) / 2);',
        '    if (nums[mid] === target) return mid;',
        '    if (nums[mid] < target) left = mid + 1;',
        '    else right = mid - 1;',
        '  }',
        '  return -1;',
        '}',
      ].join('\n'),
    },
  ],
});
```

## How To Add A New Video

1. Create a new file in `src/examples`.
2. Export a `defineVideo(...)` result.
3. Add the exported video to `registeredVideos` in `src/index.tsx`.
4. Start `npm run dev` and verify the composition appears in Remotion Studio.

## How To Write An Algorithm Scene

Algorithm scenes are state-driven.

You do not animate individual rectangles or nodes directly. Instead, you provide a sequence of semantic steps, each with:

- `label`
- `description`
- `state`

For array visualizations, the state currently supports:

- `values`
- `activeIndices`
- `sortedIndices`
- `comparedPair`

For tree visualizations, the state currently supports:

- `rootId`
- `nodes`
- `edges`
- `levels`
- `activeNodeIds`
- `visitedNodeIds`
- `activePath`

The tree model is graph-backed: tree scenes use graph-style nodes and edges as the base representation, then add tree-specific semantics for layout and path teaching.

For graph visualizations, the state currently supports:

- `layout`
  - `manual`
  - `grid`
  - `circle`
  - `layered`
- `nodes`
  - `id`
  - `value`
  - `label`
  - `group`
  - optional manual `x` / `y`
- `edges`
  - `source`
  - `target`
  - `label`
  - `weight`
  - `directed`
- node state:
  - `activeNodeIds`
  - `visitedNodeIds`
  - `highlightedNodeIds`
- edge/path state:
  - `highlightedEdgeIds`
  - `pathNodeIds`
  - `pathEdgeIds`
- `legend`

This is intended for stable, video-friendly graph teaching rather than interactive editing.

## Sort-Specific Arrays vs General Sequences

`array` is now treated as a sort-specific structure.

Use `structure: 'array'` when:
- values are numeric
- visual meaning comes from relative magnitude
- a bar-chart style presentation is the right teaching format

Use `structure: 'sequence'` when:
- you need to show array contents as cells
- you need pointers or sliding windows
- you need token-by-token string visualization
- values are characters, symbols, or general sequence items

This keeps sorting visuals simple while giving non-sorting linear algorithms a more appropriate base.

## Motion Foundation

The project now has a first-pass reusable motion layer for algorithm steps.

Supported motion kinds:

- `reorder`
  - intended for swaps, shifts, and other order changes
  - currently applied to sort-specific array scenes
- `focus`
  - intended for current comparison targets, active pointers, and active nodes
  - currently applied to sequence and graph/tree focus states
- `range`
  - intended for sliding windows, substring spans, and interval movement
  - currently applied to sequence overlays with animated boundary interpolation

The motion data lives inside each step state instead of being inferred from visual diffs.
That keeps animation behavior explicit and reusable across structures.

Recent polish on top of the motion layer:

- `reorder`
  - lifted swap arc instead of flat horizontal movement
- `focus`
  - stronger spotlight / glow behavior for active targets
- `range`
  - moving overlay label that follows the animated interval
- graph/tree path progression
  - path edges now progressively reveal from source to target for traversal momentum

For sequence visualizations, the state currently supports:

- `variant`
  - `cells`
  - `tokens`
  - `bars`
- `items`
- `activeIndices`
- `matchedIndices`
- `dimmedIndices`
- `highlightedRanges`
- `pointerMarkers`
- `annotations`

Example:

```ts
{
  type: 'algorithm',
  id: 'bubble-sort',
  durationInFrames: 210,
  title: 'Track swaps across passes',
  structure: 'array',
  steps: [
    {
      label: 'Initial state',
      description: 'Compare the first adjacent pair.',
      state: {
        values: [5, 1, 4, 2, 8],
        comparedPair: [0, 1],
        activeIndices: [0, 1],
      },
    },
  ],
}
```

## How To Customize The Look

Use `createTheme(...)` to override parts of the default theme without reimplementing the whole token set.

Current override groups:

- `name`
- `fonts`
- `colors`
- `radii`
- `spacing`
- `motion`

This keeps the base visual language intact while allowing custom branding and pacing.

## How To Add New Scene Or Visualizer Types

If you want to extend the system instead of only authoring content:

1. Add the new type to `src/core/types.ts`.
2. Extend the DSL or state model if needed.
3. Implement the renderer in `src/components/scenes` or `src/components/visualizers`.
4. Register the scene rendering branch inside `src/components/composition/VideoComposition.tsx`.
5. Add tests that prove the new behavior or registration path.

The intended boundary is:

- scene specs describe content
- scene components describe presentation
- visualizers describe structure-specific rendering
- theme tokens describe appearance

The current tree implementation follows this layering:

- `GraphStateSpec` is the reusable base for node-edge structures
- `TreeStateSpec` extends that base with root, level, and path semantics
- `GraphVisualizer` renders generic node-edge diagrams
- `TreeVisualizer` applies tree layout and tree-specific highlighting

For generic graph videos, `GraphVisualizer` now supports:

- stable non-force layouts
- directed edges
- edge weights / labels
- path highlighting
- legend rendering

## Verification

Current validation commands:

```bash
npm test
npm run typecheck
npm run build
```

## Current Limitations

- graph foundation is now implemented for video use, but only BFS-style traversal is included as an example
- sequence foundation is implemented for general linear algorithms, but only sliding-window and simple string-matching examples are included
- motion foundation currently supports `reorder`, `focus`, and `range`; richer transition choreography is not implemented yet
- there is still no dedicated scene treatment yet for shortest-path, topo-sort, MST, or flow-specific annotations
- runtime code uses relative imports because the current Remotion bundler setup does not resolve the `@/...` alias by default
- the repository is not yet under git version control

## Project Memory

Persistent engineering history is maintained in `AGENT.md`.

When architecture, authoring APIs, or verification behavior changes, update `AGENT.md` in the same task.
