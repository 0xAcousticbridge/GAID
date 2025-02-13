import React, { createContext, useContext, useState } from 'react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface ModerationContextType {
  checkContent: (content: string) => Promise<boolean>;
  moderationStatus: 'pending' | 'approved' | 'flagged' | 'rejected' | null;
}

const ModerationContext = createContext<ModerationContextType>({
  checkContent: async () => true,
  moderationStatus: null,
});

export function ModerationProvider({ children }: { children: React.ReactNode }) {
  const [moderationStatus, setModerationStatus] = useState<'pending' | 'approved' | 'flagged' | 'rejected' | null>(null);

  const checkContent = async (content: string): Promise<boolean> => {
    try {
      setModerationStatus('pending');

      // Simulate AI content moderation
      const isSafe = !content.toLowerCase().includes('inappropriate') &&
                    !content.toLowerCase().includes('offensive');

      if (!isSafe) {
        setModerationStatus('flagged');
        toast.error('Content may be inappropriate');
        return false;
      }

      setModerationStatus('approved');
      return true;
    } catch (error) {
      console.error('Moderation error:', error);
      setModerationStatus('rejected');
      toast.error('Content moderation failed');
      return false;
    }
  };

  return (
    <ModerationContext.Provider value={{ checkContent, moderationStatus }}>
      {children}
    </ModerationContext.Provider>
  );
}

export const useModeration = () => useContext(ModerationContext);