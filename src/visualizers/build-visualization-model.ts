import type {
  AlgorithmSceneSpec,
  AlgorithmStepSpec,
  ArrayStateSpec,
  GraphStateSpec,
  MotionSpec,
  SequenceStateSpec,
  TreeStateSpec,
} from '../core/types';

const getStepWeight = (scene: AlgorithmSceneSpec, step: AlgorithmStepSpec) => {
  if (typeof step.durationWeight === 'number') {
    return step.durationWeight;
  }

  const timing = scene.timing;

  if (!timing || !step.timingKey) {
    return timing?.default ?? 1;
  }

  switch (step.timingKey) {
    case 'compare':
      return timing.compare ?? timing.default ?? 1;
    case 'swap':
      return timing.swap ?? timing.default ?? 1;
    case 'passComplete':
      return timing.passComplete ?? timing.default ?? 1;
    case 'finale':
      return timing.finale ?? timing.default ?? 1;
  }
};

export const resolveAlgorithmStep = (scene: AlgorithmSceneSpec, progress: number) => {
  const clamped = Math.max(0, Math.min(progress, 0.999999));
  const weights = scene.steps.map((step) => getStepWeight(scene, step));
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

  if (totalWeight <= 0) {
    return scene.steps[0];
  }

  const targetWeight = clamped * totalWeight;
  let consumed = 0;

  for (let index = 0; index < scene.steps.length; index++) {
    const weight = weights[index] ?? 1;
    const next = consumed + weight;

    if (targetWeight < next) {
      return scene.steps[index] ?? scene.steps[0];
    }

    consumed = next;
  }

  return scene.steps.at(-1) ?? scene.steps[0];
};

export type NormalizedAlgorithmStep =
  | {
      kind: 'array';
      step: AlgorithmStepSpec;
      array: ArrayStateSpec;
      motion?: MotionSpec;
      motionProgress: number;
    }
  | {
      kind: 'sequence';
      step: AlgorithmStepSpec;
      sequence: Required<
        Pick<
          SequenceStateSpec,
          | 'variant'
          | 'items'
          | 'activeIndices'
          | 'matchedIndices'
          | 'dimmedIndices'
          | 'highlightedRanges'
          | 'pointerMarkers'
          | 'annotations'
        >
      >;
      motion?: MotionSpec;
      motionProgress: number;
    }
  | {
      kind: 'graph';
      step: AlgorithmStepSpec;
      graph: Required<
        Pick<
          GraphStateSpec,
          | 'nodes'
          | 'edges'
          | 'activeNodeIds'
          | 'visitedNodeIds'
          | 'highlightedNodeIds'
          | 'highlightedEdgeIds'
          | 'pathNodeIds'
          | 'pathEdgeIds'
          | 'legend'
          | 'layout'
        >
      >;
      motion?: MotionSpec;
      motionProgress: number;
      tree?: undefined;
    }
  | {
      kind: 'tree';
      step: AlgorithmStepSpec;
      graph: Required<
        Pick<
          GraphStateSpec,
          | 'nodes'
          | 'edges'
          | 'activeNodeIds'
          | 'visitedNodeIds'
          | 'highlightedNodeIds'
          | 'highlightedEdgeIds'
          | 'pathNodeIds'
          | 'pathEdgeIds'
          | 'legend'
          | 'layout'
        >
      >;
      tree: Pick<TreeStateSpec, 'rootId' | 'levels' | 'activePath'>;
      motion?: MotionSpec;
      motionProgress: number;
    };

const normalizeGraphState = (state: GraphStateSpec) => {
  return {
    nodes: state.nodes,
    edges: state.edges,
    activeNodeIds: state.activeNodeIds ?? [],
    visitedNodeIds: state.visitedNodeIds ?? [],
    highlightedNodeIds: state.highlightedNodeIds ?? [],
    highlightedEdgeIds: state.highlightedEdgeIds ?? [],
    pathNodeIds: state.pathNodeIds ?? [],
    pathEdgeIds: state.pathEdgeIds ?? [],
    legend: state.legend ?? [],
    layout: state.layout ?? 'manual',
  };
};

const isArrayState = (state: AlgorithmStepSpec['state']): state is ArrayStateSpec => {
  return 'values' in state;
};

const isSequenceState = (state: AlgorithmStepSpec['state']): state is SequenceStateSpec => {
  return 'items' in state && 'variant' in state;
};

const isTreeState = (state: AlgorithmStepSpec['state']): state is TreeStateSpec => {
  return 'rootId' in state && 'levels' in state;
};

export const normalizeAlgorithmStep = (
  scene: AlgorithmSceneSpec,
  progress: number,
): NormalizedAlgorithmStep => {
  const clamped = Math.max(0, Math.min(progress, 0.999999));
  const weights = scene.steps.map((step) => getStepWeight(scene, step));
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const targetWeight = clamped * totalWeight;
  let consumed = 0;
  let stepIndex = 0;

  for (let index = 0; index < scene.steps.length; index++) {
    const weight = weights[index] ?? 1;
    const next = consumed + weight;

    if (targetWeight < next) {
      stepIndex = index;
      break;
    }

    consumed = next;
    stepIndex = index;
  }

  const stepWeight = weights[stepIndex] ?? 1;
  const motionProgress = stepWeight === 0 ? 1 : (targetWeight - consumed) / stepWeight;
  const step = scene.steps[stepIndex] ?? scene.steps[0];
  const state = step.state;

  if (isArrayState(state)) {
    return {
      kind: 'array',
      step,
      array: state,
      motion: state.motion,
      motionProgress,
    };
  }

  if (isSequenceState(state)) {
    return {
      kind: 'sequence',
      step,
      sequence: {
        variant: state.variant,
        items: state.items,
        activeIndices: state.activeIndices ?? [],
        matchedIndices: state.matchedIndices ?? [],
        dimmedIndices: state.dimmedIndices ?? [],
        highlightedRanges: state.highlightedRanges ?? [],
        pointerMarkers: state.pointerMarkers ?? [],
        annotations: state.annotations ?? [],
      },
      motion: state.motion,
      motionProgress,
    };
  }

  if (isTreeState(state)) {
    return {
      kind: 'tree',
      step,
      graph: normalizeGraphState(state),
      tree: {
        rootId: state.rootId,
        levels: state.levels,
        activePath: state.activePath ?? [],
      },
      motion: state.motion,
      motionProgress,
    };
  }

  return {
    kind: 'graph',
    step,
    graph: normalizeGraphState(state),
    motion: state.motion,
    motionProgress,
    tree: undefined,
  };
};
