import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageSquare, Share2, ChevronUp, ChevronDown, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../lib/store';
import toast from 'react-hot-toast';

interface RecommendedContent {
  id: string;
  title: string;
  description: string;
  category: string;
  rating: number;
  collaborators: number;
  trend: number;
  image?: string;
  author?: {
    name: string;
    avatar?: string;
  };
}

interface ContentRecommenderProps {
  recommendations: RecommendedContent[];
}

export function ContentRecommender({ recommendations }: ContentRecommenderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const { user } = useStore();

  const handleLike = (id: string) => {
    if (!user) {
      toast.error('Please log in to like ideas');
      return;
    }
    
    const newLikedItems = new Set(likedItems);
    if (likedItems.has(id)) {
      newLikedItems.delete(id);
      toast.success('Removed from likes');
    } else {
      newLikedItems.add(id);
      toast.success('Added to likes');
    }
    setLikedItems(newLikedItems);
  };

  const handleNext = () => {
    if (currentIndex < recommendations.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentItem = recommendations[currentIndex];

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden relative h-[600px]">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900" />
      
      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="relative h-full"
        >
          {currentItem.image && (
            <img
              src={currentItem.image}
              alt={currentItem.title}
              className="w-full h-full object-cover"
            />
          )}
          
          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <div className="max-w-lg">
              <h3 className="text-2xl font-bold text-white mb-2">
                {currentItem.title}
              </h3>
              <p className="text-gray-200 mb-4">
                {currentItem.description}
              </p>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {currentItem.author?.avatar ? (
                    <img
                      src={currentItem.author.avatar}
                      alt={currentItem.author.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                  <span className="ml-2 text-white">
                    {currentItem.author?.name || 'Anonymous'}
                  </span>
                </div>
                <span className="px-2 py-1 bg-yellow-500 text-gray-900 rounded-full text-sm font-medium">
                  {currentItem.category}
                </span>
              </div>

              <div className="flex items-center space-x-6">
                <Link
                  to={`/ideas/${currentItem.id}`}
                  className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors"
                >
                  View Details
                </Link>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleLike(currentItem.id)}
                    className={`p-2 rounded-full ${
                      likedItems.has(currentItem.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600">
                    <MessageSquare className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute right-6 bottom-24 flex flex-col space-y-4">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === recommendations.length - 1}
          className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="absolute right-6 top-6 flex flex-col space-y-2">
        {recommendations.map((_, index) => (
          <div
            key={index}
            className={`w-1 h-8 rounded-full ${
              index === currentIndex ? 'bg-yellow-500' : 'bg-gray-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
}