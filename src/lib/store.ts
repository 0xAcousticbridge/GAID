import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from './supabase';

interface UserState {
  user: any | null;
  profile: any | null;
  notifications: {
    items: any[];
    unread: number;
  };
  achievements: any[];
  challenges: any[];
  streak: {
    current: number;
    longest: number;
    lastActive: string | null;
  };
  settings: {
    theme: 'light' | 'dark' | 'system';
    fontSize: 'small' | 'medium' | 'large';
    notifications: {
      email: boolean;
      push: boolean;
      inApp: boolean;
    };
    privacy: {
      profileVisibility: 'public' | 'private' | 'followers';
      activityVisibility: 'public' | 'private' | 'followers';
    };
    accessibility: {
      reduceMotion: boolean;
      highContrast: boolean;
    };
  };
  workspace: {
    layout: any[];
    widgets: any[];
    preferences: {
      showSidebar: boolean;
      sidebarWidth: number;
      compactView: boolean;
    };
  };
  collections: any[];
  onboarding: {
    completed: boolean;
    step: number;
  };

  setUser: (user: any | null) => void;
  setProfile: (profile: any | null) => void;
  addNotification: (type: string, message: string) => void;
  markNotificationAsRead: (id: string) => void;
  updateSettings: (settings: Partial<UserState['settings']>) => void;
  updateWorkspace: (workspace: Partial<UserState['workspace']>) => void;
  createCollection: (name: string) => void;
  addToCollection: (collectionId: string, ideaId: string) => void;
  setOnboardingStep: (step: number) => void;
  completeOnboarding: () => void;
  completeChallenge: (challengeId: string) => Promise<void>;
  updateStreak: () => void;
  fetchUserData: () => Promise<void>;
}

export const useStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      notifications: {
        items: [],
        unread: 0,
      },
      achievements: [],
      challenges: [],
      streak: {
        current: 0,
        longest: 0,
        lastActive: null,
      },
      settings: {
        theme: 'system',
        fontSize: 'medium',
        notifications: {
          email: true,
          push: true,
          inApp: true,
        },
        privacy: {
          profileVisibility: 'public',
          activityVisibility: 'public',
        },
        accessibility: {
          reduceMotion: false,
          highContrast: false,
        },
      },
      workspace: {
        layout: [],
        widgets: [],
        preferences: {
          showSidebar: true,
          sidebarWidth: 240,
          compactView: false,
        },
      },
      collections: [],
      onboarding: {
        completed: false,
        step: 0,
      },

      setUser: (user) => set({ user }),
      
      setProfile: (profile) => set({ profile }),
      
      addNotification: (type, message) =>
        set((state) => ({
          notifications: {
            items: [
              {
                id: Date.now().toString(),
                type,
                message,
                read: false,
                createdAt: new Date(),
              },
              ...state.notifications.items,
            ],
            unread: state.notifications.unread + 1,
          },
        })),

      markNotificationAsRead: (id) =>
        set((state) => ({
          notifications: {
            items: state.notifications.items.map((item) =>
              item.id === id ? { ...item, read: true } : item
            ),
            unread: Math.max(0, state.notifications.unread - 1),
          },
        })),

      updateSettings: (settings) =>
        set((state) => ({
          settings: { ...state.settings, ...settings },
        })),

      updateWorkspace: (workspace) =>
        set((state) => ({
          workspace: { ...state.workspace, ...workspace },
        })),

      createCollection: (name) =>
        set((state) => ({
          collections: [
            ...state.collections,
            {
              id: Date.now().toString(),
              name,
              ideaIds: [],
              createdAt: new Date(),
            },
          ],
        })),

      addToCollection: (collectionId, ideaId) =>
        set((state) => ({
          collections: state.collections.map((collection) =>
            collection.id === collectionId
              ? {
                  ...collection,
                  ideaIds: [...collection.ideaIds, ideaId],
                }
              : collection
          ),
        })),

      setOnboardingStep: (step) =>
        set((state) => ({
          onboarding: { ...state.onboarding, step },
        })),

      completeOnboarding: () =>
        set((state) => ({
          onboarding: { ...state.onboarding, completed: true },
        })),

      completeChallenge: async (challengeId) => {
        const { user } = get();
        if (!user) return;

        try {
          const { error } = await supabase
            .from('user_challenges')
            .update({ completed: true, completed_at: new Date().toISOString() })
            .match({ user_id: user.id, challenge_id: challengeId });

          if (error) throw error;

          // Update local state
          set((state) => ({
            challenges: state.challenges.map((challenge) =>
              challenge.id === challengeId
                ? { ...challenge, completed: true }
                : challenge
            ),
          }));

          // Update streak
          get().updateStreak();
        } catch (error) {
          console.error('Error completing challenge:', error);
        }
      },

      updateStreak: () => {
        const today = new Date().toISOString().split('T')[0];
        const { streak } = get();
        
        if (streak.lastActive === today) return;

        const lastActive = new Date(streak.lastActive || '');
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const isConsecutive = lastActive.toISOString().split('T')[0] === 
          yesterday.toISOString().split('T')[0];

        set((state) => ({
          streak: {
            current: isConsecutive ? state.streak.current + 1 : 1,
            longest: Math.max(
              state.streak.longest,
              isConsecutive ? state.streak.current + 1 : 1
            ),
            lastActive: today,
          },
        }));
      },

      fetchUserData: async () => {
        const { user } = get();
        if (!user) return;

        try {
          // Fetch user profile
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

          // Fetch user challenges
          const { data: challenges } = await supabase
            .from('user_challenges')
            .select(`
              *,
              challenge:challenges(*)
            `)
            .eq('user_id', user.id);

          // Fetch user achievements
          const { data: achievements } = await supabase
            .from('user_achievements')
            .select('*')
            .eq('user_id', user.id);

          // Fetch user collections
          const { data: collections } = await supabase
            .from('collections')
            .select('*')
            .eq('user_id', user.id);

          set({
            profile,
            challenges: challenges || [],
            achievements: achievements || [],
            collections: collections || [],
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      },
    }),
    {
      name: 'goodaideas-storage',
      partialize: (state) => ({
        settings: state.settings,
        workspace: state.workspace,
        collections: state.collections,
        onboarding: state.onboarding,
      }),
    }
  )
);