
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingFallbackProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingFallback: React.FC<LoadingFallbackProps> = ({ 
  message = "Načítám...", 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-8">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
      <p className="mt-4 text-sm text-muted-foreground">{message}</p>
    </div>
  );
};

export default LoadingFallback;
