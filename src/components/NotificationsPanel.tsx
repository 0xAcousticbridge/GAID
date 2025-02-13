import React from 'react';
import { Bell, X } from 'lucide-react';
import { useStore } from '../lib/store';
import { format } from 'date-fns';

interface NotificationsPanelProps {
  onClose: () => void;
}

export function NotificationsPanel({ onClose }: NotificationsPanelProps) {
  const { notifications, markNotificationAsRead } = useStore();

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg z-50">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <Bell className="h-5 w-5 text-yellow-500 mr-2" />
          <h2 className="text-lg font-bold">Notifications</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="overflow-y-auto h-full pb-20">
        {notifications.items.length === 0 ? (
          <div className="text-center text-gray-500 p-8">
            No notifications yet
          </div>
        ) : (
          notifications.items.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b ${
                notification.read ? 'bg-white' : 'bg-yellow-50'
              }`}
              onClick={() => markNotificationAsRead(notification.id)}
            >
              <div className="text-sm mb-1">{notification.message}</div>
              <div className="text-xs text-gray-500">
                {format(notification.createdAt, 'MMM d, yyyy h:mm a')}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}