import React from 'react';
import { useStore } from '../lib/store';
import { Sparkles, Brain, Target, Trophy } from 'lucide-react';

const steps = [
  {
    title: "Welcome to GoodAIdeas!",
    description: "Join our community of innovators sharing AI-powered ideas.",
    icon: Sparkles
  },
  {
    title: "Share Your First Idea",
    description: "Start by sharing an innovative AI application idea.",
    icon: Brain
  },
  {
    title: "Set Your Goals",
    description: "What areas of AI innovation interest you most?",
    icon: Target
  },
  {
    title: "Earn Achievements",
    description: "Complete challenges and earn points as you contribute.",
    icon: Trophy
  }
];

export function Onboarding() {
  const { onboarding, setOnboardingStep, completeOnboarding } = useStore();
  const currentStep = steps[onboarding.step];

  const handleNext = () => {
    if (onboarding.step < steps.length - 1) {
      setOnboardingStep(onboarding.step + 1);
    } else {
      completeOnboarding();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
        <div className="flex items-center justify-center mb-6">
          {React.createElement(currentStep.icon, {
            className: "h-12 w-12 text-yellow-500"
          })}
        </div>
        <h2 className="text-2xl font-bold text-center mb-4">
          {currentStep.title}
        </h2>
        <p className="text-gray-600 text-center mb-8">
          {currentStep.description}
        </p>
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index === onboarding.step ? 'bg-yellow-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            {onboarding.step < steps.length - 1 ? 'Next' : 'Get Started'}
          </button>
        </div>
      </div>
    </div>
  );
}