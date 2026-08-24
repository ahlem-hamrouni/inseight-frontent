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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function StudentsByLevelChart({ data = [] }) {
  const chartData = {
    labels: data.map((item) => item.level || 'Unassigned'),
    datasets: [
      {
        label: 'Étudiants',
        data: data.map((item) => item.count),
        backgroundColor:'#3B82F6',
        borderRadius: 6,
        barThickness: 28,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
  };

  return <Bar data={chartData} options={options} />;
}