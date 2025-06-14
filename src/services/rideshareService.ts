
import { supabase } from '@/integrations/supabase/client';

export interface RideshareOffer {
  id: string;
  user_id: string;
  origin_address: string;
  destination_address: string;
  departure_date: string;
  departure_time: string;
  seats_available: number;
  price_per_person: number;
  notes: string;
  is_recurring: boolean;
  recurring_days: number[];
  rating: number;
  completed_rides: number;
  created_at: string;
  is_active: boolean;
}

export interface RideshareContact {
  id: string;
  offer_id: string;
  requester_user_id: string;
  message: string;
  status: string;
  created_at: string;
  rating?: number;
  review?: string;
}

export interface RideshareOfferWithDriver extends RideshareOffer {
  driver: {
    username: string;
    phone_number?: string;
    rating?: number;
    completed_rides?: number;
  };
}

export const rideshareService = {
  async getRideshareOffers(): Promise<RideshareOfferWithDriver[]> {
    const { data, error } = await supabase
      .from('rideshare_offers')
      .select(`
        *,
        profiles!rideshare_offers_user_id_fkey (
          username,
          phone_number
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading rideshare offers:', error);
      throw error;
    }

    return (data || []).map(offer => ({
      ...offer,
      driver: {
        username: offer.profiles?.username || 'Neznámý řidič',
        phone_number: offer.profiles?.phone_number,
        rating: offer.rating,
        completed_rides: offer.completed_rides
      }
    }));
  },

  async createRideshareOffer(offerData: Omit<RideshareOffer, 'id' | 'created_at' | 'rating' | 'completed_rides' | 'is_active'>) {
    const { data, error } = await supabase
      .from('rideshare_offers')
      .insert(offerData)
      .select()
      .single();

    if (error) {
      console.error('Error creating rideshare offer:', error);
      throw error;
    }

    return data;
  },

  async createOffer(offerData: Omit<RideshareOffer, 'id' | 'created_at' | 'rating' | 'completed_rides' | 'is_active'>) {
    return this.createRideshareOffer(offerData);
  },

  async contactDriver(offerId: string, message: string) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated');
    }

    const { data, error } = await supabase
      .from('rideshare_contacts')
      .insert({
        offer_id: offerId,
        requester_user_id: user.id,
        message: message
      })
      .select()
      .single();

    if (error) {
      console.error('Error contacting driver:', error);
      throw error;
    }

    return data;
  },

  async createContact(contactData: { offer_id: string; requester_user_id: string; message: string }) {
    const { data, error } = await supabase
      .from('rideshare_contacts')
      .insert(contactData)
      .select()
      .single();

    if (error) {
      console.error('Error creating contact:', error);
      throw error;
    }

    return data;
  }
};
