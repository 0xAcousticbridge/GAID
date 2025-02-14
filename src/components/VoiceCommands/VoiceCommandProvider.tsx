import React, { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../lib/store';

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
  return (
    <VoiceCommandContext.Provider
      value={{
        isListening: false,
        startListening: () => {},
        stopListening: () => {},
        commands: [],
      }}
    >
      {children}
    </VoiceCommandContext.Provider>
  );
}

export const useVoiceCommands = () => useContext(VoiceCommandContext);