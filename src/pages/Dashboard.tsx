import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Target, Brain, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useStore } from '../lib/store';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface DailyRoutine {
  id: string;
  name: string;
  schedule: any[];
  isOptimized: boolean;
}

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  deadline: string;
  category: string;
}

export function Dashboard() {
  const { user } = useStore();
  const [dailyRoutines, setDailyRoutines] = useState<DailyRoutine[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      // Fetch daily routines
      const { data: routinesData, error: routinesError } = await supabase
        .from('daily_routines')
        .select('*')
        .eq('user_id', user?.id);

      if (routinesError) throw routinesError;
      setDailyRoutines(routinesData || []);

      // Fetch goals
      const { data: goalsData, error: goalsError } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user?.id);

      if (goalsError) throw goalsError;
      setGoals(goalsData || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Welcome to GoodAIdeas</h2>
        <p className="text-gray-400">Please log in to view your dashboard</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-700 rounded w-1/4" />
            <div className="h-4 bg-gray-700 rounded w-1/3" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-700 rounded w-1/2" />
                <div className="h-8 bg-gray-700 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-100">
              Welcome back, {user?.email?.split('@')[0] || 'User'}
            </h1>
            <p className="text-gray-400 mt-1">
              Here's what's happening with your daily optimization
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">
              {format(new Date(), 'EEEE, MMMM d')}
            </div>
            <div className="text-2xl font-bold text-yellow-500">
              {format(new Date(), 'h:mm a')}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: 'Active Routines',
            value: dailyRoutines.length,
            change: '+2 this week',
            icon: Calendar,
            color: 'blue'
          },
          {
            label: 'Goals Progress',
            value: '68%',
            change: '+5% from last week',
            icon: Target,
            color: 'green'
          },
          {
            label: 'AI Suggestions',
            value: 12,
            change: '3 new today',
            icon: Brain,
            color: 'purple'
          },
          {
            label: 'Productivity Score',
            value: '8.5',
            change: '+0.3 this week',
            icon: TrendingUp,
            color: 'yellow'
          }
        ].map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 bg-${metric.color}-500/10 rounded-lg`}>
                <metric.icon className={`h-6 w-6 text-${metric.color}-500`} />
              </div>
              {metric.change && (
                <span className={`text-sm ${
                  metric.change.includes('+') ? 'text-green-500' : 'text-red-500'
                }`}>
                  {metric.change}
                </span>
              )}
            </div>
            <div className="text-2xl font-bold text-gray-100 mb-1">
              {metric.value}
            </div>
            <div className="text-sm text-gray-400">{metric.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Daily Routines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-100">Today's Routines</h2>
            <button className="text-yellow-500 hover:text-yellow-400 text-sm">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {dailyRoutines.length > 0 ? (
              dailyRoutines.map((routine) => (
                <div
                  key={routine.id}
                  className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-gray-600 rounded-lg">
                      <Clock className="h-5 w-5 text-gray-300" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-100">{routine.name}</div>
                      <div className="text-sm text-gray-400">
                        {routine.schedule.length} tasks
                      </div>
                    </div>
                  </div>
                  {routine.isOptimized && (
                    <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm">
                      AI Optimized
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                No routines set up yet
              </div>
            )}
          </div>
        </div>

        {/* Active Goals */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-100">Active Goals</h2>
            <button className="text-yellow-500 hover:text-yellow-400 text-sm">
              Add Goal
            </button>
          </div>
          <div className="space-y-4">
            {goals.length > 0 ? (
              goals.map((goal) => {
                const progress = (goal.current / goal.target) * 100;
                return (
                  <div
                    key={goal.id}
                    className="p-4 bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-600 rounded-lg">
                          <Target className="h-5 w-5 text-gray-300" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-100">{goal.title}</div>
                          <div className="text-sm text-gray-400">{goal.category}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">
                        {format(new Date(goal.deadline), 'MMM d')}
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-gray-300">{progress.toFixed(0)}%</span>
                      </div>
                      <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-500 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-400">
                No active goals
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}