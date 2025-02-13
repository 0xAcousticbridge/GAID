import React from 'react';
import { TextQuote, ZoomIn, ZoomOut } from 'lucide-react';
import { useStore } from '../../lib/store';

export function TextSizeAdjuster() {
  const { settings, updateSettings } = useStore();

  const handleFontSizeChange = (size: 'small' | 'medium' | 'large') => {
    updateSettings({ fontSize: size });
    document.documentElement.classList.remove('text-sm', 'text-base', 'text-lg');
    switch (size) {
      case 'small':
        document.documentElement.classList.add('text-sm');
        break;
      case 'medium':
        document.documentElement.classList.add('text-base');
        break;
      case 'large':
        document.documentElement.classList.add('text-lg');
        break;
    }
  };

  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center text-gray-600">
        <TextQuote className="h-5 w-5 mr-2" />
        <span className="font-medium">Text Size</span>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleFontSizeChange('small')}
          className={`p-2 rounded-lg flex items-center ${
            settings.fontSize === 'small'
              ? 'bg-yellow-100 text-yellow-800'
              : 'hover:bg-gray-100'
          }`}
          title="Small Text"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <button
          onClick={() => handleFontSizeChange('medium')}
          className={`p-2 rounded-lg ${
            settings.fontSize === 'medium'
              ? 'bg-yellow-100 text-yellow-800'
              : 'hover:bg-gray-100'
          }`}
          title="Medium Text"
        >
          A
        </button>
        <button
          onClick={() => handleFontSizeChange('large')}
          className={`p-2 rounded-lg flex items-center ${
            settings.fontSize === 'large'
              ? 'bg-yellow-100 text-yellow-800'
              : 'hover:bg-gray-100'
          }`}
          title="Large Text"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}