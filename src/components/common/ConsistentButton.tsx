
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ButtonProps } from '@/components/ui/button';

interface ConsistentButtonProps extends ButtonProps {
  responsive?: boolean;
  fullWidthMobile?: boolean;
}

export const ConsistentButton: React.FC<ConsistentButtonProps> = ({
  children,
  className,
  responsive = true,
  fullWidthMobile = false,
  ...props
}) => {
  return (
    <Button
      className={cn(
        'min-h-[44px]', // Touch-friendly minimum height
        responsive && 'text-sm md:text-base', // Responsive text
        fullWidthMobile && 'w-full md:w-auto', // Full width on mobile
        'transition-all duration-200', // Smooth transitions
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

export default ConsistentButton;
