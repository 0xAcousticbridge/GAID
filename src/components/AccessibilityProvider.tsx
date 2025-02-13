import React, { createContext, useContext, useEffect } from 'react';
import { useStore } from '../lib/store';

interface AccessibilityContextType {
  reduceMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const AccessibilityContext = createContext<AccessibilityContextType>({
  reduceMotion: false,
  highContrast: false,
  fontSize: 'medium'
});

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useStore();

  useEffect(() => {
    // Apply accessibility settings to document
    document.documentElement.classList.toggle('reduce-motion', settings.accessibility.reduceMotion);
    document.documentElement.classList.toggle('high-contrast', settings.accessibility.highContrast);
    document.documentElement.classList.remove('text-sm', 'text-base', 'text-lg');
    document.documentElement.classList.add(
      settings.fontSize === 'small' ? 'text-sm' : 
      settings.fontSize === 'large' ? 'text-lg' : 'text-base'
    );
  }, [settings.accessibility, settings.fontSize]);

  return (
    <AccessibilityContext.Provider value={{
      reduceMotion: settings.accessibility.reduceMotion,
      highContrast: settings.accessibility.highContrast,
      fontSize: settings.fontSize
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export const useAccessibility = () => useContext(AccessibilityContext);