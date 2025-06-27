
import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Načítám aplikaci...", 
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12', 
    lg: 'h-16 w-16'
  };

  const containerClasses = size === 'sm' 
    ? 'flex items-center justify-center p-4'
    : 'min-h-screen flex items-center justify-center bg-background';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        <div className={`animate-spin rounded-full ${sizeClasses[size]} border-b-2 border-primary`}></div>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};
