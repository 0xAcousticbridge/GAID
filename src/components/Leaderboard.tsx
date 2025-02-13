import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, ChevronUp, ChevronDown, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useStore } from '../lib/store';
import { motion } from 'framer-motion';

interface LeaderboardEntry {
  id: string;
  username: string;
  points: number;
  ideas_count: number;
  avatar_url?: string;
  rank_change: number;
}

export function Leaderboard() {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'all'>('weekly');
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useStore();

  useEffect(() => {
    fetchLeaderboard();
  }, [timeframe]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('users')
        .select(`
          id,
          username,
          points,
          avatar_url,
          ideas:ideas(count)
        `)
        .order('points', { ascending: false })
        .limit(10);

      const { data, error } = await query;

      if (error) throw error;

      const leaderboardData = data.map((entry, index) => ({
        ...entry,
        ideas_count: entry.ideas[0].count,
        rank_change: Math.floor(Math.random() * 5) * (Math.random() > 0.5 ? 1 : -1),
      }));

      setLeaders(leaderboardData);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const timeframeOptions = [
    { value: 'daily', label: 'Today' },
    { value: 'weekly', label: 'This Week' },
    { value: 'monthly', label: 'This Month' },
    { value: 'all', label: 'All Time' },
  ];

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Trophy className="h-6 w-6 text-yellow-500 mr-2" />
          <h2 className="text-xl font-bold text-gray-100">Top Innovators</h2>
        </div>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value as any)}
          className="bg-gray-700 text-gray-300 text-sm border-gray-600 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
        >
          {timeframeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500" />
        </div>
      ) : (
        <div className="space-y-4">
          {leaders.map((leader, index) => (
            <motion.div
              key={leader.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-4 ${
                leader.id === user?.id ? 'bg-yellow-500/10' : 'bg-gray-700/50'
              } rounded-lg transition-colors hover:bg-gray-700`}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 text-center">
                  {index === 0 ? (
                    <Medal className="h-6 w-6 text-yellow-500" />
                  ) : index === 1 ? (
                    <Medal className="h-6 w-6 text-gray-400" />
                  ) : index === 2 ? (
                    <Medal className="h-6 w-6 text-amber-600" />
                  ) : (
                    <span className="text-gray-400 font-medium">{index + 1}</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
                    {leader.avatar_url ? (
                      <img
                        src={leader.avatar_url}
                        alt={leader.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Users className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-100 flex items-center">
                      {leader.username}
                      {leader.rank_change !== 0 && (
                        <span
                          className={`ml-2 text-xs flex items-center ${
                            leader.rank_change > 0 ? 'text-green-500' : 'text-red-500'
                          }`}
                        >
                          {leader.rank_change > 0 ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          )}
                          {Math.abs(leader.rank_change)}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-400">
                      {leader.ideas_count} ideas shared
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-yellow-500" />
                <span className="font-medium text-gray-100">{leader.points.toLocaleString()}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}