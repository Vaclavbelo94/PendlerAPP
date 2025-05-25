
import { supabase } from "@/integrations/supabase/client";
import { ShiftType } from "../types";
import { formatDateForDB } from "../utils/dateUtils";

export interface EnhancedShiftData {
  date: string;
  type: ShiftType;
  notes: string;
  user_id: string;
  synced_at?: string;
  device_id?: string;
}

/**
 * Enhanced shift service with real-time sync and better offline support
 */
export class EnhancedShiftService {
  private static instance: EnhancedShiftService;
  private syncChannel: any;
  private deviceId: string;

  constructor() {
    this.deviceId = this.generateDeviceId();
    this.setupRealtimeSync();
  }

  static getInstance(): EnhancedShiftService {
    if (!EnhancedShiftService.instance) {
      EnhancedShiftService.instance = new EnhancedShiftService();
    }
    return EnhancedShiftService.instance;
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
    // Only show notifications for changes from other devices
    if (payload.new?.device_id !== this.deviceId) {
      const eventText = event === 'INSERT' ? 'přidána' : 
                       event === 'UPDATE' ? 'upravena' : 'odstraněna';
      
      // Trigger app-wide refresh without showing toast here
      window.dispatchEvent(new CustomEvent('shifts-updated', { 
        detail: { 
          payload, 
          message: `Směna ${eventText} z jiného zařízení` 
        } 
      }));
    }
  }

  async saveShiftEnhanced(
    selectedDate: Date,
    shiftType: ShiftType,
    shiftNotes: string,
    userId: string
  ) {
    const formattedDate = formatDateForDB(selectedDate);
    
    const shiftData: EnhancedShiftData = {
      date: formattedDate,
      type: shiftType,
      notes: shiftNotes.trim(),
      user_id: userId,
      device_id: this.deviceId,
      synced_at: new Date().toISOString()
    };

    try {
      // Check for existing shifts
      const { data: existingShifts, error: checkError } = await supabase
        .from('shifts')
        .select('*')
        .eq('user_id', userId)
        .eq('date', formattedDate);
        
      if (checkError) throw checkError;

      let savedShift;
      let isUpdate = false;

      if (existingShifts && existingShifts.length > 0) {
        // Update existing shift
        const { data, error } = await supabase
          .from('shifts')
          .update({
            type: shiftType,
            notes: shiftNotes.trim(),
            device_id: this.deviceId,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingShifts[0].id)
          .eq('user_id', userId)
          .select()
          .single();
          
        if (error) throw error;
        savedShift = data;
        isUpdate = true;
      } else {
        // Create new shift
        const { data, error } = await supabase
          .from('shifts')
          .insert(shiftData)
          .select()
          .single();
          
        if (error) throw error;
        savedShift = data;
      }

      return { savedShift, isUpdate };
    } catch (error) {
      // Save to offline queue for later sync - no toast here
      await this.saveToOfflineQueue('UPSERT', shiftData);
      throw error;
    }
  }

  private async saveToOfflineQueue(action: string, data: any) {
    try {
      const queueItem = {
        id: `shift_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        action,
        data,
        timestamp: new Date().toISOString(),
        retries: 0
      };

      const existingQueue = JSON.parse(localStorage.getItem('offline_shifts_queue') || '[]');
      existingQueue.push(queueItem);
      localStorage.setItem('offline_shifts_queue', JSON.stringify(existingQueue));

      // Don't show toast here - let the calling code handle notifications
    } catch (error) {
      console.error('Failed to save to offline queue:', error);
    }
  }

  async processOfflineQueue() {
    const queue = JSON.parse(localStorage.getItem('offline_shifts_queue') || '[]');
    if (queue.length === 0) return;

    const processedItems = [];
    
    for (const item of queue) {
      try {
        if (item.action === 'UPSERT') {
          await supabase.from('shifts').upsert(item.data);
          processedItems.push(item.id);
        }
      } catch (error) {
        item.retries = (item.retries || 0) + 1;
        if (item.retries >= 3) {
          processedItems.push(item.id);
          console.error('Max retries reached for item:', item);
        }
      }
    }

    // Remove processed items
    const updatedQueue = queue.filter((item: any) => !processedItems.includes(item.id));
    localStorage.setItem('offline_shifts_queue', JSON.stringify(updatedQueue));

    return processedItems.length;
  }

  cleanup() {
    if (this.syncChannel) {
      supabase.removeChannel(this.syncChannel);
      this.syncChannel = null;
    }
  }
}
