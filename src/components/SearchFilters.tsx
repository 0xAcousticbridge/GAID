import React from 'react';
import { Filter, Tag, Calendar, Star, TrendingUp } from 'lucide-react';

interface SearchFiltersProps {
  filters: {
    category: string;
    tags: string[];
    sortBy: 'recent' | 'popular' | 'rating';
    timeframe: 'all' | 'today' | 'week' | 'month' | 'year';
  };
  onFilterChange: (filters: any) => void;
}

export function SearchFilters({ filters, onFilterChange }: SearchFiltersProps) {
  const categories = [
    "All",
    "AI & ML",
    "Web Development",
    "Mobile Apps",
    "Data Science",
    "Blockchain",
    "IoT",
    "AR/VR",
    "Robotics",
    "Productivity",
    "Health & Wellness",
    "Education",
    "Finance",
    "Entertainment",
    "Social",
    "Sustainability"
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent', icon: Calendar },
    { value: 'popular', label: 'Most Popular', icon: TrendingUp },
    { value: 'rating', label: 'Highest Rated', icon: Star },
  ];

  const timeframes = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
  ];

  const popularTags = [
    'AI', 'Machine Learning', 'Neural Networks', 'Deep Learning', 'NLP',
    'Computer Vision', 'Robotics', 'Automation', 'ChatGPT', 'Innovation'
  ];

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 space-y-6">
      <div className="flex items-center mb-4">
        <Filter className="h-5 w-5 text-yellow-500 mr-2" />
        <h3 className="text-lg font-bold text-gray-100">Filters</h3>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-300 mb-2">Category</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center">
              <input
                type="radio"
                name="category"
                value={category}
                checked={filters.category === category}
                onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
                className="text-yellow-500 focus:ring-yellow-500 bg-gray-700 border-gray-600"
              />
              <span className="ml-2 text-sm text-gray-300">{category}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-300 mb-2">Sort By</h4>
        <div className="space-y-2">
          {sortOptions.map(({ value, label, icon: Icon }) => (
            <label key={value} className="flex items-center">
              <input
                type="radio"
                name="sortBy"
                value={value}
                checked={filters.sortBy === value}
                onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as any })}
                className="text-yellow-500 focus:ring-yellow-500 bg-gray-700 border-gray-600"
              />
              <Icon className="h-4 w-4 text-gray-400 ml-2 mr-1" />
              <span className="ml-2 text-sm text-gray-300">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-300 mb-2">Time Frame</h4>
        <select
          value={filters.timeframe}
          onChange={(e) => onFilterChange({ ...filters, timeframe: e.target.value })}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
        >
          {timeframes.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h4 className="flex items-center text-sm font-medium text-gray-300 mb-2">
          <Tag className="h-4 w-4 mr-1" />
          Popular Tags
        </h4>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                const newTags = filters.tags.includes(tag)
                  ? filters.tags.filter((t) => t !== tag)
                  : [...filters.tags, tag];
                onFilterChange({ ...filters, tags: newTags });
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

      {(filters.category !== 'All' || filters.tags.length > 0 || filters.sortBy !== 'recent' || filters.timeframe !== 'all') && (
        <button
          onClick={() => onFilterChange({
            category: 'All',
            tags: [],
            sortBy: 'recent',
            timeframe: 'all'
          })}
          className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
}