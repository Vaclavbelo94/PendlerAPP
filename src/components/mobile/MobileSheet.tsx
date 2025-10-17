import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface MobileSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  position?: 'bottom' | 'right' | 'left';
  className?: string;
}

export const MobileSheet: React.FC<MobileSheetProps> = ({
  isOpen,
  onClose,
  children,
  title,
  position = 'bottom',
  className,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const positionClasses = {
    bottom:
      'inset-x-0 bottom-0 rounded-t-2xl max-h-[90vh] translate-y-full data-[state=open]:translate-y-0',
    right:
      'inset-y-0 right-0 w-full max-w-sm translate-x-full data-[state=open]:translate-x-0',
    left: 'inset-y-0 left-0 w-full max-w-sm -translate-x-full data-[state=open]:-translate-x-0',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/80 transition-opacity',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        data-state={isOpen ? 'open' : 'closed'}
        className={cn(
          'fixed z-50 bg-background shadow-lg transition-transform duration-300 ease-out',
          positionClasses[position],
          isOpen && 'translate-x-0 translate-y-0',
          position === 'bottom' && 'safe-area-bottom pb-[env(safe-area-inset-bottom)]',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="ml-auto"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-4rem)] p-4">
          {children}
        </div>
      </div>
    </>
  );
};
