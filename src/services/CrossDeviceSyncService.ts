
import { supabase } from "@/integrations/supabase/client";
import { advancedErrorHandler } from './AdvancedErrorHandlingService';

export interface DeviceInfo {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet';
  os: string;
  browser: string;
  lastSeen: Date;
  isActive: boolean;
}

export interface SyncEvent {
  id: string;
  deviceId: string;
  userId: string;
  entityType: string;
  entityId: string;
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: Date;
  version: number;
}

export interface ConflictResolution {
  entityId: string;
  conflicts: SyncEvent[];
  resolution: 'last_write_wins' | 'manual' | 'merge';
  resolvedData: any;
}

export class CrossDeviceSyncService {
  private static instance: CrossDeviceSyncService;
  private deviceId: string;
  private syncChannel: any;
  private lastSyncTimestamp: Map<string, Date> = new Map();
  private conflictResolvers: Map<string, (conflicts: SyncEvent[]) => any> = new Map();

  static getInstance(): CrossDeviceSyncService {
    if (!CrossDeviceSyncService.instance) {
      CrossDeviceSyncService.instance = new CrossDeviceSyncService();
    }
    return CrossDeviceSyncService.instance;
  }

  constructor() {
    this.deviceId = this.generateDeviceId();
    this.setupRealtimeSync();
    this.registerHeartbeat();
  }

  // Generate unique device ID
  private generateDeviceId(): string {
    let deviceId = localStorage.getItem('device_sync_id');
    if (!deviceId) {
      deviceId = `${this.getDeviceType()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('device_sync_id', deviceId);
    }
    return deviceId;
  }

  // Detect device type
  private getDeviceType(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/mobile|android|ios|iphone|ipad/.test(userAgent)) {
      return /ipad|tablet/.test(userAgent) ? 'tablet' : 'mobile';
    }
    return 'desktop';
  }

  // Get device info
  getDeviceInfo(): DeviceInfo {
    const userAgent = navigator.userAgent;
    return {
      id: this.deviceId,
      name: this.generateDeviceName(),
      type: this.getDeviceType() as DeviceInfo['type'],
      os: this.detectOS(),
      browser: this.detectBrowser(),
      lastSeen: new Date(),
      isActive: true
    };
  }

  private generateDeviceName(): string {
    const type = this.getDeviceType();
    const browser = this.detectBrowser();
    const timestamp = new Date().toLocaleString('cs-CZ', { 
      day: '2-digit', 
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return `${type.charAt(0).toUpperCase() + type.slice(1)} ${browser} (${timestamp})`;
  }

  private detectOS(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  private detectBrowser(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  // Setup real-time synchronization
  private setupRealtimeSync(): void {
    this.syncChannel = supabase
      .channel('cross-device-sync')
      .on('broadcast', { event: 'sync_event' }, (payload) => {
        this.handleRemoteSyncEvent(payload);
      })
      .subscribe();
  }

  // Handle sync events from other devices
  private handleRemoteSyncEvent(payload: any): void {
    if (payload.deviceId === this.deviceId) return; // Ignore own events

    console.log('Received sync event from device:', payload.deviceId);
    
    // Trigger local event for components to handle
    window.dispatchEvent(new CustomEvent('cross-device-sync', {
      detail: payload
    }));
  }

  // Broadcast sync event to other devices
  async broadcastSyncEvent(
    entityType: string, 
    entityId: string, 
    action: SyncEvent['action'], 
    data: any
  ): Promise<void> {
    const syncEvent: SyncEvent = {
      id: `${this.deviceId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      deviceId: this.deviceId,
      userId: (await supabase.auth.getUser()).data.user?.id || '',
      entityType,
      entityId,
      action,
      data,
      timestamp: new Date(),
      version: Date.now()
    };

    try {
      await this.syncChannel.send({
        type: 'broadcast',
        event: 'sync_event',
        payload: syncEvent
      });

      // Store locally for conflict resolution
      this.lastSyncTimestamp.set(`${entityType}_${entityId}`, new Date());
    } catch (error) {
      console.error('Failed to broadcast sync event:', error);
    }
  }

  // Sync with conflict resolution
  async syncWithConflictResolution(
    localData: any[], 
    entityType: string
  ): Promise<{ synced: number; conflicts: number; resolved: ConflictResolution[] }> {
    const context = {
      operation: 'cross_device_sync',
      entityType,
      timestamp: new Date(),
      retryCount: 0
    };

    return await advancedErrorHandler.executeWithRetry(async () => {
      const { data: remoteData, error } = await supabase
        .from(entityType)
        .select('*')
        .gte('updated_at', this.getLastSyncTime(entityType).toISOString());

      if (error) throw error;

      const conflicts: ConflictResolution[] = [];
      let syncedCount = 0;

      // Detect conflicts
      for (const localItem of localData) {
        const remoteItem = remoteData?.find(r => r.id === localItem.id);
        
        if (remoteItem && this.hasConflict(localItem, remoteItem)) {
          const conflict = await this.resolveConflict(entityType, localItem, remoteItem);
          conflicts.push(conflict);
        } else {
          // No conflict, safe to sync
          await this.syncSingleItem(entityType, localItem);
          syncedCount++;
        }
      }

      // Update last sync time
      this.lastSyncTimestamp.set(entityType, new Date());

      return {
        synced: syncedCount,
        conflicts: conflicts.length,
        resolved: conflicts
      };
    }, context);
  }

  // Check if there's a conflict between local and remote data
  private hasConflict(localItem: any, remoteItem: any): boolean {
    const localTime = new Date(localItem.updated_at || localItem.created_at);
    const remoteTime = new Date(remoteItem.updated_at || remoteItem.created_at);
    
    // Conflict if both were updated recently and data differs
    const timeDiff = Math.abs(localTime.getTime() - remoteTime.getTime());
    const hasDataDiff = JSON.stringify(localItem) !== JSON.stringify(remoteItem);
    
    return timeDiff < 60000 && hasDataDiff; // 1 minute threshold
  }

  // Resolve conflict using registered resolver or default strategy
  private async resolveConflict(
    entityType: string, 
    localItem: any, 
    remoteItem: any
  ): Promise<ConflictResolution> {
    const resolver = this.conflictResolvers.get(entityType);
    
    if (resolver) {
      // Use custom resolver
      const resolvedData = resolver([
        this.createSyncEvent(localItem, 'update'),
        this.createSyncEvent(remoteItem, 'update')
      ]);
      
      return {
        entityId: localItem.id,
        conflicts: [
          this.createSyncEvent(localItem, 'update'),
          this.createSyncEvent(remoteItem, 'update')
        ],
        resolution: 'manual',
        resolvedData
      };
    } else {
      // Default: last write wins
      const localTime = new Date(localItem.updated_at || localItem.created_at);
      const remoteTime = new Date(remoteItem.updated_at || remoteItem.created_at);
      const resolvedData = localTime > remoteTime ? localItem : remoteItem;
      
      return {
        entityId: localItem.id,
        conflicts: [
          this.createSyncEvent(localItem, 'update'),
          this.createSyncEvent(remoteItem, 'update')
        ],
        resolution: 'last_write_wins',
        resolvedData
      };
    }
  }

  private createSyncEvent(item: any, action: SyncEvent['action']): SyncEvent {
    return {
      id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      deviceId: this.deviceId,
      userId: item.user_id || '',
      entityType: 'unknown',
      entityId: item.id,
      action,
      data: item,
      timestamp: new Date(item.updated_at || item.created_at),
      version: Date.now()
    };
  }

  // Sync single item
  private async syncSingleItem(entityType: string, item: any): Promise<void> {
    const { error } = await supabase
      .from(entityType)
      .upsert(item);
    
    if (error) throw error;
  }

  // Register conflict resolver for specific entity type
  registerConflictResolver(
    entityType: string, 
    resolver: (conflicts: SyncEvent[]) => any
  ): void {
    this.conflictResolvers.set(entityType, resolver);
  }

  // Get last sync time
  private getLastSyncTime(entityType: string): Date {
    return this.lastSyncTimestamp.get(entityType) || new Date(Date.now() - 24 * 60 * 60 * 1000);
  }

  // Device heartbeat to track active devices
  private registerHeartbeat(): void {
    setInterval(async () => {
      try {
        await this.syncChannel.send({
          type: 'broadcast',
          event: 'device_heartbeat',
          payload: {
            deviceId: this.deviceId,
            deviceInfo: this.getDeviceInfo(),
            timestamp: new Date()
          }
        });
      } catch (error) {
        console.error('Failed to send heartbeat:', error);
      }
    }, 30000); // Every 30 seconds
  }

  // Get active devices
  async getActiveDevices(): Promise<DeviceInfo[]> {
    // This would typically be stored in a database
    // For now, we'll return the current device
    return [this.getDeviceInfo()];
  }

  // Cleanup
  cleanup(): void {
    if (this.syncChannel) {
      supabase.removeChannel(this.syncChannel);
    }
  }
}

export const crossDeviceSyncService = CrossDeviceSyncService.getInstance();
