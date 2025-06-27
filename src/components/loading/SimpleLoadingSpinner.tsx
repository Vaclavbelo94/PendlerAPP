
import React from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface SimpleLoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SimpleLoadingSpinner = ({ 
  message = "Načítá se...", 
  size = 'md' 
}: SimpleLoadingSpinnerProps) => {
  return (
    <LoadingSpinner size={size} message={message} />
  );
};

export default SimpleLoadingSpinner;
