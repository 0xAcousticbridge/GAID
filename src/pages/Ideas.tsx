import { useState, useEffect } from 'react';
import { Sparkles, Filter } from 'lucide-react';
import { IdeaCard } from '../components/IdeaCard';
import { SearchFilters } from '../components/SearchFilters';
import { CreateIdeaModal } from '../components/CreateIdeaModal';
import { AIPromptBuilder } from '../components/IdeaGeneration/AIPromptBuilder';
import { supabase } from '../lib/supabase';
import { useStore } from '../lib/store';
import toast from 'react-hot-toast';

interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  user_id: string;
  tags: string[];
  rating: number;
  favorites_count: number;
  comments_count: number;
  created_at: string;
  author: {
    username: string;
    avatar_url?: string;
  };
}

export function Ideas() {
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'All',
    tags: [] as string[],
    sortBy: 'recent' as 'recent' | 'popular' | 'rating',
    timeframe: 'all' as 'all' | 'today' | 'week' | 'month' | 'year'
  });
  const { user } = useStore();

  useEffect(() => {
    fetchIdeas();
  }, [filters]);

  const fetchIdeas = async () => {
    try {
      let query = supabase
        .from('ideas')
        .select(`
          *,
          author:users!ideas_user_id_fkey (
            username,
            avatar_url
          ),
          ratings:idea_ratings(rating),
          comments:comments(count)
        `);

      // Apply filters
      if (filters.category !== 'All') {
        query = query.eq('category', filters.category);
      }

      if (filters.tags.length > 0) {
        query = query.contains('tags', filters.tags);
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'popular':
          query = query.order('favorites_count', { ascending: false });
          break;
        case 'rating':
          query = query.order('rating', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;

      setIdeas(data || []);
    } catch (error) {
      console.error('Error fetching ideas:', error);
      toast.error('Failed to load ideas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIdea = () => {
    setShowCreateModal(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-100">Ideas</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 hover:bg-gray-700 rounded-lg text-gray-300"
            title="Toggle filters"
          >
            <Filter className="h-5 w-5" />
          </button>
          <button
            onClick={handleCreateIdea}
            className="flex items-center px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Share Idea
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {showFilters && (
          <div className="lg:col-span-1">
            <SearchFilters
              filters={filters}
              onFilterChange={setFilters}
            />
          </div>
        )}

        <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
          <div className="space-y-6">
            <AIPromptBuilder onGenerate={(prompt) => console.log('Generated:', prompt)} />
            
            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 animate-pulse">
                    <div className="h-6 bg-gray-700 rounded w-3/4 mb-4" />
                    <div className="h-4 bg-gray-700 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : ideas.length > 0 ? (
              <div className="space-y-6">
                {ideas.map((idea) => (
                  <IdeaCard key={idea.id} idea={idea} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
                <Sparkles className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-100 mb-2">No ideas found</h3>
                <p className="text-gray-400">
                  {filters.category !== 'All' || filters.tags.length > 0
                    ? 'Try adjusting your filters'
                    : 'Be the first to share an idea!'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showCreateModal && (
        <CreateIdeaModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}