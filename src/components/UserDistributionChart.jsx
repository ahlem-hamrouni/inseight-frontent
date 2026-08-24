import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function UserDistributionChart({ distribution = {} }) {
  const chartData = {
    labels: ['Students', 'Teachers', 'Admins'],
    datasets: [
      {
        data: [
          distribution.students || 0,
          distribution.teachers || 0,
          distribution.admins || 0,
        ],
        backgroundColor: ['#2563EB', '#60A5FA', '#93C5FD'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#94A3B8' } },
    },
    cutout: '70%',
  };

  return <Doughnut data={chartData} options={options} />;
}