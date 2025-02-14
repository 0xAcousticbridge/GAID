import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useStore } from '../lib/store';
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
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <h2>Create a New Idea</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <div>
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Add a tag"
          />
          <div>
            {tags.map((tag) => (
              <span key={tag} onClick={() => removeTag(tag)}>
                {tag} &times;
              </span>
            ))}
          </div>
        </div>
        <button type="submit">Share Idea</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
}