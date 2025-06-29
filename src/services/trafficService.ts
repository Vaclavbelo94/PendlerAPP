
import { supabase } from "@/integrations/supabase/client";

export interface TrafficData {
  routes: {
    duration: string;
    duration_in_traffic: string;
    distance: string;
    traffic_conditions: 'light' | 'normal' | 'heavy';
  }[];
  status: string;
}

export interface WeatherImpact {
  temperature: number;
  conditions: string;
  description: string;
  visibility: number;
  windSpeed: number;
  trafficImpact: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export interface TrafficAlert {
  id?: string;
  user_id: string;
  route_origin: string;
  route_destination: string;
  alert_type: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  is_active?: boolean;
}

export const trafficService = {
  async getTrafficData(origin: string, destination: string, mode: string = 'driving'): Promise<TrafficData> {
    const { data, error } = await supabase.functions.invoke('traffic-data', {
      body: { origin, destination, mode }
    });
    
    if (error) throw error;
    return data;
  },

  async getWeatherImpact(lat: number, lon: number): Promise<WeatherImpact> {
    const { data, error } = await supabase.functions.invoke('weather-impact', {
      body: { lat, lon }
    });
    
    if (error) throw error;
    return data;
  },

  async createTrafficAlert(alert: TrafficAlert): Promise<TrafficAlert> {
    const { data, error } = await supabase
      .from('traffic_alerts')
      .insert(alert)
      .select()
      .single();
    
    if (error) throw error;
    return data as TrafficAlert;
  },

  async getTrafficAlerts(userId: string): Promise<TrafficAlert[]> {
    const { data, error } = await supabase
      .from('traffic_alerts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []) as TrafficAlert[];
  },

  async updateTrafficAlert(id: string, updates: Partial<TrafficAlert>): Promise<TrafficAlert> {
    const { data, error } = await supabase
      .from('traffic_alerts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as TrafficAlert;
  },

  async deleteTrafficAlert(id: string): Promise<void> {
    const { error } = await supabase
      .from('traffic_alerts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
