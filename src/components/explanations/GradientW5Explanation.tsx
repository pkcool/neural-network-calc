import React from 'react';
import { KatexComponent } from '../KatexComponent';

const GradientW5Explanation: React.FC = () => {
  return (
    <div className="space-y-4">
      <p>
        The backward pass is where the actual learning happens through backpropagation. 
        We&apos;ll calculate how much a change in each weight affects the total error using 
        the chain rule of calculus. Let&apos;s start with weight w5.
      </p>
      
      <h3 className="text-lg font-semibold mt-6 mb-2">Understanding the Notation</h3>
      
      <p>
        The expression <KatexComponent formula="\frac{\partial E_{\text{total}}}{\partial w_5}" /> is read as 
        &ldquo;the partial derivative of <KatexComponent formula="E_{total}" /> with respect to <KatexComponent formula="w_5" />&rdquo;. 
        You can also say &ldquo;the gradient with respect to <KatexComponent formula="w_5" />&rdquo;. This tells us how 
        much the total error changes as we adjust the weight <KatexComponent formula="w_5" />, with all other 
        weights held constant. Our goal is to find this value so we can adjust <KatexComponent formula="w_5" /> 
        to minimize the total error.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">Step 1: Calculate the partial derivative of total error with respect to out_o1</h2>
      
      <p>We&apos;ll use the mean squared error function:</p>
      
      <div className="my-4 p-4 bg-gray-50 rounded">
        <KatexComponent 
          formula="E_{total} = \frac{1}{2}(target_{o1} - out_{o1})^2 + \frac{1}{2}(target_{o2} - out_{o2})^2" 
          displayMode={true}
        />
      </div>
      
      <p>The partial derivative is:</p>
      
      <div className="my-4 p-4 bg-gray-50 rounded">
        <KatexComponent 
          formula="\frac{\partial E_{total}}{\partial out_{o1}} = -(target_{o1} - out_{o1}) = out_{o1} - target_{o1}" 
          displayMode={true}
        />
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-4">Step 2: Calculate the derivative of out_o1 with respect to net_o1</h2>
      
      <p>Since we&apos;re using the sigmoid activation function:</p>
      
      <div className="my-4 p-4 bg-gray-50 rounded">
        <KatexComponent 
          formula="out_{o1} = \frac{1}{1 + e^{-net_{o1}}}" 
          displayMode={true}
        />
      </div>
      
      <p>The derivative is:</p>
      
      <div className="my-4 p-4 bg-gray-50 rounded">
        <KatexComponent 
          formula="\frac{\partial out_{o1}}{\partial net_{o1}} = out_{o1}(1 - out_{o1})" 
          displayMode={true}
        />
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-4">Step 3: Calculate the partial derivative of net_o1 with respect to w5</h2>
      
      <div className="my-4 p-4 bg-gray-50 rounded">
        <KatexComponent 
          formula="net_{o1} = w_5 \cdot out_{h1} + w_6 \cdot out_{h2} + b_2 \cdot 1" 
          displayMode={true}
        />
      </div>
      
      <div className="my-4 p-4 bg-gray-50 rounded">
        <KatexComponent 
          formula="\frac{\partial net_{o1}}{\partial w_5} = out_{h1}" 
          displayMode={true}
        />
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-4">Final Gradient Calculation</h2>
      
      <p>Putting it all together using the chain rule:</p>
      
      <div className="my-4 p-4 bg-gray-50 rounded">
        <KatexComponent 
          formula="\frac{\partial E_{total}}{\partial w_5} = \frac{\partial E_{total}}{\partial out_{o1}} \cdot \frac{\partial out_{o1}}{\partial net_{o1}} \cdot \frac{\partial net_{o1}}{\partial w_5}" 
          displayMode={true}
        />
      </div>
      
      <p>Substituting the values we calculated earlier:</p>
      
      <ol className="list-decimal list-inside my-4 space-y-2 pl-4">
        <li>
          <KatexComponent 
            formula="\frac{\partial E_{total}}{\partial out_{o1}} = 0.7414" 
            displayMode={false}
          /> (from error derivative)
        </li>
        <li>
          <KatexComponent 
            formula="\frac{\partial out_{o1}}{\partial net_{o1}} = out_{o1}(1 - out_{o1}) = 0.1868" 
            displayMode={false}
          /> (sigmoid derivative)
        </li>
        <li>
          <KatexComponent 
            formula="\frac{\partial net_{o1}}{\partial w_5} = out_{h1} = 0.5933" 
            displayMode={false}
          /> (weight gradient)
        </li>
      </ol>
      
      <p>Now multiply them together:</p>
      
      <div className="my-4 p-4 bg-gray-50 rounded">
        <KatexComponent 
          formula="\frac{\partial E_{total}}{\partial w_5} = 0.7414 \times 0.1868 \times 0.5933 = 0.0821670" 
          displayMode={true}
        />
      </div>
      
      <p className="mt-6">
        This gives us the gradient we&apos;ll use to update weight w5.
      </p>
    </div>
  );
};

export default GradientW5Explanation;
