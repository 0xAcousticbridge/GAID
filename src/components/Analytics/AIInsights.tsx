import React from 'react';
import { Brain, TrendingUp, Target, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface Insight {
  id: string;
  title: string;
  description: string;
  impact: number;
  confidence: number;
  category: string;
  recommendations: string[];
}

interface AIInsightsProps {
  insights: Insight[];
}

export function AIInsights({ insights }: AIInsightsProps) {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Brain className="h-6 w-6 text-yellow-500 mr-2" />
          <h2 className="text-xl font-bold text-gray-100">AI-Powered Insights</h2>
        </div>
        <button className="text-sm font-medium text-yellow-500 hover:text-yellow-400">
          Refresh Insights
        </button>
      </div>

      <div className="space-y-6">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-100">{insight.title}</h3>
              <span className="px-3 py-1 text-sm font-medium bg-yellow-500/10 text-yellow-500 rounded-full">
                {insight.category}
              </span>
            </div>
            <p className="text-sm text-gray-300 mb-4">{insight.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-300">
                  Impact Score: {insight.impact}%
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="text-sm text-gray-300">
                  Confidence: {insight.confidence}%
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-200">Recommendations:</h4>
              <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                {insight.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}