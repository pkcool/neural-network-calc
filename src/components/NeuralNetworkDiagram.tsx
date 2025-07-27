import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { NNState } from '@/types';

interface NeuralNetworkDiagramProps {
  nnState: NNState;
  highlight: { nodes: string[]; weights: string[] };
  className?: string;
}

interface NodeData {
  id: string;
  x: number;
  y: number;
  layer: number;
  value: string;
  label: string;
}

interface LinkData {
  source: string;
  target: string;
  weight: string;
  value: number;
}

const NeuralNetworkDiagram: React.FC<NeuralNetworkDiagramProps> = ({ 
  nnState, 
  highlight, 
  className = '' 
}) => {
  const { inputs, weights, calculated } = nnState;
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Draw the network with D3
  useEffect(() => {
    if (!svgRef.current || !dimensions.width) return;

    // Clear previous render
    d3.select(svgRef.current).selectAll('*').remove();

    // Create SVG container
    const svg = d3.select(svgRef.current);
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;
    
    // Add white background
    svg.append('rect')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('fill', 'white');

    // Create layers for better z-index control
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .attr('class', 'nn-content');

    // Define node positions in layers (input, hidden, output, and bias layers)
    const layers = [
      { id: 'input', nodes: ['i1', 'i2'], x: 0.1 },
      { id: 'input-bias', nodes: ['b0'], x: 0.2 },  // Bias node for input layer
      { id: 'hidden', nodes: ['h1', 'h2'], x: 0.5 },
      { id: 'hidden-bias', nodes: ['b1'], x: 0.6 },  // Bias node for hidden layer
      { id: 'output', nodes: ['o1', 'o2'], x: 0.9 }
    ];

    // Create nodes data
    const nodes: NodeData[] = [];
    layers.forEach((layer, layerIndex) => {
      layer.nodes.forEach((nodeId) => {
        let value = '1.0'; // Default for bias nodes
        let label = nodeId;
        
        if (nodeId.startsWith('i')) {
          // Input nodes
          value = inputs[nodeId as keyof typeof inputs]?.toFixed(2) ?? '0.00';
        } else if (nodeId.startsWith('h') || nodeId.startsWith('o')) {
          // Hidden and output nodes
          value = calculated[`out_${nodeId}` as keyof typeof calculated]?.toFixed(4) ?? '0.0000';
        } else if (nodeId.startsWith('b')) {
          // Bias nodes (b1 for hidden layer, b2 for output layer)
          label = 'b';
          // Set value to 1.0 for bias nodes (bias is always 1, weight is what changes)
          value = '1.0';
        }

        // Adjust y-position for bias nodes to be centered vertically
        let yPos;
        if (nodeId.startsWith('b')) {
          // Position bias nodes in the middle of their layer
          yPos = height / 2;
        } else {
          // Position regular nodes with equal spacing
          const nodeIndex = layer.nodes.indexOf(nodeId);
          yPos = ((nodeIndex + 1) / (layer.nodes.length + 1)) * height;
        }

        nodes.push({
          id: nodeId,
          x: layer.x * width,
          y: yPos,
          layer: layerIndex,
          value,
          label
        });
      });
    });

    // Create links data
    const links: LinkData[] = [
      // Input to Hidden layer connections
      { source: 'i1', target: 'h1', weight: 'w1', value: weights.w1 },
      { source: 'i1', target: 'h2', weight: 'w3', value: weights.w3 },
      { source: 'i2', target: 'h1', weight: 'w2', value: weights.w2 },
      { source: 'i2', target: 'h2', weight: 'w4', value: weights.w4 },
      
      // Input bias connections (b0 to hidden nodes) - using b1 and b2 from weights
      { source: 'b0', target: 'h1', weight: 'b1', value: weights.b1 },
      { source: 'b0', target: 'h2', weight: 'b2', value: weights.b2 },
      
      // Hidden to Output layer connections
      { source: 'h1', target: 'o1', weight: 'w5', value: weights.w5 },
      { source: 'h1', target: 'o2', weight: 'w7', value: weights.w7 },
      { source: 'h2', target: 'o1', weight: 'w6', value: weights.w6 },
      { source: 'h2', target: 'o2', weight: 'w8', value: weights.w8 },
      
      // Hidden bias connections (b1 to output nodes) - using b3 and b4 from weights
      { source: 'b1', target: 'o1', weight: 'b3', value: weights.b3 },
      { source: 'b1', target: 'o2', weight: 'b4', value: weights.b4 }
    ];

    // Draw links
    const linkGroup = g.append('g').attr('class', 'links');
    
    linkGroup.selectAll<SVGPathElement, LinkData>('.link')
      .data(links)
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', (d: LinkData) => {
        const source = nodes.find(n => n.id === d.source)!;
        const target = nodes.find(n => n.id === d.target)!;
        return `M${source.x},${source.y} L${target.x},${target.y}`;
      })
      .style('stroke', (d: LinkData) => highlight.weights.includes(d.weight) ? '#3b82f6' : '#94a3b8')
      .style('stroke-width', (d: LinkData) => highlight.weights.includes(d.weight) ? 2.5 : 1.5)
      .style('stroke-opacity', (d: LinkData) => highlight.weights.includes(d.weight) ? 1 : 0.6)
      .style('fill', 'none');

    // Add weight labels - positioned closer to target nodes
    linkGroup.selectAll<SVGTextElement, LinkData>('.weight-label')
      .data(links)
      .enter()
      .append('text')
      .attr('class', 'weight-label')
      .attr('x', (d: LinkData) => {
        const source = nodes.find(n => n.id === d.source)!;
        const target = nodes.find(n => n.id === d.target)!;
        // Position at 70% from source to target
        return source.x * 0.3 + target.x * 0.7;
      })
      .attr('y', (d: LinkData) => {
        const source = nodes.find(n => n.id === d.source)!;
        const target = nodes.find(n => n.id === d.target)!;
        // Position at 70% from source to target, with a small vertical offset
        return (source.y * 0.3 + target.y * 0.7) - 5;
      })
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', (d: LinkData) => highlight.weights.includes(d.weight) ? '#1e40af' : '#475569')
      .attr('font-weight', (d: LinkData) => highlight.weights.includes(d.weight) ? 'bold' : 'normal')
      .text((d: LinkData) => `${d.weight}: ${d.value.toFixed(4)}`);

    // Draw nodes
    const nodeGroup = g.append('g').attr('class', 'nodes');
    
    const nodeElements = nodeGroup.selectAll<SVGGElement, NodeData>('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d: NodeData) => `translate(${d.x},${d.y})`);

    // Add node circles
    nodeElements.append('circle')
      .attr('r', (d: NodeData) => d.id.startsWith('b') ? 20 : 30) // Smaller circles for bias nodes
      .style('fill', (d: NodeData) => {
        if (d.id.startsWith('b')) return '#fef3c7'; // Different color for bias nodes
        return highlight.nodes.includes(d.id) ? '#dbeafe' : '#f1f5f9';
      })
      .style('stroke', (d: NodeData) => {
        if (d.id.startsWith('b')) return '#d97706'; // Different border color for bias nodes
        return highlight.nodes.includes(d.id) ? '#3b82f6' : '#94a3b8';
      })
      .style('stroke-width', (d: NodeData) => highlight.nodes.includes(d.id) ? 2 : 1.5);

    // Add node labels
    nodeElements.append('text')
      .attr('dy', -10)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('fill', (d: NodeData) => highlight.nodes.includes(d.id) ? '#1e40af' : '#1f2937')
      .text((d: NodeData) => d.label);

    // Add node values
    nodeElements.append('text')
      .attr('dy', 10)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', (d: NodeData) => highlight.nodes.includes(d.id) ? '#1e40af' : '#4b5563')
      .text((d: NodeData) => d.value);

  }, [nnState, highlight, dimensions, inputs, weights, calculated]);

  return (
    <div className="bg-white rounded-lg h-full flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800">Neural Network Structure & Values</h2>
      </div>
      <div 
        ref={containerRef}
        className={`relative w-full h-full ${className}`}
      >
        <svg 
          ref={svgRef}
          width="100%" 
          height="100%"
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          className="block"
          preserveAspectRatio="xMidYMid meet"
        />
      </div>
    </div>
  );
};

export default NeuralNetworkDiagram;
