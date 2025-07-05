import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Překlady pro různé jazyky
const translations = {
  cs: {
    shiftChange: '🔄 ZMĚNA SMĚNY',
    morningShift: 'Ranní',
    afternoonShift: 'Odpolední', 
    nightShift: 'Noční',
    shiftChangedFrom: 'směna {date} změněna z {oldTime} na {newTime}',
    immediateNotification: 'Změna směny - okamžité upozornění',
    shiftNotification: 'Upozornění o změně směny',
    notification: 'Upozornění'
  },
  de: {
    shiftChange: '🔄 SCHICHTÄNDERUNG',
    morningShift: 'Früh',
    afternoonShift: 'Spät',
    nightShift: 'Nacht',
    shiftChangedFrom: 'Schicht {date} von {oldTime} auf {newTime} geändert',
    immediateNotification: 'Schichtänderung - sofortige Benachrichtigung',
    shiftNotification: 'Benachrichtigung über Schichtänderung',
    notification: 'Benachrichtigung'
  },
  pl: {
    shiftChange: '🔄 ZMIANA ZMIANY',
    morningShift: 'Ranna',
    afternoonShift: 'Popołudniowa',
    nightShift: 'Nocna',
    shiftChangedFrom: 'zmiana {date} zmieniona z {oldTime} na {newTime}',
    immediateNotification: 'Zmiana zmiany - natychmiastowe powiadomienie',
    shiftNotification: 'Powiadomienie o zmianie zmiany',
    notification: 'Powiadomienie'
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

    // Zpracování fronty notifikací
    const { data: queueItems, error: queueError } = await supabase
      .from('notification_queue')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(10);

    if (queueError) {
      console.error('Error fetching queue:', queueError);
      throw queueError;
    }

    let processedCount = 0;
    let sentNotifications = 0;

    for (const item of queueItems || []) {
      try {
        // Načtení uživatelských preferencí
        const { data: preferences, error: prefError } = await supabase
          .from('user_notification_preferences')
          .select(`
            *,
            profiles!inner(email, language),
            user_work_data(phone_number, phone_country_code)
          `)
          .eq('user_id', item.user_id)
          .eq('immediate_notifications', true)
          .single();

        if (prefError || !preferences) {
          console.log(`No preferences found for user ${item.user_id}`);
          continue;
        }

        const messageData = item.message_data;
        const userLang = preferences.profiles?.language || 'cs';
        let message = '';
        let subject = '';

        // Sestavení zprávy podle typu s lokalizací
        switch (item.notification_type) {
          case 'shift_change':
            const shiftTypeText = getTranslation(userLang, `${messageData.shift_type}Shift`);
            message = `${getTranslation(userLang, 'shiftChange')}: ${getTranslation(userLang, 'shiftChangedFrom', {
              date: messageData.date,
              oldTime: messageData.old_time,
              newTime: messageData.new_time
            })}`;
            subject = getTranslation(userLang, 'immediateNotification');
            break;
          default:
            message = getTranslation(userLang, 'shiftNotification');
            subject = getTranslation(userLang, 'notification');
        }

        let notificationSent = false;

        // 1. Pokus o push notifikaci (pokud je povolena a má device token)
        if (preferences.push_notifications && preferences.device_token) {
          try {
            // Simulace push notifikace
            console.log('Sending push notification to device:', preferences.device_token);
            console.log('Push message:', message);
            
            // Pro skutečné push notifikace by zde bylo volání FCM API
            notificationSent = true;
            
          } catch (pushError) {
            console.error('Push notification failed:', pushError);
          }
        }

        // 2. Fallback na SMS (pokud push selhala a SMS je povolena)
        if (!notificationSent && preferences.sms_notifications && preferences.user_work_data?.phone_number) {
          try {
            const phoneNumber = `+${preferences.user_work_data.phone_country_code}${preferences.user_work_data.phone_number}`;
            
            const smsResponse = await fetch(`${supabaseUrl}/functions/v1/send-sms`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                phoneNumber: phoneNumber,
                message: message,
                userId: item.user_id,
                smsType: 'immediate_shift_change',
                relatedTo: messageData
              }),
            });

            if (smsResponse.ok) {
              notificationSent = true;
              console.log('SMS sent successfully for immediate notification');
            }
          } catch (smsError) {
            console.error('SMS fallback failed:', smsError);
          }
        }

        // 3. Fallback na email
        if (!notificationSent && preferences.email_notifications && preferences.profiles?.email) {
          try {
            const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                to: preferences.profiles.email,
                subject: subject,
                template: 'immediate-notification',
                templateData: {
                  message: message,
                  details: messageData
                }
              }),
            });

            if (emailResponse.ok) {
              notificationSent = true;
              console.log('Email sent successfully for immediate notification');
            }
          } catch (emailError) {
            console.error('Email fallback failed:', emailError);
          }
        }

        if (notificationSent) {
          sentNotifications++;
        }

        // Označení jako zpracováno
        await supabase
          .from('notification_queue')
          .update({
            status: 'processed',
            processed_at: new Date().toISOString()
          })
          .eq('id', item.id);

        processedCount++;

      } catch (itemError) {
        console.error(`Error processing queue item ${item.id}:`, itemError);
        
        // Označení jako failed
        await supabase
          .from('notification_queue')
          .update({
            status: 'failed',
            processed_at: new Date().toISOString()
          })
          .eq('id', item.id);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      processedItems: processedCount,
      sentNotifications: sentNotifications,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Immediate notification error:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});