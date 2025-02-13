import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Share2, MessageSquare, Star, ArrowLeft, Edit2, Save, X } from 'lucide-react';
import { CommentSection } from '../components/CommentSection';
import { ShareButton } from '../components/SocialShare/ShareButton';
import { supabase } from '../lib/supabase';
import { useStore } from '../lib/store';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { isValidUUID } from '../lib/utils';

export function IdeaDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [idea, setIdea] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedIdea, setEditedIdea] = useState<any>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [isRatingHovered, setIsRatingHovered] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const { user } = useStore();

  useEffect(() => {
    if (!id) {
      navigate('/ideas');
      return;
    }

    if (!isValidUUID(id)) {
      setError('Invalid idea ID format');
      setLoading(false);
      return;
    }

    fetchIdea();
    checkFavoriteStatus();
    checkUserRating();
  }, [id, navigate]);

  const recordView = async (ideaId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('record_idea_view', {
        p_idea_id: ideaId,
        p_user_id: user.id
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error recording view:', error);
    }
  };

  const fetchIdea = async () => {
    try {
      const { data, error } = await supabase
        .from('ideas')
        .select(`
          *,
          author:users!ideas_user_id_fkey (
            username,
            avatar_url
          ),
          ratings:idea_ratings (
            rating
          ),
          comments:comments (
            count
          )
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        setError('Idea not found');
        setLoading(false);
        return;
      }

      // Calculate average rating
      const ratings = data.ratings || [];
      const avgRating = ratings.length > 0 
        ? ratings.reduce((acc: number, curr: any) => acc + curr.rating, 0) / ratings.length 
        : 0;

      const processedIdea = {
        ...data,
        rating: avgRating,
        comments_count: data.comments?.[0]?.count || 0
      };

      setIdea(processedIdea);
      setEditedIdea(processedIdea);

      // Record view if authenticated
      if (user) {
        await recordView(id);
      }
    } catch (error: any) {
      console.error('Error fetching idea:', error);
      setError(error.message || 'Failed to load idea');
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    if (!user || !id) return;

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('idea_id', id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      setIsLiked(!!data);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const checkUserRating = async () => {
    if (!user || !id) return;

    try {
      const { data, error } = await supabase
        .from('idea_ratings')
        .select('rating')
        .eq('user_id', user.id)
        .eq('idea_id', id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      setUserRating(data?.rating || null);
    } catch (error) {
      console.error('Error checking user rating:', error);
    }
  };

  const handleSave = async () => {
    if (!user || !editedIdea) return;

    try {
      const { error } = await supabase
        .from('ideas')
        .update({
          title: editedIdea.title,
          description: editedIdea.description,
          category: editedIdea.category,
          tags: editedIdea.tags
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setIdea(editedIdea);
      setIsEditing(false);
      toast.success('Idea updated successfully');
    } catch (error) {
      console.error('Error updating idea:', error);
      toast.error('Failed to update idea');
    }
  };

  const handleCancel = () => {
    setEditedIdea(idea);
    setIsEditing(false);
  };

  const handleLike = async () => {
    if (!user) {
      toast.error('Please log in to save ideas');
      return;
    }

    try {
      if (!isLiked) {
        const { error } = await supabase
          .from('favorites')
          .insert([{ 
            user_id: user.id, 
            idea_id: id 
          }]);

        if (error) throw error;
        setIsLiked(true);
        toast.success('Idea saved to your profile!');
      } else {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .match({ 
            user_id: user.id, 
            idea_id: id 
          });

        if (error) throw error;
        setIsLiked(false);
        toast.success('Removed from saved ideas');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update saved status');
    }
  };

  const handleRate = async (rating: number) => {
    if (!user) {
      toast.error('Please log in to rate ideas');
      return;
    }

    try {
      const { error } = await supabase
        .from('idea_ratings')
        .upsert([{
          user_id: user.id,
          idea_id: id,
          rating
        }], {
          onConflict: 'user_id,idea_id'
        });

      if (error) throw error;
      setUserRating(rating);
      await fetchIdea(); // Refresh to get updated average rating
      toast.success('Rating updated!');
    } catch (error) {
      console.error('Error rating idea:', error);
      toast.error('Failed to update rating');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-700 rounded w-1/2" />
            <div className="h-32 bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/ideas')}
          className="flex items-center text-gray-400 hover:text-gray-300 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Ideas
        </button>

        <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 text-center">
          <h2 className="text-xl font-bold text-gray-100 mb-2">Oops!</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/ideas')}
            className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors"
          >
            Browse Ideas
          </button>
        </div>
      </div>
    );
  }

  if (!idea) return null;

  const canEdit = user && user.id === idea.user_id;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-400 hover:text-gray-300 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Ideas
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700">
              {idea.author?.avatar_url ? (
                <img
                  src={idea.author.avatar_url}
                  alt={idea.author.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-xl font-medium text-gray-300">
                    {idea.author?.username?.[0] || 'A'}
                  </span>
                </div>
              )}
            </div>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={editedIdea.title}
                  onChange={(e) => setEditedIdea({ ...editedIdea, title: e.target.value })}
                  className="text-2xl font-bold bg-gray-700 text-gray-100 rounded-lg px-2 py-1 w-full"
                />
              ) : (
                <h1 className="text-2xl font-bold text-gray-100">{idea.title}</h1>
              )}
              <p className="text-gray-400">by {idea.author?.username || 'Anonymous'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {canEdit && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <Edit2 className="h-4 w-4 mr-2 inline-block" />
                Edit
              </button>
            )}
            {isEditing && (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <X className="h-4 w-4 mr-2 inline-block" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors"
                >
                  <Save className="h-4 w-4 mr-2 inline-block" />
                  Save
                </button>
              </>
            )}
          </div>
        </div>

        <div className="prose prose-invert max-w-none mb-6">
          {isEditing ? (
            <textarea
              value={editedIdea.description}
              onChange={(e) => setEditedIdea({ ...editedIdea, description: e.target.value })}
              className="w-full h-32 bg-gray-700 text-gray-100 rounded-lg p-2 resize-none"
            />
          ) : (
            <p className="text-gray-300">{idea.description}</p>
          )}
        </div>

        {idea.tags && idea.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {idea.tags.map((tag: string) => (
              <span
                key={tag}
                className="px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-6 border-t border-gray-700">
          <div className="flex space-x-6">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 ${
                isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
              } transition-colors`}
            >
              <Heart className="h-5 w-5" fill={isLiked ? 'currentColor' : 'none'} />
              <span>{idea.favorites_count || 0}</span>
            </button>
            <div className="flex items-center space-x-2 text-gray-400">
              <MessageSquare className="h-5 w-5" />
              <span>{idea.comments_count || 0}</span>
            </div>
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
                  className="cursor-pointer"
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
          <ShareButton
            url={window.location.href}
            title={idea.title}
            description={idea.description}
          />
        </div>
      </motion.div>

      <CommentSection ideaId={idea.id} />
    </div>
  );
}