import { NNState } from '@/types';

export const INITIAL_STATE: NNState = {
  weights: { 
    // Input to hidden layer weights
    w1: 0.15, w2: 0.20, w3: 0.25, w4: 0.30, 
    // Hidden to output layer weights
    w5: 0.40, w6: 0.45, w7: 0.50, w8: 0.55,
    // Bias weights (b1, b2 for hidden layer, b3, b4 for output layer)
    b1: 0.35, b2: 0.35, b3: 0.60, b4: 0.60
  },
  // Kept for backward compatibility, but should use weights.b1, weights.b2, etc.
  biases: { b1: 0.35, b2: 0.60 },
  inputs: { i1: 0.05, i2: 0.10 },
  targets: { o1: 0.01, o2: 0.99 },
  learningRate: 0.5,
  calculated: {},
};
