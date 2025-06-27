
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
    <div className="flex items-center justify-center p-6">
      <LoadingSpinner size={size} message={message} />
    </div>
  );
};

export default SimpleLoadingSpinner;
