
import React, { forwardRef } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AccessibleButtonProps extends ButtonProps {
  ariaLabel?: string;
  ariaDescription?: string;
  keyboardShortcut?: string;
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ className, ariaLabel, ariaDescription, keyboardShortcut, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'active:scale-95 transition-transform',
          className
        )}
        aria-label={ariaLabel}
        aria-describedby={ariaDescription ? `${ariaDescription}-desc` : undefined}
        title={keyboardShortcut ? `${ariaLabel || children} (${keyboardShortcut})` : undefined}
        {...props}
      >
        {children}
        {ariaDescription && (
          <span id={`${ariaDescription}-desc`} className="sr-only">
            {ariaDescription}
          </span>
        )}
      </Button>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';

export default AccessibleButton;
