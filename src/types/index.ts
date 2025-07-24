export interface NNState {
  weights: {
    w1: number; w2: number; w3: number; w4: number;
    w5: number; w6: number; w7: number; w8: number;
  };
  biases: { b1: number; b2: number };
  inputs: { i1: number; i2: number };
  targets: { o1: number; o2: number };
  learningRate: number;
  calculated: { [key: string]: number };
}

export interface Step {
  title: string;
  explanation: string;
  formula: string | null;
  calculation: (state: NNState) => { result: string; newState: NNState };
  highlight: {
    nodes: string[];
    weights: string[];
  };
}
