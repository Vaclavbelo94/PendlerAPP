
import React from 'react';
import { cn } from '@/lib/utils';

export type TextAlignment = 'left' | 'center' | 'right' | 'justify';

interface TextAlignmentProps {
  children: React.ReactNode;
  align?: TextAlignment;
  className?: string;
}

export const TextAligned: React.FC<TextAlignmentProps> = ({
  children,
  align = 'left',
  className
}) => {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify'
  };

  return (
    <div className={cn(alignmentClasses[align], className)}>
      {children}
    </div>
  );
};

// Utility hook for responsive text alignment
export const useResponsiveAlignment = (
  mobileAlign: TextAlignment = 'left',
  desktopAlign: TextAlignment = 'left'
) => {
  return cn(
    `text-${mobileAlign}`,
    `md:text-${desktopAlign}`
  );
};

export default TextAligned;
