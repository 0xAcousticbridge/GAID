import React from 'react';
import { motion } from 'framer-motion';
import { Target, Award, TrendingUp, Clock } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  deadline: string;
  category: string;
}

interface ProgressTrackerProps {
  goals: Goal[];
}

export function ProgressTracker({ goals }: ProgressTrackerProps) {
  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getTimeRemaining = (deadline: string) => {
    const days = Math.ceil(
      (new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return `${days} days remaining`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Target className="h-6 w-6 text-yellow-500 mr-2" />
          <h2 className="text-xl font-bold">Progress Tracker</h2>
        </div>
        <button className="text-sm font-medium text-yellow-600 hover:text-yellow-700">
          Set New Goal
        </button>
      </div>

      <div className="space-y-6">
        {goals.map((goal, index) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-50 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-medium">{goal.title}</h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Clock className="h-4 w-4 mr-1" />
                  {getTimeRemaining(goal.deadline)}
                </div>
              </div>
              <span className="px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full">
                {goal.category}
              </span>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">
                  {goal.current} / {goal.target}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${calculateProgress(goal.current, goal.target)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-yellow-500 rounded-full"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 text-sm">
              <div className="flex items-center text-green-500">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>On track</span>
              </div>
              {goal.current >= goal.target && (
                <div className="flex items-center text-yellow-500">
                  <Award className="h-4 w-4 mr-1" />
                  <span>Goal achieved!</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}