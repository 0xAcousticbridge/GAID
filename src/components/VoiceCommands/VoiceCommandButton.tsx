import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useVoiceCommands } from './VoiceCommandProvider';
import { motion, AnimatePresence } from 'framer-motion';

export function VoiceCommandButton() {
  const { isListening, startListening, stopListening, commands } = useVoiceCommands();

  return (
    <div className="relative">
      <button
        onClick={() => isListening ? stopListening() : startListening()}
        className={`p-2 rounded-full transition-colors ${
          isListening 
            ? 'bg-red-500 text-white hover:bg-red-600' 
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
        title={isListening ? 'Stop listening' : 'Start voice commands'}
      >
        {isListening ? (
          <Mic className="h-5 w-5 animate-pulse" />
        ) : (
          <MicOff className="h-5 w-5" />
        )}
      </button>

      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full mb-2 right-0 w-64 bg-gray-800 rounded-lg shadow-lg p-4"
          >
            <div className="text-sm font-medium text-gray-300 mb-2">
              Available Commands:
            </div>
            <ul className="space-y-1 text-sm text-gray-400">
              {commands.map((command, index) => (
                <li key={index}>{command}</li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}