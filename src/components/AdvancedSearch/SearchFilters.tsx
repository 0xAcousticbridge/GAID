import React, { useState } from 'react';
import { Filter, Tag, Calendar, Star, TrendingUp, Sliders } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchFiltersProps {
  onFilterChange: (filters: any) => void;
}

export function SearchFilters({ onFilterChange }: SearchFiltersProps) {
  const [filters, setFilters] = useState({
    category: 'All',
    tags: [] as string[],
    sortBy: 'recent',
    timeframe: 'all',
    rating: 0,
    status: 'all',
    aiGenerated: false
  });

  const categories = [
    "All",
    "AI & ML",
    "Web Development",
    "Mobile Apps",
    "Data Science",
    "Blockchain",
    "IoT",
    "AR/VR",
    "Robotics"
  ];

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
      <div className="flex items-center mb-6">
        <Sliders className="h-5 w-5 text-yellow-500 mr-2" />
        <h3 className="text-lg font-bold text-gray-100">Advanced Filters</h3>
      </div>

      <div className="space-y-6">
        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full bg-gray-700 text-gray-100 rounded-lg border-gray-600 focus:ring-yellow-500 focus:border-yellow-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {['AI', 'Machine Learning', 'Neural Networks', 'Deep Learning', 'NLP'].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  const newTags = filters.tags.includes(tag)
                    ? filters.tags.filter((t) => t !== tag)
                    : [...filters.tags, tag];
                  handleFilterChange('tags', newTags);
                }}
                className={`px-3 py-1 rounded-full text-sm ${
                  filters.tags.includes(tag)
                    ? 'bg-yellow-500 text-gray-900'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Minimum Rating
          </label>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleFilterChange('rating', rating)}
                className={`p-2 rounded-lg ${
                  filters.rating === rating
                    ? 'bg-yellow-500 text-gray-900'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Star
                  className="h-5 w-5"
                  fill={filters.rating >= rating ? 'currentColor' : 'none'}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Time Frame */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Time Frame
          </label>
          <select
            value={filters.timeframe}
            onChange={(e) => handleFilterChange('timeframe', e.target.value)}
            className="w-full bg-gray-700 text-gray-100 rounded-lg border-gray-600 focus:ring-yellow-500 focus:border-yellow-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Sort By
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'recent', label: 'Most Recent', icon: Calendar },
              { value: 'popular', label: 'Most Popular', icon: TrendingUp },
              { value: 'rating', label: 'Highest Rated', icon: Star }
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => handleFilterChange('sortBy', value)}
                className={`flex items-center justify-center px-4 py-2 rounded-lg ${
                  filters.sortBy === value
                    ? 'bg-yellow-500 text-gray-900'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* AI Generated Filter */}
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.aiGenerated}
              onChange={(e) => handleFilterChange('aiGenerated', e.target.checked)}
              className="rounded border-gray-600 text-yellow-500 focus:ring-yellow-500"
            />
            <span className="text-sm text-gray-300">AI Generated Only</span>
          </label>
        </div>
      </div>
    </div>
  );
}