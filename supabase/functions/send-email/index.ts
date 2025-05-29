
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  to: string;
  subject: string;
  template: 'shift-reminder' | 'weekly-summary' | 'welcome' | 'system-notification';
  templateData?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, template, templateData }: EmailRequest = await req.json();
    
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const htmlContent = generateEmailTemplate(template, templateData);

    const emailData = {
      from: 'Pendler Assistant <noreply@pendler.cz>',
      to: [to],
      subject,
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

    const result = await response.json();
    
    if (!response.ok) {
      console.error('Resend API error:', result);
      throw new Error(`Email sending failed: ${result.message}`);
    }

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

function generateEmailTemplate(template: string, data: any): string {
  const baseStyle = `
    <style>
      .email-container { font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; }
      .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
      .content { padding: 30px; background: #ffffff; }
      .footer { padding: 20px; background: #f8f9fa; text-align: center; color: #6c757d; font-size: 14px; }
      .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0; }
      .shift-card { background: #f8f9fa; border-left: 4px solid #667eea; padding: 16px; margin: 16px 0; }
    </style>
  `;

  switch (template) {
    case 'shift-reminder':
      return `
        <!DOCTYPE html>
        <html>
        <head>${baseStyle}</head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>Připomínka směny</h1>
            </div>
            <div class="content">
              <h2>Ahoj!</h2>
              <p>Připomínáme ti nadcházející směnu:</p>
              <div class="shift-card">
                <h3>${data.shiftType || 'Směna'}</h3>
                <p><strong>Datum:</strong> ${data.date}</p>
                <p><strong>Čas:</strong> ${data.time}</p>
                ${data.notes ? `<p><strong>Poznámky:</strong> ${data.notes}</p>` : ''}
              </div>
              <p>Přejeme ti úspěšnou směnu!</p>
            </div>
            <div class="footer">
              <p>Pendler Assistant - Tvůj pomocník pro práci v Německu</p>
            </div>
          </div>
        </body>
        </html>
      `;

    case 'weekly-summary':
      return `
        <!DOCTYPE html>
        <html>
        <head>${baseStyle}</head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>Týdenní souhrn</h1>
            </div>
            <div class="content">
              <h2>Ahoj!</h2>
              <p>Zde je tvůj týdenní souhrn:</p>
              <div class="shift-card">
                <h3>Statistiky tohoto týdne</h3>
                <p><strong>Odpracované směny:</strong> ${data.shiftsWorked || 0}</p>
                <p><strong>Celkové hodiny:</strong> ${data.totalHours || 0}</p>
                <p><strong>Nová slovíčka:</strong> ${data.newWords || 0}</p>
              </div>
              ${data.upcomingShifts ? `
              <div class="shift-card">
                <h3>Nadcházející směny</h3>
                ${data.upcomingShifts.map((shift: any) => 
                  `<p>${shift.date} - ${shift.type} směna</p>`
                ).join('')}
              </div>
              ` : ''}
            </div>
            <div class="footer">
              <p>Pendler Assistant - Tvůj pomocník pro práci v Německu</p>
            </div>
          </div>
        </body>
        </html>
      `;

    case 'welcome':
      return `
        <!DOCTYPE html>
        <html>
        <head>${baseStyle}</head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>Vítej v Pendler Assistant!</h1>
            </div>
            <div class="content">
              <h2>Ahoj ${data.userName || ''}!</h2>
              <p>Vítáme tě v aplikaci Pendler Assistant - tvém pomocníkovi pro práci v Německu.</p>
              <p>S naší aplikací můžeš:</p>
              <ul>
                <li>Spravovat své směny a rozpis</li>
                <li>Učit se německá slovíčka pro práci</li>
                <li>Získat právní poradenství</li>
                <li>Plánovat své cesty</li>
              </ul>
              <a href="${data.appUrl || 'https://app.pendler.cz'}" class="button">Začít používat</a>
            </div>
            <div class="footer">
              <p>Pendler Assistant - Tvůj pomocník pro práci v Německu</p>
            </div>
          </div>
        </body>
        </html>
      `;

    case 'system-notification':
      return `
        <!DOCTYPE html>
        <html>
        <head>${baseStyle}</head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>Systémové oznámení</h1>
            </div>
            <div class="content">
              <h2>${data.title || 'Oznámení'}</h2>
              <p>${data.message || 'Máme pro tebe důležité oznámení.'}</p>
              ${data.actionUrl ? `<a href="${data.actionUrl}" class="button">Zobrazit detail</a>` : ''}
            </div>
            <div class="footer">
              <p>Pendler Assistant - Tvůj pomocník pro práci v Německu</p>
            </div>
          </div>
        </body>
        </html>
      `;

    default:
      return `
        <!DOCTYPE html>
        <html>
        <head>${baseStyle}</head>
        <body>
          <div class="email-container">
            <div class="content">
              <p>Email template not found</p>
            </div>
          </div>
        </body>
        </html>
      `;
  }
}
