import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function StudentsByGroupChart({ data = [] }) {
  const chartData = {
    labels: data.map((item) => item.group || 'Sans groupe'),
    datasets: [
      {
        data: data.map((item) => item.count),
        backgroundColor: [
          '#10B981', '#3B82F6', '#60A5FA', '#EC4899', '#8B5CF6', '#6366F1'
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#94A3B8' } },
    },
  };

  return <Pie data={chartData} options={options} />;
}