import { supabase } from '@/integrations/supabase/client';

export interface RideshareContact {
  id: string;
  offer_id: string;
  requester_email: string;
  requester_user_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  phone_number?: string;
  country_code?: string;
  created_at: string;
  updated_at: string;
}

class RideshareContactService {
  /**
   * Update the status of a rideshare contact and handle seat updates
   */
  async updateContactStatus(
    contactId: string, 
    status: 'accepted' | 'rejected'
  ): Promise<RideshareContact> {
    console.log('🔧 updateContactStatus called with:', { contactId, status });
    
    try {
      const { data, error } = await supabase
        .from('rideshare_contacts')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', contactId)
        .select(`
          *,
          rideshare_offers (
            id,
            seats_available,
            user_id
          )
        `)
        .single();

      if (error) {
        console.error('❌ Database error updating contact:', error);
        throw new Error(`Failed to update contact status: ${error.message}`);
      }

      console.log('✅ Contact updated successfully:', data);

      // If accepted, decrease available seats
      if (status === 'accepted' && data) {
        const offer = (data as any).rideshare_offers;
        console.log('🎯 Processing seat update for offer:', offer);
        
        if (offer && offer.seats_available > 0) {
          const newSeatsCount = offer.seats_available - 1;
          console.log(`🪑 Updating seats from ${offer.seats_available} to ${newSeatsCount}`);
          
          const { error: updateError } = await supabase
            .from('rideshare_offers')
            .update({ 
              seats_available: newSeatsCount,
              is_active: newSeatsCount > 0, // Deactivate if no seats left
              updated_at: new Date().toISOString()
            })
            .eq('id', offer.id);

          if (updateError) {
            console.error('❌ Error updating seat count:', updateError);
            // Don't throw here, just log the error
          } else {
            console.log('✅ Seat count updated successfully');
          }
        } else {
          console.log('ℹ️ No seat update needed:', { offer, seatsAvailable: offer?.seats_available });
        }
      }

      // Update the corresponding notification metadata to reflect the new status
      console.log('🔔 Updating notification metadata for contact:', contactId);
      
      // First get the current notification
      const { data: notification } = await supabase
        .from('notifications')
        .select('metadata')
        .eq('metadata->>contact_id', contactId)
        .single();

      if (notification?.metadata && typeof notification.metadata === 'object') {
        const updatedMetadata = {
          ...(notification.metadata as Record<string, any>),
          status
        };

        const { error: notificationError } = await supabase
          .from('notifications')
          .update({ 
            metadata: updatedMetadata,
            updated_at: new Date().toISOString()
          })
          .eq('metadata->>contact_id', contactId);

        if (notificationError) {
          console.error('❌ Error updating notification metadata:', notificationError);
        } else {
          console.log('✅ Notification metadata updated successfully');
        }
      }

      return data as RideshareContact;
    } catch (error) {
      console.error('💥 CRITICAL ERROR in updateContactStatus:', error);
      throw error;
    }
  }

  /**
   * Get contacts for a specific offer (for drivers to manage)
   */
  async getContactsForOffer(offerId: string): Promise<RideshareContact[]> {
    const { data, error } = await supabase
      .from('rideshare_contacts')
      .select('*')
      .eq('offer_id', offerId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch contacts: ${error.message}`);
    }

    return data as RideshareContact[];
  }

  /**
   * Get user's own rideshare requests
   */
  async getUserContacts(userId: string): Promise<RideshareContact[]> {
    const { data, error } = await supabase
      .from('rideshare_contacts')
      .select(`
        *,
        rideshare_offers (
          origin_address,
          destination_address,
          departure_date,
          departure_time,
          user_id,
          profiles (username)
        )
      `)
      .eq('requester_user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch user contacts: ${error.message}`);
    }

    return data as RideshareContact[];
  }

  /**
   * Check if user can approve/reject a contact (must be the driver)
   */
  async canManageContact(contactId: string, userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('rideshare_contacts')
      .select(`
        rideshare_offers (
          user_id
        )
      `)
      .eq('id', contactId)
      .single();

    if (error || !data) {
      return false;
    }

    return (data as any).rideshare_offers?.user_id === userId;
  }
}

export const rideshareContactService = new RideshareContactService();