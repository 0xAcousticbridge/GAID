import React from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { useTheme } from '../ThemeProvider';

export function ColorThemeSelector() {
  const { theme, setTheme } = useTheme();

  const themes = [
    {
      id: 'light',
      name: 'Light',
      icon: Sun,
      description: 'Bright theme for daytime use',
    },
    {
      id: 'dark',
      name: 'Dark',
      icon: Moon,
      description: 'Easy on the eyes in low light',
    },
    {
      id: 'system',
      name: 'System',
      icon: Monitor,
      description: 'Follows your system preferences',
    },
  ];

  return (
    <div className="bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-gray-100 mb-6">Color Theme</h2>

      <div className="grid gap-4">
        {themes.map((themeOption) => (
          <button
            key={themeOption.id}
            onClick={() => setTheme(themeOption.id as 'light' | 'dark' | 'system')}
            className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
              theme === themeOption.id
                ? 'bg-yellow-500/20 border-2 border-yellow-500'
                : 'bg-gray-700/50 hover:bg-gray-700 border-2 border-transparent'
            }`}
          >
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${
                theme === themeOption.id ? 'bg-yellow-500/20' : 'bg-gray-600'
              }`}>
                <themeOption.icon className={`h-5 w-5 ${
                  theme === themeOption.id ? 'text-yellow-500' : 'text-gray-300'
                }`} />
              </div>
              <div className="ml-4 text-left">
                <h3 className="font-medium text-gray-100">{themeOption.name}</h3>
                <p className="text-sm text-gray-400">{themeOption.description}</p>
              </div>
            </div>
            {theme === themeOption.id && (
              <Check className="h-5 w-5 text-yellow-500" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
        <p className="text-sm text-gray-300">
          Choose a theme that works best for your eyes and environment. Your selection
          will be saved automatically.
        </p>
      </div>
    </div>
  );
}