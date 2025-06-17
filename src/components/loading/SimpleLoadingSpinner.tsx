
import React from 'react';
import { Loader2 } from 'lucide-react';

interface SimpleLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

const SimpleLoadingSpinner: React.FC<SimpleLoadingSpinnerProps> = ({
  size = 'md',
  text = 'Načítám...',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8'
  };

  return (
    <div className={`flex items-center justify-center min-h-[200px] ${className}`}>
      <div className="flex flex-col items-center gap-3">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
        <p className="text-sm text-muted-foreground animate-pulse">
          {text}
        </p>
      </div>
    </div>
  );
};

export default SimpleLoadingSpinner;
