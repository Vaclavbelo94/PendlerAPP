import React, { useState, useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { Button } from '@/components/ui/button';
import { X, Download, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * PWA Install Prompt Component
 * Shows a custom install prompt when the app can be installed
 */
export const PWAInstallPrompt: React.FC = () => {
  const { canInstall, install, isInstalled } = usePWA();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has previously dismissed
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    // Show prompt after 30 seconds of usage
    const timer = setTimeout(() => {
      if (canInstall && !isInstalled) {
        setIsVisible(true);
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [canInstall, isInstalled]);

  const handleInstall = async () => {
    await install();
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!canInstall || isInstalled || isDismissed || !isVisible) {
    return null;
  }

  return (
    <div className={cn(
      'fixed bottom-20 left-4 right-4 z-50',
      'animate-in slide-in-from-bottom duration-300'
    )}>
      <div className="bg-card border border-border rounded-lg shadow-lg p-4">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-accent"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Smartphone className="w-6 h-6 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm mb-1">
              Install PendlerApp
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              Install our app for quick access, offline support, and a better experience
            </p>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleInstall}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Install
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDismiss}
              >
                Not now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
