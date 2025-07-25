
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
  currency: string; // Added currency field
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
    try {
      // First get the offers
      const { data: offers, error: offersError } = await supabase
        .from('rideshare_offers')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (offersError) {
        console.error('Error loading rideshare offers:', offersError);
        throw new Error('Failed to load ride offers');
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
        throw new Error('Failed to load driver profiles');
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
            username: profile?.username || '',
            phone_number: offer.phone_number || profile?.phone_number, // Prefer offer phone number
            rating: offer.rating,
            completed_rides: offer.completed_rides
          }
        };
      });
    } catch (error) {
      console.error('Service error in getRideshareOffers:', error);
      throw error;
    }
  },

  async createRideshareOffer(offerData: Omit<RideshareOffer, 'id' | 'created_at' | 'rating' | 'completed_rides' | 'is_active'>) {
    try {
      const { data, error } = await supabase
        .from('rideshare_offers')
        .insert({
          ...offerData,
          is_active: true,
          // Ensure currency is set
          currency: offerData.currency || 'EUR'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating rideshare offer:', error);
        throw new Error('Failed to create ride offer');
      }

      return data;
    } catch (error) {
      console.error('Service error in createRideshareOffer:', error);
      throw error;
    }
  },

  async createOffer(offerData: Omit<RideshareOffer, 'id' | 'created_at' | 'rating' | 'completed_rides' | 'is_active'>) {
    return this.createRideshareOffer(offerData);
  },

  async contactDriver(offerId: string, message: string, email?: string, phoneNumber?: string, countryCode?: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated');
      }

      const { data, error } = await supabase
        .from('rideshare_contacts')
        .insert({
          offer_id: offerId,
          requester_user_id: user.id,
          message: message,
          status: 'pending',
          requester_email: email,
          phone_number: phoneNumber,
          country_code: countryCode
        })
        .select()
        .single();

      if (error) {
        console.error('Error contacting driver:', error);
        throw new Error('Failed to send contact request');
      }

      return data;
    } catch (error) {
      console.error('Service error in contactDriver:', error);
      throw error;
    }
  },

  async getDriverContacts(userId: string) {
    try {
      const { data, error } = await supabase
        .from('rideshare_contacts')
        .select(`
          *,
          rideshare_offers!inner(
            origin_address,
            destination_address,
            departure_date,
            departure_time,
            seats_available,
            price_per_person,
            currency
          )
        `)
        .eq('rideshare_offers.user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading driver contacts:', error);
        throw new Error('Failed to load contact requests');
      }

      return data || [];
    } catch (error) {
      console.error('Service error in getDriverContacts:', error);
      throw error;
    }
  },

  async updateContactStatus(contactId: string, status: string) {
    try {
      const { error } = await supabase
        .from('rideshare_contacts')
        .update({ status })
        .eq('id', contactId);

      if (error) {
        console.error('Error updating contact status:', error);
        throw new Error('Failed to update contact status');
      }
    } catch (error) {
      console.error('Service error in updateContactStatus:', error);
      throw error;
    }
  },

  async createContact(contactData: { offer_id: string; requester_user_id: string; message: string }) {
    try {
      const { data, error } = await supabase
        .from('rideshare_contacts')
        .insert({
          ...contactData,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating contact:', error);
        throw new Error('Failed to create contact request');
      }

      return data;
    } catch (error) {
      console.error('Service error in createContact:', error);
      throw error;
    }
  },

  async deleteRideshareOffer(offerId: string) {
    try {
      const { error } = await supabase
        .from('rideshare_offers')
        .delete()
        .eq('id', offerId);

      if (error) {
        console.error('Error deleting offer:', error);
        throw new Error('Failed to delete offer');
      }
    } catch (error) {
      console.error('Service error in deleteRideshareOffer:', error);
      throw error;
    }
  },

  async deactivateRideshareOffer(offerId: string) {
    try {
      const { error } = await supabase
        .from('rideshare_offers')
        .update({ is_active: false })
        .eq('id', offerId);

      if (error) {
        console.error('Error deactivating offer:', error);
        throw new Error('Failed to deactivate offer');
      }
    } catch (error) {
      console.error('Service error in deactivateRideshareOffer:', error);
      throw error;
    }
  },

  async reactivateRideshareOffer(offerId: string) {
    try {
      const { error } = await supabase
        .from('rideshare_offers')
        .update({ is_active: true })
        .eq('id', offerId);

      if (error) {
        console.error('Error reactivating offer:', error);
        throw new Error('Failed to reactivate offer');
      }
    } catch (error) {
      console.error('Service error in reactivateRideshareOffer:', error);
      throw error;
    }
  },

  async getUserRideshareOffers(userId: string): Promise<RideshareOfferWithDriver[]> {
    try {
      const { data: offers, error: offersError } = await supabase
        .from('rideshare_offers')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (offersError) {
        console.error('Error loading user offers:', offersError);
        throw new Error('Failed to load your offers');
      }

      if (!offers || offers.length === 0) {
        return [];
      }

      // Get profile for the user
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, phone_number')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error loading profile:', profileError);
        throw new Error('Failed to load profile');
      }

      // Return offers with profile data
      return offers.map(offer => ({
        ...offer,
        driver: {
          username: profile?.username || '',
          phone_number: offer.phone_number || profile?.phone_number,
          rating: offer.rating,
          completed_rides: offer.completed_rides
        }
      }));
    } catch (error) {
      console.error('Service error in getUserRideshareOffers:', error);
      throw error;
    }
  }
};
