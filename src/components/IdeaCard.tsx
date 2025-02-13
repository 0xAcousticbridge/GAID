import React, { useState, useEffect, useCallback } from 'react';
import { Heart, MessageSquare, Star, Share2, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { useStore } from '../lib/store';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { isValidUUID } from '../lib/utils';

interface Author {
  username: string;
  avatar_url?: string;
}

interface IdeaCardProps {
  idea: {
    id: string;
    title: string;
    description: string;
    category: string;
    author: Author;
    rating?: number;
    favorites_count?: number;
    comments_count?: number;
    created_at: string;
    user_id: string;
    tags?: string[];
  };
}

export function IdeaCard({ idea }: IdeaCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [isRatingHovered, setIsRatingHovered] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const { user } = useStore();

  const checkFavoriteStatus = useCallback(async () => {
    if (!user || !isValidUUID(idea.id)) return;

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('idea_id', idea.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      setIsLiked(!!data);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  }, [user, idea.id]);

  const checkUserRating = useCallback(async () => {
    if (!user || !isValidUUID(idea.id)) return;

    try {
      const { data, error } = await supabase
        .from('idea_ratings')
        .select('rating')
        .eq('user_id', user.id)
        .eq('idea_id', idea.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      setUserRating(data?.rating || null);
    } catch (error) {
      console.error('Error checking user rating:', error);
    }
  }, [user, idea.id]);

  useEffect(() => {
    checkFavoriteStatus();
    checkUserRating();
  }, [checkFavoriteStatus, checkUserRating]);

  const handleLike = async () => {
    if (!user) {
      toast.error('Please log in to like ideas');
      return;
    }

    if (!isValidUUID(idea.id)) {
      toast.error('Invalid idea ID');
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      if (!isLiked) {
        const { error } = await supabase
          .from('favorites')
          .insert([{ 
            user_id: user.id, 
            idea_id: idea.id 
          }]);

        if (error) throw error;
        setIsLiked(true);
        toast.success('Added to favorites!');
      } else {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .match({ 
            user_id: user.id, 
            idea_id: idea.id 
          });

        if (error) throw error;
        setIsLiked(false);
        toast.success('Removed from favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorite status');
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async (rating: number) => {
    if (!user) {
      toast.error('Please log in to rate ideas');
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from('idea_ratings')
        .upsert([{
          user_id: user.id,
          idea_id: idea.id,
          rating
        }], {
          onConflict: 'user_id,idea_id'
        });

      if (error) throw error;
      setUserRating(rating);
      toast.success('Rating updated!');
    } catch (error) {
      console.error('Error rating idea:', error);
      toast.error('Failed to update rating');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="card holographic"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700/50 glass">
              {idea.author?.avatar_url ? (
                <img
                  src={idea.author.avatar_url}
                  alt={idea.author.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-yellow-500 glow-text">
                  {idea.author?.username?.[0] || 'A'}
                </div>
              )}
            </div>
            <div>
              <div className="font-medium text-gray-100">{idea.author?.username || 'Anonymous'}</div>
              <div className="text-sm text-gray-400">
                {format(new Date(idea.created_at), 'MMM d, yyyy')}
              </div>
            </div>
          </div>
          <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-sm font-medium glass">
            {idea.category}
          </span>
        </div>

        <Link to={`/ideas/${idea.id}`}>
          <h3 className="text-xl font-bold mb-2 text-gray-100 hover:text-yellow-500 transition-colors glow-text">
            {idea.title}
          </h3>
        </Link>

        <p className="text-gray-300 line-clamp-2 mb-4">{idea.description}</p>

        {idea.tags && idea.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {idea.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded-full text-xs glass"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex space-x-6">
            <button
              onClick={handleLike}
              disabled={loading}
              className={`flex items-center space-x-2 transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' :
                isLiked ? 'text-red-500 glow-text' : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart className="h-5 w-5" fill={isLiked ? 'currentColor' : 'none'} />
              <span>{(idea.favorites_count || 0) + (isLiked ? 1 : 0)}</span>
            </button>
            <Link
              to={`/ideas/${idea.id}`}
              className="flex items-center space-x-2 text-gray-400 hover:text-gray-300 transition-colors"
            >
              <MessageSquare className="h-5 w-5" />
              <span>{idea.comments_count || 0}</span>
            </Link>
            <div 
              className="flex items-center space-x-1"
              onMouseEnter={() => setIsRatingHovered(true)}
              onMouseLeave={() => {
                setIsRatingHovered(false);
                setHoveredRating(0);
              }}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRate(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  disabled={loading}
                  className={`transition-colors ${
                    loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                  }`}
                >
                  <Star 
                    className={`h-5 w-5 ${
                      (isRatingHovered ? hoveredRating >= star : userRating && userRating >= star)
                        ? 'text-yellow-500 glow'
                        : 'text-gray-500'
                    }`}
                    fill={(isRatingHovered ? hoveredRating >= star : userRating && userRating >= star) ? 'currentColor' : 'none'}
                  />
                </button>
              ))}
              {!isRatingHovered && (
                <span className="text-sm text-gray-400 ml-1">
                  {idea.rating?.toFixed(1) || '0.0'}
                </span>
              )}
            </div>
          </div>
          <Link
            to={`/ideas/${idea.id}`}
            className="flex items-center text-yellow-500 hover:text-yellow-400 transition-colors glow-text"
          >
            <span className="text-sm font-medium mr-1">View Details</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}