export const getReorderLift = (progress: number) => {
  const clamped = Math.max(0, Math.min(progress, 1));
  const lift = Math.sin(clamped * Math.PI) * 22;
  return Math.abs(lift) < 1e-9 ? 0 : lift;
};

export const getFocusPulseScale = (progress: number) => {
  const clamped = Math.max(0, Math.min(progress, 1));
  return 1 + Math.sin(clamped * Math.PI) * 0.08;
};

export const getSpotlightOpacity = (progress: number) => {
  const clamped = Math.max(0, Math.min(progress, 1));
  return Math.sin(clamped * Math.PI) * 0.24;
};
