import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Reveal} from '../primitives/Reveal';
import type {AlgorithmSceneSpec, ThemeSpec} from '../../core/types';
import {getPreviousArrayState} from '../../visualizers/array-motion';
import {normalizeAlgorithmStep} from '../../visualizers/build-visualization-model';
import {Stage} from '../layout/Stage';
import {ArrayVisualizer} from '../visualizers/ArrayVisualizer';
import {GraphVisualizer} from '../visualizers/GraphVisualizer';
import {SequenceVisualizer} from '../visualizers/SequenceVisualizer';
import {TreeVisualizer} from '../visualizers/TreeVisualizer';

type AlgorithmSceneProps = {
  scene: AlgorithmSceneSpec;
  theme: ThemeSpec;
};

export const AlgorithmScene: React.FC<AlgorithmSceneProps> = ({scene, theme}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const progress = frame / Math.max(durationInFrames, 1);
  const visualization = normalizeAlgorithmStep(scene, progress);
  const step = visualization.step;

  const renderVisualization = () => {
    switch (visualization.kind) {
      case 'array':
        return (
          <ArrayVisualizer
            state={visualization.array}
            theme={theme}
            motionProgress={visualization.motionProgress}
            previousState={getPreviousArrayState(scene, progress)}
          />
        );
      case 'tree':
        return <TreeVisualizer visualization={visualization} theme={theme} />;
      case 'sequence':
        return (
          <SequenceVisualizer
            sequence={visualization.sequence}
            motion={visualization.motion}
            motionProgress={visualization.motionProgress}
            theme={theme}
          />
        );
      case 'graph':
        return (
          <GraphVisualizer
            nodes={visualization.graph.nodes}
            edges={visualization.graph.edges}
            activeNodeIds={visualization.graph.activeNodeIds}
            visitedNodeIds={visualization.graph.visitedNodeIds}
            highlightedNodeIds={visualization.graph.highlightedNodeIds}
            highlightedEdgeIds={visualization.graph.highlightedEdgeIds}
            pathNodeIds={visualization.graph.pathNodeIds}
            pathEdgeIds={visualization.graph.pathEdgeIds}
            legend={visualization.graph.legend}
            layout={visualization.graph.layout}
            motion={visualization.motion}
            motionProgress={visualization.motionProgress}
            nodePositions={Object.fromEntries(
              visualization.graph.nodes
                .filter((node) => typeof node.x === 'number' && typeof node.y === 'number')
                .map((node) => [node.id, {x: node.x as number, y: node.y as number}]),
            )}
            theme={theme}
          />
        );
    }
  };

  return (
    <Stage theme={theme}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.15fr 0.85fr',
          gap: 28,
          height: '100%',
        }}
      >
        <Reveal theme={theme}>
          <div
            style={{
              padding: 34,
              borderRadius: theme.radii.card,
              background: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  color: theme.colors.muted,
                  fontSize: 18,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: 12,
                }}
              >
                Algorithm state
              </div>
              <h2
                style={{
                  margin: 0,
                  marginBottom: 24,
                  fontSize: 42,
                  fontFamily: theme.fonts.display,
                }}
              >
                {scene.title}
              </h2>
            </div>
            {renderVisualization()}
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
                  marginBottom: 10,
                }}
              >
                Current step
              </div>
              <div style={{fontSize: 34, fontWeight: 700, marginBottom: 12}}>{step.label}</div>
              <div style={{fontSize: 28, lineHeight: 1.45, color: theme.colors.foreground}}>
                {step.description}
              </div>
            </div>
          </Reveal>
          <Reveal delay={theme.motion.staggerFrames * 2} theme={theme}>
            <div
              style={{
                padding: 28,
                borderRadius: theme.radii.card,
                background: theme.colors.surface,
                border: `1px solid ${theme.colors.border}`,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 18,
              }}
            >
              <div>
                <div style={{color: theme.colors.muted, marginBottom: 8}}>Time</div>
                <div style={{fontFamily: theme.fonts.mono, fontSize: 28}}>
                  {scene.complexity?.time ?? 'N/A'}
                </div>
              </div>
              <div>
                <div style={{color: theme.colors.muted, marginBottom: 8}}>Space</div>
                <div style={{fontFamily: theme.fonts.mono, fontSize: 28}}>
                  {scene.complexity?.space ?? 'N/A'}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Stage>
  );
};
