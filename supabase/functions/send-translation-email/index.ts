
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
    const { 
      email, 
      originalText, 
      translatedText, 
      sourceLanguage, 
      targetLanguage 
    }: TranslationEmailRequest = await req.json();
    
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
        console.log('Chyba při získávání uživatele:', error);
      }
    }
    
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not found in environment variables');
      throw new Error('RESEND_API_KEY not configured');
    }

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('cs-CZ');
    const formattedTime = currentDate.toLocaleTimeString('cs-CZ');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .email-container { font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; background: #ffffff; }
          .footer { padding: 20px; background: #f8f9fa; text-align: center; color: #6c757d; font-size: 14px; }
          .user-info { background: #e3f2fd; border-left: 4px solid #2196f3; padding: 20px; margin: 20px 0; border-radius: 4px; }
          .translation-card { background: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 4px; }
          .metadata { background: #e9ecef; padding: 15px; border-radius: 4px; margin: 20px 0; }
          .text-section { margin: 15px 0; }
          .label { font-weight: bold; color: #495057; margin-bottom: 5px; }
          .text-content { background: white; padding: 15px; border-radius: 4px; border: 1px solid #dee2e6; }
          .highlight { background: #fff3cd; padding: 10px; border-radius: 4px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>📧 Zpráva od zaměstnance pro HR</h1>
            <p>Pendler Assistant - Komunikace s HR oddělením</p>
          </div>
          <div class="content">
            <div class="user-info">
              <h3>👤 Informace o uživateli</h3>
              <p><strong>Email uživatele:</strong> ${userInfo.email}</p>
              <p><strong>ID uživatele:</strong> ${userInfo.id}</p>
              <p><strong>Datum a čas:</strong> ${formattedDate} v ${formattedTime}</p>
            </div>

            <div class="highlight">
              <p><strong>⚠️ Urgentní zpráva z mobilního zařízení</strong></p>
              <p>Tato zpráva byla odeslána pravděpodobně z auta nebo při pracovní cestě pomocí hlasového zadání.</p>
            </div>
            
            <div class="metadata">
              <h3>📋 Informace o překladu</h3>
              <p><strong>Zdrojový jazyk:</strong> ${sourceLanguage}</p>
              <p><strong>Cílový jazyk:</strong> ${targetLanguage}</p>
            </div>
            
            <div class="translation-card">
              <div class="text-section">
                <div class="label">📝 Původní zpráva (${sourceLanguage}):</div>
                <div class="text-content">${originalText}</div>
              </div>
              
              <div class="text-section">
                <div class="label">🇩🇪 Německý překlad:</div>
                <div class="text-content"><strong>${translatedText}</strong></div>
              </div>
            </div>
            
            <div style="background: #d4edda; padding: 15px; border-radius: 4px; margin: 20px 0; border: 1px solid #c3e6cb;">
              <p><strong>💡 Doporučení pro HR:</strong></p>
              <p>Prosím odpovězte uživateli na email: <strong>${userInfo.email}</strong></p>
              <p>Zpráva byla odeslána automaticky přes Pendler Assistant aplikaci během ${formattedDate} v ${formattedTime}.</p>
            </div>
          </div>
          <div class="footer">
            <p>Pendler Assistant - Tvůj pomocník pro práci v Německu</p>
            <p>Automaticky generovaný email z HR komunikačního modulu</p>
            <p style="font-size: 12px; color: #999;">ID zprávy: ${Date.now()}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailData = {
      from: 'Pendler Assistant <onboarding@resend.dev>',
      to: email,
      subject: `🚨 HR Zpráva od ${userInfo.email} - ${formattedDate} ${formattedTime}`,
      html: htmlContent,
    };

    console.log('Sending HR email to:', email);
    console.log('User info:', userInfo);
    console.log('Email data:', JSON.stringify(emailData, null, 2));

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
      console.error('Resend API error:', response.status, errorText);
      throw new Error(`Email sending failed: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log('HR Email sent successfully:', result);

    return new Response(JSON.stringify({ 
      success: true, 
      messageId: result.id,
      userInfo: userInfo
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('HR Email sending error:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
