import React, { useState, useEffect } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { format } from 'date-fns';
import { useStore } from '../lib/store';
import { supabase } from '../lib/supabase';
import TextareaAutosize from 'react-textarea-autosize';
import toast from 'react-hot-toast';

interface Comment {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  user: {
    username: string;
    avatar_url?: string;
  };
}

interface CommentSectionProps {
  ideaId: string;
}

export function CommentSection({ ideaId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const { user } = useStore();

  useEffect(() => {
    if (ideaId) {
      fetchComments();
    }
  }, [ideaId]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          user:users!comments_user_id_fkey (
            username,
            avatar_url
          )
        `)
        .eq('idea_id', ideaId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setComments(data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to comment');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      const { error } = await supabase
        .from('comments')
        .insert([
          {
            content: newComment.trim(),
            idea_id: ideaId,
            user_id: user.id,
          }
        ]);

      if (error) throw error;

      setNewComment('');
      await fetchComments();
      toast.success('Comment added successfully!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <MessageSquare className="h-6 w-6 text-yellow-500 mr-2" />
        <h3 className="text-xl font-bold">Comments</h3>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <TextareaAutosize
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={user ? "Add a comment..." : "Please log in to comment"}
          className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
          minRows={2}
          maxRows={6}
          disabled={!user}
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={!user || !newComment.trim()}
            className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4 mr-2" />
            Comment
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                {comment.user.avatar_url ? (
                  <img
                    src={comment.user.avatar_url}
                    alt={comment.user.username}
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  <span className="text-sm font-medium text-gray-600">
                    {comment.user.username[0]}
                  </span>
                )}
              </div>
              <div>
                <div className="font-medium">{comment.user.username}</div>
                <div className="text-xs text-gray-500">
                  {format(new Date(comment.created_at), 'MMM d, yyyy h:mm a')}
                </div>
              </div>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}