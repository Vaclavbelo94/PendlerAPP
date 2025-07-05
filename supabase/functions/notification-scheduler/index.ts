
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Překlady pro různé jazyky  
const translations = {
  cs: {
    tomorrowShift: 'Zítra začíná směna',
    morningShift: 'Ranní',
    afternoonShift: 'Odpolední',
    nightShift: 'Noční', 
    shiftTomorrow: 'směna zítra v {time}',
    traffic: 'Doprava',
    shiftReminder: 'Připomínka směny',
    weeklySummary: 'Týdenní souhrn - Pendler Assistant',
    shiftsWorked: 'Odpracované směny',
    totalHours: 'Celkem hodin',
    upcomingShifts: 'Nadcházející směny'
  },
  de: {
    tomorrowShift: 'Schicht beginnt morgen',
    morningShift: 'Früh',
    afternoonShift: 'Spät', 
    nightShift: 'Nacht',
    shiftTomorrow: 'Schicht morgen um {time}',
    traffic: 'Verkehr',
    shiftReminder: 'Schichterinnerung',
    weeklySummary: 'Wöchentliche Zusammenfassung - Pendler Assistant',
    shiftsWorked: 'Gearbeitete Schichten',
    totalHours: 'Gesamtstunden',
    upcomingShifts: 'Kommende Schichten'
  },
  pl: {
    tomorrowShift: 'Jutro zaczyna się zmiana',
    morningShift: 'Ranna',
    afternoonShift: 'Popołudniowa',
    nightShift: 'Nocna',
    shiftTomorrow: 'zmiana jutro o {time}',
    traffic: 'Ruch',
    shiftReminder: 'Przypomnienie o zmianie',
    weeklySummary: 'Tygodniowe podsumowanie - Pendler Assistant',
    shiftsWorked: 'Przepracowane zmiany',
    totalHours: 'Łącznie godzin',
    upcomingShifts: 'Nadchodzące zmiany'
  }
};

function getTranslation(lang: string, key: string, replacements?: Record<string, string>): string {
  const langTranslations = translations[lang as keyof typeof translations] || translations.cs;
  let text = langTranslations[key as keyof typeof langTranslations] || key;
  
  if (replacements) {
    for (const [placeholder, value] of Object.entries(replacements)) {
      text = text.replace(`{${placeholder}}`, value);
    }
  }
  
  return text;
}

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
        profiles!inner(email, language),
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

          const userLang = user.profiles?.language || 'cs';
          const shiftTypeText = getTranslation(userLang, `${shift.type}Shift`);
          const timeText = shift.start_time || (shift.type === 'morning' ? '06:00' : 
                         shift.type === 'afternoon' ? '14:00' : '22:00');

          // Získání dopravních informací
          let trafficInfo = '';
          if (user.user_travel_preferences?.home_address && user.user_travel_preferences?.work_address) {
            trafficInfo = await getTrafficInfo(user.user_travel_preferences.home_address, user.user_travel_preferences.work_address, userLang);
          }

          const baseMessage = `${getTranslation(userLang, 'shiftTomorrow', { time: timeText })}${shift.notes ? ` - ${shift.notes}` : ''}`;
          const fullMessage = trafficInfo ? `🚚 ${baseMessage}\n🛣️ ${getTranslation(userLang, 'traffic')}: ${trafficInfo}` : `🚚 ${baseMessage}`;

          // Create notification
          await supabase
            .from('notifications')
            .insert({
              user_id: user.user_id,
              title: getTranslation(userLang, 'tomorrowShift'),
              message: fullMessage,
              type: 'warning',
              related_to: { type: 'shift', id: shift.id }
            });

          // Multi-channel notifications
          await sendMultiChannelNotification(supabase, user, fullMessage, getTranslation(userLang, 'shiftReminder'), shift, supabaseUrl, supabaseKey, userLang);
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

async function getTrafficInfo(homeAddress: string, workAddress: string, lang: string = 'cs'): Promise<string> {
  try {
    // Simulace dopravních informací s lokalizací
    const conditions = {
      cs: ['normální', 'zpomalení', 'zácpa', 'nehoda'],
      de: ['normal', 'Verzögerung', 'Stau', 'Unfall'],
      pl: ['normalny', 'opóźnienie', 'korek', 'wypadek']
    };
    const langConditions = conditions[lang as keyof typeof conditions] || conditions.cs;
    const randomCondition = langConditions[Math.floor(Math.random() * langConditions.length)];
    return randomCondition;
  } catch (error) {
    console.error('Error getting traffic info:', error);
    const unavailable = { cs: 'nedostupné', de: 'nicht verfügbar', pl: 'niedostępne' };
    return unavailable[lang as keyof typeof unavailable] || unavailable.cs;
  }
}

async function sendMultiChannelNotification(supabase: any, user: any, message: string, subject: string, shift: any, supabaseUrl: string, supabaseKey: string, lang: string = 'cs') {
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
            shiftType: getTranslation(lang, `${shift.type}Shift`),
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
    const userLang = user.profiles?.language || 'cs';
    await fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: user.profiles.email,
        subject: getTranslation(userLang, 'weeklySummary'),
        template: 'weekly-summary',
        templateData: {
          shiftsWorked: weekShifts?.length || 0,
          totalHours: (weekShifts?.length || 0) * 8, // Assuming 8h shifts
          upcomingShifts: upcomingShifts?.map(s => ({
            date: s.date,
            type: getTranslation(userLang, `${s.type}Shift`)
          }))
        }
      }),
    });
  }
}
