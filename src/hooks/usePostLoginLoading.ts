import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/auth';
import { useCompany } from '@/hooks/useCompany';
import { useOptimizedDHLData } from '@/hooks/dhl/useOptimizedDHLData';
import { useOptimizedOnboarding } from '@/hooks/useOptimizedOnboarding';

interface LoadingState {
  isLoading: boolean;
  progress: number;
  currentStep: string;
  isComplete: boolean;
}

const LOADING_STEPS = [
  'authenticating',
  'loadingProfile', 
  'checkingCompany',
  'preparingDashboard',
  'almostReady'
];

const MIN_LOADING_TIME = 3000; // 3 seconds minimum to ensure all data loads
const STEP_DURATION = 600; // 0.6 seconds per step

export const usePostLoginLoading = () => {
  const { user, isLoading: authLoading, unifiedUser } = useAuth();
  const { company } = useCompany();
  
  // Get DHL data if user is DHL employee
  const { userAssignment, isLoading: dhlLoading } = useOptimizedDHLData(
    unifiedUser?.isDHLEmployee ? user?.id : null
  );
  
  // Get onboarding data
  const { showOnboarding, isNewUser } = useOptimizedOnboarding(userAssignment);
  
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    progress: 0,
    currentStep: 'authenticating',
    isComplete: false
  });

  const [startTime] = useState(() => Date.now());

  // Check if this is a fresh login
  const isFreshLogin = useCallback(() => {
    const freshLogin = sessionStorage.getItem('freshLogin');
    return freshLogin === 'true';
  }, []);

  // Mark login as processed
  const markLoginProcessed = useCallback(() => {
    sessionStorage.removeItem('freshLogin');
  }, []);

  // Simulate loading progress with real data dependencies
  useEffect(() => {
    if (!isFreshLogin()) {
      setLoadingState(prev => ({ ...prev, isLoading: false, isComplete: true }));
      return;
    }

    let stepIndex = 0;
    let progressTimer: NodeJS.Timeout;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const minTimeReached = elapsed >= MIN_LOADING_TIME;
      
      // Check actual loading states - wait for ALL data to be ready
      const authReady = !authLoading && user && unifiedUser;
      const companyReady = company !== null;
      
      // For DHL users, wait for DHL data to be loaded
      const dhlDataReady = !unifiedUser?.isDHLEmployee || !dhlLoading;
      
      // Additional check - make sure onboarding data is available for DHL users
      const onboardingDataReady = !unifiedUser?.isDHLEmployee || (
        typeof showOnboarding === 'boolean' && typeof isNewUser === 'boolean'
      );
      
      const allDataReady = authReady && companyReady && dhlDataReady && onboardingDataReady;

      // Calculate progress based on time and actual loading
      let calculatedProgress = Math.min((elapsed / MIN_LOADING_TIME) * 100, 100);
      
      // Adjust progress based on actual data loading
      if (authReady) calculatedProgress = Math.max(calculatedProgress, 25);
      if (companyReady) calculatedProgress = Math.max(calculatedProgress, 45);
      if (dhlDataReady) calculatedProgress = Math.max(calculatedProgress, 65);
      if (onboardingDataReady) calculatedProgress = Math.max(calculatedProgress, 85);
      if (allDataReady) calculatedProgress = Math.max(calculatedProgress, 95);

      // Update step based on progress
      const newStepIndex = Math.floor((calculatedProgress / 100) * LOADING_STEPS.length);
      if (newStepIndex < LOADING_STEPS.length) {
        stepIndex = newStepIndex;
      }

      setLoadingState(prev => ({
        ...prev,
        progress: calculatedProgress,
        currentStep: LOADING_STEPS[stepIndex] || LOADING_STEPS[LOADING_STEPS.length - 1]
      }));

      // Complete loading when both time and data are ready
      if (minTimeReached && allDataReady && calculatedProgress >= 100) {
        setTimeout(() => {
          setLoadingState(prev => ({ 
            ...prev, 
            isLoading: false, 
            isComplete: true,
            progress: 100 
          }));
          markLoginProcessed();
        }, 500);
      } else {
        progressTimer = setTimeout(updateProgress, 100);
      }
    };

    progressTimer = setTimeout(updateProgress, 100);

    return () => {
      if (progressTimer) clearTimeout(progressTimer);
    };
  }, [
    startTime, 
    authLoading, 
    user, 
    unifiedUser, 
    company, 
    dhlLoading, 
    showOnboarding, 
    isNewUser,
    isFreshLogin, 
    markLoginProcessed
  ]);

  return {
    ...loadingState,
    shouldShow: loadingState.isLoading && isFreshLogin()
  };
};