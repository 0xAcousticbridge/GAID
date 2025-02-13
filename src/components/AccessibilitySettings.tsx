import React from 'react';
import { useStore } from '../lib/store';
import { Eye, ZapOff, PanelTop, Settings } from 'lucide-react';

export function AccessibilitySettings() {
  const { settings, updateSettings } = useStore();

  const handleToggleReduceMotion = () => {
    updateSettings({
      accessibility: {
        ...settings.accessibility,
        reduceMotion: !settings.accessibility.reduceMotion,
      },
    });
  };

  const handleToggleHighContrast = () => {
    updateSettings({
      accessibility: {
        ...settings.accessibility,
        highContrast: !settings.accessibility.highContrast,
      },
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center mb-6">
        <Settings className="h-6 w-6 text-yellow-500 mr-2" />
        <h2 className="text-xl font-bold">Accessibility Settings</h2>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ZapOff className="h-5 w-5 text-gray-500" />
            <div>
              <h3 className="font-medium">Reduce Motion</h3>
              <p className="text-sm text-gray-500">
                Minimize animations and transitions
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.accessibility.reduceMotion}
              onChange={handleToggleReduceMotion}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Eye className="h-5 w-5 text-gray-500" />
            <div>
              <h3 className="font-medium">High Contrast</h3>
              <p className="text-sm text-gray-500">
                Increase contrast for better visibility
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.accessibility.highContrast}
              onChange={handleToggleHighContrast}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <PanelTop className="h-5 w-5 text-gray-500" />
            <div>
              <h3 className="font-medium">Font Size</h3>
              <p className="text-sm text-gray-500">
                Adjust text size for better readability
              </p>
            </div>
          </div>
          <select
            value={settings.fontSize}
            onChange={(e) =>
              updateSettings({ fontSize: e.target.value as 'small' | 'medium' | 'large' })
            }
            className="rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
      </div>
    </div>
  );
}