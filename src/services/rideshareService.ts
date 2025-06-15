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
  rating?: number;
  completed_rides?: number;
  created_at: string;
  is_active: boolean;
  phone_number?: string;
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
    // First get the offers
    const { data: offers, error: offersError } = await supabase
      .from('rideshare_offers')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (offersError) {
      console.error('Error loading rideshare offers:', offersError);
      throw offersError;
    }

    if (!offers || offers.length === 0) {
      return [];
    }

    // Get all unique user IDs
    const userIds = [...new Set(offers.map(offer => offer.user_id))];

    // Get profiles for these users
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username, phone_number')
      .in('id', userIds);

    if (profilesError) {
      console.error('Error loading profiles:', profilesError);
      throw profilesError;
    }

    // Create a map of user_id to profile
    const profilesMap = new Map();
    profiles?.forEach(profile => {
      profilesMap.set(profile.id, profile);
    });

    // Combine offers with profile data
    return offers.map(offer => {
      const profile = profilesMap.get(offer.user_id);
      return {
        ...offer,
        driver: {
          username: profile?.username || 'Neznámý řidič',
          phone_number: offer.phone_number || profile?.phone_number, // Prefer offer phone number
          rating: offer.rating,
          completed_rides: offer.completed_rides
        }
      };
    });
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
