import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Line } from 'react-chartjs-2';

interface InsightCardProps {
  title: string;
  value: number;
  change: number;
  trend: number[];
  timeframe: string;
}

export function InsightCard({ title, value, change, trend, timeframe }: InsightCardProps) {
  const isPositive = change >= 0;

  const chartData = {
    labels: trend.map((_, i) => i + 1),
    datasets: [
      {
        data: trend,
        borderColor: isPositive ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <span className="text-xs text-gray-400">{timeframe}</span>
      </div>
      <div className="flex items-baseline space-x-2">
        <span className="text-2xl font-bold">{value}</span>
        <div
          className={`flex items-center text-sm ${
            isPositive ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {isPositive ? (
            <TrendingUp className="h-4 w-4 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 mr-1" />
          )}
          {Math.abs(change)}%
        </div>
      </div>
      <div className="h-16 mt-4">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}