import React from 'react';
import { BarChart3, TrendingUp, Users, Brain, Award } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';

interface InsightsDashboardProps {
  data: {
    ideaMetrics: {
      totalIdeas: number;
      trendingIdeas: number;
      averageRating: number;
      collaborations: number;
    };
    activityData: {
      labels: string[];
      datasets: any[];
    };
  };
}

export function InsightsDashboard({ data }: InsightsDashboardProps) {
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  const metrics = [
    {
      title: 'Total Ideas',
      value: data.ideaMetrics.totalIdeas,
      change: '+12%',
      icon: Brain,
      color: 'text-blue-500',
    },
    {
      title: 'Trending Ideas',
      value: data.ideaMetrics.trendingIdeas,
      change: '+5%',
      icon: TrendingUp,
      color: 'text-green-500',
    },
    {
      title: 'Average Rating',
      value: data.ideaMetrics.averageRating.toFixed(1),
      change: '+0.3',
      icon: Award,
      color: 'text-yellow-500',
    },
    {
      title: 'Collaborations',
      value: data.ideaMetrics.collaborations,
      change: '+8%',
      icon: Users,
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <BarChart3 className="h-6 w-6 text-yellow-500 mr-2" />
          <h2 className="text-xl font-bold">Insights Dashboard</h2>
        </div>
        <select className="text-sm border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500">
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-50 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <metric.icon className={`h-5 w-5 ${metric.color}`} />
              <span className={`text-sm font-medium ${
                metric.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
              }`}>
                {metric.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{metric.value}</h3>
            <p className="text-sm text-gray-600">{metric.title}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Activity Trend</h3>
        <div className="h-64">
          <Line data={data.activityData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}