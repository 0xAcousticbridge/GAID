import React from 'react';
import { Trophy, Star, Target, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  completed: boolean;
  icon: 'trophy' | 'star' | 'target' | 'award';
}

interface AchievementTrackerProps {
  achievements: Achievement[];
}

export function AchievementTracker({ achievements }: AchievementTrackerProps) {
  const getIcon = (icon: string) => {
    switch (icon) {
      case 'trophy':
        return Trophy;
      case 'star':
        return Star;
      case 'target':
        return Target;
      case 'award':
        return Award;
      default:
        return Trophy;
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Trophy className="h-6 w-6 text-yellow-500 mr-2" />
          <h2 className="text-xl font-bold text-gray-100">Achievements</h2>
        </div>
      </div>

      <div className="grid gap-4">
        {achievements.map((achievement, index) => {
          const Icon = getIcon(achievement.icon);
          const progressPercentage = (achievement.progress / achievement.total) * 100;

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gray-700/50 rounded-lg p-4 ${
                achievement.completed ? 'border-l-4 border-yellow-500' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-lg ${
                  achievement.completed ? 'bg-yellow-500' : 'bg-gray-600'
                }`}>
                  <Icon className={`h-6 w-6 ${
                    achievement.completed ? 'text-gray-900' : 'text-gray-300'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-100">{achievement.title}</h3>
                  <p className="text-sm text-gray-400 mb-3">{achievement.description}</p>
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block text-gray-300">
                          {achievement.progress} / {achievement.total}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs font-sem ibold inline-block text-gray-300">
                          {progressPercentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-600">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                          achievement.completed ? 'bg-yellow-500' : 'bg-yellow-600'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}