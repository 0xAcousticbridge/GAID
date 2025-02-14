import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useStore } from '../lib/store';
import toast from 'react-hot-toast';

interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  user_id: string;
  tags: string[];
  rating: number;
  favorites_count: number;
  comments_count: number;
  created_at: string;
  author: {
    username: string;
    avatar_url?: string;
  };
}

export function IdeaDetails() {
  const { id } = useParams<{ id: string }>();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useStore();

  useEffect(() => {
    fetchIdea();
  }, [id]);

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

  const recordView = async (ideaId: string) => {
    try {
      await supabase
        .from('idea_views')
        .insert([{ user_id: user?.id, idea_id: ideaId }]);
    } catch (error) {
      console.error('Error recording view:', error);
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

  return (
    <div className="idea-details">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : idea ? (
        <div>
          <h1>{idea.title}</h1>
          <p>{idea.description}</p>
          <p>Category: {idea.category}</p>
          <p>Rating: {idea.rating.toFixed(1)}</p>
          <p>Favorites: {idea.favorites_count}</p>
          <p>Comments: {idea.comments_count}</p>
          <p>Author: {idea.author.username}</p>
        </div>
      ) : (
        <p>Idea not found</p>
      )}
    </div>
  );
}