
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth';

interface SyncQueueItem {
  id: string;
  operation: 'create' | 'update' | 'delete';
  table: string;
  data: any;
  userId: string;
  createdAt: string;
}

interface SyncQueueState {
  queue: SyncQueueItem[];
  isSyncing: boolean;
  error: string | null;
  queueCount: number;
}

interface SyncQueueWithActions extends SyncQueueState {
  enqueue: (operation: 'create' | 'update' | 'delete', table: string, data: any) => Promise<void>;
  sync: () => Promise<void>;
  processQueue: () => Promise<void>;
}

export const useSyncQueue = (): SyncQueueWithActions => {
  const { user } = useAuth();
  const [state, setState] = useState<SyncQueueState>({
    queue: [],
    isSyncing: false,
    error: null,
    queueCount: 0,
  });

  useEffect(() => {
    const loadQueue = async () => {
      if (!user) return;

      try {
        // Using mock data since sync_queue table doesn't exist
        const mockQueue: SyncQueueItem[] = [
          {
            id: '1',
            operation: 'create',
            table: 'shifts',
            data: { date: '2024-01-15', type: 'morning' },
            userId: user.id,
            createdAt: new Date().toISOString()
          }
        ];

        setState(prevState => ({ 
          ...prevState, 
          queue: mockQueue,
          queueCount: mockQueue.length
        }));
      } catch (error: any) {
        console.error('Error loading sync queue:', error);
        setState(prevState => ({
          ...prevState,
          error: error.message || 'Chyba při načítání fronty synchronizace',
        }));
      }
    };

    loadQueue();
  }, [user]);

  const enqueue = async (
    operation: 'create' | 'update' | 'delete',
    table: string,
    data: any
  ) => {
    if (!user) return;

    const newItem: SyncQueueItem = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      operation,
      table,
      data,
      userId: user.id,
      createdAt: new Date().toISOString(),
    };

    setState(prevState => ({
      ...prevState,
      queue: [...prevState.queue, newItem],
      queueCount: prevState.queueCount + 1,
    }));
  };

  const sync = async () => {
    if (!user || state.isSyncing) return;

    setState(prevState => ({ ...prevState, isSyncing: true, error: null }));

    try {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 1000));

      setState(prevState => ({
        ...prevState,
        queue: [],
        queueCount: 0,
        isSyncing: false
      }));
    } catch (error: any) {
      console.error('Error during sync:', error);
      setState(prevState => ({
        ...prevState,
        isSyncing: false,
        error: error.message || 'Chyba během synchronizace',
      }));
    }
  };

  const processQueue = async () => {
    await sync();
  };

  return {
    ...state,
    enqueue,
    sync,
    processQueue,
  };
};
