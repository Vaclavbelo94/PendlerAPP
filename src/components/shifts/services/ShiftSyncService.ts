
import { supabase } from "@/integrations/supabase/client";
import { errorHandler } from "@/utils/errorHandler";

export class ShiftSyncService {
  private static instance: ShiftSyncService;
  private syncChannel: any;
  private deviceId: string;

  constructor() {
    this.deviceId = this.generateDeviceId();
    this.setupRealtimeSync();
  }

  static getInstance(): ShiftSyncService {
    if (!ShiftSyncService.instance) {
      ShiftSyncService.instance = new ShiftSyncService();
    }
    return ShiftSyncService.instance;
  }

  private generateDeviceId(): string {
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('device_id', deviceId);
    }
    return deviceId;
  }

  private setupRealtimeSync() {
    if (this.syncChannel) return;

    this.syncChannel = supabase
      .channel('shifts-sync')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'shifts' },
        (payload) => this.handleRealtimeUpdate('INSERT', payload)
      )
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'shifts' },
        (payload) => this.handleRealtimeUpdate('UPDATE', payload)
      )
      .on('postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'shifts' },
        (payload) => this.handleRealtimeUpdate('DELETE', payload)
      )
      .subscribe();
  }

  private handleRealtimeUpdate(event: string, payload: any) {
    if (payload.new?.device_id !== this.deviceId) {
      const eventText = event === 'INSERT' ? 'přidána' : 
                       event === 'UPDATE' ? 'upravena' : 'odstraněna';
      
      window.dispatchEvent(new CustomEvent('shifts-updated', { 
        detail: { 
          payload, 
          message: `Směna ${eventText} z jiného zařízení` 
        } 
      }));
    }
  }

  getDeviceId(): string {
    return this.deviceId;
  }

  cleanup() {
    if (this.syncChannel) {
      supabase.removeChannel(this.syncChannel);
      this.syncChannel = null;
    }
  }
}
