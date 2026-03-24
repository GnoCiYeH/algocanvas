import React from 'react';
import type {
  GraphEdgeSpec,
  GraphLegendItemSpec,
  MotionSpec,
  GraphNodeSpec,
  ThemeSpec,
} from '../../core/types';
import {getEdgeRevealSegment} from '../../visualizers/graph-motion';
import {getFocusPulseScale, getSpotlightOpacity} from '../../visualizers/motion-style';

type GraphVisualizerProps = {
  nodes: GraphNodeSpec[];
  edges: GraphEdgeSpec[];
  nodePositions?: Record<string, {x: number; y: number}>;
  activeNodeIds?: string[];
  visitedNodeIds?: string[];
  highlightedNodeIds?: string[];
  highlightedEdgeIds?: string[];
  pathNodeIds?: string[];
  pathEdgeIds?: string[];
  legend?: GraphLegendItemSpec[];
  layout?: 'tree' | 'grid' | 'manual' | 'layered' | 'circle';
  motion?: MotionSpec;
  motionProgress?: number;
  theme: ThemeSpec;
};

const nodeRadius = 34;
const viewWidth = 880;
const viewHeight = 420;

const getLegendColor = (tone: GraphLegendItemSpec['tone'], theme: ThemeSpec) => {
  switch (tone) {
    case 'accent':
      return theme.colors.accent;
    case 'success':
      return theme.colors.success;
    case 'info':
      return '#7ab6ff';
    case 'muted':
      return theme.colors.muted;
  }
};

const buildGraphPositions = (
  nodes: GraphNodeSpec[],
  layout: GraphVisualizerProps['layout'],
  nodePositions: Record<string, {x: number; y: number}>,
) => {
  if (layout === 'manual') {
    return nodePositions;
  }

  if (layout === 'circle') {
    const centerX = viewWidth / 2;
    const centerY = viewHeight / 2;
    const radius = 140;

    return Object.fromEntries(
      nodes.map((node, index) => {
        const angle = (-Math.PI / 2) + (index / Math.max(nodes.length, 1)) * Math.PI * 2;

        return [
          node.id,
          {
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius,
          },
        ];
      }),
    );
  }

  if (layout === 'layered') {
    const layerOrder = Array.from(new Set(nodes.map((node) => node.group ?? 'layer-0')));
    const grouped = layerOrder.map((group) => nodes.filter((node) => (node.group ?? 'layer-0') === group));
    const xGap = viewWidth / (grouped.length + 1);

    return Object.fromEntries(
      grouped.flatMap((groupNodes, layerIndex) => {
        const yGap = viewHeight / (groupNodes.length + 1);

        return groupNodes.map((node, nodeIndex) => [
          node.id,
          {
            x: xGap * (layerIndex + 1),
            y: yGap * (nodeIndex + 1),
          },
        ]);
      }),
    );
  }

  const columns = Math.ceil(Math.sqrt(nodes.length));
  const xGap = viewWidth / (columns + 1);
  const rows = Math.ceil(nodes.length / columns);
  const yGap = viewHeight / (rows + 1);

  return Object.fromEntries(
    nodes.map((node, index) => [
      node.id,
      {
        x: xGap * ((index % columns) + 1),
        y: yGap * (Math.floor(index / columns) + 1),
      },
    ]),
  );
};

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({
  nodes,
  edges,
  nodePositions = {},
  activeNodeIds = [],
  visitedNodeIds = [],
  highlightedNodeIds = [],
  highlightedEdgeIds = [],
  pathNodeIds = [],
  pathEdgeIds = [],
  legend = [],
  layout = 'manual',
  motion,
  motionProgress = 1,
  theme,
}) => {
  const positions = buildGraphPositions(nodes, layout, nodePositions);
  const spotlightOpacity = motion?.kind === 'focus' ? getSpotlightOpacity(motionProgress) : 0;

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 18}}>
      <svg viewBox={`0 0 ${viewWidth} ${viewHeight}`} style={{width: '100%', height: 420, overflow: 'visible'}}>
        <defs>
          <marker
            id="graph-arrow"
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" fill={theme.colors.muted} />
          </marker>
        </defs>
        {spotlightOpacity > 0 ? (
          <rect
            x="0"
            y="0"
            width={viewWidth}
            height={viewHeight}
            fill={`rgba(3,7,17,${spotlightOpacity})`}
            rx="28"
          />
        ) : null}
        {edges.map((edge) => {
          const source = positions[edge.source];
          const target = positions[edge.target];

          if (!source || !target) {
            return null;
          }

          const highlighted = highlightedEdgeIds.includes(edge.id);
          const onPath = pathEdgeIds.includes(edge.id);
          const stroke = onPath
            ? theme.colors.success
            : highlighted
              ? theme.colors.accent
              : theme.colors.border;
          const dx = target.x - source.x;
          const dy = target.y - source.y;
          const distance = Math.max(Math.hypot(dx, dy), 1);
          const unitX = dx / distance;
          const unitY = dy / distance;
          const startX = source.x + unitX * nodeRadius;
          const startY = source.y + unitY * nodeRadius;
          const endX = target.x - unitX * nodeRadius;
          const endY = target.y - unitY * nodeRadius;
          const midX = (startX + endX) / 2;
          const midY = (startY + endY) / 2;

          return (
            <g key={edge.id}>
              <line
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke={stroke}
                strokeWidth={onPath ? 7 : highlighted ? 6 : 3}
                strokeLinecap="round"
                opacity={onPath || highlighted ? 1 : 0.9}
                markerEnd={edge.directed ? 'url(#graph-arrow)' : undefined}
              />
              {onPath ? (
                (() => {
                  const reveal = getEdgeRevealSegment(
                    {
                      start: {x: startX, y: startY},
                      end: {x: endX, y: endY},
                    },
                    motionProgress,
                  );

                  return (
                    <g>
                      <line
                        x1={reveal.start.x}
                        y1={reveal.start.y}
                        x2={reveal.end.x}
                        y2={reveal.end.y}
                        stroke={theme.colors.accent}
                        strokeWidth={8}
                        strokeLinecap="round"
                        opacity={0.95}
                      />
                      <line
                        x1={reveal.start.x}
                        y1={reveal.start.y}
                        x2={reveal.end.x}
                        y2={reveal.end.y}
                        stroke="#ffffff"
                        strokeWidth={3}
                        strokeLinecap="round"
                        opacity={0.45}
                      />
                    </g>
                  );
                })()
              ) : null}
              {edge.weight || edge.label ? (
                <g>
                  <rect
                    x={midX - 18}
                    y={midY - 16}
                    width="36"
                    height="24"
                    rx="12"
                    fill={theme.colors.surface}
                    stroke={theme.colors.border}
                  />
                  <text
                    x={midX}
                    y={midY + 6}
                    textAnchor="middle"
                    fontSize="15"
                    fontFamily={theme.fonts.mono}
                    fill={theme.colors.foreground}
                  >
                    {edge.weight ?? edge.label}
                  </text>
                </g>
              ) : null}
            </g>
          );
        })}
        {nodes.map((node) => {
          const position = positions[node.id];

          if (!position) {
            return null;
          }

          const isActive = activeNodeIds.includes(node.id);
          const isVisited = visitedNodeIds.includes(node.id);
          const isHighlighted = highlightedNodeIds.includes(node.id);
          const isOnPath = pathNodeIds.includes(node.id);
          const isFocusTarget =
            motion?.kind === 'focus' &&
            ((motion.targetIds?.includes(node.id) ?? false) ||
              (motion.targetIndices?.includes(nodes.findIndex((entry) => entry.id === node.id)) ?? false));
          const focusScale = isFocusTarget ? getFocusPulseScale(motionProgress) + 0.02 : 1;

          const fill = isActive
            ? theme.colors.accent
            : isOnPath
              ? theme.colors.success
              : isHighlighted
                ? '#7ab6ff'
                : isVisited
                  ? theme.colors.success
                  : theme.colors.surfaceAlt;

          return (
            <g key={node.id}>
              {isFocusTarget ? (
                <circle
                  cx={position.x}
                  cy={position.y}
                  r={nodeRadius * (focusScale + 0.35)}
                  fill={theme.colors.accentSoft}
                />
              ) : null}
              <circle
                cx={position.x}
                cy={position.y}
                r={nodeRadius * focusScale}
                fill={fill}
                stroke={theme.colors.border}
                strokeWidth={isFocusTarget ? 4 : 2}
              />
              <text
                x={position.x}
                y={position.y + 4}
                textAnchor="middle"
                fontSize="24"
                fontWeight="700"
                fill={theme.colors.background}
                fontFamily={theme.fonts.mono}
              >
                {node.value}
              </text>
              {node.label ? (
                <text
                  x={position.x}
                  y={position.y + 56}
                  textAnchor="middle"
                  fontSize="17"
                  fill={theme.colors.muted}
                  fontFamily={theme.fonts.body}
                >
                  {node.label}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
      {legend.length > 0 ? (
        <div style={{display: 'flex', gap: 14, flexWrap: 'wrap'}}>
          {legend.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                borderRadius: theme.radii.pill,
                background: theme.colors.surfaceAlt,
                color: theme.colors.foreground,
                fontSize: 16,
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: getLegendColor(item.tone, theme),
                }}
              />
              {item.label}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};
