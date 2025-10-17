import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageTransition = () => {
  const location = useLocation();
  const [direction, setDirection] = useState<'left' | 'right'>('left');

  useEffect(() => {
    // Determine transition direction based on navigation
    // This is a simple implementation - can be enhanced with route history
    setDirection('left');
  }, [location]);

  return { direction };
};
