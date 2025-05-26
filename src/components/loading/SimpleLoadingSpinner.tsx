
import React from 'react';

interface SimpleLoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SimpleLoadingSpinner = ({ 
  message = "Načítá se...", 
  size = 'md' 
}: SimpleLoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-3">
        <div className={`animate-spin rounded-full border-2 border-primary border-t-transparent ${sizeClasses[size]}`} />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

export default SimpleLoadingSpinner;
