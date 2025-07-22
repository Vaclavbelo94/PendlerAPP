
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth';
import { useDHLData } from '@/hooks/dhl/useDHLData';
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

export const useOnboarding = () => {
  const { user, unifiedUser } = useAuth();
  const { userAssignment } = useDHLData(user?.id);
  const { shifts } = useShiftsData({ userId: user?.id });
  
  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    isNewUser: false,
    currentStep: 0,
    totalSteps: 0,
    steps: [],
    showOnboarding: false,
    completedSteps: []
  });

  // Detekce nového DHL uživatele
  useEffect(() => {
    if (!user || !unifiedUser?.isDHLEmployee) return;

    const checkIfNewUser = () => {
      const hasShifts = shifts.length > 0;
      const hasAssignment = !!userAssignment;
      const registrationDate = new Date(user.created_at || '');
      const daysSinceRegistration = (Date.now() - registrationDate.getTime()) / (1000 * 60 * 60 * 24);
      
      // Považujeme za nového uživatele pokud:
      // - Nemá žádné směny
      // - Registroval se před méně než 7 dny
      // - Ještě neukončil onboarding
      const savedOnboarding = localStorage.getItem(`onboarding_completed_${user.id}`);
      const isNewUser = !hasShifts && daysSinceRegistration < 7 && !savedOnboarding;
      
      console.log('Onboarding check:', {
        hasShifts,
        hasAssignment,
        daysSinceRegistration,
        isNewUser,
        savedOnboarding
      });

      const steps: OnboardingStep[] = [
        {
          id: 'welcome',
          title: 'welcome.title',
          description: 'welcome.description',
          completed: true // První krok je vždy hotový
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

      const completedSteps = steps.filter(s => s.completed).map(s => s.id);
      const currentStep = steps.findIndex(s => !s.completed);

      setOnboardingState({
        isNewUser,
        currentStep: currentStep === -1 ? steps.length - 1 : currentStep,
        totalSteps: steps.length,
        steps,
        showOnboarding: isNewUser,
        completedSteps
      });
    };

    checkIfNewUser();
  }, [user, unifiedUser, userAssignment, shifts]);

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
