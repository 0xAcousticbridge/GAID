import React, { useEffect, useState } from 'react';
import { Target, Trophy, Calendar, Clock } from 'lucide-react';
import { useStore } from '../lib/store';
import { format, differenceInSeconds } from 'date-fns';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  progress: number;
  total: number;
  completed: boolean;
}

export function DailyChallenge() {
  const { user, streak } = useStore();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [timeUntilReset, setTimeUntilReset] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDailyChallenges();
      const interval = setInterval(updateTimeUntilReset, 1000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchDailyChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from('daily_challenges')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', new Date().toISOString().split('T')[0]);

      if (error) throw error;

      const challengeData = data || [
        {
          id: 'rate',
          title: "Rate 3 Ideas",
          description: "Rate some ideas to help the community",
          points: 50,
          progress: 0,
          total: 3,
          completed: false,
        },
        {
          id: 'share',
          title: "Share an Idea",
          description: "Share your innovative AI idea",
          points: 100,
          progress: 0,
          total: 1,
          completed: false,
        },
        {
          id: 'comment',
          title: "Comment on Ideas",
          description: "Engage with the community",
          points: 75,
          progress: 0,
          total: 5,
          completed: false,
        },
      ];

      setChallenges(challengeData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching daily challenges:', error);
      setLoading(false);
    }
  };

  const updateTimeUntilReset = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const secondsLeft = differenceInSeconds(tomorrow, now);
    const hours = Math.floor(secondsLeft / 3600);
    const minutes = Math.floor((secondsLeft % 3600) / 60);
    const seconds = secondsLeft % 60;

    setTimeUntilReset(
      `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    );
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-700 rounded w-1/3" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-700 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Target className="h-6 w-6 text-yellow-500 mr-2" />
          <h2 className="text-xl font-bold text-gray-100">Daily Challenges</h2>
        </div>
        <div className="flex items-center">
          <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
          <span className="text-sm font-medium text-gray-300">
            {streak.current} Day Streak
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {challenges.map((challenge) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-gray-700/50 rounded-lg p-4 ${
              challenge.completed ? 'border-l-4 border-green-500' : ''
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex-1">
                <h3 className="font-medium text-gray-100">{challenge.title}</h3>
                <p className="text-sm text-gray-400">{challenge.description}</p>
              </div>
              <span className="text-yellow-500 font-medium ml-4">
                +{challenge.points} pts
              </span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2">
              <motion.div
                className={`rounded-full h-2 ${
                  challenge.completed
                    ? 'bg-green-500'
                    : 'bg-yellow-500'
                }`}
                style={{
                  width: `${(challenge.progress / challenge.total) * 100}%`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-gray-400">
                {challenge.progress} / {challenge.total}
              </span>
              {challenge.completed && (
                <span className="text-sm text-green-500 font-medium">
                  Completed!
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 border-t border-gray-700 pt-4">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Resets at midnight {format(new Date(), 'z')}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{timeUntilReset}</span>
          </div>
        </div>
      </div>
    </div>
  );
}