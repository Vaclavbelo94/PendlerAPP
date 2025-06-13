
import { supabase } from "@/integrations/supabase/client";
import { rideshareService, RideshareOffer, RideshareContact } from "./rideshareService";

export interface RideshareMatch extends RideshareOffer {
  matchScore: number;
  routeCompatibility: number;
  timeCompatibility: number;
  profiles?: {
    username: string;
    email: string;
  };
}

export interface RideshareMessage {
  id?: string;
  contact_id: string;
  sender_user_id: string;
  message: string;
  created_at?: string;
}

export interface CommuteAnalytics {
  id?: string;
  user_id: string;
  route_origin: string;
  route_destination: string;
  travel_date: string;
  departure_time: string;
  arrival_time?: string;
  duration_minutes?: number;
  distance_km?: number;
  cost_amount?: number;
  transport_mode: string;
  weather_conditions?: string;
  traffic_level?: string;
}

export const enhancedRideshareService = {
  // Smart matching
  async findMatches(origin: string, destination: string, date: string, flexibility: number = 30): Promise<RideshareMatch[]> {
    const { data, error } = await supabase.functions.invoke('rideshare-matching', {
      body: { origin, destination, date, flexibility }
    });
    
    if (error) throw error;
    return data.matches;
  },

  // Rating and reviews
  async rateRide(contactId: string, rating: number, review?: string): Promise<RideshareContact> {
    const { data, error } = await supabase
      .from('rideshare_contacts')
      .update({ rating, review, status: 'completed' })
      .eq('id', contactId)
      .select()
      .single();
    
    if (error) throw error;
    return data as RideshareContact;
  },

  // Chat functionality
  async sendMessage(contactId: string, senderId: string, message: string): Promise<RideshareMessage> {
    const { data, error } = await supabase
      .from('rideshare_messages')
      .insert({ contact_id: contactId, sender_user_id: senderId, message })
      .select()
      .single();
    
    if (error) throw error;
    return data as RideshareMessage;
  },

  async getMessages(contactId: string): Promise<RideshareMessage[]> {
    const { data, error } = await supabase
      .from('rideshare_messages')
      .select('*')
      .eq('contact_id', contactId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return (data || []) as RideshareMessage[];
  },

  // Analytics
  async saveCommuteData(analytics: CommuteAnalytics): Promise<CommuteAnalytics> {
    const { data, error } = await supabase
      .from('commute_analytics')
      .insert(analytics)
      .select()
      .single();
    
    if (error) throw error;
    return data as CommuteAnalytics;
  },

  async getCommuteAnalytics(userId: string, days: number = 30): Promise<CommuteAnalytics[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('commute_analytics')
      .select('*')
      .eq('user_id', userId)
      .gte('travel_date', startDate.toISOString().split('T')[0])
      .order('travel_date', { ascending: false });
    
    if (error) throw error;
    return (data || []) as CommuteAnalytics[];
  },

  // Enhanced offer management
  async updateOfferRating(offerId: string, rating: number): Promise<void> {
    const { error } = await supabase
      .from('rideshare_offers')
      .update({ rating })
      .eq('id', offerId);
    
    if (error) throw error;
  },

  async incrementCompletedRides(offerId: string): Promise<void> {
    const { error } = await supabase.rpc('increment_completed_rides', {
      offer_id: offerId
    });
    
    if (error) throw error;
  }
};
