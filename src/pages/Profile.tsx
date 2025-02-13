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
  const { user, profile, achievements, challenges } = useStore();
  const [activeTab, setActiveTab] = useState('ideas');
  const [userIdeas, setUserIdeas] = useState([]);
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
      fetchUserIdeas();
      fetchActivityData();
    }
  }, [user]);

  const fetchUserIdeas = async () => {
    const { data, error } = await supabase
      .from('ideas')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setUserIdeas(data);
    }
  };

  const fetchActivityData = async () => {
    // Fetch user activity data for the chart
    const { data, error } = await supabase
      .from('user_activity')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: true })
      .limit(30);

    if (!error && data) {
      setActivityData({
        labels: data.map(d => format(new Date(d.date), 'MMM d')),
        datasets: [{
          label: 'Activity Points',
          data: data.map(d => d.points),
          fill: false,
          borderColor: 'rgb(245, 158, 11)',
          tension: 0.1
        }]
      });
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
        title: {
          display: true,
          text: 'Date'
        },
        grid: {
          display: false
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Points'
        },
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
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
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-gray-100 p-4 rounded-full">
              <User className="h-12 w-12 text-gray-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome to GoodAIdeas</h2>
              <p className="text-gray-500">Please log in to view your profile</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
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
                <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-gray-600" />
                </div>
              )}
              <button className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-sm">
                <Edit2 className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile?.username || 'Anonymous'}</h1>
              <p className="text-gray-500">Member since {format(new Date(user.created_at), 'MMMM yyyy')}</p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Settings className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-600">Ideas</span>
              <Lightbulb className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">{userIdeas.length}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-600">Points</span>
              <Award className="h-5 w-5 text-purple-500" />
            </div>
            <div className="text-2xl font-bold">{profile?.points || 0}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-600">Achievements</span>
              <Trophy className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold">{achievements.length}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-600">Avg Rating</span>
              <Star className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold">4.8</div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === id
                    ? 'border-yellow-500 text-yellow-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
              {userIdeas.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} />
              ))}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`bg-gray-50 rounded-lg p-4 ${
                    achievement.unlockedAt ? 'opacity-100' : 'opacity-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-yellow-100 rounded-full p-2">
                      <Trophy className="h-6 w-6 text-yellow-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">{achievement.title}</h3>
                      <p className="text-sm text-gray-500">{achievement.description}</p>
                    </div>
                  </div>
                  {achievement.unlockedAt && (
                    <div className="mt-2 text-xs text-gray-500">
                      Unlocked on {format(new Date(achievement.unlockedAt), 'MMM d, yyyy')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'challenges' && (
            <div className="space-y-4">
              {challenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className={`bg-gray-50 rounded-lg p-4 ${
                    challenge.completed ? 'border-l-4 border-green-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{challenge.title}</h3>
                      <p className="text-sm text-gray-500">{challenge.description}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-500 font-medium mr-2">
                        +{challenge.points} pts
                      </span>
                      {challenge.completed && (
                        <div className="bg-green-100 rounded-full p-1">
                          <Trophy className="h-4 w-4 text-green-500" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="bg-white p-4 rounded-lg">
              <Line data={activityData} options={chartOptions} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}