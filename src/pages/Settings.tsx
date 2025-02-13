import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { ColorThemeSelector } from '../components/Accessibility/ColorThemeSelector';
import { TextSizeAdjuster } from '../components/Accessibility/TextSizeAdjuster';
import { NotificationPreferences } from '../components/Notifications/NotificationPreferences';
import { AccessibilitySettings } from '../components/AccessibilitySettings';

export function Settings() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center mb-6">
        <SettingsIcon className="h-6 w-6 text-yellow-500 mr-2" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="space-y-6">
        <ColorThemeSelector />
        <TextSizeAdjuster />
        <NotificationPreferences />
        <AccessibilitySettings />
      </div>
    </div>
  );
}