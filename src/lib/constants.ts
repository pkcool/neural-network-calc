import { NNState } from '@/types';

export const INITIAL_STATE: NNState = {
  weights: { w1: 0.15, w2: 0.20, w3: 0.25, w4: 0.30, w5: 0.40, w6: 0.45, w7: 0.50, w8: 0.55 },
  biases: { b1: 0.35, b2: 0.60 },
  inputs: { i1: 0.05, i2: 0.10 },
  targets: { o1: 0.01, o2: 0.99 },
  learningRate: 0.5,
  calculated: {},
};
