import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2, TrendingUp, Tag, Hash, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useOnClickOutside } from '../hooks/useOnClickOutside';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  author: {
    username: string;
  };
}

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'tags' | 'categories'>('all');
  const [trendingTags] = useState([
    'Productivity',
    'Daily Life',
    'Home',
    'Health',
    'Family',
    'Automation'
  ]);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useOnClickOutside(searchRef, () => setIsOpen(false));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('ideas')
          .select(`
            *,
            author:users!ideas_user_id_fkey (
              username,
              avatar_url
            )
          `);

        const searchTermLower = searchTerm.toLowerCase().trim();

        switch (activeFilter) {
          case 'tags':
            query = query.contains('tags', [searchTermLower]);
            break;
          case 'categories':
            query = query.ilike('category', `%${searchTermLower}%`);
            break;
          default:
            query = query.or(`title.ilike.%${searchTermLower}%,description.ilike.%${searchTermLower}%`);
        }

        const { data, error } = await query.limit(10);
        if (error) throw error;
        setResults(data || []);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, activeFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center w-64 px-3 py-1.5 text-gray-400 bg-gray-800 rounded-lg hover:bg-gray-700/70 transition-colors group"
      >
        <Search className="h-4 w-4 mr-2 group-hover:text-gray-300" />
        <span className="text-sm group-hover:text-gray-300">Quick search...</span>
        <span className="ml-auto text-xs bg-gray-700 px-1.5 py-0.5 rounded">⌘K</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50"
            />
            
            <motion.div
              ref={searchRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-0 top-4 mx-auto max-w-2xl z-50 p-4"
            >
              <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      ref={inputRef}
                      type="text"
                      name="search"
                      id="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search ideas, tags, or categories..."
                      className="w-full pl-12 pr-12 py-4 bg-transparent text-gray-100 border-b border-gray-700 focus:outline-none focus:ring-0 placeholder-gray-400"
                      autoComplete="off"
                      autoFocus
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center space-x-2">
                      <div className="flex space-x-1">
                        {['all', 'tags', 'categories'].map((filter) => (
                          <button
                            key={filter}
                            type="button"
                            onClick={() => setActiveFilter(filter as any)}
                            className={`px-2 py-1 text-xs rounded-md transition-colors ${
                              activeFilter === filter
                                ? 'bg-yellow-500/20 text-yellow-500'
                                : 'text-gray-400 hover:text-gray-300'
                            }`}
                          >
                            {filter}
                          </button>
                        ))}
                      </div>
                      {loading ? (
                        <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                      ) : searchTerm && (
                        <button
                          type="button"
                          onClick={() => setSearchTerm('')}
                          className="text-gray-400 hover:text-gray-300"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </form>

                <div className="p-4">
                  {!searchTerm && (
                    <div>
                      <div className="flex items-center text-sm text-gray-400 mb-3">
                        <Tag className="h-4 w-4 mr-2" />
                        Trending tags
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {trendingTags.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              setSearchTerm(tag);
                              setActiveFilter('tags');
                            }}
                            className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600 flex items-center space-x-1"
                          >
                            <Hash className="h-3 w-3" />
                            <span>{tag}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.length > 0 && (
                    <div className="space-y-2 mt-4">
                      {results.map((result) => (
                        <button
                          key={result.id}
                          type="button"
                          onClick={() => {
                            navigate(`/ideas/${result.id}`);
                            setIsOpen(false);
                          }}
                          className="w-full p-3 flex items-center text-left rounded-lg hover:bg-gray-700/50 group"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-gray-200 group-hover:text-yellow-500">
                              {result.title}
                            </div>
                            <div className="text-sm text-gray-400 mt-1">
                              {result.description.length > 120
                                ? result.description.substring(0, 120) + '...'
                                : result.description}
                            </div>
                            <div className="flex items-center mt-2 space-x-2">
                              <span className="text-sm text-gray-400">
                                by {result.author.username}
                              </span>
                              <span className="text-gray-600">•</span>
                              <span className="text-sm text-gray-400">
                                {result.category}
                              </span>
                            </div>
                            {result.tags && result.tags.length > 0 && (
                              <div className="flex items-center gap-2 mt-2">
                                {result.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-0.5 text-xs bg-gray-700 text-gray-300 rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {searchTerm && results.length === 0 && !loading && (
                    <div className="text-center py-12 text-gray-400">
                      No results found for "{searchTerm}"
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}