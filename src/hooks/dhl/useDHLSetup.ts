
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface DHLSetupData {
  position_id: string;
  work_group_id: string;
}

export const useDHLSetup = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitSetup = async (data: DHLSetupData) => {
    if (!user) {
      toast.error('Musíte být přihlášeni');
      return false;
    }

    setIsSubmitting(true);
    
    try {
      // Zkontrolujeme, zda už uživatel nemá DHL přiřazení
      const { data: existingAssignment, error: checkError } = await supabase
        .from('user_dhl_assignments')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing assignment:', checkError);
        throw checkError;
      }

      if (existingAssignment) {
        // Aktualizujeme existující přiřazení
        const { error: updateError } = await supabase
          .from('user_dhl_assignments')
          .update({
            dhl_position_id: data.position_id,
            dhl_work_group_id: data.work_group_id,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingAssignment.id);

        if (updateError) throw updateError;
      } else {
        // Vytvoříme nové přiřazení
        const { error: insertError } = await supabase
          .from('user_dhl_assignments')
          .insert({
            user_id: user.id,
            dhl_position_id: data.position_id,
            dhl_work_group_id: data.work_group_id,
            is_active: true
          });

        if (insertError) throw insertError;
      }

      toast.success('DHL nastavení bylo úspěšně uloženo!');
      return true;
    } catch (error) {
      console.error('Error saving DHL setup:', error);
      toast.error('Chyba při ukládání nastavení');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitSetup,
    isSubmitting
  };
};
