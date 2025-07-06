import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Truck } from 'lucide-react';
import { useDHLThemeContext } from '@/contexts/DHLThemeContext';

interface DHLBrandIndicatorProps {
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const DHLBrandIndicator: React.FC<DHLBrandIndicatorProps> = ({
  showText = true,
  size = 'md',
  className = ''
}) => {
  const { isDHLThemeActive } = useDHLThemeContext();

  if (!isDHLThemeActive) return null;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <Badge 
      className={`dhl-brand-indicator ${sizeClasses[size]} ${className}`}
      variant="default"
    >
      <Truck className={`${iconSizes[size]} ${showText ? 'mr-2' : ''}`} />
      {showText && 'DHL Mode'}
    </Badge>
  );
};