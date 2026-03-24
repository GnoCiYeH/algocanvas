import type {ArrayItemStateStyleSpec, ThemeSpec} from '../core/types';
import {mixColors} from './color-motion';

export type ResolvedArrayItemStyle = {
  fill: string;
  outlineColor: string;
  outlineWidth: number;
  shadowColor: string;
  shadowOpacity: number;
  brightness: number;
  scale: number;
  opacity: number;
};

const transparent = 'rgba(0, 0, 0, 0)';

export const getDefaultArrayItemStyle = (theme: ThemeSpec): ResolvedArrayItemStyle => {
  return {
    fill: theme.colors.surfaceAlt,
    outlineColor: transparent,
    outlineWidth: 0,
    shadowColor: transparent,
    shadowOpacity: 0,
    brightness: 1,
    scale: 1,
    opacity: 1,
  };
};

export const resolveArrayItemStyle = (
  itemId: string,
  itemStates: Record<string, string[]> | undefined,
  stateStyles: Record<string, ArrayItemStateStyleSpec> | undefined,
  defaults: ResolvedArrayItemStyle,
): ResolvedArrayItemStyle => {
  const assignedStates = itemStates?.[itemId] ?? [];
  const layeredStates = assignedStates
    .map((stateName) => ({
      name: stateName,
      style: stateStyles?.[stateName],
    }))
    .filter(
      (entry): entry is {name: string; style: ArrayItemStateStyleSpec} => entry.style !== undefined,
    )
    .sort((left, right) => (left.style.priority ?? 0) - (right.style.priority ?? 0));

  return layeredStates.reduce<ResolvedArrayItemStyle>((acc, entry) => {
    const style = entry.style;

    return {
      fill: style.fill ?? acc.fill,
      outlineColor: style.outlineColor ?? acc.outlineColor,
      outlineWidth: style.outlineWidth ?? acc.outlineWidth,
      shadowColor: style.shadowColor ?? acc.shadowColor,
      shadowOpacity: style.shadowOpacity ?? acc.shadowOpacity,
      brightness: style.brightness ?? acc.brightness,
      scale: style.scale ?? acc.scale,
      opacity: style.opacity ?? acc.opacity,
    };
  }, defaults);
};

export const interpolateArrayItemStyle = (
  from: ResolvedArrayItemStyle,
  to: ResolvedArrayItemStyle,
  progress: number,
): ResolvedArrayItemStyle => {
  const clamped = Math.max(0, Math.min(progress, 1));
  const lerp = (left: number, right: number) => left + (right - left) * clamped;

  return {
    fill: mixColors(from.fill, to.fill, clamped),
    outlineColor: mixColors(from.outlineColor, to.outlineColor, clamped),
    outlineWidth: lerp(from.outlineWidth, to.outlineWidth),
    shadowColor: mixColors(from.shadowColor, to.shadowColor, clamped),
    shadowOpacity: lerp(from.shadowOpacity, to.shadowOpacity),
    brightness: lerp(from.brightness, to.brightness),
    scale: lerp(from.scale, to.scale),
    opacity: lerp(from.opacity, to.opacity),
  };
};

export const getStateTransitionProgress = (stepProgress: number, portion = 0.45) => {
  const clamped = Math.max(0, Math.min(stepProgress, 1));
  const safePortion = Math.max(0.05, Math.min(portion, 1));

  if (clamped >= safePortion) {
    return 1;
  }

  return clamped / safePortion;
};
