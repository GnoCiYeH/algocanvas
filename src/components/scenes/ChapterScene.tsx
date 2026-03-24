import React from 'react';
import {Reveal} from '../primitives/Reveal';
import type {ChapterSceneSpec, ThemeSpec} from '../../core/types';
import {Stage} from '../layout/Stage';

type ChapterSceneProps = {
  scene: ChapterSceneSpec;
  theme: ThemeSpec;
};

export const ChapterScene: React.FC<ChapterSceneProps> = ({scene, theme}) => {
  return (
    <Stage theme={theme}>
      <div
        style={{
          display: 'flex',
          height: '100%',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            display: 'flex',
            flexDirection: 'column',
            gap: 22,
          }}
        >
          <Reveal theme={theme}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12,
                width: 'fit-content',
                padding: '10px 18px',
                borderRadius: theme.radii.pill,
                background: theme.colors.accentSoft,
                color: theme.colors.accent,
                fontFamily: theme.fonts.mono,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontSize: 24,
              }}
            >
              {scene.eyebrow}
            </div>
          </Reveal>
          <Reveal delay={6} theme={theme} translateY={36}>
            <h1
              style={{
                margin: 0,
                fontSize: 110,
                lineHeight: 0.95,
                fontFamily: theme.fonts.display,
                letterSpacing: '-0.06em',
              }}
            >
              {scene.title}
            </h1>
          </Reveal>
          {scene.summary ? (
            <Reveal delay={12} theme={theme}>
              <p
                style={{
                  margin: 0,
                  maxWidth: 880,
                  fontSize: 34,
                  lineHeight: 1.4,
                  color: theme.colors.muted,
                }}
              >
                {scene.summary}
              </p>
            </Reveal>
          ) : null}
        </div>
      </div>
    </Stage>
  );
};
