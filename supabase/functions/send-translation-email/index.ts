
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TranslationEmailRequest {
  email: string;
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
}

serve(async (req) => {
  console.log('[EMAIL DEBUG] Function called at:', new Date().toISOString());
  console.log('[EMAIL DEBUG] Request method:', req.method);

  if (req.method === 'OPTIONS') {
    console.log('[EMAIL DEBUG] Handling OPTIONS request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[EMAIL DEBUG] Processing request body...');
    const requestBody = await req.json();
    console.log('[EMAIL DEBUG] Request body received:', {
      ...requestBody,
      originalText: requestBody.originalText?.substring(0, 50) + '...',
      translatedText: requestBody.translatedText?.substring(0, 50) + '...'
    });

    const { 
      email, 
      originalText, 
      translatedText, 
      sourceLanguage, 
      targetLanguage 
    }: TranslationEmailRequest = requestBody;
    
    // Validace vstupních dat
    if (!email || !originalText || !translatedText) {
      console.error('[EMAIL ERROR] Missing required fields:', {
        hasEmail: !!email,
        hasOriginalText: !!originalText,
        hasTranslatedText: !!translatedText
      });
      throw new Error('Chybí povinná pole pro odeslání emailu');
    }

    console.log('[EMAIL DEBUG] Getting user info from auth...');
    // Získat informace o uživateli z auth tokenu
    const authHeader = req.headers.get('authorization');
    let userInfo = {
      email: 'Anonymní uživatel',
      id: 'neznámé ID'
    };

    if (authHeader) {
      try {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_ANON_KEY') ?? '',
          {
            global: {
              headers: { Authorization: authHeader },
            },
          }
        );

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          userInfo = {
            email: user.email || 'Neznámý email',
            id: user.id
          };
          console.log('[EMAIL DEBUG] User info retrieved:', userInfo.email);
        }
      } catch (error) {
        console.log('[EMAIL DEBUG] Error getting user info:', error);
      }
    }
    
    // Zkontrolovat RESEND_API_KEY
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error('[EMAIL ERROR] RESEND_API_KEY not found in environment variables');
      throw new Error('RESEND_API_KEY není nakonfigurován');
    }
    console.log('[EMAIL DEBUG] RESEND_API_KEY found:', resendApiKey.substring(0, 10) + '...' + resendApiKey.slice(-4));

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('cs-CZ');
    const formattedTime = currentDate.toLocaleTimeString('cs-CZ');

    // Zjednodušený HTML obsah pro testování
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>HR Zpráva</title>
      </head>
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">HR Zpráva od zaměstnance</h1>
          
          <div style="background: #f5f5f5; padding: 15px; margin: 15px 0; border-radius: 5px;">
            <h3>Informace o uživateli</h3>
            <p><strong>Email:</strong> ${userInfo.email}</p>
            <p><strong>ID:</strong> ${userInfo.id}</p>
            <p><strong>Datum:</strong> ${formattedDate} v ${formattedTime}</p>
          </div>
          
          <div style="background: #e8f4fd; padding: 15px; margin: 15px 0; border-radius: 5px;">
            <h3>Původní zpráva (${sourceLanguage}):</h3>
            <p>${originalText}</p>
          </div>
          
          <div style="background: #e8f5e8; padding: 15px; margin: 15px 0; border-radius: 5px;">
            <h3>Německý překlad:</h3>
            <p><strong>${translatedText}</strong></p>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; margin: 15px 0; border-radius: 5px;">
            <p><strong>Doporučení:</strong> Odpovězte na email: ${userInfo.email}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailData = {
      from: 'Pendler Assistant <onboarding@resend.dev>',
      to: [email],
      subject: `HR Zpráva od ${userInfo.email} - ${formattedDate}`,
      html: htmlContent,
    };

    console.log('[EMAIL DEBUG] Preparing to send email to:', email);
    console.log('[EMAIL DEBUG] Email subject:', emailData.subject);

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    console.log('[EMAIL DEBUG] Resend API response status:', response.status);
    console.log('[EMAIL DEBUG] Resend API response headers:', Object.fromEntries(response.headers));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[EMAIL ERROR] Resend API error:', response.status, errorText);
      throw new Error(`Chyba Resend API: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('[EMAIL SUCCESS] Email sent successfully:', result);

    return new Response(JSON.stringify({ 
      success: true, 
      messageId: result.id,
      userInfo: userInfo,
      debug: {
        timestamp: new Date().toISOString(),
        emailTo: email,
        resendId: result.id
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[EMAIL ERROR] Complete error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    return new Response(JSON.stringify({ 
      error: error.message,
      debug: {
        timestamp: new Date().toISOString(),
        errorType: error.name
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
