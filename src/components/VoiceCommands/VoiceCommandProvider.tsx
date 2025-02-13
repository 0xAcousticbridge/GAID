import React, { createContext, useContext, useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useStore } from '../../lib/store';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface VoiceCommandContextType {
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  commands: string[];
}

const VoiceCommandContext = createContext<VoiceCommandContextType>({
  isListening: false,
  startListening: () => {},
  stopListening: () => {},
  commands: [],
});

export function VoiceCommandProvider({ children }: { children: React.ReactNode }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const navigate = useNavigate();
  const { user } = useStore();

  const commands = [
    {
      command: 'go to *',
      callback: (page: string) => {
        const routes: { [key: string]: string } = {
          home: '/',
          ideas: '/ideas',
          profile: '/profile',
          settings: '/settings',
          search: '/search',
          insights: '/insights',
          learn: '/learn',
        };
        
        const route = routes[page.toLowerCase()];
        if (route) {
          navigate(route);
          toast.success(`Navigating to ${page}`);
        }
      },
    },
    {
      command: 'search for *',
      callback: (term: string) => {
        navigate(`/search?q=${encodeURIComponent(term)}`);
        toast.success(`Searching for "${term}"`);
      },
    },
    {
      command: 'create idea',
      callback: () => {
        navigate('/ideas');
        // Trigger create idea modal
        toast.success('Opening idea creation form');
      },
    },
    {
      command: 'toggle theme',
      callback: () => {
        // Toggle theme logic
        toast.success('Toggling theme');
      },
    },
  ];

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition({ commands });

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      toast.error('Browser does not support speech recognition');
      setIsEnabled(false);
    }
  }, [browserSupportsSpeechRecognition]);

  const startListening = () => {
    if (!isEnabled) return;
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  return (
    <VoiceCommandContext.Provider
      value={{
        isListening: listening,
        startListening,
        stopListening,
        commands: commands.map(c => c.command),
      }}
    >
      {children}
    </VoiceCommandContext.Provider>
  );
}

export const useVoiceCommands = () => useContext(VoiceCommandContext);