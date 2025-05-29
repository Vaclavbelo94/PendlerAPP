
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Get users with shift reminders enabled
    const { data: users, error: usersError } = await supabase
      .from('user_notification_preferences')
      .select(`
        user_id,
        shift_reminders,
        weekly_summaries,
        email_notifications,
        reminder_time,
        profiles!inner(email)
      `)
      .eq('shift_reminders', true);

    if (usersError) {
      console.error('Error fetching users:', usersError);
      throw usersError;
    }

    let processedCount = 0;
    let emailsSent = 0;

    for (const user of users || []) {
      try {
        // Check for tomorrow's shifts
        const { data: shifts, error: shiftsError } = await supabase
          .from('shifts')
          .select('*')
          .eq('user_id', user.user_id)
          .eq('date', tomorrow);

        if (shiftsError) {
          console.error(`Error fetching shifts for user ${user.user_id}:`, shiftsError);
          continue;
        }

        for (const shift of shifts || []) {
          // Check if notification already sent today
          const { data: existingNotif } = await supabase
            .from('notifications')
            .select('id')
            .eq('user_id', user.user_id)
            .eq('type', 'warning')
            .contains('related_to', { type: 'shift', id: shift.id })
            .gte('created_at', today + 'T00:00:00Z')
            .single();

          if (existingNotif) continue;

          const shiftTypeText = shift.type === 'morning' ? 'Ranní' : 
                              shift.type === 'afternoon' ? 'Odpolední' : 'Noční';
          const timeText = shift.type === 'morning' ? '6:00' : 
                         shift.type === 'afternoon' ? '14:00' : '22:00';

          // Create notification
          await supabase
            .from('notifications')
            .insert({
              user_id: user.user_id,
              title: 'Zítra začíná směna',
              message: `${shiftTypeText} směna začíná zítra v ${timeText}${shift.notes ? ` - ${shift.notes}` : ''}`,
              type: 'warning',
              related_to: { type: 'shift', id: shift.id }
            });

          // Send email if enabled
          if (user.email_notifications && user.profiles?.email) {
            try {
              const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${supabaseKey}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  to: user.profiles.email,
                  subject: 'Připomínka směny - zítra',
                  template: 'shift-reminder',
                  templateData: {
                    shiftType: shiftTypeText,
                    date: tomorrow,
                    time: timeText,
                    notes: shift.notes
                  }
                }),
              });

              if (emailResponse.ok) {
                emailsSent++;
                
                // Log email
                await supabase
                  .from('email_logs')
                  .insert({
                    user_id: user.user_id,
                    email_type: 'shift-reminder',
                    recipient_email: user.profiles.email,
                    subject: 'Připomínka směny - zítra',
                    status: 'sent'
                  });
              }
            } catch (emailError) {
              console.error('Email sending failed:', emailError);
              
              // Log failed email
              await supabase
                .from('email_logs')
                .insert({
                  user_id: user.user_id,
                  email_type: 'shift-reminder',
                  recipient_email: user.profiles.email,
                  subject: 'Připomínka směny - zítra',
                  status: 'failed',
                  error_message: emailError.message
                });
            }
          }
        }

        // Weekly summary logic (run on Sundays)
        if (now.getDay() === 0 && user.weekly_summaries) {
          await sendWeeklySummary(supabase, user, supabaseUrl, supabaseKey);
        }

        processedCount++;
      } catch (userError) {
        console.error(`Error processing user ${user.user_id}:`, userError);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      processedUsers: processedCount,
      emailsSent,
      timestamp: now.toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Notification scheduler error:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function sendWeeklySummary(supabase: any, user: any, supabaseUrl: string, supabaseKey: string) {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const today = new Date().toISOString().split('T')[0];
  
  // Get week stats
  const { data: weekShifts } = await supabase
    .from('shifts')
    .select('*')
    .eq('user_id', user.user_id)
    .gte('date', weekAgo)
    .lte('date', today);

  const { data: upcomingShifts } = await supabase
    .from('shifts')
    .select('*')
    .eq('user_id', user.user_id)
    .gt('date', today)
    .limit(5);

  if (user.email_notifications && user.profiles?.email) {
    await fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: user.profiles.email,
        subject: 'Týdenní souhrn - Pendler Assistant',
        template: 'weekly-summary',
        templateData: {
          shiftsWorked: weekShifts?.length || 0,
          totalHours: (weekShifts?.length || 0) * 8, // Assuming 8h shifts
          upcomingShifts: upcomingShifts?.map(s => ({
            date: s.date,
            type: s.type === 'morning' ? 'Ranní' : s.type === 'afternoon' ? 'Odpolední' : 'Noční'
          }))
        }
      }),
    });
  }
}
