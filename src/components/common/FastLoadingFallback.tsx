
import React from 'react';
import { Loader2 } from 'lucide-react';

interface FastLoadingFallbackProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  minimal?: boolean;
}

export const FastLoadingFallback: React.FC<FastLoadingFallbackProps> = ({ 
  message = "Načítám...", 
  size = 'md',
  minimal = false
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  if (minimal) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[150px] p-6">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary mb-3`} />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
};

export default FastLoadingFallback;
