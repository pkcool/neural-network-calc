export interface NNState {
  weights: {
    // Input to hidden layer weights
    w1: number; w2: number; w3: number; w4: number;
    // Hidden to output layer weights
    w5: number; w6: number; w7: number; w8: number;
    // Bias weights (b1, b2 for hidden layer, b3, b4 for output layer)
    b1: number; b2: number; b3: number; b4: number;
  };
  // Kept for backward compatibility, but should use weights.b1, weights.b2, etc.
  biases: { b1: number; b2: number };
  inputs: { i1: number; i2: number };
  targets: { o1: number; o2: number };
  learningRate: number;
  calculated: { [key: string]: number };
}

import { ReactNode } from 'react';

export interface Step {
  title: string;
  explanation: string | ReactNode;
  formula: string | null;
  calculation: (state: NNState) => { result: string; newState: NNState };
  highlight: {
    nodes: string[];
    weights: string[];
  };
}
