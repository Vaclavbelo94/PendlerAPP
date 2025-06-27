
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { isDHLEmployee } from '@/utils/dhlAuthUtils';

/**
 * Separate hook for DHL status to avoid circular dependencies
 */
export const useDHLStatus = (user: User | null) => {
  const [isDHL, setIsDHL] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsDHL(false);
      return;
    }

    setIsLoading(true);
    try {
      const dhlStatus = isDHLEmployee(user);
      setIsDHL(dhlStatus);
    } catch (error) {
      console.error('Error checking DHL status:', error);
      setIsDHL(false);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  return {
    isDHL,
    isLoading
  };
};
