// Import everything from chart.js
import * as ChartJS from 'chart.js/auto';

// Explicitly import and register the linear scale
import { LinearScale, CategoryScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register all the components we'll use
ChartJS.Chart.register(
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Export types
export type { 
  ChartData, 
  ChartOptions, 
  ChartType, 
  ScaleType, 
  Point,
  ChartDataset
} from 'chart.js';

// Export the configured ChartJS instance
export { ChartJS };

// Export React Chart component
export { Chart as ReactChart } from 'react-chartjs-2';
