
import { supabase } from "@/integrations/supabase/client";

export interface SavedRoute {
  id?: string;
  user_id?: string;
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
  user_id?: string;
  origin_address: string;
  destination_address: string;
  search_date?: string;
}

export const routeService = {
  // Uložené trasy
  async saveRoute(route: SavedRoute) {
    const { data, error } = await supabase
      .from('saved_routes' as any)
      .insert([route])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getSavedRoutes(userId: string) {
    const { data, error } = await supabase
      .from('saved_routes' as any)
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async deleteSavedRoute(id: string) {
    const { error } = await supabase
      .from('saved_routes' as any)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Historie vyhledávání
  async addSearchHistory(search: RouteSearchHistory) {
    const { data, error } = await supabase
      .from('route_search_history' as any)
      .insert([search])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getSearchHistory(userId: string, limit: number = 10) {
    const { data, error } = await supabase
      .from('route_search_history' as any)
      .select('*')
      .eq('user_id', userId)
      .order('search_date', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  },

  async clearSearchHistory(userId: string) {
    const { error } = await supabase
      .from('route_search_history' as any)
      .delete()
      .eq('user_id', userId);
    
    if (error) throw error;
  }
};
