import React from 'react';
import {Reveal} from '../primitives/Reveal';
import type {CodeSceneSpec, ThemeSpec} from '../../core/types';
import {Stage} from '../layout/Stage';

type CodeSceneProps = {
  scene: CodeSceneSpec;
  theme: ThemeSpec;
};

export const CodeScene: React.FC<CodeSceneProps> = ({scene, theme}) => {
  const lines = scene.code.split('\n');

  return (
    <Stage theme={theme}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 0.8fr',
          gap: 28,
          height: '100%',
        }}
      >
        <Reveal theme={theme}>
          <div
            style={{
              height: '100%',
              padding: 28,
              borderRadius: theme.radii.card,
              background: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              boxShadow: '0 24px 70px rgba(0, 0, 0, 0.28)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 22,
              }}
            >
              <div>
                <div
                  style={{
                    color: theme.colors.muted,
                    fontSize: 18,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  Code
                </div>
                <div
                  style={{
                    fontSize: 34,
                    fontWeight: 700,
                  }}
                >
                  {scene.title}
                </div>
              </div>
              <div
                style={{
                  borderRadius: theme.radii.pill,
                  padding: '8px 14px',
                  background: theme.colors.surfaceAlt,
                  fontFamily: theme.fonts.mono,
                  color: theme.colors.accent,
                }}
              >
                {scene.language}
              </div>
            </div>
            <div
              style={{
                background: theme.colors.codeBackground,
                borderRadius: 22,
                padding: 22,
                fontFamily: theme.fonts.mono,
                fontSize: 24,
                lineHeight: 1.7,
              }}
            >
              {lines.map((line, index) => {
                const lineNumber = index + 1;
                const highlighted = scene.focusLines?.includes(lineNumber) ?? false;

                return (
                  <div
                    key={`${lineNumber}-${line}`}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '56px 1fr',
                      gap: 16,
                      padding: '2px 10px',
                      borderRadius: 14,
                      background: highlighted ? theme.colors.accentSoft : 'transparent',
                    }}
                  >
                    <span style={{color: theme.colors.muted, textAlign: 'right'}}>{lineNumber}</span>
                    <span>{line || ' '}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
        <div style={{display: 'flex', flexDirection: 'column', gap: 22}}>
          <Reveal delay={theme.motion.staggerFrames} theme={theme}>
            <div
              style={{
                padding: 28,
                borderRadius: theme.radii.card,
                background: theme.colors.surface,
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              <div
                style={{
                  color: theme.colors.muted,
                  fontSize: 18,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: 12,
                }}
              >
                Narration cue
              </div>
              <div style={{fontSize: 34, lineHeight: 1.35}}>{scene.callout ?? 'Explain the current code focus.'}</div>
            </div>
          </Reveal>
          {scene.output ? (
            <Reveal delay={theme.motion.staggerFrames * 2} theme={theme}>
              <div
                style={{
                  padding: 28,
                  borderRadius: theme.radii.card,
                  background: theme.colors.surface,
                  border: `1px solid ${theme.colors.border}`,
                  minHeight: 220,
                }}
              >
                <div
                  style={{
                    color: theme.colors.muted,
                    fontSize: 18,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: 12,
                  }}
                >
                  Output
                </div>
                <pre
                  style={{
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                    fontFamily: theme.fonts.mono,
                    fontSize: 24,
                    lineHeight: 1.6,
                  }}
                >
                  {scene.output}
                </pre>
              </div>
            </Reveal>
          ) : null}
        </div>
      </div>
    </Stage>
  );
};
