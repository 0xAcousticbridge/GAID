import React from 'react';
import { InsightsDashboard } from '../components/Dashboard/InsightsDashboard';
import { ProgressTracker } from '../components/Analytics/ProgressTracker';
import { AIInsights } from '../components/Analytics/AIInsights';

export function Insights() {
  const mockData = {
    ideaMetrics: {
      totalIdeas: 156,
      trendingIdeas: 12,
      averageRating: 4.7,
      collaborations: 45
    },
    activityData: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Activity',
          data: [65, 59, 80, 81, 56, 55, 70],
          fill: false,
          borderColor: 'rgb(245, 158, 11)',
          tension: 0.1
        }
      ]
    }
  };

  const goals = [
    {
      id: '1',
      title: 'Share Ideas',
      target: 10,
      current: 7,
      deadline: '2024-03-01',
      category: 'Contribution'
    },
    {
      id: '2',
      title: 'Engage with Community',
      target: 50,
      current: 35,
      deadline: '2024-03-15',
      category: 'Engagement'
    }
  ];

  const insights = [
    {
      id: '1',
      title: 'Rising Interest in AI Education',
      description: 'There is a significant increase in educational AI ideas this week.',
      impact: 85,
      confidence: 92,
      category: 'Trend Analysis',
      recommendations: [
        'Consider focusing on educational AI projects',
        'Explore partnerships with educational institutions',
        'Develop learning-focused features'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <InsightsDashboard data={mockData} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgressTracker goals={goals} />
        <AIInsights insights={insights} />
      </div>
    </div>
  );
}