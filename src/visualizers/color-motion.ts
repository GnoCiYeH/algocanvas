const toRgb = (color: string) => {
  if (color.startsWith('#')) {
    const normalized = color.length === 4
      ? `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`
      : color;
    const value = Number.parseInt(normalized.slice(1), 16);

    return {
      r: (value >> 16) & 255,
      g: (value >> 8) & 255,
      b: value & 255,
    };
  }

  const match = color.match(/rgba?\(([^)]+)\)/);

  if (!match) {
    return {r: 255, g: 255, b: 255};
  }

  const [r, g, b] = match[1].split(',').map((part) => Number.parseFloat(part.trim()));
  return {
    r: r ?? 255,
    g: g ?? 255,
    b: b ?? 255,
  };
};

export const mixColors = (from: string, to: string, progress: number) => {
  const clamped = Math.max(0, Math.min(progress, 1));
  const start = toRgb(from);
  const end = toRgb(to);

  const r = Math.round(start.r + (end.r - start.r) * clamped);
  const g = Math.round(start.g + (end.g - start.g) * clamped);
  const b = Math.round(start.b + (end.b - start.b) * clamped);

  return `rgb(${r}, ${g}, ${b})`;
};
