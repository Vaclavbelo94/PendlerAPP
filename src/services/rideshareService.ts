
import { supabase } from "@/integrations/supabase/client";

export interface RideshareOffer {
  id?: string;
  user_id: string;
  origin_address: string;
  destination_address: string;
  departure_date: string;
  departure_time: string;
  seats_available: number;
  price_per_person?: number;
  notes?: string;
  is_recurring?: boolean;
  recurring_days?: number[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface RideshareRequest {
  id?: string;
  user_id: string;
  origin_address: string;
  destination_address: string;
  departure_date: string;
  departure_time_from: string;
  departure_time_to: string;
  max_price_per_person?: number;
  notes?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface RideshareContact {
  id?: string;
  offer_id: string;
  requester_user_id: string;
  message?: string;
  status?: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  created_at?: string;
  updated_at?: string;
}

export const rideshareService = {
  // Nabídky spolujízd
  async createOffer(offer: RideshareOffer): Promise<RideshareOffer> {
    const { data, error } = await supabase
      .from('rideshare_offers')
      .insert(offer)
      .select()
      .single();
    
    if (error) throw error;
    return data as RideshareOffer;
  },

  async getOffers(filters?: { 
    origin?: string; 
    destination?: string; 
    date?: string; 
    limit?: number;
  }): Promise<RideshareOffer[]> {
    let query = supabase
      .from('rideshare_offers')
      .select('*')
      .eq('is_active', true)
      .order('departure_date', { ascending: true });

    if (filters?.origin) {
      query = query.ilike('origin_address', `%${filters.origin}%`);
    }
    if (filters?.destination) {
      query = query.ilike('destination_address', `%${filters.destination}%`);
    }
    if (filters?.date) {
      query = query.gte('departure_date', filters.date);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as RideshareOffer[];
  },

  async getUserOffers(userId: string): Promise<RideshareOffer[]> {
    const { data, error } = await supabase
      .from('rideshare_offers')
      .select('*')
      .eq('user_id', userId)
      .order('departure_date', { ascending: true });
    
    if (error) throw error;
    return (data || []) as RideshareOffer[];
  },

  async updateOffer(id: string, updates: Partial<RideshareOffer>): Promise<RideshareOffer> {
    const { data, error } = await supabase
      .from('rideshare_offers')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as RideshareOffer;
  },

  async deleteOffer(id: string): Promise<void> {
    const { error } = await supabase
      .from('rideshare_offers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Požadavky na spolujízdy
  async createRequest(request: RideshareRequest): Promise<RideshareRequest> {
    const { data, error } = await supabase
      .from('rideshare_requests')
      .insert(request)
      .select()
      .single();
    
    if (error) throw error;
    return data as RideshareRequest;
  },

  async getRequests(filters?: { 
    origin?: string; 
    destination?: string; 
    date?: string; 
    limit?: number;
  }): Promise<RideshareRequest[]> {
    let query = supabase
      .from('rideshare_requests')
      .select('*')
      .eq('is_active', true)
      .order('departure_date', { ascending: true });

    if (filters?.origin) {
      query = query.ilike('origin_address', `%${filters.origin}%`);
    }
    if (filters?.destination) {
      query = query.ilike('destination_address', `%${filters.destination}%`);
    }
    if (filters?.date) {
      query = query.gte('departure_date', filters.date);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as RideshareRequest[];
  },

  // Kontakty
  async createContact(contact: RideshareContact): Promise<RideshareContact> {
    const { data, error } = await supabase
      .from('rideshare_contacts')
      .insert(contact)
      .select()
      .single();
    
    if (error) throw error;
    return data as RideshareContact;
  },

  async getContactsForOffer(offerId: string): Promise<RideshareContact[]> {
    const { data, error } = await supabase
      .from('rideshare_contacts')
      .select('*')
      .eq('offer_id', offerId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []) as RideshareContact[];
  },

  async updateContactStatus(contactId: string, status: RideshareContact['status']): Promise<RideshareContact> {
    const { data, error } = await supabase
      .from('rideshare_contacts')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', contactId)
      .select()
      .single();
    
    if (error) throw error;
    return data as RideshareContact;
  }
};
