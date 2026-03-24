export const getEdgeRevealSegment = (
  edge: {
    start: {x: number; y: number};
    end: {x: number; y: number};
  },
  progress: number,
) => {
  const clampedProgress = Math.max(0, Math.min(progress, 1));
  const dx = edge.end.x - edge.start.x;
  const dy = edge.end.y - edge.start.y;

  return {
    start: {
      x: edge.start.x,
      y: edge.start.y,
    },
    end: {
      x: edge.start.x + dx * clampedProgress,
      y: edge.start.y + dy * clampedProgress,
    },
  };
};
