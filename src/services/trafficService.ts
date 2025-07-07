
import { supabase } from "@/integrations/supabase/client";

export interface TrafficData {
  multi_modal_results?: {
    transport_mode: string;
    routes: {
      duration: string;
      duration_in_traffic: string;
      distance: string;
      traffic_conditions: 'light' | 'normal' | 'heavy';
      warnings?: string[];
      incidents?: any[];
      summary?: string;
    }[];
  }[];
  routes?: {
    duration: string;
    duration_in_traffic: string;
    distance: string;
    traffic_conditions: 'light' | 'normal' | 'heavy';
    warnings?: string[];
    incidents?: any[];
    summary?: string;
  }[];
  recommendations?: string[];
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
  async getTrafficData(origin: string, destination: string, mode: string = 'driving', transportModes: string[] = ['driving'], userId?: string): Promise<TrafficData> {
    const { data, error } = await supabase.functions.invoke('traffic-data', {
      body: { origin, destination, mode, transportModes, userId }
    });
    
    if (error) throw error;
    return data;
  },

  async optimizeRoute(origin: string, destination: string, criteria: string = 'balanced', userId?: string) {
    const { data, error } = await supabase.functions.invoke('route-optimization', {
      body: { 
        origin, 
        destination, 
        optimizationCriteria: criteria,
        userId,
        departureTime: new Date().toISOString()
      }
    });
    
    if (error) throw error;
    return data;
  },

  async getPersonalRoutes(userId: string) {
    const { data, error } = await supabase
      .from('personal_routes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createPersonalRoute(userId: string, routeData: any) {
    const { data, error } = await supabase
      .from('personal_routes')
      .insert({
        user_id: userId,
        name: routeData.name,
        origin_address: routeData.origin,
        destination_address: routeData.destination,
        transport_modes: routeData.transportModes || ['driving'],
        is_frequent: routeData.isFrequent || false
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getRouteAnalytics(userId: string, limit: number = 50) {
    const { data, error } = await supabase
      .from('route_analytics')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
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
