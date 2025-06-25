
import { supabase } from '@/integrations/supabase/client';
import { DHLSetupFormData, UserDHLAssignment } from '@/types/dhl';

export class DHLService {
  /**
   * Kontrola, zda má uživatel aktivní DHL přiřazení
   */
  static async hasActiveDHLAssignment(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_dhl_assignments')
        .select('id')
        .eq('user_id', userId)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('Chyba při kontrole DHL přiřazení:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Chyba při kontrole DHL přiřazení:', error);
      return false;
    }
  }

  /**
   * Získání aktivního DHL přiřazení uživatele
   */
  static async getUserDHLAssignment(userId: string): Promise<UserDHLAssignment | null> {
    try {
      const { data, error } = await supabase
        .from('user_dhl_assignments')
        .select(`
          *,
          dhl_position:dhl_positions(*),
          dhl_work_group:dhl_work_groups(*)
        `)
        .eq('user_id', userId)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('Chyba při načítání DHL přiřazení:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Chyba při načítání DHL přiřazení:', error);
      return null;
    }
  }

  /**
   * Vytvoření DHL přiřazení pro uživatele
   */
  static async createDHLAssignment(userId: string, setupData: DHLSetupFormData): Promise<UserDHLAssignment | null> {
    try {
      // Nejdříve deaktivovat všechna existující přiřazení
      await supabase
        .from('user_dhl_assignments')
        .update({ is_active: false })
        .eq('user_id', userId);

      // Vytvořit nové přiřazení
      const { data, error } = await supabase
        .from('user_dhl_assignments')
        .insert({
          user_id: userId,
          dhl_position_id: setupData.position_id,
          dhl_work_group_id: setupData.work_group_id,
          is_active: true
        })
        .select(`
          *,
          dhl_position:dhl_positions(*),
          dhl_work_group:dhl_work_groups(*)
        `)
        .single();

      if (error) {
        console.error('Chyba při vytváření DHL přiřazení:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Chyba při vytváření DHL přiřazení:', error);
      return null;
    }
  }

  /**
   * Kontrola, zda by uživatel měl být přesměrován na DHL setup
   */
  static async shouldRedirectToDHLSetup(userId: string): Promise<boolean> {
    try {
      // Zkontrolovat, zda má uživatel aktivní DHL přiřazení
      const hasAssignment = await this.hasActiveDHLAssignment(userId);
      
      if (hasAssignment) {
        return false; // Už má nastavení, nemusí znovu
      }

      // Zkontrolovat, zda má uživatel DHL promo kód redemption
      const { data: redemption, error } = await supabase
        .from('promo_code_redemptions')
        .select(`
          promo_code:promo_codes!inner(code)
        `)
        .eq('user_id', userId)
        .ilike('promo_codes.code', 'DHL2026')
        .maybeSingle();

      if (error) {
        console.error('Chyba při kontrole promo kódu:', error);
        return false;
      }

      return !!redemption; // Má DHL kód, ale nemá nastavení
    } catch (error) {
      console.error('Chyba při kontrole přesměrování:', error);
      return false;
    }
  }

  /**
   * Vytvoření DHL notifikace
   */
  static async createDHLNotification(
    userId: string, 
    type: 'shift_assigned' | 'shift_changed' | 'shift_cancelled',
    title: string,
    message: string,
    metadata?: any
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('dhl_notifications')
        .insert({
          user_id: userId,
          notification_type: type,
          title,
          message,
          metadata: metadata || {}
        });

      if (error) {
        console.error('Chyba při vytváření DHL notifikace:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Chyba při vytváření DHL notifikace:', error);
      return false;
    }
  }
}

export default DHLService;
