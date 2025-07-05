import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SMSRequest {
  phoneNumber: string;
  message: string;
  userId?: string;
  smsType?: string;
  relatedTo?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { phoneNumber, message, userId, smsType = 'general', relatedTo }: SMSRequest = await req.json();

    console.log('SMS Request:', { phoneNumber, message, userId, smsType });

    // Validace telefonního čísla (mezinárodní formát)
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      throw new Error('Neplatné telefonní číslo. Použijte mezinárodní formát (+420...)');
    }

    // Rate limiting - kontrola počtu SMS za den
    if (userId) {
      const today = new Date().toISOString().split('T')[0];
      const { data: todaysSMS, error: countError } = await supabase
        .from('sms_logs')
        .select('id')
        .eq('user_id', userId)
        .gte('created_at', today + 'T00:00:00Z')
        .lte('created_at', today + 'T23:59:59Z');

      if (countError) {
        console.error('Error counting SMS:', countError);
      } else if (todaysSMS && todaysSMS.length >= 5) {
        throw new Error('Denní limit SMS byl překročen (5 SMS/den)');
      }
    }

    // Log SMS pokus do databáze
    const smsLogData = {
      user_id: userId,
      phone_number: phoneNumber,
      message: message,
      status: 'sending',
      sms_type: smsType,
      related_to: relatedTo,
    };

    const { data: smsLog, error: logError } = await supabase
      .from('sms_logs')
      .insert(smsLogData)
      .select()
      .single();

    if (logError) {
      console.error('Error logging SMS:', logError);
    }

    // Použití FreeSMS API (simulace - bude potřeba skutečný poskytovatel)
    let smsResult;
    try {
      // Pro demonstraci - používám simulaci úspěšného odeslání
      // V reálném prostředí zde bude volání na skutečné SMS API
      
      // Simulace API volání
      console.log('Sending SMS to:', phoneNumber);
      console.log('Message:', message);
      
      // Simulace úspěchu pro testování
      smsResult = {
        success: true,
        messageId: `sim_${Date.now()}`,
        status: 'sent'
      };

      // Pro skutečné použití s FreeSMS API:
      /*
      const smsResponse = await fetch('https://api.freesms.com/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_API_KEY'
        },
        body: JSON.stringify({
          to: phoneNumber,
          message: message,
          from: 'Pendler'
        })
      });
      
      smsResult = await smsResponse.json();
      */

    } catch (smsError) {
      console.error('SMS sending failed:', smsError);
      smsResult = {
        success: false,
        error: smsError.message || 'SMS odeslání selhalo'
      };
    }

    // Aktualizace SMS logu
    if (smsLog) {
      const updateData = {
        status: smsResult.success ? 'sent' : 'failed',
        sent_at: smsResult.success ? new Date().toISOString() : null,
        error_message: smsResult.success ? null : smsResult.error
      };

      await supabase
        .from('sms_logs')
        .update(updateData)
        .eq('id', smsLog.id);
    }

    if (!smsResult.success) {
      throw new Error(smsResult.error || 'SMS se nepodařilo odeslat');
    }

    return new Response(JSON.stringify({
      success: true,
      messageId: smsResult.messageId,
      status: 'sent'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('SMS function error:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});