import { supabase } from '@/integrations/supabase/client';

export interface RideshareContact {
  id: string;
  offer_id: string;
  requester_email: string;
  requester_user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  message?: string;
  phone_number?: string;
  country_code?: string;
  created_at: string;
  updated_at: string;
}

class RideshareContactService {
  /**
   * Update the status of a rideshare contact
   */
  async updateContactStatus(
    contactId: string, 
    status: 'approved' | 'rejected'
  ): Promise<RideshareContact> {
    const { data, error } = await supabase
      .from('rideshare_contacts')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', contactId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update contact status: ${error.message}`);
    }

    return data as RideshareContact;
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