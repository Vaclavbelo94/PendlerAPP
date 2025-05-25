
import { supabase } from "@/integrations/supabase/client";

export interface SavedRoute {
  id?: string;
  user_id: string;
  name: string;
  origin_address: string;
  destination_address: string;
  transport_modes: string[];
  optimization_preference: string;
  route_data?: any;
  created_at?: string;
  updated_at?: string;
}

export interface RouteSearchHistory {
  id?: string;
  user_id: string;
  origin_address: string;
  destination_address: string;
  search_date?: string;
}

export const routeService = {
  // Uložené trasy
  async saveRoute(route: SavedRoute): Promise<SavedRoute> {
    const { data, error } = await supabase
      .from('saved_routes')
      .insert(route)
      .select()
      .single();
    
    if (error) throw error;
    return data as SavedRoute;
  },

  async getSavedRoutes(userId: string): Promise<SavedRoute[]> {
    const { data, error } = await supabase
      .from('saved_routes')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    return (data || []) as SavedRoute[];
  },

  async deleteSavedRoute(id: string): Promise<void> {
    const { error } = await supabase
      .from('saved_routes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Historie vyhledávání
  async addSearchHistory(search: RouteSearchHistory): Promise<RouteSearchHistory> {
    const { data, error } = await supabase
      .from('route_search_history')
      .insert(search)
      .select()
      .single();
    
    if (error) throw error;
    return data as RouteSearchHistory;
  },

  async getSearchHistory(userId: string, limit: number = 10): Promise<RouteSearchHistory[]> {
    const { data, error } = await supabase
      .from('route_search_history')
      .select('*')
      .eq('user_id', userId)
      .order('search_date', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return (data || []) as RouteSearchHistory[];
  },

  async clearSearchHistory(userId: string): Promise<void> {
    const { error } = await supabase
      .from('route_search_history')
      .delete()
      .eq('user_id', userId);
    
    if (error) throw error;
  }
};
