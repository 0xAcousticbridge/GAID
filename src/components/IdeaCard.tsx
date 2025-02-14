import React from 'react';

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
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
      <div className="flex items-center mb-4">
        <img
          src={idea.author.avatar_url || '/default-avatar.png'}
          alt={idea.author.username}
          className="h-10 w-10 rounded-full mr-3"
        />
        <div>
          <h4 className="text-lg font-medium text-gray-100">{idea.title}</h4>
          <p className="text-sm text-gray-400">{idea.author.username}</p>
        </div>
      </div>
      <p className="text-gray-300 mb-4">{idea.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-400">{idea.category}</span>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">{idea.rating?.toFixed(1) || 'N/A'}</span>
          <span className="text-sm text-gray-400">{idea.favorites_count || 0} favorites</span>
          <span className="text-sm text-gray-400">{idea.comments_count || 0} comments</span>
        </div>
      </div>
    </div>
  );
}