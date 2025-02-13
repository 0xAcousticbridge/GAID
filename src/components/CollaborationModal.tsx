import React, { useState } from 'react';
import { Users, X, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useStore } from '../lib/store';
import toast from 'react-hot-toast';

interface CollaborationModalProps {
  ideaId: string;
  onClose: () => void;
}

export function CollaborationModal({ ideaId, onClose }: CollaborationModalProps) {
  const [role, setRole] = useState('contributor');
  const [message, setMessage] = useState('');
  const { user } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to request collaboration');
      return;
    }

    try {
      const { error } = await supabase
        .from('collaborations')
        .insert([
          {
            idea_id: ideaId,
            user_id: user.id,
            role,
            status: 'pending',
          }
        ]);

      if (error) throw error;

      toast.success('Collaboration request sent!');
      onClose();
    } catch (error) {
      console.error('Error sending collaboration request:', error);
      toast.error('Failed to send request. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Users className="h-6 w-6 text-yellow-500 mr-2" />
            <h2 className="text-xl font-bold">Request Collaboration</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            >
              <option value="contributor">Contributor</option>
              <option value="reviewer">Reviewer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              rows={4}
              placeholder="Explain how you'd like to contribute..."
            />
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
              className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              <Send className="h-4 w-4 mr-2" />
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}