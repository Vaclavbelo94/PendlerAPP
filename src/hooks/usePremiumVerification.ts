import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth';

export const usePremiumVerification = () => {
  const { user, isPremium } = useAuth();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (user && isPremium) {
      setIsVerified(true);
    } else {
      setIsVerified(false);
    }
  }, [user, isPremium]);

  return isVerified;
};
