export type SceneType = 'chapter' | 'code' | 'algorithm';

export type ChapterSceneSpec = {
  type: 'chapter';
  id: string;
  durationInFrames: number;
  title: string;
  eyebrow: string;
  summary?: string;
};

export type CodeSceneSpec = {
  type: 'code';
  id: string;
  durationInFrames: number;
  title: string;
  code: string;
  language: string;
  focusLines?: number[];
  callout?: string;
  output?: string;
};

export type ArrayItemStateStyleSpec = {
  priority?: number;
  fill?: string;
  outlineColor?: string;
  outlineWidth?: number;
  shadowColor?: string;
  shadowOpacity?: number;
  brightness?: number;
  scale?: number;
  opacity?: number;
};

export type ArrayStateSpec = {
  variant?: 'sort-bars';
  itemIds?: string[];
  values: number[];
  itemStates?: Record<string, string[]>;
  stateStyles?: Record<string, ArrayItemStateStyleSpec>;
  stateTransition?: {
    portion?: number;
  };
  motion?: MotionSpec;
};

export type SequenceItemSpec = {
  id: string;
  value: string;
  label?: string;
  tone?: 'default' | 'accent' | 'success' | 'muted' | 'info';
};

export type SequenceRangeSpec = {
  start: number;
  end: number;
  tone: 'accent' | 'success' | 'muted' | 'info';
  label?: string;
};

export type SequencePointerSpec = {
  id: string;
  index: number;
  label: string;
};

export type SequenceAnnotationSpec = {
  id: string;
  index: number;
  text: string;
};

export type MotionSpec =
  | {
      kind: 'reorder';
      fromOrder: string[];
      toOrder: string[];
    }
  | {
      kind: 'focus';
      mode: 'pulse' | 'spotlight' | 'glow';
      targetIds?: string[];
      targetIndices?: number[];
    }
  | {
      kind: 'range';
      fromRange: {
        start: number;
        end: number;
      };
      toRange: {
        start: number;
        end: number;
      };
      tone: 'accent' | 'success' | 'muted' | 'info';
      label?: string;
    };

export type SequenceStateSpec = {
  variant: 'cells' | 'tokens' | 'bars';
  items: SequenceItemSpec[];
  activeIndices?: number[];
  matchedIndices?: number[];
  dimmedIndices?: number[];
  highlightedRanges?: SequenceRangeSpec[];
  pointerMarkers?: SequencePointerSpec[];
  annotations?: SequenceAnnotationSpec[];
  motion?: MotionSpec;
};

export type GraphNodeSpec = {
  id: string;
  value: string;
  label?: string;
  subtitle?: string;
  group?: string;
  x?: number;
  y?: number;
};

export type GraphEdgeSpec = {
  id: string;
  source: string;
  target: string;
  label?: string;
  weight?: string;
  directed?: boolean;
};

export type GraphLegendItemSpec = {
  id: string;
  label: string;
  tone: 'accent' | 'success' | 'muted' | 'info';
};

export type GraphStateSpec = {
  nodes: GraphNodeSpec[];
  edges: GraphEdgeSpec[];
  activeNodeIds?: string[];
  visitedNodeIds?: string[];
  highlightedNodeIds?: string[];
  highlightedEdgeIds?: string[];
  pathNodeIds?: string[];
  pathEdgeIds?: string[];
  legend?: GraphLegendItemSpec[];
  layout?: 'tree' | 'grid' | 'manual' | 'layered' | 'circle';
  motion?: MotionSpec;
};

export type TreeStateSpec = GraphStateSpec & {
  rootId: string;
  levels: string[][];
  activePath?: string[];
};

export type AlgorithmStepSpec = {
  label: string;
  description: string;
  timingKey?: 'compare' | 'swap' | 'passComplete' | 'finale';
  durationWeight?: number;
  state: ArrayStateSpec | SequenceStateSpec | GraphStateSpec | TreeStateSpec;
};

export type AlgorithmSceneSpec = {
  type: 'algorithm';
  id: string;
  durationInFrames: number;
  title: string;
  structure: 'array' | 'sequence' | 'tree' | 'graph';
  timing?: {
    compare?: number;
    swap?: number;
    passComplete?: number;
    finale?: number;
    default?: number;
  };
  steps: AlgorithmStepSpec[];
  complexity?: {
    time?: string;
    space?: string;
  };
};

export type SceneSpec = ChapterSceneSpec | CodeSceneSpec | AlgorithmSceneSpec;

export type ThemeSpec = {
  name: string;
  fonts: {
    display: string;
    body: string;
    mono: string;
  };
  colors: {
    background: string;
    surface: string;
    surfaceAlt: string;
    foreground: string;
    muted: string;
    accent: string;
    accentSoft: string;
    success: string;
    border: string;
    codeBackground: string;
  };
  radii: {
    card: number;
    pill: number;
  };
  spacing: {
    pageX: number;
    pageY: number;
    stackGap: number;
  };
  motion: {
    staggerFrames: number;
    transitionSpring: {
      damping: number;
      stiffness: number;
      mass: number;
    };
  };
};

export type VideoSpec = {
  id: string;
  title: string;
  fps: number;
  width: number;
  height: number;
  scenes: SceneSpec[];
  theme: ThemeSpec;
};

export type RegisteredVideo = {
  id: string;
  spec: VideoSpec;
};
