import React from 'react';
import type {ThemeSpec} from '../../core/types';

type StageProps = {
  theme: ThemeSpec;
  children: React.ReactNode;
};

export const Stage: React.FC<StageProps> = ({theme, children}) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        color: theme.colors.foreground,
        background: `radial-gradient(circle at top left, rgba(77, 212, 172, 0.12), transparent 38%), linear-gradient(135deg, ${theme.colors.background} 0%, #030711 100%)`,
        fontFamily: theme.fonts.body,
        padding: `${theme.spacing.pageY}px ${theme.spacing.pageX}px`,
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.55), transparent)',
        }}
      />
      <div style={{position: 'relative', zIndex: 1, width: '100%', height: '100%'}}>{children}</div>
    </div>
  );
};
