import React, { useState, useEffect } from 'react';
import { User, Star, Award, Lightbulb, Settings, Edit2, Share2, Trophy, Target, Bookmark } from 'lucide-react';
import { useStore } from '../lib/store';
import { supabase } from '../lib/supabase';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import { IdeaCard } from '../components/IdeaCard';
import { AchievementPopup } from '../components/AchievementPopup';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function Profile() {
  const { user, profile } = useStore();
  const [activeTab, setActiveTab] = useState('ideas');
  const [userIdeas, setUserIdeas] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Activity',
        data: [],
        fill: false,
        borderColor: 'rgb(245, 158, 11)',
        tension: 0.1
      }
    ]
  });

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      // Fetch user's ideas
      const { data: ideasData, error: ideasError } = await supabase
        .from('ideas')
        .select(`
          *,
          author:users!ideas_user_id_fkey (
            username,
            avatar_url
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (ideasError) throw ideasError;
      setUserIdeas(ideasData || []);

      // Fetch user's achievements
      const { data: achievementsData, error: achievementsError } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user?.id);

      if (achievementsError) throw achievementsError;
      setAchievements(achievementsData || []);

      // Fetch user's challenges
      const { data: challengesData, error: challengesError } = await supabase
        .from('user_challenges')
        .select('*')
        .eq('user_id', user?.id);

      if (challengesError) throw challengesError;
      setChallenges(challengesData || []);

      // Fetch activity data
      const { data: activityData, error: activityError } = await supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: true })
        .limit(30);

      if (activityError) throw activityError;

      if (activityData) {
        setActivityData({
          labels: activityData.map(d => format(new Date(d.date), 'MMM d')),
          datasets: [{
            label: 'Activity Points',
            data: activityData.map(d => d.points),
            fill: false,
            borderColor: 'rgb(245, 158, 11)',
            tension: 0.1
          }]
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false
        },
        ticks: {
          color: 'rgb(156, 163, 175)'
        }
      },
      y: {
        display: true,
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)'
        },
        ticks: {
          color: 'rgb(156, 163, 175)'
        }
      }
    }
  };

  const tabs = [
    { id: 'ideas', label: 'My Ideas', icon: Lightbulb },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'challenges', label: 'Challenges', icon: Target },
    { id: 'collections', label: 'Collections', icon: Bookmark },
    { id: 'activity', label: 'Activity', icon: Share2 },
  ];

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="bg-gray-700 p-4 rounded-full">
              <User className="h-12 w-12 text-gray-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-100">Welcome to GoodAIdeas</h2>
              <p className="text-gray-400">Please log in to view your profile</p>
            </div>
          </div>
          <div className="mt-6 flex space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/login?signup=true"
              className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-700">
          <div className="animate-pulse space-y-4">
            <div className="h-20 w-20 bg-gray-700 rounded-full" />
            <div className="h-8 bg-gray-700 rounded w-1/4" />
            <div className="h-4 bg-gray-700 rounded w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.username}
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <div className="h-20 w-20 bg-gray-700 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-gray-400" />
                </div>
              )}
              <button className="absolute bottom-0 right-0 bg-gray-700 rounded-full p-1 hover:bg-gray-600 transition-colors">
                <Edit2 className="h-4 w-4 text-gray-300" />
              </button>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-100">{profile?.username || 'Anonymous'}</h1>
              <p className="text-gray-400">Member since {format(new Date(user.created_at), 'MMMM yyyy')}</p>
            </div>
          </div>
          <Link
            to="/settings"
            className="p-2 text-gray-300 hover:text-gray-100 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Settings className="h-5 w-5" />
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-400">Ideas</span>
              <Lightbulb className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-gray-100">{userIdeas.length}</div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-400">Points</span>
              <Award className="h-5 w-5 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-gray-100">{profile?.points || 0}</div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-400">Achievements</span>
              <Trophy className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold text-gray-100">{achievements.length}</div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-400">Avg Rating</span>
              <Star className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold text-gray-100">4.8</div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700">
        <div className="border-b border-gray-700">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === id
                    ? 'border-yellow-500 text-yellow-500'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'ideas' && (
            <div className="space-y-6">
              {userIdeas.length > 0 ? (
                userIdeas.map((idea) => (
                  <IdeaCard key={idea.id} idea={idea} />
                ))
              ) : (
                <div className="text-center py-12">
                  <Lightbulb className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-100 mb-2">No ideas yet</h3>
                  <p className="text-gray-400">
                    Share your first idea and start your innovation journey!
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.length > 0 ? (
                achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`bg-gray-700/50 rounded-lg p-4 ${
                      achievement.unlockedAt ? 'opacity-100' : 'opacity-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-yellow-500/10 rounded-full p-2">
                        <Trophy className="h-6 w-6 text-yellow-500" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-100">{achievement.title}</h3>
                        <p className="text-sm text-gray-400">{achievement.description}</p>
                      </div>
                    </div>
                    {achievement.unlockedAt && (
                      <div className="mt-2 text-xs text-gray-400">
                        Unlocked on {format(new Date(achievement.unlockedAt), 'MMM d, yyyy')}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-100 mb-2">No achievements yet</h3>
                  <p className="text-gray-400">
                    Complete challenges and share ideas to earn achievements!
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="bg-gray-700/50 rounded-lg p-4">
              <Line data={activityData} options={chartOptions} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}