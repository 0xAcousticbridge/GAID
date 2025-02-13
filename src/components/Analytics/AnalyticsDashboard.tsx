import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Star, Eye, MessageSquare, Share2 } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AnalyticsDashboardProps {
  data: {
    views: number[];
    engagement: number[];
    shares: number[];
    dates: string[];
  };
}

export function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
  const metrics = [
    {
      title: 'Total Views',
      value: data.views.reduce((a, b) => a + b, 0),
      change: '+12%',
      icon: Eye,
      color: 'text-blue-500'
    },
    {
      title: 'Engagement Rate',
      value: '8.5%',
      change: '+3.2%',
      icon: MessageSquare,
      color: 'text-green-500'
    },
    {
      title: 'Shares',
      value: data.shares.reduce((a, b) => a + b, 0),
      change: '+5%',
      icon: Share2,
      color: 'text-purple-500'
    }
  ];

  const lineChartData = {
    labels: data.dates,
    datasets: [
      {
        label: 'Views',
        data: data.views,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const barChartData = {
    labels: data.dates,
    datasets: [
      {
        label: 'Engagement',
        data: data.engagement,
        backgroundColor: 'rgba(16, 185, 129, 0.8)'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      }
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-700/50 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <metric.icon className={`h-5 w-5 ${metric.color}`} />
              <span className={`text-sm font-medium ${
                metric.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
              }`}>
                {metric.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-100">{metric.value}</h3>
            <p className="text-sm text-gray-400">{metric.title}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-700/50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-100 mb-4">Views Trend</h3>
          <div className="h-64">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-gray-700/50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-100 mb-4">Engagement</h3>
          <div className="h-64">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}