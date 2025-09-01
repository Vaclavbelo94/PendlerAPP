import { supabase } from '@/integrations/supabase/client';

export interface RideRequest {
  id: string;
  offer_id: string;
  requester_user_id: string;
  requester_email: string;
  phone_number?: string;
  country_code?: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
  rating?: number;
  review?: string;
  rideshare_offers: {
    id: string;
    user_id: string;
    origin_address: string;
    destination_address: string;
    departure_date: string;
    departure_time: string;
    price_per_person: number;
    currency: string;
    seats_available: number;
    notes?: string;
  };
}

export const fixedRideshareService = {
  /**
   * Get ride requests for the current user (as driver)
   */
  async getUserRideRequests(userId: string): Promise<RideRequest[]> {
    try {
      console.log('🔍 fixedRideshareService: getUserRideRequests called with userId:', userId);
      
      // First check auth session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('🔐 Current auth session:', {
        hasSession: !!session,
        sessionUserId: session?.user?.id,
        email: session?.user?.email,
        sessionError,
        inputUserId: userId,
        userIdsMatch: session?.user?.id === userId
      });

      if (!session?.user?.id) {
        console.warn('⚠️ No valid session found');
        return [];
      }

      if (session.user.id !== userId) {
        console.warn('⚠️ Session user ID does not match requested user ID');
        return [];
      }

      // Query rideshare_contacts with join to rideshare_offers
      console.log('📊 Executing main query...');
      const { data, error } = await supabase
        .from('rideshare_contacts')
        .select(`
          id,
          offer_id,
          requester_user_id,
          requester_email,
          phone_number,
          country_code,
          message,
          status,
          created_at,
          updated_at,
          rating,
          review,
          rideshare_offers!inner(
            id,
            user_id,
            origin_address,
            destination_address,
            departure_date,
            departure_time,
            price_per_person,
            currency,
            seats_available,
            notes
          )
        `)
        .eq('rideshare_offers.user_id', userId)
        .order('created_at', { ascending: false });

      console.log('📊 Query result:', {
        error,
        dataCount: data?.length || 0,
        data: data?.slice(0, 2) // Show first 2 for debugging
      });

      if (error) {
        console.error('❌ Query error:', error);
        
        // Try a simpler query to debug
        console.log('🧪 Trying simpler queries for debugging...');
        
        // Check if user has any offers
        const { data: userOffers, error: offersError } = await supabase
          .from('rideshare_offers')
          .select('id, origin_address, destination_address')
          .eq('user_id', userId);
        
        console.log('🚗 User offers:', {
          offersError,
          userOffersCount: userOffers?.length || 0,
          userOffers
        });
        
        // Check all contacts
        const { data: allContacts, error: contactsError } = await supabase
          .from('rideshare_contacts')
          .select('id, offer_id, requester_email, status');
          
        console.log('📋 All contacts:', {
          contactsError,
          allContactsCount: allContacts?.length || 0,
          allContacts
        });
        
        throw new Error(`Database query failed: ${error.message}`);
      }

      console.log('✅ Successfully loaded ride requests:', data?.length || 0);
      return data as RideRequest[] || [];
      
    } catch (error) {
      console.error('❌ Service error in getUserRideRequests:', error);
      throw error;
    }
  },

  /**
   * Update the status of a ride request
   */
  async updateRequestStatus(requestId: string, status: 'accepted' | 'rejected'): Promise<void> {
    try {
      const { error } = await supabase
        .from('rideshare_contacts')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) {
        console.error('Error updating request status:', error);
        throw new Error('Failed to update request status');
      }
    } catch (error) {
      console.error('Service error in updateRequestStatus:', error);
      throw error;
    }
  },

  /**
   * Add rating and review for a completed ride
   */
  async rateRequest(requestId: string, rating: number, review?: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('rideshare_contacts')
        .update({ 
          rating,
          review: review || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) {
        console.error('Error rating request:', error);
        throw new Error('Failed to rate request');
      }
    } catch (error) {
      console.error('Service error in rateRequest:', error);
      throw error;
    }
  },

  /**
   * Get statistics for user's ride requests
   */
  async getUserRequestStats(userId: string) {
    try {
      const { data, error } = await supabase
        .from('rideshare_contacts')
        .select(`
          status,
          rideshare_offers!inner(user_id)
        `)
        .eq('rideshare_offers.user_id', userId);

      if (error) {
        console.error('Error loading request stats:', error);
        return { total: 0, pending: 0, accepted: 0, rejected: 0 };
      }

      const stats = data?.reduce((acc, request) => {
        acc.total++;
        acc[request.status as keyof typeof acc]++;
        return acc;
      }, { total: 0, pending: 0, accepted: 0, rejected: 0 });

      return stats || { total: 0, pending: 0, accepted: 0, rejected: 0 };
    } catch (error) {
      console.error('Service error in getUserRequestStats:', error);
      return { total: 0, pending: 0, accepted: 0, rejected: 0 };
    }
  }
};