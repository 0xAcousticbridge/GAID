import React from 'react';
import { OnboardingFlow } from './Onboarding/OnboardingFlow';
import { useStore } from '../lib/store';

export function Onboarding() {
  const { user, onboarding } = useStore();

  if (!user || onboarding.completed) {
    return null;
  }

  return <OnboardingFlow />;
}