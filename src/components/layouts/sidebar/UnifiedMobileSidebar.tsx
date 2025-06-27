
import React from 'react';
import { X } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { cn } from '@/lib/utils';
import { MobileSidebarNavigationGrid } from './MobileSidebarNavigationGrid';
import { MobileSidebarUserSection } from './MobileSidebarUserSection';
import { MobileSidebarFooter } from './MobileSidebarFooter';

interface UnifiedMobileSidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
  variant?: 'overlay' | 'compact';
}

export const UnifiedMobileSidebar: React.FC<UnifiedMobileSidebarProps> = ({
  isOpen,
  closeSidebar,
  variant = 'overlay'
}) => {
  const { user } = useAuth();

  if (!user && variant === 'compact') return null;

  const isCompact = variant === 'compact';

  return (
    <>
      {/* Backdrop overlay - only for overlay variant */}
      {isOpen && !isCompact && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "bg-card border-r shadow-lg transition-transform duration-300 ease-in-out z-50",
        isCompact ? (
          "w-20 h-full flex flex-col"
        ) : (
          cn(
            "fixed top-0 left-0 h-full w-80 transform",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )
        )
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {!isCompact && (
            <>
              <h2 className="text-lg font-semibold">Menu</h2>
              <button
                onClick={closeSidebar}
                className="p-2 hover:bg-muted rounded-md transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            {user && <MobileSidebarUserSection compact={isCompact} />}
            <MobileSidebarNavigationGrid compact={isCompact} />
          </div>
        </div>

        {/* Footer */}
        <MobileSidebarFooter compact={isCompact} />
      </div>
    </>
  );
};
