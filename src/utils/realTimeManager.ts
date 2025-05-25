
import { supabase } from '@/integrations/supabase/client';
import { notificationService } from '@/components/shifts/services/NotificationService';

type RealtimeCallback = (payload: any) => void;

class RealTimeManager {
  private channels: Map<string, any> = new Map();
  private callbacks: Map<string, RealtimeCallback[]> = new Map();
  
  // Subscribe to table changes
  subscribeToTable(
    table: string, 
    event: 'INSERT' | 'UPDATE' | 'DELETE' | '*' = '*',
    callback: RealtimeCallback,
    filter?: { column: string; value: any }
  ) {
    const channelName = `${table}-${event}`;
    
    if (!this.channels.has(channelName)) {
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event,
            schema: 'public',
            table,
            ...(filter && { filter: `${filter.column}=eq.${filter.value}` })
          },
          (payload) => {
            // Notify all callbacks for this channel
            const callbacks = this.callbacks.get(channelName) || [];
            callbacks.forEach(cb => cb(payload));
          }
        )
        .subscribe();
        
      this.channels.set(channelName, channel);
      this.callbacks.set(channelName, []);
    }
    
    // Add callback to list
    const existingCallbacks = this.callbacks.get(channelName) || [];
    this.callbacks.set(channelName, [...existingCallbacks, callback]);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.callbacks.get(channelName) || [];
      const filteredCallbacks = callbacks.filter(cb => cb !== callback);
      this.callbacks.set(channelName, filteredCallbacks);
      
      // If no more callbacks, unsubscribe from channel
      if (filteredCallbacks.length === 0) {
        const channel = this.channels.get(channelName);
        if (channel) {
          supabase.removeChannel(channel);
          this.channels.delete(channelName);
          this.callbacks.delete(channelName);
        }
      }
    };
  }
  
  // Subscribe to user-specific shifts
  subscribeToUserShifts(userId: string, callback: RealtimeCallback) {
    return this.subscribeToTable('shifts', '*', (payload) => {
      // Only notify for current user's shifts
      if (payload.new?.user_id === userId || payload.old?.user_id === userId) {
        callback(payload);
        
        // Show notification for remote changes
        if (payload.eventType === 'INSERT') {
          notificationService.showRemoteUpdate('Nová směna byla přidána z jiného zařízení');
        } else if (payload.eventType === 'UPDATE') {
          notificationService.showRemoteUpdate('Směna byla upravena z jiného zařízení');
        } else if (payload.eventType === 'DELETE') {
          notificationService.showRemoteUpdate('Směna byla smazána z jiného zařízení');
        }
      }
    });
  }
  
  // Presence tracking for collaborative features
  trackUserPresence(roomId: string, userInfo: { id: string; name: string }) {
    const presenceChannel = supabase.channel(`presence-${roomId}`, {
      config: { presence: { key: userInfo.id } }
    });
    
    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        console.log('Online users:', state);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track(userInfo);
        }
      });
      
    return () => {
      supabase.removeChannel(presenceChannel);
    };
  }
  
  // Broadcast messages to other users
  broadcastMessage(roomId: string, message: any) {
    const channel = supabase.channel(`broadcast-${roomId}`);
    channel.send({
      type: 'broadcast',
      event: 'message',
      payload: message
    });
  }
  
  // Listen for broadcast messages
  subscribeToBroadcast(roomId: string, callback: (message: any) => void) {
    const channel = supabase.channel(`broadcast-${roomId}`)
      .on('broadcast', { event: 'message' }, callback)
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }
  
  // Cleanup all channels
  cleanup() {
    this.channels.forEach(channel => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
    this.callbacks.clear();
  }
}

export const realTimeManager = new RealTimeManager();
