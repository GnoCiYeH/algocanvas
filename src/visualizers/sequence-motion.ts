import type {MotionSpec} from '../core/types';

export const getAnimatedRange = (
  motion: Extract<MotionSpec, {kind: 'range'}>,
  progress: number,
) => {
  const clamped = Math.max(0, Math.min(progress, 1));

  return {
    start: motion.fromRange.start + (motion.toRange.start - motion.fromRange.start) * clamped,
    end: motion.fromRange.end + (motion.toRange.end - motion.fromRange.end) * clamped,
    tone: motion.tone,
    label: motion.label,
  };
};

export const getAnimatedRangeLabelCenter = (
  motion: Extract<MotionSpec, {kind: 'range'}>,
  progress: number,
) => {
  const range = getAnimatedRange(motion, progress);
  return (range.start + range.end + 1) / 2;
};
