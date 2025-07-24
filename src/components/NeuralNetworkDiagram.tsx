import React from 'react';
import { NNState } from '@/types';

interface NeuralNetworkDiagramProps {
  nnState: NNState;
  highlight: { nodes: string[]; weights: string[] };
}

const Node: React.FC<{ id: string; label: string; value: string; top: string; left: string; isActive: boolean }> = ({ id, label, value, top, left, isActive }) => (
  <div id={id} className={`nn-node ${isActive ? 'active' : ''}`} style={{ top, left }}>
    <div className="font-bold">{label}</div>
    <div className="text-xs">{value}</div>
  </div>
);

const Connection: React.FC<{ from: {x: number, y: number}, to: {x: number, y: number}, weight: number, label: string, isActive: boolean }> = ({ from, to, weight, label, isActive }) => {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;

  return (
    <g>
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        className={`nn-weight ${isActive ? 'active' : ''}`}
        strokeWidth={isActive ? 3 : 1.5}
        stroke={isActive ? '#2563eb' : '#94a3b8'}
      />
      <text
        x={midX}
        y={midY}
        dy={-0.5}
        textAnchor="middle"
        className={`nn-weight-label ${isActive ? 'active' : ''}`}
        fill={isActive ? '#1d4ed8' : '#475569'}
        fontSize="3"
      >
        {label}: {weight.toFixed(4)}
      </text>
    </g>
  );
};

const NeuralNetworkDiagram: React.FC<NeuralNetworkDiagramProps> = ({ nnState, highlight }) => {
  const { inputs, weights, biases, calculated } = nnState;

  const nodePositions: { [key: string]: { x: number; y: number } } = {
    i1: { x: 10, y: 20 }, i2: { x: 10, y: 80 },
    h1: { x: 50, y: 20 }, h2: { x: 50, y: 80 },
    o1: { x: 90, y: 20 }, o2: { x: 90, y: 80 },
  };

  return (
    <section id="nn-visualization" className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Neural Network Structure & Values</h2>
      <div className="relative h-96 w-full" id="nn-diagram-container">
        {/* Connections */}
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100" style={{ zIndex: 5 }}>
          <Connection from={nodePositions.i1} to={nodePositions.h1} weight={weights.w1} label="w1" isActive={highlight.weights.includes('w1')} />
          <Connection from={nodePositions.i1} to={nodePositions.h2} weight={weights.w3} label="w3" isActive={highlight.weights.includes('w3')} />
          <Connection from={nodePositions.i2} to={nodePositions.h1} weight={weights.w2} label="w2" isActive={highlight.weights.includes('w2')} />
          <Connection from={nodePositions.i2} to={nodePositions.h2} weight={weights.w4} label="w4" isActive={highlight.weights.includes('w4')} />

          <Connection from={nodePositions.h1} to={nodePositions.o1} weight={weights.w5} label="w5" isActive={highlight.weights.includes('w5')} />
          <Connection from={nodePositions.h1} to={nodePositions.o2} weight={weights.w7} label="w7" isActive={highlight.weights.includes('w7')} />
          <Connection from={nodePositions.h2} to={nodePositions.o1} weight={weights.w6} label="w6" isActive={highlight.weights.includes('w6')} />
          <Connection from={nodePositions.h2} to={nodePositions.o2} weight={weights.w8} label="w8" isActive={highlight.weights.includes('w8')} />
        </svg>

        {/* Nodes */}
        {Object.entries(nodePositions).map(([id, pos]) => {
          let label = id;
          let value = '';
          if (id.startsWith('i')) value = nnState.inputs[id as keyof typeof nnState.inputs].toFixed(2);
          if (id.startsWith('h')) value = nnState.calculated[`out_${id}` as keyof typeof nnState.calculated]?.toFixed(4) || '?';
          if (id.startsWith('o')) value = nnState.calculated[`out_${id}` as keyof typeof nnState.calculated]?.toFixed(4) || '?';

          return <Node key={id} id={id} label={label} value={value} top={`${pos.y}%`} left={`${pos.x}%`} isActive={highlight.nodes.includes(id)} />
        })}
      </div>
    </section>
  );
};

export default NeuralNetworkDiagram;
