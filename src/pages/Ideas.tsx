// Remove unused import if not needed
// import React from 'react';

import { useState, useEffect } from 'react';
// import { Sparkles, Filter } from 'lucide-react';
// import { IdeaCard } from '../components/IdeaCard';
// import { SearchFilters } from '../components/SearchFilters';
// import { CreateIdeaModal } from '../components/CreateIdeaModal';
// import { AIPromptBuilder } from '../components/IdeaGeneration/AIPromptBuilder';
// import { supabase } from '../lib/supabase';
// import { useStore } from '../lib/store';
// import toast from 'react-hot-toast';
// import { isValid, parseISO } from 'date-fns';

// Import or define isValidUUID
// import { isValidUUID } from 'some-utility-library';

// Or define it if it's a custom function
// const isValidUUID = (uuid: string) => {
//   // Implement UUID validation logic
//   return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(uuid);
// };

interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  // Add other properties as needed
}

// Import or define the function used to fetch ideas
// For example, if you have a function like this:
// import { fetchIdeasFromAPI } from './path/to/your/api'; // Adjust the import path as needed

// If you don't have such a function, define it or use an existing one
const fetchIdeasFromAPI = async () => {
  // Implement the function to fetch ideas
  return [
    { id: '1', title: 'Idea 1', description: 'Description 1', category: 'General' },
    { id: '2', title: 'Idea 2', description: 'Description 2', category: 'Technology' },
  ];
};

export function Ideas() {
  // Remove unused state and functions
  // const [showFilters, setShowFilters] = useState(false);
  // const [showCreateModal, setShowCreateModal] = useState(false);
  const [, setIdeas] = useState<Idea[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [filters, setFilters] = useState({
  //   category: '',
  //   tags: [] as string[],
  //   sortBy: 'rating' as 'rating' | 'recent' | 'popular',
  //   timeframe: 'all' as 'all' | 'today' | 'week' | 'month' | 'year',
  // });
  // const { user } = useStore();

  // useEffect(() => {
  //   fetchIdeas();
  // }, [filters]);

  // const validateDate = (dateString: string | null): string => {
  //   if (!dateString) {
  //     return new Date().toISOString(); // Fallback to current date if null
  //   }

  //   try {
  //     // Handle ISO string format
  //     if (typeof dateString === 'string' && dateString.includes('T')) {
  //       const date = parseISO(dateString);
  //       if (!isValid(date)) {
  //         console.error('Invalid date:', dateString);
  //         return new Date().toISOString();
  //       }
  //       return date.toISOString();
  //     }
      
  //     // Handle timestamp format
  //     const timestamp = new Date(dateString);
  //     if (!isValid(timestamp)) {
  //       console.error('Invalid date:', dateString);
  //       return new Date().toISOString();
  //     }
  //     return timestamp.toISOString();
  //   } catch (error) {
  //     console.error('Error validating date:', error);
  //     return new Date().toISOString(); // Fallback to current date if parsing fails
  //   }
  // };

  useEffect(() => {
    const fetchIdeas = async () => {
      const fetchedIdeas = await fetchIdeasFromAPI();
      setIdeas(fetchedIdeas);
    };

    fetchIdeas();
  }, []);

  // const handleCreateIdea = useCallback(() => {
  //   if (!user) {
  //     toast.error('Please log in to share ideas');
  //     return;
  //   }
  //   setShowCreateModal(true);
  // }, [user]);

  // const filteredIdeas = useMemo(() => {
  //   return ideas.filter(idea => idea.category === filters.category);
  // }, [ideas, filters.category]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-100">Ideas</h1>
        <div className="flex space-x-2">
          {/* Remove unused buttons */}
          {/* <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 hover:bg-gray-700 rounded-lg text-gray-300"
            title="Toggle filters"
          >
            <Filter className="h-5 w-5" />
          </button>
          <button
            aria-label="Create new idea"
            onClick={handleCreateIdea}
            className="flex items-center px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Share Idea
          </button> */}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Remove unused filters section */}
        {/* <div className="lg:col-span-1">
          <SearchFilters
            filters={filters}
            onFilterChange={setFilters}
          />
        </div> */}

        <div className="lg:col-span-4">
          <div className="space-y-6">
            {/* Remove unused AIPromptBuilder */}
            {/* <AIPromptBuilder onGenerate={(prompt) => console.log('Generated:', prompt)} /> */}
            
            {/* Remove unused loading and ideas section */}
            {/* {loading ? (
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
                {filteredIdeas.map((idea) => (
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
            )} */}
          </div>
        </div>
      </div>

      {/* Remove unused CreateIdeaModal */}
      {/* {showCreateModal && (
        <CreateIdeaModal onClose={() => setShowCreateModal(false)} />
      )} */}
    </div>
  );
}