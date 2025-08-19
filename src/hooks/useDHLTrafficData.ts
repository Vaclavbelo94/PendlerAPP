import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';
import { trafficService } from '@/services/trafficService';

interface TrafficData {
  id?: string;
  current_duration: number;
  normal_duration: number;
  traffic_level: 'excellent' | 'good' | 'fair' | 'poor';
  incidents: any[];
  weather_impact: any;
  last_updated: string;
  route_origin: string;
  route_destination: string;
}

interface SmartAlert {
  id?: string;
  alert_type: string;
  route_origin: string;
  route_destination: string;
  alert_time: string;
  days_of_week: number[];
  is_active: boolean;
  settings: any;
}

interface TrafficNotification {
  id?: string;
  notification_type: string;
  title: string;
  message: string;
  route_data: any;
  is_read: boolean;
  scheduled_for?: string;
  sent_at?: string;
}

interface RoutePrediction {
  id?: string;
  route_origin: string;
  route_destination: string;
  prediction_date: string;
  hour_of_day: number;
  predicted_duration: number;
  confidence_score: number;
  historical_data: any;
  weather_factors: any;
}

export const useDHLTrafficData = (origin: string, destination: string) => {
  const { user } = useAuth();
  const [trafficData, setTrafficData] = useState<TrafficData | null>(null);
  const [smartAlerts, setSmartAlerts] = useState<SmartAlert[]>([]);
  const [notifications, setNotifications] = useState<TrafficNotification[]>([]);
  const [predictions, setPredictions] = useState<RoutePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load real-time traffic data
  const loadTrafficData = useCallback(async () => {
    if (!user || !origin || !destination) return;

    setLoading(true);
    setError(null);
    
    try {
      // Check for cached data first
      const { data: cachedData } = await supabase
        .from('real_time_traffic_data')
        .select('*')
        .eq('user_id', user.id)
        .eq('route_origin', origin)
        .eq('route_destination', destination)
        .order('last_updated', { ascending: false })
        .limit(1);

      // If we have recent data (less than 5 minutes old), use it
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      
      if (cachedData && cachedData.length > 0) {
        const lastUpdate = new Date(cachedData[0].last_updated);
        if (lastUpdate > fiveMinutesAgo) {
          const typedData: TrafficData = {
            id: cachedData[0].id,
            current_duration: cachedData[0].current_duration || 0,
            normal_duration: cachedData[0].normal_duration || 0,
            traffic_level: getTrafficLevel(cachedData[0].traffic_level),
            incidents: Array.isArray(cachedData[0].incidents) ? cachedData[0].incidents : [],
            weather_impact: cachedData[0].weather_impact || {},
            last_updated: cachedData[0].last_updated,
            route_origin: cachedData[0].route_origin,
            route_destination: cachedData[0].route_destination
          };
          setTrafficData(typedData);
          setLoading(false);
          return;
        }
      }

      // Fetch fresh data from API
      const freshData = await trafficService.getTrafficData(origin, destination, 'driving', ['driving'], user.id);
      
      const processedData: TrafficData = {
        current_duration: freshData.routes?.[0]?.duration_in_traffic ? 
          parseInt(freshData.routes[0].duration_in_traffic.split(' ')[0]) : 0,
        normal_duration: freshData.routes?.[0]?.duration ? 
          parseInt(freshData.routes[0].duration.split(' ')[0]) : 0,
        traffic_level: getTrafficLevel(freshData.routes?.[0]?.traffic_conditions),
        incidents: freshData.routes?.[0]?.incidents || [],
        weather_impact: freshData.weather || {},
        last_updated: new Date().toISOString(),
        route_origin: origin,
        route_destination: destination
      };

      // Store in database
      const { data: insertedData, error: insertError } = await supabase
        .from('real_time_traffic_data')
        .upsert({
          user_id: user.id,
          route_origin: origin,
          route_destination: destination,
          current_duration: processedData.current_duration,
          normal_duration: processedData.normal_duration,
          traffic_level: processedData.traffic_level,
          incidents: processedData.incidents,
          weather_impact: processedData.weather_impact,
          last_updated: processedData.last_updated
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setTrafficData({ ...processedData, id: insertedData?.id });

      // Check if we need to create notifications for significant changes
      if (cachedData && cachedData.length > 0) {
        const oldData: TrafficData = {
          id: cachedData[0].id,
          current_duration: cachedData[0].current_duration || 0,
          normal_duration: cachedData[0].normal_duration || 0,
          traffic_level: getTrafficLevel(cachedData[0].traffic_level),
          incidents: Array.isArray(cachedData[0].incidents) ? cachedData[0].incidents : [],
          weather_impact: cachedData[0].weather_impact || {},
          last_updated: cachedData[0].last_updated,
          route_origin: cachedData[0].route_origin,
          route_destination: cachedData[0].route_destination
        };
        await checkForSignificantChanges(oldData, processedData);
      }

    } catch (err) {
      console.error('Error loading traffic data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [user, origin, destination]);

  // Load smart alerts
  const loadSmartAlerts = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('smart_alerts')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) throw error;
      setSmartAlerts(data || []);
    } catch (err) {
      console.error('Error loading smart alerts:', err);
    }
  }, [user]);

  // Load notifications
  const loadNotifications = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('traffic_notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setNotifications(data || []);
    } catch (err) {
      console.error('Error loading notifications:', err);
    }
  }, [user]);

  // Load route predictions
  const loadPredictions = useCallback(async () => {
    if (!user || !origin || !destination) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('route_predictions')
        .select('*')
        .eq('user_id', user.id)
        .eq('route_origin', origin)
        .eq('route_destination', destination)
        .gte('prediction_date', today)
        .order('prediction_date', { ascending: true });

      if (error) throw error;
      setPredictions(data || []);
    } catch (err) {
      console.error('Error loading predictions:', err);
    }
  }, [user, origin, destination]);

  // Create smart alert
  const createSmartAlert = async (alertData: Omit<SmartAlert, 'id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('smart_alerts')
        .insert({
          user_id: user.id,
          ...alertData
        })
        .select()
        .single();

      if (error) throw error;
      setSmartAlerts(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Error creating smart alert:', err);
      throw err;
    }
  };

  // Update smart alert
  const updateSmartAlert = async (id: string, updates: Partial<SmartAlert>) => {
    try {
      const { data, error } = await supabase
        .from('smart_alerts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setSmartAlerts(prev => prev.map(alert => alert.id === id ? data : alert));
      return data;
    } catch (err) {
      console.error('Error updating smart alert:', err);
      throw err;
    }
  };

  // Mark notification as read
  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await supabase
        .from('traffic_notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, is_read: true }
            : notif
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Helper functions
  const getTrafficLevel = (condition: string): 'excellent' | 'good' | 'fair' | 'poor' => {
    switch (condition) {
      case 'light': return 'excellent';
      case 'normal': return 'good';
      case 'heavy': return 'fair';
      case 'severe': return 'poor';
      default: return 'good';
    }
  };

  const checkForSignificantChanges = async (oldData: TrafficData, newData: TrafficData) => {
    if (!user) return;

    const durationChange = newData.current_duration - oldData.current_duration;
    const significantChange = Math.abs(durationChange) >= 10; // 10+ minutes change

    if (significantChange || newData.incidents.length > oldData.incidents.length) {
      const title = significantChange 
        ? (durationChange > 0 ? 'Traffic Worsened' : 'Traffic Improved')
        : 'New Traffic Incident';
      
      const message = significantChange
        ? `Travel time changed by ${Math.abs(durationChange)} minutes`
        : `New incident detected on your route`;

      await supabase.from('traffic_notifications').insert({
        user_id: user.id,
        notification_type: 'traffic_alert',
        title,
        message,
        route_data: {
          origin: newData.route_origin,
          destination: newData.route_destination,
          old_duration: oldData.current_duration,
          new_duration: newData.current_duration
        }
      });
    }
  };

  // Effects
  useEffect(() => {
    if (user && origin && destination) {
      loadTrafficData();
      loadSmartAlerts();
      loadNotifications();
      loadPredictions();
    }
  }, [user, origin, destination, loadTrafficData, loadSmartAlerts, loadNotifications, loadPredictions]);

  return {
    trafficData,
    smartAlerts,
    notifications,
    predictions,
    loading,
    error,
    refreshData: loadTrafficData,
    createSmartAlert,
    updateSmartAlert,
    markNotificationAsRead
  };
};