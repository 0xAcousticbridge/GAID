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
  settings: {
    theme: 'light' | 'dark' | 'system';
    fontSize: 'small' | 'medium' | 'large';
    notifications: {
      email: boolean;
      push: boolean;
      inApp: boolean;
    };
    accessibility: {
      reduceMotion: boolean;
      highContrast: boolean;
    };
  };
  onboarding: {
    completed: boolean;
    step: number;
  };

  // Actions
  setUser: (user: any | null) => void;
  setProfile: (profile: any | null) => void;
  updateSettings: (settings: Partial<UserState['settings']>) => void;
  setOnboardingStep: (step: number) => void;
  completeOnboarding: () => Promise<void>;
  fetchUserData: () => Promise<void>;
  logout: () => Promise<void>;
  reset: () => void;
  addNotification: (type: string, message: string) => void;
  markNotificationAsRead: (id: string) => void;
}

const initialState = {
  user: null,
  profile: null,
  notifications: {
    items: [],
    unread: 0
  },
  settings: {
    theme: 'system' as const,
    fontSize: 'medium' as const,
    notifications: {
      email: true,
      push: true,
      inApp: true,
    },
    accessibility: {
      reduceMotion: false,
      highContrast: false,
    },
  },
  onboarding: {
    completed: false,
    step: 0,
  }
};

export const useStore = create<UserState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUser: (user) => set({ user }),
      
      setProfile: (profile) => {
        if (profile) {
          set({ 
            profile,
            onboarding: {
              ...get().onboarding,
              completed: profile.onboarding_completed || false
            }
          });
        } else {
          set({ profile: null });
        }
      },

      updateSettings: (settings) =>
        set((state) => ({
          settings: { ...state.settings, ...settings },
        })),

      setOnboardingStep: (step) =>
        set((state) => ({
          onboarding: { ...state.onboarding, step },
        })),

      completeOnboarding: async () => {
        const { user } = get();
        if (!user) return;

        try {
          // Update the database first
          const { error } = await supabase
            .from('users')
            .update({ onboarding_completed: true })
            .eq('id', user.id);

          if (error) throw error;

          // Only update local state if database update succeeds
          set((state) => ({
            onboarding: { ...state.onboarding, completed: true },
            profile: state.profile ? {
              ...state.profile,
              onboarding_completed: true
            } : null
          }));
        } catch (error) {
          console.error('Error completing onboarding:', error);
          throw error;
        }
      },

      fetchUserData: async () => {
        const { user } = get();
        if (!user) return;

        try {
          // Get user profile
          const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profileError) {
            // If profile doesn't exist, create it
            if (profileError.code === 'PGRST116') {
              const { data: newProfile, error: createError } = await supabase
                .from('users')
                .insert([{
                  id: user.id,
                  username: user.email?.split('@')[0],
                  onboarding_completed: false
                }])
                .select()
                .single();

              if (createError) throw createError;
              set({ 
                profile: newProfile,
                onboarding: {
                  ...get().onboarding,
                  completed: false
                }
              });
            } else {
              throw profileError;
            }
          } else {
            set({ 
              profile,
              onboarding: {
                ...get().onboarding,
                completed: profile.onboarding_completed || false
              }
            });
          }

          // Get user settings
          const { data: settings, error: settingsError } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (settingsError && settingsError.code !== 'PGRST116') {
            throw settingsError;
          }

          // Update state with fetched data
          if (settings) {
            set((state) => ({
              settings: {
                theme: settings.theme || state.settings.theme,
                fontSize: settings.font_size || state.settings.fontSize,
                notifications: settings.notifications || state.settings.notifications,
                accessibility: settings.accessibility || state.settings.accessibility,
              }
            }));
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          throw error;
        }
      },

      logout: async () => {
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          get().reset();
        } catch (error) {
          console.error('Error logging out:', error);
          throw error;
        }
      },

      reset: () => {
        const currentTheme = get().settings.theme;
        set({
          ...initialState,
          settings: {
            ...initialState.settings,
            theme: currentTheme // Preserve theme preference
          }
        });
      },

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
    }),
    {
      name: 'goodaideas-storage',
      partialize: (state) => ({
        settings: state.settings,
      }),
    }
  )
);