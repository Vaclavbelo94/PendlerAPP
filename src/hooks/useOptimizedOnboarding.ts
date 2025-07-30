import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/auth';
import { useShiftsData } from '@/hooks/shifts/useShiftsData';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  optional?: boolean;
}

export interface OnboardingState {
  isNewUser: boolean;
  currentStep: number;
  totalSteps: number;
  steps: OnboardingStep[];
  showOnboarding: boolean;
  completedSteps: string[];
}

/**
 * Optimized onboarding hook that prevents repeated checks
 * Uses memoization and debouncing to minimize computations
 */
export const useOptimizedOnboarding = (userAssignment: any) => {
  const { user, unifiedUser } = useAuth();
  const { shifts } = useShiftsData({ userId: user?.id });
  
  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    isNewUser: false,
    currentStep: 0,
    totalSteps: 0,
    steps: [],
    showOnboarding: false,
    completedSteps: []
  });

  // Memoize expensive calculations
  const memoizedOnboardingData = useMemo(() => {
    if (!user || !unifiedUser?.isDHLEmployee) {
      return {
        isNewUser: false,
        showOnboarding: false,
        steps: []
      };
    }

    const hasShifts = shifts.length > 0;
    const hasAssignment = !!userAssignment;
    const registrationDate = new Date(user.created_at || '');
    const daysSinceRegistration = (Date.now() - registrationDate.getTime()) / (1000 * 60 * 60 * 24);
    
    // Check localStorage flags (cached)
    const isDHLSelection = localStorage.getItem('isDHLSelection') === 'true';
    const savedOnboarding = localStorage.getItem(`onboarding_completed_${user.id}`);
    
    // Determine if user is new
    const isNewUser = !hasShifts && (daysSinceRegistration < 7 || isDHLSelection) && !savedOnboarding;
    
    console.log('Optimized Onboarding check (memoized):', {
      hasShifts,
      hasAssignment,
      daysSinceRegistration,
      isDHLSelection,
      isNewUser,
      savedOnboarding
    });

    const steps: OnboardingStep[] = [
      {
        id: 'welcome',
        title: 'welcome.title',
        description: 'welcome.description',
        completed: true
      },
      {
        id: 'setup',
        title: 'setup.title',
        description: 'setup.description',
        completed: hasAssignment
      },
      {
        id: 'first-shift',
        title: 'firstShift.title',
        description: 'firstShift.description',
        completed: hasShifts
      },
      {
        id: 'explore',
        title: 'explore.title',
        description: 'explore.description',
        completed: false,
        optional: true
      }
    ];

    return {
      isNewUser,
      showOnboarding: isNewUser,
      steps,
      hasShifts,
      hasAssignment
    };
  }, [
    user?.id,
    user?.created_at,
    unifiedUser?.isDHLEmployee,
    shifts.length,
    userAssignment
  ]);

  // Update state only when memoized data changes
  useEffect(() => {
    const { steps, isNewUser, showOnboarding } = memoizedOnboardingData;
    
    if (steps.length > 0) {
      const completedSteps = steps.filter(s => s.completed).map(s => s.id);
      const currentStep = steps.findIndex(s => !s.completed);

      setOnboardingState({
        isNewUser,
        currentStep: currentStep === -1 ? steps.length - 1 : currentStep,
        totalSteps: steps.length,
        steps,
        showOnboarding,
        completedSteps
      });
    }
  }, [memoizedOnboardingData]);

  const completeStep = (stepId: string) => {
    setOnboardingState(prev => ({
      ...prev,
      steps: prev.steps.map(step => 
        step.id === stepId ? { ...step, completed: true } : step
      ),
      completedSteps: [...prev.completedSteps, stepId].filter((id, index, arr) => 
        arr.indexOf(id) === index
      )
    }));
  };

  const skipOnboarding = () => {
    if (user?.id) {
      localStorage.setItem(`onboarding_completed_${user.id}`, 'true');
    }
    setOnboardingState(prev => ({
      ...prev,
      showOnboarding: false
    }));
  };

  const completeOnboarding = () => {
    if (user?.id) {
      localStorage.setItem(`onboarding_completed_${user.id}`, 'true');
      localStorage.removeItem('isDHLSelection');
      localStorage.removeItem('dhlSelectionTimestamp');
    }
    setOnboardingState(prev => ({
      ...prev,
      showOnboarding: false,
      completedSteps: prev.steps.map(s => s.id)
    }));
  };

  return {
    ...onboardingState,
    completeStep,
    skipOnboarding,
    completeOnboarding
  };
};