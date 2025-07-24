import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { NNState } from '@/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SummaryChartProps {
  nnState: NNState;
}

const SummaryChart: React.FC<SummaryChartProps> = ({ nnState }) => {
  const data = {
    labels: ['Error'],
    datasets: [
      {
        label: 'Initial Total Error',
        data: [nnState.calculated.initialError || 0],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Current Total Error',
        data: [nnState.calculated.E_total || 0],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Error Comparison',
      },
    },
    scales: {
        y: {
            beginAtZero: true,
        }
    }
  };

  return (
    <section id="summary-section" className="bg-white rounded-lg shadow-md p-6 md:p-8">
      <h2 className="text-2xl font-bold text-center mb-6">Summary: Error Reduction</h2>
      <p className="text-center text-slate-600 mb-6 max-w-2xl mx-auto">
        This chart shows the total error before and after one round of backpropagation. In a real scenario, we would repeat this process many times (epochs) to minimize the error.
      </p>
      <div className="chart-container">
        <Bar options={options} data={data} />
      </div>
    </section>
  );
};

export default SummaryChart;
