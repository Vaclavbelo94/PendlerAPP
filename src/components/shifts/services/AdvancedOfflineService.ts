import { Shift, ShiftType } from '@/types/shifts';
import { supabase } from '@/integrations/supabase/client';

export class AdvancedOfflineService {
  private static instance: AdvancedOfflineService;
  private shifts: Shift[] = [];
  private isOnline: boolean = navigator.onLine;

  private constructor() {
    this.setupEventListeners();
    this.loadFromCache();
  }

  static getInstance(): AdvancedOfflineService {
    if (!AdvancedOfflineService.instance) {
      AdvancedOfflineService.instance = new AdvancedOfflineService();
    }
    return AdvancedOfflineService.instance;
  }

  private setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncOfflineChanges();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  private loadFromCache() {
    try {
      const cachedShifts = localStorage.getItem('cached_shifts');
      if (cachedShifts) {
        this.shifts = JSON.parse(cachedShifts);
      }
    } catch (error) {
      console.error('Error loading from cache:', error);
    }
  }

  private saveToCache() {
    try {
      localStorage.setItem('cached_shifts', JSON.stringify(this.shifts));
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  }

  async loadShifts(userId: string): Promise<Shift[]> {
    if (this.isOnline) {
      try {
        const { data, error } = await supabase
          .from('shifts')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: false });

        if (error) throw error;

        // Ensure all shifts have required properties
        const formattedShifts: Shift[] = (data || []).map(shift => ({
          id: shift.id,
          user_id: shift.user_id,
          date: shift.date,
          type: shift.type as ShiftType,
          start_time: shift.start_time || '08:00',
          end_time: shift.end_time || '16:00',
          notes: shift.notes || '',
          created_at: shift.created_at,
          updated_at: shift.updated_at,
        }));

        this.shifts = formattedShifts;
        this.saveToCache();
        return formattedShifts;
      } catch (error) {
        console.error('Error loading shifts from server:', error);
        return this.shifts; // Return cached data on error
      }
    } else {
      return this.shifts; // Return cached data when offline
    }
  }

  async addShift(userId: string, date: string, type: ShiftType, notes: string): Promise<Shift> {
    const tempId = `temp_${Date.now()}`;
    const newShift: Shift = {
      id: tempId,
      user_id: userId,
      date,
      type,
      start_time: this.getDefaultStartTime(type),
      end_time: this.getDefaultEndTime(type),
      notes: notes || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.shifts.unshift(newShift);
    this.saveToCache();

    if (this.isOnline) {
      try {
        const { data, error } = await supabase
          .from('shifts')
          .insert([{
            user_id: userId,
            date,
            type,
            start_time: newShift.start_time,
            end_time: newShift.end_time,
            notes: notes || null,
          }])
          .select()
          .single();

        if (error) throw error;

        // Replace temp shift with real one
        const realShift: Shift = {
          ...data,
          type: data.type as ShiftType,
        };
        
        this.shifts = this.shifts.map(s => s.id === tempId ? realShift : s);
        this.saveToCache();
        return realShift;
      } catch (error) {
        console.error('Error adding shift to server:', error);
        // Keep the temp shift for later sync
        this.markForSync(tempId, 'create');
        return newShift;
      }
    } else {
      this.markForSync(tempId, 'create');
      return newShift;
    }
  }

  private getDefaultStartTime(type: ShiftType): string {
    switch (type) {
      case 'morning': return '06:00';
      case 'afternoon': return '14:00';
      case 'night': return '22:00';
      case 'custom': return '08:00';
      default: return '08:00';
    }
  }

  private getDefaultEndTime(type: ShiftType): string {
    switch (type) {
      case 'morning': return '14:00';
      case 'afternoon': return '22:00';
      case 'night': return '06:00';
      case 'custom': return '16:00';
      default: return '16:00';
    }
  }

  private markForSync(id: string, action: 'create' | 'update' | 'delete') {
    const syncQueue = JSON.parse(localStorage.getItem('sync_queue') || '[]');
    syncQueue.push({ id, action, timestamp: Date.now() });
    localStorage.setItem('sync_queue', JSON.stringify(syncQueue));
  }

  private async syncOfflineChanges() {
    const syncQueue = JSON.parse(localStorage.getItem('sync_queue') || '[]');
    if (syncQueue.length === 0) return;

    console.log('Syncing offline changes:', syncQueue);
    
    // Process sync queue
    for (const item of syncQueue) {
      try {
        await this.processSyncItem(item);
      } catch (error) {
        console.error('Error syncing item:', item, error);
      }
    }
    
    // Clear sync queue on successful sync
    localStorage.removeItem('sync_queue');
  }

  private async processSyncItem(item: any) {
    // Implementation for processing sync items
    console.log('Processing sync item:', item);
  }
}
