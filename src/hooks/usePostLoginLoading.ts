import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/auth';
import { useCompany } from '@/hooks/useCompany';

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

const MIN_LOADING_TIME = 2500; // 2.5 seconds minimum
const STEP_DURATION = 500; // 0.5 seconds per step

export const usePostLoginLoading = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { company } = useCompany();
  
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
      
      // Check actual loading states
      const authReady = !authLoading && user;
      const companyReady = company !== null;
      const allDataReady = authReady && companyReady;

      // Calculate progress based on time and actual loading
      let calculatedProgress = Math.min((elapsed / MIN_LOADING_TIME) * 100, 100);
      
      // Adjust progress based on actual data loading
      if (authReady) calculatedProgress = Math.max(calculatedProgress, 40);
      if (companyReady) calculatedProgress = Math.max(calculatedProgress, 70);
      if (allDataReady) calculatedProgress = Math.max(calculatedProgress, 90);

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
  }, [startTime, authLoading, user, company, isFreshLogin, markLoginProcessed]);

  return {
    ...loadingState,
    shouldShow: loadingState.isLoading && isFreshLogin()
  };
};