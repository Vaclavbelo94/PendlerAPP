import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CloudOff, RefreshCw, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';

interface QueuedAction {
  id: string;
  type: string;
  timestamp: number;
  data: any;
  retries: number;
}

/**
 * Offline Queue Indicator
 * Shows pending actions and allows manual retry/clear
 */
export const OfflineQueueIndicator: React.FC = () => {
  const { isOffline } = useOfflineStatus();
  const [queue, setQueue] = useState<QueuedAction[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Load queue from localStorage
    const loadQueue = () => {
      try {
        const stored = localStorage.getItem('offline-queue');
        if (stored) {
          setQueue(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Failed to load offline queue:', error);
      }
    };

    loadQueue();

    // Listen for queue updates
    const handleQueueUpdate = () => loadQueue();
    window.addEventListener('offline-queue-updated', handleQueueUpdate);

    return () => {
      window.removeEventListener('offline-queue-updated', handleQueueUpdate);
    };
  }, []);

  const handleRetry = async () => {
    setIsSyncing(true);
    
    try {
      // Trigger sync event
      window.dispatchEvent(new CustomEvent('offline-sync-requested'));
      
      // Wait for sync to complete
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reload queue
      const stored = localStorage.getItem('offline-queue');
      setQueue(stored ? JSON.parse(stored) : []);
    } catch (error) {
      console.error('Failed to sync:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleClear = () => {
    if (confirm('Clear all pending actions? This cannot be undone.')) {
      localStorage.removeItem('offline-queue');
      setQueue([]);
      window.dispatchEvent(new CustomEvent('offline-queue-updated'));
    }
  };

  if (queue.length === 0) return null;

  return (
    <div className={cn(
      'fixed bottom-20 right-4 z-40',
      'animate-in slide-in-from-right duration-300'
    )}>
      <div className="bg-card border border-border rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-accent transition-colors"
        >
          <div className="flex items-center gap-2">
            <CloudOff className="w-4 h-4 text-warning" />
            <span className="font-medium text-sm">
              {queue.length} pending {queue.length === 1 ? 'action' : 'actions'}
            </span>
          </div>
          <div className={cn(
            'transform transition-transform',
            isExpanded && 'rotate-180'
          )}>
            ▼
          </div>
        </button>

        {/* Expanded content */}
        {isExpanded && (
          <div className="border-t border-border">
            <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
              {queue.map((action) => (
                <div
                  key={action.id}
                  className="text-xs p-2 bg-accent rounded"
                >
                  <div className="font-medium">{action.type}</div>
                  <div className="text-muted-foreground">
                    {new Date(action.timestamp).toLocaleTimeString()}
                  </div>
                  {action.retries > 0 && (
                    <div className="text-warning">
                      Retries: {action.retries}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-border flex gap-2">
              <Button
                size="sm"
                onClick={handleRetry}
                disabled={isSyncing || isOffline}
                className="flex-1 gap-2"
              >
                <RefreshCw className={cn(
                  'w-3 h-3',
                  isSyncing && 'animate-spin'
                )} />
                {isSyncing ? 'Syncing...' : 'Retry'}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleClear}
                className="gap-2"
              >
                <Trash2 className="w-3 h-3" />
                Clear
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
