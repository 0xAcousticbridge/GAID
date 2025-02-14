import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IdeaCard } from '../components/IdeaCard';
import { SearchFilters } from '../components/SearchFilters';
import { supabase } from '../lib/supabase';

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm) {
      performSearch();
    }
  }, [searchTerm]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ideas')
        .select(`
          *,
          author:users!ideas_user_id_fkey (
            username,
            avatar_url
          )
        `)
        .textSearch('title', searchTerm)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResults(data || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm });
      performSearch();
    }
  };

  return (
    <div className="search-page">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search ideas..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          <SearchIcon />
        </button>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="filter-button"
        >
          <Filter />
        </button>
      </form>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="filters"
          >
            <SearchFilters />
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <p>Loading...</p>
      ) : results.length > 0 ? (
        <div className="results">
          {results.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
}