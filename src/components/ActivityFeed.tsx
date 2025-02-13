import React, { useEffect, useState } from 'react';
import { MessageSquare, Heart, Star, Users, Trophy, Lightbulb } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import { useStore } from '../lib/store';

interface ActivityItem {
  id: string;
  user_id: string;
  type: string;
  content: any;
  created_at: string;
  user: {
    username: string;
    avatar_url?: string;
  };
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useStore();

  useEffect(() => {
    if (user) {
      fetchActivities();
    }
  }, [user]);

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('activity_feed')
        .select(`
          *,
          user:users(username, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'like':
        return <Heart className="h-5 w-5 text-red-500" />;
      case 'rating':
        return <Star className="h-5 w-5 text-yellow-500" />;
      case 'follow':
        return <Users className="h-5 w-5 text-green-500" />;
      case 'achievement':
        return <Trophy className="h-5 w-5 text-purple-500" />;
      case 'idea':
        return <Lightbulb className="h-5 w-5 text-yellow-500" />;
      default:
        return <Lightbulb className="h-5 w-5 text-gray-500" />;
    }
  };

  const getActivityMessage = (activity: ActivityItem) => {
    const { type, content } = activity;
    switch (type) {
      case 'comment':
        return `commented on "${content.idea_title}"`;
      case 'like':
        return `liked "${content.idea_title}"`;
      case 'rating':
        return `rated "${content.idea_title}" ${content.rating} stars`;
      case 'follow':
        return `started following ${content.followed_user}`;
      case 'achievement':
        return `earned the "${content.achievement_title}" achievement`;
      case 'idea':
        return `shared a new idea: "${content.idea_title}"`;
      default:
        return 'performed an action';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex space-x-4">
              <div className="rounded-full bg-gray-200 h-10 w-10" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6">Activity Feed</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {activity.user.avatar_url ? (
                <img
                  src={activity.user.avatar_url}
                  alt={activity.user.username}
                  className="h-10 w-10 rounded-full"
                />
              ) : (
                <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 font-medium">
                    {activity.user.username[0]}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-medium">{activity.user.username}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-500 text-sm">
                  {format(new Date(activity.created_at), 'MMM d, h:mm a')}
                </span>
              </div>
              <p className="text-gray-600 flex items-center space-x-2">
                {getActivityIcon(activity.type)}
                <span>{getActivityMessage(activity)}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}