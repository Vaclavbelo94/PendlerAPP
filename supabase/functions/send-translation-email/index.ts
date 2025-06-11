
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
    
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
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
          .translation-card { background: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 4px; }
          .metadata { background: #e9ecef; padding: 15px; border-radius: 4px; margin: 20px 0; }
          .text-section { margin: 15px 0; }
          .label { font-weight: bold; color: #495057; margin-bottom: 5px; }
          .text-content { background: white; padding: 15px; border-radius: 4px; border: 1px solid #dee2e6; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>Překladový report</h1>
            <p>AI Překladač CZ/PL → DE</p>
          </div>
          <div class="content">
            <div class="metadata">
              <h3>Informace o překladu</h3>
              <p><strong>Datum:</strong> ${formattedDate}</p>
              <p><strong>Čas:</strong> ${formattedTime}</p>
              <p><strong>Zdrojový jazyk:</strong> ${sourceLanguage}</p>
              <p><strong>Cílový jazyk:</strong> ${targetLanguage}</p>
            </div>
            
            <div class="translation-card">
              <div class="text-section">
                <div class="label">Původní text (${sourceLanguage}):</div>
                <div class="text-content">${originalText}</div>
              </div>
              
              <div class="text-section">
                <div class="label">Překlad (${targetLanguage}):</div>
                <div class="text-content">${translatedText}</div>
              </div>
            </div>
            
            <p>Tento překlad byl vytvořen pomocí AI překladače Pendler Assistant.</p>
          </div>
          <div class="footer">
            <p>Pendler Assistant - Tvůj pomocník pro práci v Německu</p>
            <p>Automaticky generovaný email z AI překladače</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailData = {
      from: 'Pendler Assistant <noreply@pendler.cz>',
      to: email,
      subject: `Překlad z ${sourceLanguage} do ${targetLanguage} - ${formattedDate}`,
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
      console.error('Resend API error:', response.status, errorText);
      throw new Error(`Email sending failed: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log('Email sent successfully:', result);

    return new Response(JSON.stringify({ 
      success: true, 
      messageId: result.id 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Email sending error:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
