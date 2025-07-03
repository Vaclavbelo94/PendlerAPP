
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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    const { 
      email, 
      originalText, 
      translatedText, 
      sourceLanguage, 
      targetLanguage 
    }: TranslationEmailRequest = requestBody;
    
    // Validace vstupních dat
    if (!email || !originalText || !translatedText) {
      throw new Error('Chybí povinná pole pro odeslání emailu');
    }

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
        }
      } catch (error) {
        console.log('Error getting user info:', error);
      }
    }
    
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY není nakonfigurován');
    }

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('cs-CZ');
    const formattedTime = currentDate.toLocaleTimeString('cs-CZ');

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
      to: ['vaclavbelo94@gmail.com'], // Používáme ověřený email
      subject: `HR Zpráva od ${userInfo.email} - ${formattedDate}`,
      html: htmlContent,
    };

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Chyba Resend API: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    return new Response(JSON.stringify({ 
      success: true, 
      messageId: result.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Email error:', error.message);
    
    return new Response(JSON.stringify({ 
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
