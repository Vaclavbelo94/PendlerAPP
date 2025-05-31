
import { QueryClient } from '@tanstack/react-query';

interface SyncEvent {
  type: 'create' | 'update' | 'delete';
  entity: string;
  data: any;
  timestamp: number;
  source: 'local' | 'remote';
  userId?: string;
}

interface ConflictResolution {
  strategy: 'client-wins' | 'server-wins' | 'merge' | 'prompt-user';
  resolver?: (local: any, remote: any) => any;
}

class StateSyncService {
  private queryClient: QueryClient;
  private eventQueue: SyncEvent[] = [];
  private syncInProgress = false;
  private conflictResolution: Map<string, ConflictResolution> = new Map();
  private syncInterval: NodeJS.Timeout | null = null;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
    this.initializeDefaultResolutions();
  }

  // Initialize default conflict resolution strategies
  private initializeDefaultResolutions() {
    this.conflictResolution.set('shifts', {
      strategy: 'merge',
      resolver: (local, remote) => ({
        ...remote,
        notes: local.notes || remote.notes, // Prefer local notes
        updated_at: Math.max(
          new Date(local.updated_at).getTime(),
          new Date(remote.updated_at).getTime()
        )
      })
    });

    this.conflictResolution.set('vehicles', {
      strategy: 'server-wins' // Vehicle data should come from server
    });

    this.conflictResolution.set('vocabulary', {
      strategy: 'merge',
      resolver: (local, remote) => ({
        ...remote,
        lastReviewed: Math.max(
          new Date(local.lastReviewed || 0).getTime(),
          new Date(remote.lastReviewed || 0).getTime()
        ),
        reviewCount: Math.max(local.reviewCount || 0, remote.reviewCount || 0),
        correctCount: Math.max(local.correctCount || 0, remote.correctCount || 0)
      })
    });
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
    
    if (existingData) {
      // Conflict detected - resolve it
      const resolved = await this.resolveConflict(entity, existingData, data);
      this.queryClient.setQueryData([entity, data.id], resolved);
    } else {
      // No conflict - add new data
      this.queryClient.setQueryData([entity, data.id], data);
    }

    // Update collection query
    this.updateCollectionQuery(entity, data, 'add');
  }

  // Handle update operations
  private async handleUpdate(entity: string, data: any) {
    const existingData = this.queryClient.getQueryData([entity, data.id]);
    
    if (existingData) {
      const resolved = await this.resolveConflict(entity, existingData, data);
      this.queryClient.setQueryData([entity, data.id], resolved);
      this.updateCollectionQuery(entity, resolved, 'update');
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

  // Resolve conflicts between local and remote data
  private async resolveConflict(entity: string, local: any, remote: any): Promise<any> {
    const resolution = this.conflictResolution.get(entity) || { strategy: 'server-wins' };

    switch (resolution.strategy) {
      case 'client-wins':
        return local;
      
      case 'server-wins':
        return remote;
      
      case 'merge':
        if (resolution.resolver) {
          return resolution.resolver(local, remote);
        }
        return { ...local, ...remote }; // Simple merge
      
      case 'prompt-user':
        // In a real app, this would show a UI for user to resolve
        console.warn('User conflict resolution not implemented, defaulting to server-wins');
        return remote;
      
      default:
        return remote;
    }
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

  // Set custom conflict resolution
  setConflictResolution(entity: string, resolution: ConflictResolution) {
    this.conflictResolution.set(entity, resolution);
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

export default StateSyncService;
