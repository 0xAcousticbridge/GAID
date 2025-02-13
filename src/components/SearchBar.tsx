import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useOnClickOutside } from '../hooks/useOnClickOutside';

interface SearchResult {
  id: string;
  title: string;
  category: string;
  author: {
    username: string;
  };
}

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [trendingSearches] = useState([
    'AI Education',
    'Machine Learning',
    'Neural Networks',
    'Computer Vision',
    'Natural Language Processing'
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
        // Format search term for PostgreSQL tsquery
        const formattedTerm = searchTerm
          .trim()
          .split(/\s+/)
          .map(word => word + ':*')
          .join(' & ');

        const { data, error } = await supabase
          .from('ideas')
          .select(`
            id,
            title,
            category,
            author:users!ideas_user_id_fkey (
              username
            )
          `)
          .textSearch('title', formattedTerm, {
            type: 'websearch',
            config: 'english'
          })
          .limit(5);

        if (error) throw error;
        setResults(data || []);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleResultClick = (id: string) => {
    setIsOpen(false);
    navigate(`/ideas/${id}`);
  };

  const handleTrendingClick = (term: string) => {
    setSearchTerm(term);
    inputRef.current?.focus();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center px-3 py-1.5 text-gray-400 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
      >
        <Search className="h-4 w-4 mr-2" />
        <span>Quick search...</span>
        <span className="ml-2 text-sm bg-gray-700 px-1.5 py-0.5 rounded">⌘K</span>
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
                <div className="relative">
                  <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search ideas..."
                    className="w-full pl-12 pr-12 py-4 bg-transparent text-gray-100 border-b border-gray-700 focus:outline-none focus:ring-0"
                    autoFocus
                  />
                  {loading ? (
                    <Loader2 className="absolute right-4 top-4 h-5 w-5 text-gray-400 animate-spin" />
                  ) : searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-4 top-4 text-gray-400 hover:text-gray-300"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>

                <div className="p-4">
                  {!searchTerm && (
                    <div>
                      <div className="flex items-center text-sm text-gray-400 mb-3">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Trending searches
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {trendingSearches.map((term) => (
                          <button
                            key={term}
                            onClick={() => handleTrendingClick(term)}
                            className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.length > 0 && (
                    <div className="space-y-2">
                      {results.map((result) => (
                        <button
                          key={result.id}
                          onClick={() => handleResultClick(result.id)}
                          className="w-full p-3 flex items-center text-left rounded-lg hover:bg-gray-700/50 group"
                        >
                          <div>
                            <div className="font-medium text-gray-200 group-hover:text-yellow-500">
                              {result.title}
                            </div>
                            <div className="text-sm text-gray-400">
                              by {result.author.username} in {result.category}
                            </div>
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