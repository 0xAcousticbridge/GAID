import React, { useState } from 'react';
import { X, Sparkles, Tag } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import { useStore } from '../lib/store';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface CreateIdeaModalProps {
  onClose: () => void;
}

const CATEGORIES = [
  "Productivity",
  "Health & Wellness",
  "Education",
  "Finance",
  "Entertainment",
  "Social",
  "Sustainability",
  "Business",
  "Creative",
  "Technology"
];

export function CreateIdeaModal({ onClose }: CreateIdeaModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const { user, addNotification, completeChallenge } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to share ideas');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('ideas')
        .insert([
          {
            title,
            description,
            category,
            tags,
            user_id: user.id,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast.success('Idea shared successfully!');
      addNotification('idea', 'Your idea was shared successfully!');
      await completeChallenge('first-idea');
      onClose();
    } catch (error) {
      console.error('Error sharing idea:', error);
      toast.error('Failed to share idea. Please try again.');
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      if (tags.length >= 5) {
        toast.error('Maximum 5 tags allowed');
        return;
      }
      if (!tags.includes(newTag.trim())) {
        setTags([...tags, newTag.trim()]);
      }
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Sparkles className="h-6 w-6 text-yellow-500 mr-2" />
            <h2 className="text-2xl font-bold">Share Your Idea</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              required
              maxLength={100}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <TextareaAutosize
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              minRows={3}
              required
              maxLength={2000}
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              required
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
              Tags (max 5)
            </label>
            <div className="mt-1 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-yellow-600 hover:text-yellow-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-2 flex items-center">
              <Tag className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add tags (press Enter)"
                className="block w-full border-0 border-b border-gray-300 focus:border-yellow-500 focus:ring-0"
                disabled={tags.length >= 5}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="mr-4 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Share Idea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}