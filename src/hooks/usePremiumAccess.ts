
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export const usePremiumAccess = (featureKey: string) => {
  const { user, isAdmin, isPremium } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [canAccess, setCanAccess] = useState(false);
  const [isPremiumFeature, setIsPremiumFeature] = useState(false);
  const [isSpecialUser, setIsSpecialUser] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        setIsLoading(true);
        
        // Check if user is special user
        const specialEmails = ['uzivatel@pendlerapp.com', 'admin@pendlerapp.com'];
        const isSpecial = user?.email ? specialEmails.includes(user.email) : false;
        setIsSpecialUser(isSpecial);
        
        // Check if feature is premium
        const premiumFeatures = ['translator', 'tax-advisor', 'laws'];
        const isPremiumFeat = premiumFeatures.includes(featureKey);
        setIsPremiumFeature(isPremiumFeat);
        
        // Determine access - be more permissive to avoid blocking users
        const hasAccess = isSpecial || isAdmin || (!isPremiumFeat || isPremium);
        setCanAccess(hasAccess);
        
      } catch (error) {
        console.error('Error checking premium access:', error);
        // Be permissive on error to avoid blocking users
        setCanAccess(true);
        setErrorMessage('Chyba při ověřování přístupu');
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [user, isAdmin, isPremium, featureKey]);

  return {
    isLoading,
    canAccess,
    isPremiumFeature,
    isSpecialUser,
    errorMessage
  };
};
