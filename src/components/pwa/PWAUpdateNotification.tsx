import React from 'react';
import { usePWA } from '@/hooks/usePWA';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * PWA Update Notification Component
 * Shows when a new version is available
 */
export const PWAUpdateNotification: React.FC = () => {
  const { isUpdateAvailable, updateApp } = usePWA();

  if (!isUpdateAvailable) return null;

  return (
    <div className={cn(
      'fixed top-4 left-4 right-4 z-50',
      'animate-in slide-in-from-top duration-300'
    )}>
      <div className="bg-primary text-primary-foreground rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <RefreshCw className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">
                Update Available
              </p>
              <p className="text-xs opacity-90">
                A new version is ready to install
              </p>
            </div>
          </div>
          
          <Button
            size="sm"
            variant="secondary"
            onClick={updateApp}
            className="flex-shrink-0"
          >
            Update
          </Button>
        </div>
      </div>
    </div>
  );
};
