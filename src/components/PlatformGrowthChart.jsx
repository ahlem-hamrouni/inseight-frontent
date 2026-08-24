import { Line } from 'react-chartjs-2';
import {
  CategoryScale, Chart as ChartJS, LinearScale, LineElement, PointElement, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function PlatformGrowthChart({ data = [] }) {
  const chartData = {
    labels: data.length > 0 ? data.map((item) => item.month) : ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Users',
        data: data.length > 0 ? data.map((item) => item.count) : [1200, 1500, 1800, 2100, 2456],
        borderColor: '#3B82F6',
        backgroundColor: '#3B82F6',
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#3B82F6',
        tension: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'center',
        labels: {
          usePointStyle: false,
          boxWidth: 25,
          boxHeight: 12,
          color: '#64748B',
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: '#F1F5F9',
        },
        ticks: {
          color: '#94A3B8',
        },
      },
      y: {
        grid: {
          color: '#F1F5F9',
        },
        ticks: {
          color: '#94A3B8',
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
}