import { Step, NNState } from '@/types';

export const steps: Step[] = [
  // Introduction
  {
    title: 'The Setup',
    explanation: 'We start with a simple neural network with two input neurons, two hidden neurons, and two output neurons. Each connection has a weight, and the hidden and output layers have a bias. Our goal is to train the network to produce target outputs (0.01, 0.99) for given inputs (0.05, 0.10).',
    formula: null,
    calculation: (state) => {
      return { result: "The initial weights, biases, and inputs are shown in the diagram above. Click 'Next' to start the Forward Pass.", newState: state };
    },
    highlight: { nodes: ['i1', 'i2', 'h1', 'h2', 'o1', 'o2'], weights: [] },
  },
  // Forward Pass
  {
    title: 'Forward Pass: Net Input for h1',
    explanation: 'First, we calculate the total net input for the first hidden neuron, $h_1$. This is a weighted sum of the inputs plus the bias.',
    formula: `$$net_{h1} = w_1 \\cdot i_1 + w_2 \\cdot i_2 + b_1 \\cdot 1$$`,
    calculation: (state) => {
      const { w1, w2 } = state.weights;
      const { i1, i2 } = state.inputs;
      const { b1 } = state.biases;
      const net_h1 = (w1 * i1) + (w2 * i2) + b1;
      const newState = { ...state, calculated: { ...state.calculated, net_h1 } };
      return { result: `(${w1} * ${i1}) + (${w2} * ${i2}) + ${b1} = ${net_h1.toFixed(4)}`, newState };
    },
    highlight: { nodes: ['i1', 'i2', 'h1'], weights: ['w1', 'w2'] },
  },
  {
    title: 'Forward Pass: Output of h1',
    explanation: 'The net input is passed through an activation function (here, the logistic/sigmoid function) to produce the neuron\'s output.',
    formula: `$$out_{h1} = \\frac{1}{1 + e^{-net_{h1}}}$$`,
    calculation: (state) => {
      const out_h1 = 1 / (1 + Math.exp(-state.calculated.net_h1));
      const newState = { ...state, calculated: { ...state.calculated, out_h1 } };
      return { result: `1 / (1 + e<sup>-${state.calculated.net_h1.toFixed(4)}</sup>) = ${out_h1.toFixed(7)}`, newState };
    },
    highlight: { nodes: ['h1'], weights: [] },
  },
  {
    title: 'Forward Pass: Net Input for h2',
    explanation: 'We do the same for the second hidden neuron, $h_2$.',
    formula: `$$net_{h2} = w_3 \\cdot i_1 + w_4 \\cdot i_2 + b_1 \\cdot 1$$`,
    calculation: (state) => {
      const { w3, w4 } = state.weights;
      const { i1, i2 } = state.inputs;
      const { b1 } = state.biases;
      const net_h2 = (w3 * i1) + (w4 * i2) + b1;
      const newState = { ...state, calculated: { ...state.calculated, net_h2 } };
      return { result: `(${w3} * ${i1}) + (${w4} * ${i2}) + ${b1} = ${net_h2.toFixed(4)}`, newState };
    },
    highlight: { nodes: ['i1', 'i2', 'h2'], weights: ['w3', 'w4'] },
  },
  {
    title: 'Forward Pass: Output of h2',
    explanation: 'And again, we squash the net input for $h_2$ to get its output.',
    formula: `$$out_{h2} = \\frac{1}{1 + e^{-net_{h2}}}$$`,
    calculation: (state) => {
      const out_h2 = 1 / (1 + Math.exp(-state.calculated.net_h2));
      const newState = { ...state, calculated: { ...state.calculated, out_h2 } };
      return { result: `1 / (1 + e<sup>-${state.calculated.net_h2.toFixed(4)}</sup>) = ${out_h2.toFixed(7)}`, newState };
    },
    highlight: { nodes: ['h2'], weights: [] },
  },
  {
    title: 'Forward Pass: Net Input for o1',
    explanation: 'Now we move to the output layer. The inputs for this layer are the outputs from the hidden layer ($out_{h1}, out_{h2}$).',
    formula: `$$net_{o1} = w_5 \\cdot out_{h1} + w_6 \\cdot out_{h2} + b_2 \\cdot 1$$`,
    calculation: (state) => {
      const { w5, w6 } = state.weights;
      const { b2 } = state.biases;
      const { out_h1, out_h2 } = state.calculated;
      const net_o1 = (w5 * out_h1) + (w6 * out_h2) + b2;
      const newState = { ...state, calculated: { ...state.calculated, net_o1 } };
      return { result: `(${w5} * ${out_h1.toFixed(3)}) + (${w6} * ${out_h2.toFixed(3)}) + ${b2} = ${net_o1.toFixed(4)}`, newState };
    },
    highlight: { nodes: ['h1', 'h2', 'o1'], weights: ['w5', 'w6'] },
  },
  {
    title: 'Forward Pass: Output of o1',
    explanation: 'We get the final output of the first output neuron, $o_1$. This is one of the network\'s predictions.',
    formula: `$$out_{o1} = \\frac{1}{1 + e^{-net_{o1}}}$$`,
    calculation: (state) => {
      const out_o1 = 1 / (1 + Math.exp(-state.calculated.net_o1));
      const newState = { ...state, calculated: { ...state.calculated, out_o1 } };
      return { result: `1 / (1 + e<sup>-${state.calculated.net_o1.toFixed(4)}</sup>) = ${out_o1.toFixed(7)}`, newState };
    },
    highlight: { nodes: ['o1'], weights: [] },
  },
  {
    title: 'Forward Pass: Net Input for o2',
    explanation: 'We repeat the process for the second output neuron, $o_2$.',
    formula: `$$net_{o2} = w_7 \\cdot out_{h1} + w_8 \\cdot out_{h2} + b_2 \\cdot 1$$`,
    calculation: (state) => {
      const { w7, w8 } = state.weights;
      const { b2 } = state.biases;
      const { out_h1, out_h2 } = state.calculated;
      const net_o2 = (w7 * out_h1) + (w8 * out_h2) + b2;
      const newState = { ...state, calculated: { ...state.calculated, net_o2 } };
      return { result: `(${w7} * ${out_h1.toFixed(3)}) + (${w8} * ${out_h2.toFixed(3)}) + ${b2} = ${net_o2.toFixed(4)}`, newState };
    },
    highlight: { nodes: ['h1', 'h2', 'o2'], weights: ['w7', 'w8'] },
  },
  {
    title: 'Forward Pass: Output of o2',
    explanation: 'And we get the final prediction from the second output neuron, $o_2$.',
    formula: `$$out_{o2} = \\frac{1}{1 + e^{-net_{o2}}}$$`,
    calculation: (state) => {
      const out_o2 = 1 / (1 + Math.exp(-state.calculated.net_o2));
      const newState = { ...state, calculated: { ...state.calculated, out_o2 } };
      return { result: `1 / (1 + e<sup>-${state.calculated.net_o2.toFixed(4)}</sup>) = ${out_o2.toFixed(7)}`, newState };
    },
    highlight: { nodes: ['o2'], weights: [] },
  },
  // Error Calculation
  {
    title: 'Error Calculation: E_o1',
    explanation: 'Now that we have the predictions, we can calculate how \'wrong\' they are. We use the squared error formula. First, for $o_1$.',
    formula: `$$E_{o1} = \\frac{1}{2}(target_{o1} - out_{o1})^2$$`,
    calculation: (state) => {
      const { o1 } = state.targets;
      const { out_o1 } = state.calculated;
      const E_o1 = 0.5 * Math.pow(o1 - out_o1, 2);
      const newState = { ...state, calculated: { ...state.calculated, E_o1 } };
      return { result: `0.5 * (${o1} - ${out_o1.toFixed(4)})² = ${E_o1.toFixed(7)}`, newState };
    },
    highlight: { nodes: ['o1'], weights: [] },
  },
  {
    title: 'Error Calculation: E_o2',
    explanation: 'Then we calculate the error for $o_2$.',
    formula: `$$E_{o2} = \\frac{1}{2}(target_{o2} - out_{o2})^2$$`,
    calculation: (state) => {
      const { o2 } = state.targets;
      const { out_o2 } = state.calculated;
      const E_o2 = 0.5 * Math.pow(o2 - out_o2, 2);
      const newState = { ...state, calculated: { ...state.calculated, E_o2 } };
      return { result: `0.5 * (${o2} - ${out_o2.toFixed(4)})² = ${E_o2.toFixed(7)}`, newState };
    },
    highlight: { nodes: ['o2'], weights: [] },
  },
  {
    title: 'Error Calculation: Total Error',
    explanation: 'The total error for the network is the sum of the individual errors. This is the value we want to minimize.',
    formula: `$$E_{total} = E_{o1} + E_{o2}$$`,
    calculation: (state) => {
      const { E_o1, E_o2 } = state.calculated;
      const E_total = E_o1 + E_o2;
      const newState = { ...state, calculated: { ...state.calculated, E_total, initialError: E_total } };
      return { result: `${E_o1.toFixed(4)} + ${E_o2.toFixed(4)} = ${E_total.toFixed(7)}`, newState };
    },
    highlight: { nodes: ['o1', 'o2'], weights: [] },
  },
  // Backward Pass
  {
    title: 'Backward Pass: Gradient for w5',
    explanation: 'Now the \'learning\' begins. We go backward, updating weights to reduce the error. We use the chain rule to find how much the total error changes with respect to each weight. Let\'s start with $w_5$.',
    formula: `$$\\frac{\\partial E_{total}}{\\partial w_5} = \\frac{\\partial E_{total}}{\\partial out_{o1}} \\cdot \\frac{\\partial out_{o1}}{\\partial net_{o1}} \\cdot \\frac{\\partial net_{o1}}{\\partial w_5}$$`,
    calculation: (state) => {
      const { out_o1, out_h1 } = state.calculated;
      const { o1 } = state.targets;
      const dE_douto1 = out_o1 - o1;
      const douto1_dneto1 = out_o1 * (1 - out_o1);
      const dneto1_dw5 = out_h1;
      const dE_dw5 = dE_douto1 * douto1_dneto1 * dneto1_dw5;
      const delta_o1 = dE_douto1 * douto1_dneto1;
      const newState = { ...state, calculated: { ...state.calculated, dE_dw5, delta_o1 } };
      return { result: `Gradient for w5 = ${dE_dw5.toFixed(7)}`, newState };
    },
    highlight: { nodes: ['o1', 'h1'], weights: ['w5'] },
  },
  {
    title: 'Backward Pass: Update w5',
    explanation: 'We update the weight by moving it in the opposite direction of the gradient, scaled by a learning rate $\\eta$ (here, 0.5).',
    formula: `$$w_5^{new} = w_5 - \\eta \\cdot \\frac{\\partial E_{total}}{\\partial w_5}$$`,
    calculation: (state) => {
      const w5_new = state.weights.w5 - state.learningRate * state.calculated.dE_dw5;
      const newWeights = { ...state.weights, w5: w5_new };
      const newState = { ...state, weights: newWeights };
      return { result: `${state.weights.w5.toFixed(2)} - ${state.learningRate} * ${state.calculated.dE_dw5.toFixed(4)} = ${w5_new.toFixed(7)}`, newState };
    },
    highlight: { nodes: [], weights: ['w5'] },
  },
  {
    title: 'Backward Pass: Update w6, w7, w8',
    explanation: 'We repeat the same process for the other weights in the output layer ($w_6, w_7, w_8$). The calculations follow the same chain rule logic.',
    formula: `$$w_6^{new} = w_6 - \\eta \\cdot \\delta_{o1} \\cdot out_{h2} \\\\ w_7^{new} = w_7 - \\eta \\cdot \\delta_{o2} \\cdot out_{h1} \\\\ w_8^{new} = w_8 - \\eta \\cdot \\delta_{o2} \\cdot out_{h2}$$`,
    calculation: (state) => {
      const { out_o2, out_h1, out_h2, delta_o1 } = state.calculated;
      const { o2 } = state.targets;
      const dE_douto2 = out_o2 - o2;
      const douto2_dneto2 = out_o2 * (1 - out_o2);
      const delta_o2 = dE_douto2 * douto2_dneto2;

      const dE_dw6 = delta_o1 * out_h2;
      const w6_new = state.weights.w6 - state.learningRate * dE_dw6;

      const dE_dw7 = delta_o2 * out_h1;
      const w7_new = state.weights.w7 - state.learningRate * dE_dw7;

      const dE_dw8 = delta_o2 * out_h2;
      const w8_new = state.weights.w8 - state.learningRate * dE_dw8;

      const newWeights = { ...state.weights, w6: w6_new, w7: w7_new, w8: w8_new };
      const newState = { ...state, weights: newWeights, calculated: { ...state.calculated, delta_o2 } };

      return { result: `w6: ${w6_new.toFixed(4)}, w7: ${w7_new.toFixed(4)}, w8: ${w8_new.toFixed(4)}`, newState };
    },
    highlight: { nodes: ['h1', 'h2', 'o1', 'o2'], weights: ['w6', 'w7', 'w8'] },
  },
  {
    title: 'Backward Pass: Gradient for w1',
    explanation: 'For the hidden layer weights, the process is similar but more complex. The error from a hidden neuron ($h_1$) is distributed across all output neurons it connects to ($o_1, o_2$). We sum its error contribution from each.',
    formula: `$$\\frac{\\partial E_{total}}{\\partial w_1} = (\\sum_{k} \\frac{\\partial E_{total}}{\\partial out_k} \\frac{\\partial out_k}{\\partial net_k} \\frac{\\partial net_k}{\\partial out_{h1}}) \\cdot \\frac{\\partial out_{h1}}{\\partial net_{h1}} \\cdot \\frac{\\partial net_{h1}}{\\partial w_1}$$`,
    calculation: (state) => {
      const { delta_o1, delta_o2, out_h1 } = state.calculated;
      const { w5, w7 } = state.weights;

      const dE_douth1 = (delta_o1 * w5) + (delta_o2 * w7);
      const douth1_dneth1 = out_h1 * (1 - out_h1);
      const delta_h1 = dE_douth1 * douth1_dneth1;

      const dE_dw1 = delta_h1 * state.inputs.i1;
      const w1_new = state.weights.w1 - state.learningRate * dE_dw1;

      const newWeights = { ...state.weights, w1: w1_new };
      const newState = { ...state, weights: newWeights, calculated: { ...state.calculated, delta_h1, dE_dw1 } };

      return { result: `Gradient for w1 = ${dE_dw1.toFixed(7)}`, newState };
    },
    highlight: { nodes: ['i1', 'h1'], weights: ['w1'] },
  },
  {
    title: 'Backward Pass: Update w1, w2, w3, w4',
    explanation: 'Finally, we update all the hidden layer weights using their respective gradients. The network has now completed one full training cycle.',
    formula: `$$w_1^{new} = w_1 - \\eta \\cdot \\delta_{h1} \\cdot i_1 \\\\ w_2^{new} = w_2 - \\eta \\cdot \\delta_{h1} \\cdot i_2 \\\\ ...etc$$`,
    calculation: (state) => {
      const { delta_h1, delta_o1, delta_o2, out_h2 } = state.calculated;
      const { w6, w8 } = state.weights;
      const { i1, i2 } = state.inputs;

      const dE_dw2 = delta_h1 * i2;
      const w2_new = state.weights.w2 - state.learningRate * dE_dw2;

      const dE_douth2 = (delta_o1 * w6) + (delta_o2 * w8);
      const douth2_dneth2 = out_h2 * (1 - out_h2);
      const delta_h2 = dE_douth2 * douth2_dneth2;

      const dE_dw3 = delta_h2 * i1;
      const w3_new = state.weights.w3 - state.learningRate * dE_dw3;

      const dE_dw4 = delta_h2 * i2;
      const w4_new = state.weights.w4 - state.learningRate * dE_dw4;

      const newWeights = { ...state.weights, w2: w2_new, w3: w3_new, w4: w4_new };
      const newState = { ...state, weights: newWeights };

      return { result: `w2: ${w2_new.toFixed(4)}, w3: ${w3_new.toFixed(4)}, w4: ${w4_new.toFixed(4)}`, newState };
    },
    highlight: { nodes: ['i1', 'i2', 'h1', 'h2'], weights: ['w2', 'w3', 'w4'] },
  },
];
