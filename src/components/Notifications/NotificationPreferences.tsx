import React from 'react';
import { Bell, Mail, Globe, Smartphone, Settings } from 'lucide-react';
import { useStore } from '../../lib/store';

export function NotificationPreferences() {
  const { settings, updateSettings } = useStore();

  const handleToggle = (type: 'email' | 'push' | 'inApp') => {
    updateSettings({
      notifications: {
        ...settings.notifications,
        [type]: !settings.notifications[type],
      },
    });
  };

  const notificationTypes = [
    {
      id: 'inApp',
      title: 'In-App Notifications',
      description: 'Receive notifications while using the platform',
      icon: Bell,
    },
    {
      id: 'email',
      title: 'Email Notifications',
      description: 'Get important updates in your inbox',
      icon: Mail,
    },
    {
      id: 'push',
      title: 'Push Notifications',
      description: "Stay updated even when you are not on the site",
      icon: Smartphone,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Settings className="h-6 w-6 text-yellow-500 mr-2" />
          <h2 className="text-xl font-bold">Notification Preferences</h2>
        </div>
        <Globe className="h-5 w-5 text-gray-400" />
      </div>

      <div className="space-y-6">
        {notificationTypes.map((type) => (
          <div
            key={type.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center">
              <div className="bg-yellow-100 p-2 rounded-lg mr-4">
                <type.icon className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-medium">{type.title}</h3>
                <p className="text-sm text-gray-600">{type.description}</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.notifications[type.id as keyof typeof settings.notifications]}
                onChange={() => handleToggle(type.id as 'email' | 'push' | 'inApp')}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
            </label>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <p className="text-sm text-yellow-800">
          You can customize your notification preferences at any time. We will only send you
          relevant updates based on your settings.
        </p>
      </div>
    </div>
  );
}