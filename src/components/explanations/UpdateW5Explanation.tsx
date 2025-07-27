import React, { useRef } from 'react';
import { KatexComponent } from '../KatexComponent';
// Import Chart.js and register required components
import { Chart as ChartJS, registerables } from 'chart.js';
import { Chart as ReactChart } from 'react-chartjs-2';
import type { 
  ChartOptions,
  ChartData,
  Point
} from 'chart.js';

// Register all required Chart.js components
ChartJS.register(...registerables);

type ChartTypeName = 'line';
type ChartDataPoint = number | null | Point;

// Function to calculate y = x^2
const quadraticFunction = (x: number) => x * x;

const UpdateW5Explanation: React.FC = () => {
  const chartRef = useRef<InstanceType<typeof ChartJS<ChartTypeName, ChartDataPoint[], unknown>>>(null);
  
  // Generate x-values for the plot
  const xValues = Array.from({length: 100}, (_, i) => -5 + (i / 10));
  
  // Points where we'll draw tangent lines
  const tangentPoints = [-3, -1.5, 0, 1.5, 3];
  
  // Calculate the quadratic function values
  const quadraticData = xValues.map(x => ({
    x,
    y: quadraticFunction(x)
  }));
  
  // Generate tangent lines at specified points
  const tangentLines = tangentPoints.map((x, i) => {
    const y = quadraticFunction(x);
    const slope = 2 * x; // derivative of x² is 2x
    
      // Calculate two points for the tangent line (extend 2 units in each direction from the point)
    const x1 = x - 2;
    const y1 = slope * (x1 - x) + y;
    const x2 = x + 2;
    const y2 = slope * (x2 - x) + y;
    
    return {
      label: `Tangent at x=${x}`,
      data: [
        { x: x1, y: y1 },
        { x: x2, y: y2 }
      ],
      borderColor: `hsl(${i * 72}, 70%, 50%)`,
      borderWidth: 2,
      borderDash: [5, 5],
      pointRadius: 0,
      showLine: true
    };
  });
  
  // Chart data
  const chartData: ChartData<ChartTypeName> = {
    datasets: [
      {
        label: 'y = x²',
        data: quadraticData,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 3,
        pointRadius: 0,
        tension: 0.1
      },
      ...tangentLines,
      {
        label: 'Minimum Point',
        data: [{ x: 0, y: 0 }],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 5,
        pointRadius: 8,
        pointHoverRadius: 10
      }
    ]
  };
  
  const chartOptions: ChartOptions<ChartTypeName> = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.5, // Wider than tall for better visualization
    layout: {
      padding: {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        onClick: (e) => e.native?.stopPropagation()
      },
      title: {
        display: true,
        text: 'Quadratic Function with Tangent Lines',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            if (context.parsed.y !== null) {
              return `${label}: (${context.parsed.x.toFixed(2)}, ${context.parsed.y.toFixed(2)})`;
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'linear',
        position: 'center',
        title: {
          display: true,
          text: 'x (weight value)'
        },
        min: -4,
        max: 4,
        grid: {
          color: 'rgba(200, 200, 200, 0.2)'
        }
      },
      y: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'Loss (y = x²)'
        },
        min: -2,
        max: 20,
        grid: {
          color: 'rgba(200, 200, 200, 0.2)'
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const
    }
  };
  
  return (
    <div className="space-y-4">
      <p>
        Now that we&apos;ve calculated the gradient for w5, we can update the weight using gradient descent.
      </p>
      
      <div className="my-4 p-4 bg-gray-50 rounded">
        <KatexComponent 
          formula="w_{\text{new}} = w_{\text{old}} - \eta \cdot \frac{\partial E_{\text{total}}}{\partial w}"
          displayMode={true}
        />
      </div>

      <p>Where:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li><KatexComponent formula="w_{\text{new}}" /> is the updated weight</li>
        <li><KatexComponent formula="w_{\text{old}}" /> is the current weight</li>
        <li><KatexComponent formula="\eta" /> is the learning rate (here, 0.5)</li>
        <li><KatexComponent formula="\frac{\partial E_{\text{total}}}{\partial w}" /> is the gradient we calculated</li>
      </ul>

      <h3 className="text-lg font-semibold mt-6 mb-2">Intuition Behind the Update</h3>
      
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">1. Gradient Descent</h4>
          <p>We move the weight in the opposite direction of the gradient because the gradient points in the direction of steepest increase, and we want to minimize the error.</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">2. Learning Rate <KatexComponent formula="(\eta)" /></h4>
          <p>This hyperparameter controls how big of a step we take in the direction of the negative gradient.</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Higher learning rate: Larger steps, faster learning, but might overshoot the minimum</li>
            <li>Lower learning rate: More stable, but might require more iterations to converge</li>
          </ul>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-2">3. The Negative Sign</h4>
          <p>Ensures we move against the gradient, towards the minimum of the error function.</p>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Visualizing Gradient Descent</h3>
        <p className="mb-4">
          The chart below illustrates the concept of gradient descent using a simplified example. For visualization purposes, 
          we&apos;re assuming the relationship between weight w5 and the error follows the function y = x². In this simplified view:
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>The x-axis shows different values of w5</li>
          <li>The y-axis shows the corresponding error (loss)</li>
          <li>The blue curve represents our assumed error function y = x²</li>
          <li>Dashed lines show the gradient (slope) at different w5 values</li>
        </ul>
        <p className="mb-4 text-sm text-gray-600">
          Note: In a real neural network, the error landscape would be much more complex, but this simple example helps 
          demonstrate the core concept of gradient-based optimization.
        </p>
        
        <div className="w-full max-w-3xl mx-auto h-[500px] bg-white p-6 rounded-lg shadow-md">
          <ReactChart 
            ref={chartRef}
            type='line' 
            data={chartData} 
            options={chartOptions} 
          />
        </div>
        
        <div className="mt-4 p-4 bg-purple-50 rounded-md">
          <h4 className="font-semibold mb-2">Key Observations About Weight w5 and Error:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>The blue curve shows how the error changes as we adjust weight w5</li>
            <li>Dashed lines show the gradient (rate of change) of the error at different w5 values</li>
            <li>The red point marks the optimal w5 value (0) where error is minimized</li>
            <li>When w5 &lt; 0: Negative gradient → Increase w5 to reduce error</li>
            <li>When w5 &gt; 0: Positive gradient → Decrease w5 to reduce error</li>
            <li>At w5 = 0: Zero gradient → We&apos;ve found the optimal weight value</li>
          </ul>
        </div>
        
        <div className="mt-8 space-y-6">
        <div className="p-4 bg-blue-50 rounded-md">
          <h4 className="font-semibold mb-2">Adjusting Weight w5 Based on Gradient:</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li><span className="font-medium">Negative Gradient</span>: When the gradient is negative at current w5, we increase w5 to reduce the error. The steeper the slope, the larger the adjustment needed.</li>
            <li><span className="font-medium">Positive Gradient</span>: When the gradient is positive at current w5, we decrease w5 to reduce the error. The steeper the slope, the larger the adjustment needed.</li>
            <li><span className="font-medium">Zero Gradient</span>: When the gradient is zero, we&apos;ve found a critical point where adjusting w5 won&apos;t reduce the error further (minimum error in this case).</li>
          </ul>
        </div>

        <div className="p-4 bg-green-50 rounded-md">
          <h4 className="font-semibold mb-2">Finding the Optimal w5 Value:</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li><span className="font-medium">Optimal Weight (w5=0)</span>: In our simple example, the error is minimized when w5 is 0. This is where the gradient is zero and the curve is at its lowest point.</li>
            <li><span className="font-medium">Learning Rate</span>: The size of the step we take when updating w5. In practice, we multiply the gradient by a small learning rate to control how quickly we adjust the weights.</li>
            <li><span className="font-medium">Gradient Descent</span>: The process of iteratively adjusting w5 in the direction that reduces the error, using the gradient to determine the direction and size of each update.</li>
          </ul>
        </div>

        <div className="p-4 bg-yellow-50 rounded-md">
          <h4 className="font-medium">From Simple Example to Real Neural Networks:</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li><span className="font-medium">Multiple Weights</span>: Real networks have millions or billions of weights, not just one. Each weight has its own dimension in the loss landscape.</li>
            <li><span className="font-medium">Complex Landscapes</span>: The error surface becomes a high-dimensional space with many hills, valleys, and plateaus, but the core idea remains: follow the gradient to reduce error.</li>
            <li><span className="font-medium">Optimization Challenges</span>: In practice, we use advanced techniques like momentum, adaptive learning rates, and batch processing to navigate these complex spaces effectively.</li>
            <li><span className="font-medium">Generalization in Large Models</span>: In large language models (LLMs) with billions of parameters, finding the global minimum is computationally intractable and often unnecessary. The loss landscape is so complex and high-dimensional that we can&apos;t even verify if we&apos;ve found a global minimum. Fortunately, local minima often provide excellent performance, especially when they&apos;re in flatter regions of the loss landscape. This is why modern neural networks, including LLMs, can achieve remarkable results despite not finding the absolute optimal solution.</li>
          </ul>
        </div>
      </div>
      </div>
    </div>
  );
};

export default UpdateW5Explanation;
