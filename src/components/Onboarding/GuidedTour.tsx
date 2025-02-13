import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';

interface TourStep {
  title: string;
  description: string;
  element: string;
  position: 'top' | 'right' | 'bottom' | 'left';
}

export function GuidedTour() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const tourSteps: TourStep[] = [
    {
      title: 'Welcome to GoodAIdeas',
      description: "Let us take a quick tour to help you get started",
      element: '#welcome',
      position: 'bottom',
    },
    {
      title: 'Share Your Ideas',
      description: 'Click here to share your innovative AI ideas with the community',
      element: '#share-idea',
      position: 'bottom',
    },
    {
      title: 'Explore Ideas',
      description: 'Browse and discover inspiring AI ideas from other innovators',
      element: '#explore',
      position: 'right',
    },
  ];

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsVisible(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-6 max-w-md z-50"
      >
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2">{tourSteps[currentStep].title}</h3>
          <p className="text-gray-600">{tourSteps[currentStep].description}</p>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex space-x-1">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 w-1.5 rounded-full ${
                  index === currentStep ? 'bg-yellow-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          <div className="flex space-x-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            >
              {currentStep === tourSteps.length - 1 ? (
                'Finish'
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}