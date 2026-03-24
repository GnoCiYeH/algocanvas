import type {AlgorithmSceneSpec, ArrayStateSpec} from '../core/types';

const getStepWeight = (scene: AlgorithmSceneSpec, index: number) => {
  const step = scene.steps[index];

  if (!step) {
    return 1;
  }

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

const getCurrentStepIndex = (scene: AlgorithmSceneSpec, progress: number) => {
  const clamped = Math.max(0, Math.min(progress, 0.999999));
  const weights = scene.steps.map((_, index) => getStepWeight(scene, index));
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const targetWeight = clamped * totalWeight;
  let consumed = 0;

  for (let index = 0; index < scene.steps.length; index++) {
    const weight = weights[index] ?? 1;
    const next = consumed + weight;

    if (targetWeight < next) {
      return index;
    }

    consumed = next;
  }

  return Math.max(scene.steps.length - 1, 0);
};

export const getPreviousArrayState = (
  scene: AlgorithmSceneSpec,
  progress: number,
): ArrayStateSpec | undefined => {
  const currentStepIndex = getCurrentStepIndex(scene, progress);

  for (let index = currentStepIndex - 1; index >= 0; index--) {
    const state = scene.steps[index]?.state;

    if (state && 'values' in state) {
      return state;
    }
  }

  return undefined;
};
