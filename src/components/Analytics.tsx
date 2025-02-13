import React from 'react';
import { TrendingUp, Users, Lightbulb, Star, Award, Target } from 'lucide-react';

interface AnalyticsProps {
  stats: {
    totalIdeas: number;
    totalUsers: number;
    averageRating: number;
    totalPoints: number;
    completedChallenges: number;
    achievements: number;
  };
}

export function Analytics({ stats }: AnalyticsProps) {
  const metrics = [
    {
      label: 'Total Ideas',
      value: stats.totalIdeas,
      icon: Lightbulb,
      color: 'text-blue-500',
    },
    {
      label: 'Active Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-green-500',
    },
    {
      label: 'Avg Rating',
      value: stats.averageRating.toFixed(1),
      icon: Star,
      color: 'text-yellow-500',
    },
    {
      label: 'Total Points',
      value: stats.totalPoints.toLocaleString(),
      icon: Award,
      color: 'text-purple-500',
    },
    {
      label: 'Challenges',
      value: stats.completedChallenges,
      icon: Target,
      color: 'text-red-500',
    },
    {
      label: 'Achievements',
      value: stats.achievements,
      icon: TrendingUp,
      color: 'text-indigo-500',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6">Analytics Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">{label}</span>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div className="text-2xl font-bold">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}