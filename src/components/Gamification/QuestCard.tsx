import React from 'react';
import { Trophy, Clock, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuestCardProps {
  title: string;
  description: string;
  reward: number;
  deadline: Date;
  progress: number;
  total: number;
}

export function QuestCard({
  title,
  description,
  reward,
  deadline,
  progress,
  total,
}: QuestCardProps) {
  const progressPercentage = (progress / total) * 100;
  const daysLeft = Math.ceil(
    (deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg p-4 shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-medium mb-1">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div className="flex items-center space-x-1 text-yellow-500">
          <Trophy className="h-4 w-4" />
          <span className="font-medium">+{reward}</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-500">
            Progress: {progress}/{total}
          </span>
          <span className="text-sm font-medium">{progressPercentage.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
            className="bg-yellow-500 h-2 rounded-full"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          <span>{daysLeft} days left</span>
        </div>
        {progressPercentage === 100 && (
          <div className="flex items-center text-green-500">
            <Award className="h-4 w-4 mr-1" />
            <span>Completed!</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}