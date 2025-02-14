import React, { createContext, useContext, useEffect } from 'react';
import { useStore } from '../lib/store';
import { supabase } from '../lib/supabase';

interface ThemeContextType {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: async () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user, settings, updateSettings } = useStore();

  const setTheme = async (theme: 'light' | 'dark' | 'system') => {
    try {
      // Update local state first for immediate feedback
      updateSettings({ theme });

      // Apply theme to document
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
        document.documentElement.classList.toggle('dark', systemTheme === 'dark');
      } else {
        document.documentElement.classList.toggle('dark', theme === 'dark');
      }

      // If user is logged in, persist to database
      if (user) {
        const { error } = await supabase
          .from('user_settings')
          .upsert({
            user_id: user.id,
            theme,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error saving theme preference:', error);
      // Revert to previous theme if save fails
      updateSettings({ theme: settings.theme });
    }
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (settings.theme === 'system') {
        setTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [settings.theme]);

  useEffect(() => {
    // Apply initial theme
    setTheme(settings.theme);

    // Fetch user's theme preference if logged in
    if (user) {
      const fetchThemePreference = async () => {
        try {
          const { data, error } = await supabase
            .from('user_settings')
            .select('theme')
            .eq('user_id', user.id)
            .single();

          if (error) throw error;
          if (data?.theme) {
            setTheme(data.theme as 'light' | 'dark' | 'system');
          }
        } catch (error) {
          console.error('Error fetching theme preference:', error);
        }
      };

      fetchThemePreference();
    }
  }, [user]);

  return (
    <ThemeContext.Provider value={{ theme: settings.theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);