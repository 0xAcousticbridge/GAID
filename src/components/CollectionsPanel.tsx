import React, { useState } from 'react';
import { FolderPlus, Folder, Plus, X } from 'lucide-react';
import { useStore } from '../lib/store';
import toast from 'react-hot-toast';

interface CollectionsPanelProps {
  onClose: () => void;
  ideaId?: string;
}

export function CollectionsPanel({ onClose, ideaId }: CollectionsPanelProps) {
  const [newCollectionName, setNewCollectionName] = useState('');
  const { collections, createCollection, addToCollection } = useStore();

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCollectionName.trim()) {
      createCollection(newCollectionName.trim());
      setNewCollectionName('');
      toast.success('Collection created!');
    }
  };

  const handleAddToCollection = (collectionId: string) => {
    if (ideaId) {
      addToCollection(collectionId, ideaId);
      toast.success('Added to collection!');
      onClose();
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg z-50">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <FolderPlus className="h-5 w-5 text-yellow-500 mr-2" />
          <h2 className="text-lg font-bold">Collections</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-4">
        <form onSubmit={handleCreateCollection} className="mb-6">
          <div className="flex items-center">
            <input
              type="text"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder="New collection name"
              className="flex-1 border-gray-300 rounded-l-lg focus:ring-yellow-500 focus:border-yellow-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-500 text-white rounded-r-lg hover:bg-yellow-600"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </form>

        <div className="space-y-2">
          {collections.map((collection) => (
            <button
              key={collection.id}
              onClick={() => handleAddToCollection(collection.id)}
              className="w-full flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Folder className="h-5 w-5 text-yellow-500 mr-3" />
              <div className="flex-1 text-left">
                <div className="font-medium">{collection.name}</div>
                <div className="text-sm text-gray-500">
                  {collection.ideaIds.length} ideas
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}