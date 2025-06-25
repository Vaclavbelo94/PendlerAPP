
import { supabase } from '@/integrations/supabase/client';
import { DHLShift, DHLShiftTemplate, UserDHLAssignment } from '@/types/dhl';

export class DHLShiftService {
  /**
   * Automatické generování DHL směn pro uživatele na základě šablon
   */
  static async generateShiftsForUser(
    userId: string, 
    startDate: string, 
    endDate: string
  ): Promise<{ success: boolean; message: string; shiftsCreated: number }> {
    try {
      // Získání aktivního DHL přiřazení uživatele
      const { data: assignment, error: assignmentError } = await supabase
        .from('user_dhl_assignments')
        .select(`
          *,
          dhl_position:dhl_positions(*),
          dhl_work_group:dhl_work_groups(*)
        `)
        .eq('user_id', userId)
        .eq('is_active', true)
        .maybeSingle();

      if (assignmentError) throw assignmentError;

      if (!assignment) {
        return {
          success: false,
          message: 'Uživatel nemá aktivní DHL přiřazení',
          shiftsCreated: 0
        };
      }

      // Získání šablon směn pro pozici a pracovní skupinu uživatele
      const { data: templates, error: templatesError } = await supabase
        .from('dhl_shift_templates')
        .select('*')
        .eq('position_id', assignment.dhl_position_id)
        .eq('work_group_id', assignment.dhl_work_group_id);

      if (templatesError) throw templatesError;

      if (!templates || templates.length === 0) {
        return {
          success: false,
          message: 'Pro vaši pozici a pracovní skupinu nejsou definovány šablony směn',
          shiftsCreated: 0
        };
      }

      // Generování směn pro zadané období
      const shifts: Omit<DHLShift, 'id' | 'created_at' | 'updated_at'>[] = [];
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);

      for (let date = new Date(startDateObj); date <= endDateObj; date.setDate(date.getDate() + 1)) {
        const dayOfWeek = date.getDay();
        const dateString = date.toISOString().split('T')[0];

        // Najít šablony pro tento den v týdnu
        const dayTemplates = templates.filter(t => t.day_of_week === dayOfWeek);

        for (const template of dayTemplates) {
          // Zkontrolovat, zda už pro tento den a pozici existuje směna
          const { data: existingShift, error: checkError } = await supabase
            .from('shifts')
            .select('id')
            .eq('user_id', userId)
            .eq('date', dateString)
            .eq('is_dhl_managed', true)
            .maybeSingle();

          if (checkError) throw checkError;

          if (existingShift) {
            continue; // Směna už existuje, přeskočit
          }

          // Určit typ směny podle času začátku
          let shiftType: 'morning' | 'afternoon' | 'night' = 'morning';
          const startHour = parseInt(template.start_time.split(':')[0]);
          
          if (startHour >= 6 && startHour < 14) {
            shiftType = 'morning';
          } else if (startHour >= 14 && startHour < 22) {
            shiftType = 'afternoon';
          } else {
            shiftType = 'night';
          }

          shifts.push({
            user_id: userId,
            date: dateString,
            type: shiftType,
            notes: `Automaticky vygenerováno - ${template.start_time} - ${template.end_time}`,
            dhl_position_id: assignment.dhl_position_id,
            dhl_work_group_id: assignment.dhl_work_group_id,
            is_dhl_managed: true,
            dhl_override: false,
            original_dhl_data: {
              template_id: template.id,
              start_time: template.start_time,
              end_time: template.end_time,
              break_duration: template.break_duration,
              is_required: template.is_required
            }
          });
        }
      }

      if (shifts.length === 0) {
        return {
          success: true,
          message: 'Žádné nové směny k vytvoření - všechny už existují',
          shiftsCreated: 0
        };
      }

      // Vložení směn do databáze
      const { error: insertError } = await supabase
        .from('shifts')
        .insert(shifts);

      if (insertError) throw insertError;

      // Vytvoření notifikace o vygenerovaných směnách
      await supabase
        .from('dhl_notifications')
        .insert({
          user_id: userId,
          notification_type: 'shift_assigned',
          title: 'DHL směny vygenerovány',
          message: `Bylo automaticky vygenerováno ${shifts.length} směn pro období ${startDate} - ${endDate}.`,
          metadata: {
            shifts_created: shifts.length,
            start_date: startDate,
            end_date: endDate,
            position: assignment.dhl_position?.name,
            work_group: assignment.dhl_work_group?.name
          }
        });

      return {
        success: true,
        message: `Úspěšně vygenerováno ${shifts.length} směn`,
        shiftsCreated: shifts.length
      };

    } catch (error) {
      console.error('Chyba při generování DHL směn:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Neočekávaná chyba při generování směn',
        shiftsCreated: 0
      };
    }
  }

  /**
   * Přepsání DHL směny uživatelem
   */
  static async overrideShift(
    userId: string, 
    shiftId: string, 
    overrideData: Partial<DHLShift>
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Získání původní směny
      const { data: originalShift, error: fetchError } = await supabase
        .from('shifts')
        .select('*')
        .eq('id', shiftId)
        .eq('user_id', userId)
        .eq('is_dhl_managed', true)
        .single();

      if (fetchError) throw fetchError;

      // Aktualizace směny s override příznakem
      const { error: updateError } = await supabase
        .from('shifts')
        .update({
          ...overrideData,
          dhl_override: true
        })
        .eq('id', shiftId)
        .eq('user_id', userId);

      if (updateError) throw updateError;

      // Vytvoření notifikace o přepsání směny
      await supabase
        .from('dhl_notifications')
        .insert({
          user_id: userId,
          shift_id: shiftId,
          notification_type: 'shift_changed',
          title: 'DHL směna upravena',
          message: `Směna na ${originalShift.date} byla ručně upravena.`,
          metadata: {
            original_type: originalShift.type,
            new_type: overrideData.type,
            override_date: new Date().toISOString()
          }
        });

      return {
        success: true,
        message: 'Směna byla úspěšně upravena'
      };

    } catch (error) {
      console.error('Chyba při přepisování DHL směny:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Neočekávaná chyba při úpravě směny'
      };
    }
  }

  /**
   * Obnovení DHL směny na původní stav
   */
  static async restoreShift(
    userId: string, 
    shiftId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Získání směny s původními daty
      const { data: shift, error: fetchError } = await supabase
        .from('shifts')
        .select('*')
        .eq('id', shiftId)
        .eq('user_id', userId)
        .eq('is_dhl_managed', true)
        .single();

      if (fetchError) throw fetchError;

      if (!shift.original_dhl_data) {
        return {
          success: false,
          message: 'Směna nemá uložená původní DHL data'
        };
      }

      // Type check for original_dhl_data
      const originalData = shift.original_dhl_data as any;
      if (!originalData || typeof originalData !== 'object') {
        return {
          success: false,
          message: 'Neplatná původní DHL data'
        };
      }

      // Obnovení na původní stav
      const { error: updateError } = await supabase
        .from('shifts')
        .update({
          dhl_override: false,
          notes: `Automaticky vygenerováno - ${originalData.start_time || 'N/A'} - ${originalData.end_time || 'N/A'}`
        })
        .eq('id', shiftId)
        .eq('user_id', userId);

      if (updateError) throw updateError;

      // Vytvoření notifikace o obnovení směny
      await supabase
        .from('dhl_notifications')
        .insert({
          user_id: userId,
          shift_id: shiftId,
          notification_type: 'shift_changed',
          title: 'DHL směna obnovena',
          message: `Směna na ${shift.date} byla obnovena na původní DHL nastavení.`,
          metadata: {
            restored_date: new Date().toISOString()
          }
        });

      return {
        success: true,
        message: 'Směna byla obnovena na původní stav'
      };

    } catch (error) {
      console.error('Chyba při obnovování DHL směny:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Neočekávaná chyba při obnovování směny'
      };
    }
  }
}

export default DHLShiftService;
