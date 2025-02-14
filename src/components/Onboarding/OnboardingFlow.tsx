import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Coffee, Home, Book, Heart, ArrowRight, ArrowLeft, Check, Clock, Brain, AlertCircle } from 'lucide-react';
import { useStore } from '../../lib/store';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
  isValid: (preferences: any) => boolean;
  errorMessage?: string;
}

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { completeOnboarding, user } = useStore();
  const navigate = useNavigate();

  const [preferences, setPreferences] = useState({
    schedule: {
      wakeTime: '07:00',
      sleepTime: '22:00',
      productiveHours: ['morning']
    },
    goals: [] as string[],
    focusAreas: [] as string[],
    aiPreferences: {
      suggestionsFrequency: 'sometimes',
      categories: [] as string[]
    }
  });

  const steps: OnboardingStep[] = [
    {
      id: 'schedule',
      title: "Let's Understand Your Day",
      description: "Help us optimize your daily routine",
      isValid: (prefs) => 
        prefs.schedule.wakeTime && 
        prefs.schedule.sleepTime && 
        prefs.schedule.productiveHours.length > 0,
      errorMessage: "Please set your wake time, sleep time, and select at least one productive period",
      component: (
        <div className="space-y-6">
          <div className="space-y-4">
            <label className="block">
              <span className="text-gray-300 mb-1 block">When do you usually wake up?</span>
              <input
                type="time"
                value={preferences.schedule.wakeTime}
                onChange={(e) => {
                  setError(null);
                  setPreferences(prev => ({
                    ...prev,
                    schedule: { ...prev.schedule, wakeTime: e.target.value }
                  }));
                }}
                className="w-full bg-gray-700 border-gray-600 rounded-lg text-gray-100"
                required
              />
            </label>

            <label className="block">
              <span className="text-gray-300 mb-1 block">When do you usually go to bed?</span>
              <input
                type="time"
                value={preferences.schedule.sleepTime}
                onChange={(e) => {
                  setError(null);
                  setPreferences(prev => ({
                    ...prev,
                    schedule: { ...prev.schedule, sleepTime: e.target.value }
                  }));
                }}
                className="w-full bg-gray-700 border-gray-600 rounded-lg text-gray-100"
                required
              />
            </label>

            <div>
              <span className="text-gray-300 mb-2 block">When are you most productive?</span>
              <div className="grid grid-cols-3 gap-3">
                {['morning', 'afternoon', 'evening'].map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => {
                      setError(null);
                      const current = preferences.schedule.productiveHours;
                      const updated = current.includes(time)
                        ? current.filter(t => t !== time)
                        : [...current, time];
                      setPreferences(prev => ({
                        ...prev,
                        schedule: { ...prev.schedule, productiveHours: updated }
                      }));
                    }}
                    className={`p-3 rounded-lg border ${
                      preferences.schedule.productiveHours.includes(time)
                        ? 'bg-yellow-500 text-gray-900 border-yellow-500'
                        : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                    }`}
                  >
                    <Clock className="h-5 w-5 mx-auto mb-1" />
                    <span className="text-sm capitalize">{time}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'goals',
      title: "Set Your Goals",
      description: "What would you like to achieve?",
      isValid: (prefs) => prefs.goals.length > 0,
      errorMessage: "Please select at least one goal",
      component: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { id: 'productivity', label: 'Boost Productivity', icon: Brain },
              { id: 'health', label: 'Improve Health', icon: Heart },
              { id: 'learning', label: 'Learn New Skills', icon: Book },
              { id: 'organization', label: 'Better Organization', icon: Home }
            ].map((goal) => (
              <button
                key={goal.id}
                type="button"
                onClick={() => {
                  setError(null);
                  const current = preferences.goals;
                  const updated = current.includes(goal.id)
                    ? current.filter(g => g !== goal.id)
                    : [...current, goal.id];
                  setPreferences(prev => ({ ...prev, goals: updated }));
                }}
                className={`p-4 rounded-lg border ${
                  preferences.goals.includes(goal.id)
                    ? 'bg-yellow-500 text-gray-900 border-yellow-500'
                    : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                }`}
              >
                <goal.icon className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm font-medium">{goal.label}</span>
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'ai-preferences',
      title: "AI Assistance",
      description: "How would you like AI to help?",
      isValid: (prefs) => 
        prefs.aiPreferences.suggestionsFrequency && 
        prefs.aiPreferences.categories.length > 0,
      errorMessage: "Please select suggestion frequency and at least one category",
      component: (
        <div className="space-y-6">
          <div>
            <span className="text-gray-300 mb-2 block">How often would you like AI suggestions?</span>
            <div className="grid grid-cols-3 gap-3">
              {['rarely', 'sometimes', 'often'].map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => {
                    setError(null);
                    setPreferences(prev => ({
                      ...prev,
                      aiPreferences: { ...prev.aiPreferences, suggestionsFrequency: freq }
                    }));
                  }}
                  className={`p-3 rounded-lg border ${
                    preferences.aiPreferences.suggestionsFrequency === freq
                      ? 'bg-yellow-500 text-gray-900 border-yellow-500'
                      : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                  }`}
                >
                  <span className="text-sm capitalize">{freq}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-gray-300 mb-2 block">Which areas would you like AI help with?</span>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'daily-routine', label: 'Daily Routine' },
                { id: 'meal-planning', label: 'Meal Planning' },
                { id: 'exercise', label: 'Exercise' },
                { id: 'learning', label: 'Learning' },
                { id: 'productivity', label: 'Productivity' },
                { id: 'home', label: 'Home Management' }
              ].map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    setError(null);
                    const current = preferences.aiPreferences.categories;
                    const updated = current.includes(category.id)
                      ? current.filter(c => c !== category.id)
                      : [...current, category.id];
                    setPreferences(prev => ({
                      ...prev,
                      aiPreferences: { ...prev.aiPreferences, categories: updated }
                    }));
                  }}
                  className={`p-3 rounded-lg border ${
                    preferences.aiPreferences.categories.includes(category.id)
                      ? 'bg-yellow-500 text-gray-900 border-yellow-500'
                      : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                  }`}
                >
                  <span className="text-sm">{category.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    const currentStepData = steps[currentStep];
    if (!currentStepData.isValid(preferences)) {
      setError(currentStepData.errorMessage || 'Please complete all required fields');
      return;
    }
    
    setError(null);
    if (currentStep < steps.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    if (!user) {
      setError('Please log in to complete setup');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Save user preferences
      const { error: preferencesError } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          daily_routine_preferences: preferences.schedule,
          suggestions_frequency: preferences.aiPreferences.suggestionsFrequency,
          focus_areas: preferences.goals,
          preferred_categories: preferences.aiPreferences.categories,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (preferencesError) throw preferencesError;

      // Complete onboarding
      await completeOnboarding();
      
      toast.success('Setup completed successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error completing setup:', error);
      setError(error.message || 'Failed to complete setup. Please try again.');
      toast.error('Failed to complete setup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/95 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 border border-gray-700 p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-100 mb-2">{steps[currentStep].title}</h2>
          <p className="text-gray-400">{steps[currentStep].description}</p>
        </div>

        <div className="mb-8">
          {steps[currentStep].component}
          
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center text-red-500">
                <AlertCircle className="h-5 w-5 mr-2" />
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep ? 'bg-yellow-500' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>

          <div className="flex space-x-4">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setCurrentStep(s => s - 1);
                }}
                className="flex items-center px-4 py-2 text-gray-300 hover:text-gray-100"
                disabled={loading}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </button>
            )}
            
            <button
              type="button"
              onClick={handleNext}
              disabled={loading}
              className="flex items-center px-6 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
              ) : currentStep === steps.length - 1 ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Complete Setup
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}