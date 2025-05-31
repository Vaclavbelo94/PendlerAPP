
import { QueryClient } from '@tanstack/react-query';

interface SyncEvent {
  type: 'create' | 'update' | 'delete';
  entity: string;
  data: any;
  timestamp: number;
  source: 'local' | 'remote';
  userId?: string;
}

export class RealtimeSyncService {
  private queryClient: QueryClient;
  private eventQueue: SyncEvent[] = [];
  private syncInProgress = false;
  private syncInterval: NodeJS.Timeout | null = null;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  // Add event to sync queue
  addEvent(event: Omit<SyncEvent, 'timestamp'>) {
    const syncEvent: SyncEvent = {
      ...event,
      timestamp: Date.now()
    };

    this.eventQueue.push(syncEvent);
    
    // Auto-sync if not already in progress
    if (!this.syncInProgress) {
      this.processQueue();
    }
  }

  // Process the sync queue
  async processQueue() {
    if (this.syncInProgress || this.eventQueue.length === 0) return;

    this.syncInProgress = true;

    try {
      // Group events by entity for batch processing
      const eventGroups = this.groupEventsByEntity(this.eventQueue);
      
      for (const [entity, events] of eventGroups) {
        await this.syncEntityEvents(entity, events);
      }

      // Clear processed events
      this.eventQueue = [];
    } catch (error) {
      console.error('Sync queue processing failed:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  // Group events by entity type
  private groupEventsByEntity(events: SyncEvent[]): Map<string, SyncEvent[]> {
    const groups = new Map<string, SyncEvent[]>();
    
    events.forEach(event => {
      const existing = groups.get(event.entity) || [];
      existing.push(event);
      groups.set(event.entity, existing);
    });

    return groups;
  }

  // Sync events for specific entity
  private async syncEntityEvents(entity: string, events: SyncEvent[]) {
    try {
      // Sort events by timestamp
      const sortedEvents = events.sort((a, b) => a.timestamp - b.timestamp);
      
      for (const event of sortedEvents) {
        await this.processSingleEvent(event);
      }

      // Invalidate related queries after successful sync
      this.invalidateRelatedQueries(entity);
      
    } catch (error) {
      console.error(`Failed to sync ${entity} events:`, error);
      throw error;
    }
  }

  // Process single sync event
  private async processSingleEvent(event: SyncEvent) {
    const { type, entity, data } = event;

    try {
      switch (type) {
        case 'create':
          await this.handleCreate(entity, data);
          break;
        case 'update':
          await this.handleUpdate(entity, data);
          break;
        case 'delete':
          await this.handleDelete(entity, data);
          break;
      }
    } catch (error) {
      console.error(`Failed to process ${type} event for ${entity}:`, error);
      throw error;
    }
  }

  // Handle create operations
  private async handleCreate(entity: string, data: any) {
    // Check for conflicts with existing data
    const existingData = this.queryClient.getQueryData([entity, data.id]);
    
    if (!existingData) {
      // No conflict - add new data
      this.queryClient.setQueryData([entity, data.id], data);
      this.updateCollectionQuery(entity, data, 'add');
    }
  }

  // Handle update operations
  private async handleUpdate(entity: string, data: any) {
    const existingData = this.queryClient.getQueryData([entity, data.id]);
    
    if (existingData) {
      this.queryClient.setQueryData([entity, data.id], data);
      this.updateCollectionQuery(entity, data, 'update');
    } else {
      // Item doesn't exist locally - treat as create
      await this.handleCreate(entity, data);
    }
  }

  // Handle delete operations
  private async handleDelete(entity: string, data: any) {
    this.queryClient.removeQueries({ queryKey: [entity, data.id] });
    this.updateCollectionQuery(entity, data, 'remove');
  }

  // Update collection queries (lists)
  private updateCollectionQuery(entity: string, data: any, operation: 'add' | 'update' | 'remove') {
    const collectionQueries = [entity, `${entity}-list`, `${entity}s`];
    
    collectionQueries.forEach(queryKey => {
      this.queryClient.setQueryData([queryKey], (old: any[] | undefined) => {
        if (!Array.isArray(old)) return old;

        switch (operation) {
          case 'add':
            return old.some(item => item.id === data.id) ? old : [...old, data];
          
          case 'update':
            return old.map(item => item.id === data.id ? data : item);
          
          case 'remove':
            return old.filter(item => item.id !== data.id);
          
          default:
            return old;
        }
      });
    });
  }

  // Invalidate related queries
  private invalidateRelatedQueries(entity: string) {
    const relatedQueries: Record<string, string[]> = {
      shifts: ['dashboard', 'calendar', 'reports'],
      vehicles: ['fuel-records', 'service-records'],
      vocabulary: ['progress', 'statistics', 'dashboard']
    };

    const related = relatedQueries[entity] || [];
    related.forEach(queryKey => {
      this.queryClient.invalidateQueries({ queryKey: [queryKey] });
    });
  }

  // Start periodic sync
  startPeriodicSync(intervalMs: number = 30000) {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(() => {
      this.processQueue();
    }, intervalMs);
  }

  // Stop periodic sync
  stopPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // Get sync status
  getSyncStatus() {
    return {
      inProgress: this.syncInProgress,
      queueLength: this.eventQueue.length,
      lastSync: this.syncInterval ? new Date() : null
    };
  }

  // Clear sync queue
  clearQueue() {
    this.eventQueue = [];
  }

  // Cleanup
  destroy() {
    this.stopPeriodicSync();
    this.clearQueue();
  }
}
