
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

    // Nejprve zpracování fronty okamžitých notifikací
    await processImmediateNotifications(supabase, supabaseUrl, supabaseKey);

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
        sms_notifications,
        push_notifications,
        sms_reminder_advance,
        reminder_time,
        profiles!inner(email),
        user_work_data(phone_number, phone_country_code),
        user_travel_preferences(home_address, work_address)
      `)
      .eq('shift_reminders', true);

    if (usersError) {
      console.error('Error fetching users:', usersError);
      throw usersError;
    }

    let processedCount = 0;
    let emailsSent = 0;
    let smsSent = 0;
    let pushSent = 0;

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
          const timeText = shift.start_time || (shift.type === 'morning' ? '06:00' : 
                         shift.type === 'afternoon' ? '14:00' : '22:00');

          // Získání dopravních informací
          let trafficInfo = '';
          if (user.user_travel_preferences?.home_address && user.user_travel_preferences?.work_address) {
            trafficInfo = await getTrafficInfo(user.user_travel_preferences.home_address, user.user_travel_preferences.work_address);
          }

          const baseMessage = `${shiftTypeText} směna zítra v ${timeText}${shift.notes ? ` - ${shift.notes}` : ''}`;
          const fullMessage = trafficInfo ? `🚚 ${baseMessage}\n🛣️ Doprava: ${trafficInfo}` : `🚚 ${baseMessage}`;

          // Create notification
          await supabase
            .from('notifications')
            .insert({
              user_id: user.user_id,
              title: 'Zítra začíná směna',
              message: fullMessage,
              type: 'warning',
              related_to: { type: 'shift', id: shift.id }
            });

          // Multi-channel notifications
          await sendMultiChannelNotification(supabase, user, fullMessage, 'Připomínka směny', shift, supabaseUrl, supabaseKey);
        }

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
      smsSent,
      pushSent,
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

async function processImmediateNotifications(supabase: any, supabaseUrl: string, supabaseKey: string) {
  // Spuštění edge funkce pro okamžité notifikace
  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/send-immediate-notification`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Immediate notifications processed:', result);
    }
  } catch (error) {
    console.error('Error processing immediate notifications:', error);
  }
}

async function getTrafficInfo(homeAddress: string, workAddress: string): Promise<string> {
  try {
    // Simulace dopravních informací - v reálném prostředí by se volalo Google Maps API
    const conditions = ['normální', 'zpomalení', 'zácpa', 'nehoda'];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    return randomCondition;
  } catch (error) {
    console.error('Error getting traffic info:', error);
    return 'nedostupné';
  }
}

async function sendMultiChannelNotification(supabase: any, user: any, message: string, subject: string, shift: any, supabaseUrl: string, supabaseKey: string) {
  let notificationSent = false;

  // 1. Push notifikace (prioritní)
  if (user.push_notifications && user.device_token) {
    try {
      // Simulace push notifikace
      console.log('Push notification sent to:', user.device_token);
      notificationSent = true;
      // pushSent++; // Toto bude potřeba přidat do kontextu
    } catch (error) {
      console.error('Push notification failed:', error);
    }
  }

  // 2. SMS fallback
  if (!notificationSent && user.sms_notifications && user.user_work_data?.phone_number) {
    try {
      const phoneNumber = `+${user.user_work_data.phone_country_code || '420'}${user.user_work_data.phone_number}`;
      
      const smsResponse = await fetch(`${supabaseUrl}/functions/v1/send-sms`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
          message: message.length > 160 ? message.substring(0, 157) + '...' : message,
          userId: user.user_id,
          smsType: 'shift-reminder',
          relatedTo: { type: 'shift', id: shift.id }
        }),
      });

      if (smsResponse.ok) {
        notificationSent = true;
        console.log('SMS sent successfully');
        // smsSent++; // Toto bude potřeba přidat do kontextu
      }
    } catch (error) {
      console.error('SMS sending failed:', error);
    }
  }

  // 3. Email fallback
  if (!notificationSent && user.email_notifications && user.profiles?.email) {
    try {
      const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: user.profiles.email,
          subject: subject,
          template: 'shift-reminder',
          templateData: {
            shiftType: shift.type === 'morning' ? 'Ranní' : shift.type === 'afternoon' ? 'Odpolední' : 'Noční',
            date: shift.date,
            time: shift.start_time,
            notes: shift.notes,
            message: message
          }
        }),
      });

      if (emailResponse.ok) {
        notificationSent = true;
        console.log('Email sent successfully');
        // emailsSent++; // Toto bude potřeba přidat do kontextu
      }
    } catch (error) {
      console.error('Email sending failed:', error);
    }
  }
}

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
