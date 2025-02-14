import React from 'react';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

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
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <TrendingUp className="h-6 w-6 text-yellow-500 mr-2" />
          <h2 className="text-xl font-bold text-gray-100">Trending Topics</h2>
        </div>
      </div>

      <div className="space-y-4">
        {topics.map((topic, index) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-100 group-hover:text-yellow-500">
                {topic.name}
              </h3>
              <div className="flex items-center text-sm">
                <span className="text-gray-400 mr-2">{topic.count} ideas</span>
                <span className="text-green-500">+{topic.trend}%</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 group-hover:text-gray-300 mb-2">
              {topic.description}
            </p>
            <Link 
              to={`/search?topic=${encodeURIComponent(topic.name)}`}
              className="text-sm text-yellow-500 hover:text-yellow-400 flex items-center"
            >
              Explore ideas
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}