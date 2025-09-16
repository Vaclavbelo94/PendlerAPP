
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

      // Get profiles and extended profiles for these users
      const [{ data: profiles, error: profilesError }, { data: extendedProfiles, error: extendedError }] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, username, phone_number')
          .in('id', userIds),
        supabase
          .from('user_extended_profiles')
          .select('user_id, display_name')
          .in('user_id', userIds)
      ]);

      if (profilesError) {
        console.error('Error loading profiles:', profilesError);
        throw new Error('Failed to load driver profiles');
      }

      if (extendedError) {
        console.warn('Error loading extended profiles:', extendedError);
      }

      // Create maps for profiles and extended profiles
      const profilesMap = new Map();
      profiles?.forEach(profile => {
        profilesMap.set(profile.id, profile);
      });

      const extendedProfilesMap = new Map();
      extendedProfiles?.forEach(profile => {
        extendedProfilesMap.set(profile.user_id, profile);
      });

      // Combine offers with profile data
      return offers.map(offer => {
        const profile = profilesMap.get(offer.user_id);
        const extendedProfile = extendedProfilesMap.get(offer.user_id);
        const displayName = extendedProfile?.display_name || profile?.username || '';
        
        return {
          ...offer,
          driver: {
            username: displayName,
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
    } catch (error: any) {
      console.error('Service error in createRideshareOffer:', error);
      
      // Enhanced error handling
      if (error?.code === '23505') {
        throw new Error('Nabídka s podobnými údaji již existuje');
      } else if (error?.code === '23503') {
        throw new Error('Uživatel nebyl nalezen');
      } else if (error?.message?.includes('violates row-level security')) {
        throw new Error('Nemáte oprávnění k vytvoření nabídky');
      } else if (error?.message?.includes('duplicate key')) {
        throw new Error('Duplicitní záznam - zkuste to znovu');
      } else {
        throw new Error(error?.message || 'Neočekávaná chyba při vytváření nabídky');
      }
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

      // Validate offer_id is a valid UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(offerId)) {
        console.error('Invalid offer ID format:', offerId);
        throw new Error('Invalid offer ID format');
      }

      // First get the offer to validate it exists and is active
      const { data: offer, error: offerError } = await supabase
        .from('rideshare_offers')
        .select('user_id, is_active')
        .eq('id', offerId)
        .single();

      if (offerError || !offer) {
        console.error('Offer not found:', offerError);
        throw new Error('Offer not found or no longer available');
      }

      if (!offer.is_active) {
        throw new Error('This offer is no longer active');
      }

      if (offer.user_id === user.id) {
        throw new Error('Cannot contact your own offer');
      }

      const contactData = {
        offer_id: offerId,
        requester_user_id: user.id,
        requester_email: email || user.email,
        phone_number: phoneNumber,
        message: message,
        status: 'pending'
      };

      console.log('Creating rideshare contact with data:', contactData);

      const { data, error } = await supabase
        .from('rideshare_contacts')
        .insert(contactData)
        .select()
        .single();

      if (error) {
        console.error('Error contacting driver:', error);
        throw new Error(`Failed to send contact request: ${error.message}`);
      }

      console.log('✅ Rideshare contact created successfully:', data);

      // Fallback: Create notifications directly if real-time doesn't work
      try {
        // Create notification for the driver
        if (offer.user_id !== user.id) {
          await supabase.from('notifications').insert({
            user_id: offer.user_id,
            title: 'Nová žádost o spolujízdu',
            message: `Někdo se zajímá o vaši spolujízdu`,
            type: 'rideshare_match', // Fixed: using valid type
            category: 'rideshare',
            metadata: {
              contact_id: data.id,
              offer_id: offerId
            },
            related_to: {
              type: 'rideshare_contact',
              id: data.id
            }
          });
        }

        // Create confirmation notification for the requester
        await supabase.from('notifications').insert({
          user_id: user.id,
          title: 'Žádost odeslána',
          message: `Vaše žádost o spolujízdu byla odeslána`,
          type: 'rideshare_request', // Fixed: using valid type
          category: 'rideshare',
          metadata: {
            contact_id: data.id,
            offer_id: offerId
          },
          related_to: {
            type: 'rideshare_contact',
            id: data.id
          }
        });

        console.log('✅ Fallback notifications created');
      } catch (notifError) {
        console.warn('⚠️ Fallback notification creation failed:', notifError);
        // Don't throw error here as the main contact was created successfully
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
            currency,
            user_id
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

  async getUserRideRequests(userId: string) {
    try {
      console.log('🔍 getUserRideRequests called with userId:', userId);
      
      // Check current auth session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('🔐 Current session:', {
        hasSession: !!session,
        userId: session?.user?.id,
        email: session?.user?.email,
        sessionError
      });

      // Get requests made TO this user (as driver) - from rideshare_contacts table
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
            currency,
            user_id
          )
        `)
        .eq('rideshare_offers.user_id', userId)
        .order('created_at', { ascending: false });

      console.log('📊 Query result:', {
        error,
        dataCount: data?.length || 0,
        data: data?.slice(0, 2) // Show first 2 records for debugging
      });

      if (error) {
        console.error('❌ Error loading user ride requests:', error);
        throw new Error('Failed to load your ride requests');
      }

      // Also try a direct query without join to debug
      const { data: allContacts, error: contactsError } = await supabase
        .from('rideshare_contacts')
        .select('*');
      
      console.log('📋 All rideshare_contacts for debugging:', {
        contactsError,
        allContactsCount: allContacts?.length || 0,
        allContacts: allContacts?.slice(0, 3)
      });

      // Try querying offers for this user
      const { data: userOffers, error: offersError } = await supabase
        .from('rideshare_offers')
        .select('*')
        .eq('user_id', userId);
      
      console.log('🚗 User offers for debugging:', {
        offersError,
        userOffersCount: userOffers?.length || 0,
        userOffers: userOffers?.slice(0, 2)
      });

      return data || [];
    } catch (error) {
      console.error('❌ Service error in getUserRideRequests:', error);
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

      // Get profile and extended profile for the user
      const [{ data: profile, error: profileError }, { data: extendedProfile, error: extendedError }] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, username, phone_number')
          .eq('id', userId)
          .single(),
        supabase
          .from('user_extended_profiles')
          .select('user_id, display_name')
          .eq('user_id', userId)
          .maybeSingle()
      ]);

      if (profileError) {
        console.error('Error loading profile:', profileError);
        throw new Error('Failed to load profile');
      }

      if (extendedError) {
        console.warn('Error loading extended profile:', extendedError);
      }

      const displayName = extendedProfile?.display_name || profile?.username || '';

      // Return offers with profile data
      return offers.map(offer => ({
        ...offer,
        driver: {
          username: displayName,
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
