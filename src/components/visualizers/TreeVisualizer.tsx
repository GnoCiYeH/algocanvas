import React from 'react';
import type {ThemeSpec} from '../../core/types';
import type {NormalizedAlgorithmStep} from '../../visualizers/build-visualization-model';
import {GraphVisualizer} from './GraphVisualizer';

type TreeVisualizerProps = {
  visualization: Extract<NormalizedAlgorithmStep, {kind: 'tree'}>;
  theme: ThemeSpec;
};

const buildTreePositions = (levels: string[][]) => {
  const positions: Record<string, {x: number; y: number}> = {};
  const totalWidth = 880;
  const baseY = 84;
  const levelGap = 108;

  levels.forEach((level, levelIndex) => {
    const gap = totalWidth / (level.length + 1);
    level.forEach((nodeId, nodeIndex) => {
      positions[nodeId] = {
        x: gap * (nodeIndex + 1),
        y: baseY + levelIndex * levelGap,
      };
    });
  });

  return positions;
};

export const TreeVisualizer: React.FC<TreeVisualizerProps> = ({visualization, theme}) => {
  const tree = visualization.tree;

  const activePath = tree.activePath ?? [];
  const highlightedEdges = visualization.graph.edges
    .filter((edge) => {
      const sourceIndex = activePath.indexOf(edge.source);
      const targetIndex = activePath.indexOf(edge.target);
      return sourceIndex !== -1 && targetIndex === sourceIndex + 1;
    })
    .map((edge) => edge.id);

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 20}}>
      <GraphVisualizer
        nodes={visualization.graph.nodes}
        edges={visualization.graph.edges}
        nodePositions={buildTreePositions(tree.levels)}
        activeNodeIds={visualization.graph.activeNodeIds}
        visitedNodeIds={visualization.graph.visitedNodeIds}
        highlightedNodeIds={tree.activePath}
        highlightedEdgeIds={highlightedEdges}
        motion={visualization.motion}
        motionProgress={visualization.motionProgress}
        theme={theme}
      />
      <div
        style={{
          display: 'flex',
          gap: 14,
          flexWrap: 'wrap',
          fontSize: 22,
          color: theme.colors.muted,
        }}
      >
        <span>Root: {tree.rootId}</span>
        <span>Levels: {tree.levels.length}</span>
        <span>Active path: {tree.activePath?.join(' -> ') ?? 'N/A'}</span>
      </div>
    </div>
  );
};
