import React from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { useStore } from '../../lib/store';

export function ColorThemeSelector() {
  const { settings, updateSettings } = useStore();

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
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6">Color Theme</h2>

      <div className="grid gap-4">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => updateSettings({ theme: theme.id as any })}
            className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
              settings.theme === theme.id
                ? 'bg-yellow-50 border-2 border-yellow-500'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${
                settings.theme === theme.id ? 'bg-yellow-200' : 'bg-gray-200'
              }`}>
                <theme.icon className={`h-5 w-5 ${
                  settings.theme === theme.id ? 'text-yellow-700' : 'text-gray-600'
                }`} />
              </div>
              <div className="ml-4 text-left">
                <h3 className="font-medium">{theme.name}</h3>
                <p className="text-sm text-gray-600">{theme.description}</p>
              </div>
            </div>
            {settings.theme === theme.id && (
              <Check className="h-5 w-5 text-yellow-500" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          Choose a theme that works best for your eyes and environment. Your selection
          will be saved automatically.
        </p>
      </div>
    </div>
  );
}