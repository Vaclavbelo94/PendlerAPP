
import { useState, useCallback } from 'react';
import { debounce } from 'lodash';

interface UseDebouncedNavigationProps {
  onSectionChange: (section: string) => void;
  debounceMs?: number;
}

export const useDebouncedNavigation = ({ 
  onSectionChange, 
  debounceMs = 300 
}: UseDebouncedNavigationProps) => {
  const [isChanging, setIsChanging] = useState(false);

  // Create debounced function
  const debouncedChange = useCallback(
    debounce((section: string) => {
      onSectionChange(section);
      setIsChanging(false);
    }, debounceMs),
    [onSectionChange, debounceMs]
  );

  const handleSectionChange = useCallback((section: string) => {
    setIsChanging(true);
    debouncedChange(section);
  }, [debouncedChange]);

  return {
    handleSectionChange,
    isChanging
  };
};
