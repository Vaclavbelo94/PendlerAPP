import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RecruitmentEmailRequest {
  firstName: string;
  lastName: string;
  city: string;
  phone: string;
  language?: string;
}

const serve_handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }

    const resend = new Resend(resendApiKey);
    const { firstName, lastName, city, phone, language = 'cs' }: RecruitmentEmailRequest = await req.json();

    console.log("Processing recruitment application:", { firstName, lastName, city, phone, language });

    // Generate email content based on language
    const getEmailContent = (lang: string) => {
      switch (lang) {
        case 'pl':
          return {
            subject: `DHL Rekrutacja - Nowa aplikacja: ${firstName} ${lastName}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #d40511; color: white; padding: 20px; text-align: center;">
                  <h1 style="margin: 0; font-size: 24px;">🚚 DHL Rekrutacja</h1>
                </div>
                
                <div style="padding: 30px; background: #f9f9f9;">
                  <h2 style="color: #d40511; margin-bottom: 20px;">Nowa aplikacja rekrutacyjna</h2>
                  
                  <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h3 style="color: #333; margin-top: 0;">Dane kandydata:</h3>
                    <p><strong>Imię:</strong> ${firstName}</p>
                    <p><strong>Nazwisko:</strong> ${lastName}</p>
                    <p><strong>Miasto:</strong> ${city}</p>
                    <p><strong>Telefon:</strong> ${phone}</p>
                    <p><strong>Język:</strong> ${lang}</p>
                  </div>
                  
                  <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px;">
                    <p style="margin: 0; color: #856404;">
                      <strong>Akcja wymagana:</strong> Skontaktuj się z kandydatem w celu omówienia możliwości zatrudnienia w centrum paczek w ${city}.
                    </p>
                  </div>
                </div>
                
                <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
                  Wysłano automatycznie przez system rekrutacyjny DHL
                </div>
              </div>
            `
          };
        case 'de':
          return {
            subject: `DHL Rekrutierung - Neue Bewerbung: ${firstName} ${lastName}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #d40511; color: white; padding: 20px; text-align: center;">
                  <h1 style="margin: 0; font-size: 24px;">🚚 DHL Rekrutierung</h1>
                </div>
                
                <div style="padding: 30px; background: #f9f9f9;">
                  <h2 style="color: #d40511; margin-bottom: 20px;">Neue Rekrutierungsbewerbung</h2>
                  
                  <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h3 style="color: #333; margin-top: 0;">Kandidatendaten:</h3>
                    <p><strong>Vorname:</strong> ${firstName}</p>
                    <p><strong>Nachname:</strong> ${lastName}</p>
                    <p><strong>Stadt:</strong> ${city}</p>
                    <p><strong>Telefon:</strong> ${phone}</p>
                    <p><strong>Sprache:</strong> ${lang}</p>
                  </div>
                  
                  <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px;">
                    <p style="margin: 0; color: #856404;">
                      <strong>Aktion erforderlich:</strong> Kontaktieren Sie den Kandidaten, um Beschäftigungsmöglichkeiten im Paketzentrum in ${city} zu besprechen.
                    </p>
                  </div>
                </div>
                
                <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
                  Automatisch vom DHL-Rekrutierungssystem gesendet
                </div>
              </div>
            `
          };
        default: // Czech
          return {
            subject: `DHL Nábor - Nová žádost: ${firstName} ${lastName}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #d40511; color: white; padding: 20px; text-align: center;">
                  <h1 style="margin: 0; font-size: 24px;">🚚 DHL Nábor</h1>
                </div>
                
                <div style="padding: 30px; background: #f9f9f9;">
                  <h2 style="color: #d40511; margin-bottom: 20px;">Nová náborová žádost</h2>
                  
                  <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h3 style="color: #333; margin-top: 0;">Údaje uchazeče:</h3>
                    <p><strong>Jméno:</strong> ${firstName}</p>
                    <p><strong>Příjmení:</strong> ${lastName}</p>
                    <p><strong>Město:</strong> ${city}</p>
                    <p><strong>Telefon:</strong> ${phone}</p>
                    <p><strong>Jazyk:</strong> ${lang}</p>
                  </div>
                  
                  <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px;">
                    <p style="margin: 0; color: #856404;">
                      <strong>Akce požadována:</strong> Kontaktujte uchazeče k projednání možností zaměstnání v balíkovém centru v ${city}.
                    </p>
                  </div>
                </div>
                
                <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
                  Odesláno automaticky náborovým systémem DHL
                </div>
              </div>
            `
          };
      }
    };

    const emailContent = getEmailContent(language);

    // Send email
    const emailResponse = await resend.emails.send({
      from: "DHL Nábor <onboarding@resend.dev>",
      to: ["vaclavbelo94@gmail.com"],
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      messageId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in send-recruitment-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "Failed to send recruitment email"
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(serve_handler);