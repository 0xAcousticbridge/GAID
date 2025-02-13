import React from 'react';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface Topic {
  id: string;
  name: string;
  count: number;
  trend: number;
  description: string;
}

interface TrendingTopicsProps {
  topics: Topic[];
}

export function TrendingTopics({ topics }: TrendingTopicsProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <TrendingUp className="h-6 w-6 text-yellow-500 mr-2" />
          <h2 className="text-xl font-bold">Trending Topics</h2>
        </div>
      </div>

      <div className="space-y-4">
        {topics.map((topic, index) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group bg-gray-50 rounded-lg p-4 hover:bg-yellow-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium group-hover:text-yellow-700">
                {topic.name}
              </h3>
              <div className="flex items-center text-sm">
                <span className="text-gray-500 mr-2">{topic.count} ideas</span>
                <span className="text-green-500">+{topic.trend}%</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">{topic.description}</p>
            <button className="text-sm text-yellow-600 hover:text-yellow-700 flex items-center">
              Explore ideas
              <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}