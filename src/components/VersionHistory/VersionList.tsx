import React, { useState, useEffect } from 'react';
import { Clock, ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';

interface Version {
  id: string;
  version_number: number;
  title: string;
  description: string;
  changes: any;
  created_at: string;
}

interface VersionListProps {
  ideaId: string;
}

export function VersionList({ ideaId }: VersionListProps) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);

  useEffect(() => {
    fetchVersions();
  }, [ideaId]);

  const fetchVersions = async () => {
    try {
      const { data, error } = await supabase
        .from('idea_versions')
        .select('*')
        .eq('idea_id', ideaId)
        .order('version_number', { ascending: false });

      if (error) throw error;
      setVersions(data || []);
    } catch (error) {
      console.error('Error fetching versions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-gray-700 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {versions.map((version, index) => (
        <motion.div
          key={version.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`bg-gray-700/50 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors ${
            selectedVersion?.id === version.id ? 'border-l-4 border-yellow-500' : ''
          }`}
          onClick={() => setSelectedVersion(version)}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-100">
                Version {version.version_number}
              </h3>
              <div className="flex items-center text-sm text-gray-400">
                <Clock className="h-4 w-4 mr-1" />
                {format(new Date(version.created_at), 'MMM d, yyyy h:mm a')}
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>

          {selectedVersion?.id === version.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-600"
            >
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-300">Title</h4>
                  <p className="text-gray-100">{version.title}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-300">Description</h4>
                  <p className="text-gray-100">{version.description}</p>
                </div>
                {version.changes && Object.keys(version.changes).length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-300">Changes</h4>
                    <ul className="list-disc list-inside text-gray-100">
                      {Object.entries(version.changes).map(([key, value]) => (
                        <li key={key}>{`${key}: ${value}`}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
}