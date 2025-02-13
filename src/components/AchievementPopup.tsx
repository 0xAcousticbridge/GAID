import React from 'react';
import Confetti from 'react-confetti';
import { Trophy } from 'lucide-react';

interface AchievementPopupProps {
  title: string;
  description: string;
  points: number;
  onClose: () => void;
}

export function AchievementPopup({ title, description, points, onClose }: AchievementPopupProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false}
        numberOfPieces={200}
      />
      <div className="bg-white rounded-xl p-8 shadow-lg max-w-sm mx-4 relative">
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <div className="bg-yellow-500 rounded-full p-4">
            <Trophy className="h-8 w-8 text-white" />
          </div>
        </div>
        <div className="text-center mt-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-4">{description}</p>
          <p className="text-yellow-500 font-bold text-lg">+{points} points</p>
          <button
            onClick={onClose}
            className="mt-6 px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Awesome!
          </button>
        </div>
      </div>
    </div>
  );
}