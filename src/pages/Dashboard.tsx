import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Target, Brain, TrendingUp, Clock, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useStore } from '../lib/store';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

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

interface AISuggestion {
  id: string;
  category: string;
  title: string;
  description: string;
  impact: number;
  confidence: number;
  actionItems: string[];
}

export function Dashboard() {
  const { user } = useStore();
  const [dailyRoutines, setDailyRoutines] = useState<DailyRoutine[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [userPreferences, setUserPreferences] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      // Fetch user preferences
      const { data: prefsData, error: prefsError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (prefsError) throw prefsError;
      setUserPreferences(prefsData);

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

      // Generate AI suggestions based on preferences
      generateAISuggestions(prefsData);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const generateAISuggestions = (preferences: any) => {
    // In a real app, this would call an AI service
    // For now, we'll generate suggestions based on preferences
    const suggestions: AISuggestion[] = [];

    if (preferences.focus_areas.includes('productivity')) {
      suggestions.push({
        id: '1',
        category: 'Productivity',
        title: 'Optimize Your Morning Routine',
        description: `Based on your wake time of ${preferences.daily_routine_preferences.wakeTime}, we've identified opportunities to enhance your morning productivity.`,
        impact: 85,
        confidence: 92,
        actionItems: [
          'Start with a 5-minute meditation',
          'Prepare your workspace the night before',
          'Schedule your most important task first'
        ]
      });
    }

    if (preferences.focus_areas.includes('health')) {
      suggestions.push({
        id: '2',
        category: 'Health',
        title: 'Energy Level Optimization',
        description: 'Your productive hours pattern suggests potential for better energy management.',
        impact: 78,
        confidence: 88,
        actionItems: [
          'Take short breaks every 90 minutes',
          'Schedule exercise during your energy peaks',
          'Adjust meal times to support your rhythm'
        ]
      });
    }

    if (preferences.preferred_categories.includes('daily-routine')) {
      suggestions.push({
        id: '3',
        category: 'Daily Routine',
        title: 'Smart Schedule Adjustments',
        description: 'AI analysis shows opportunities to better align your activities with your natural rhythm.',
        impact: 82,
        confidence: 90,
        actionItems: [
          'Batch similar tasks together',
          'Create transition rituals between activities',
          'Set up environment triggers for different modes'
        ]
      });
    }

    setAiSuggestions(suggestions);
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
              Here's your personalized AI-powered optimization dashboard
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

      {/* AI Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {aiSuggestions.map((suggestion, index) => (
          <motion.div
            key={suggestion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                </div>
                <span className="ml-2 text-sm text-yellow-500">{suggestion.category}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-xs text-gray-400">
                  Impact: <span className="text-green-500">{suggestion.impact}%</span>
                </div>
                <div className="text-xs text-gray-400">
                  Confidence: <span className="text-blue-500">{suggestion.confidence}%</span>
                </div>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-100 mb-2">{suggestion.title}</h3>
            <p className="text-gray-400 text-sm mb-4">{suggestion.description}</p>
            <div className="space-y-2">
              {suggestion.actionItems.map((item, i) => (
                <div key={i} className="flex items-center text-sm text-gray-300">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full px-4 py-2 bg-yellow-500/10 text-yellow-500 rounded-lg hover:bg-yellow-500/20 transition-colors flex items-center justify-center">
              Apply Suggestion
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Daily Routines and Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Routines */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-100">Today's Routines</h2>
            <Link 
              to="/routines"
              className="text-yellow-500 hover:text-yellow-400 text-sm flex items-center"
            >
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
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
            <Link 
              to="/goals"
              className="text-yellow-500 hover:text-yellow-400 text-sm flex items-center"
            >
              Add Goal
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
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
                          className="h-full bg-yellow-500 rounded-full transition-all duration-500"
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