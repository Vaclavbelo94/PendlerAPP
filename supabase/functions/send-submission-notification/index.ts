import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: 'new_submission' | 'status_update';
  submission_id: string;
  old_status?: string;
  new_status?: string;
}

const statusLabels = {
  pending: 'Čeká na vyřízení',
  in_progress: 'Zpracovává se',
  completed: 'Dokončeno',
  cancelled: 'Zrušeno'
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, submission_id, old_status, new_status }: NotificationRequest = await req.json();

    // Fetch submission details
    const { data: submission, error: submissionError } = await supabase
      .from('assisted_submissions')
      .select(`
        *,
        profiles:user_id (email, username)
      `)
      .eq('id', submission_id)
      .single();

    if (submissionError || !submission) {
      throw new Error('Submission not found');
    }

    const userEmail = submission.profiles?.email;
    const userName = submission.profiles?.username || 'Uživatel';

    if (type === 'new_submission') {
      // Send notification to admin
      await resend.emails.send({
        from: 'PendlerApp <noreply@resend.dev>',
        to: ['vaclavbelo94@gmail.com'], // Admin email
        subject: 'Nová žádost o asistované podání daňového přiznání',
        html: `
          <h2>Nová žádost o asistované podání</h2>
          <p>Byla podána nová žádost o asistované podání daňového přiznání.</p>
          
          <h3>Detaily žádosti:</h3>
          <ul>
            <li><strong>Uživatel:</strong> ${userName} (${userEmail})</li>
            <li><strong>Priorita:</strong> ${submission.priority}</li>
            <li><strong>Odhad návratu:</strong> ${(submission.calculation_result.totalDeductions * 0.25).toFixed(2)}€</li>
            <li><strong>Podáno:</strong> ${new Date(submission.created_at).toLocaleString('cs-CZ')}</li>
          </ul>

          <h3>Kontaktní údaje:</h3>
          <ul>
            <li><strong>Email:</strong> ${submission.contact_info.contactEmail}</li>
            ${submission.contact_info.phone ? `<li><strong>Telefon:</strong> ${submission.contact_info.phone}</li>` : ''}
            ${submission.contact_info.additionalNotes ? `<li><strong>Poznámky:</strong> ${submission.contact_info.additionalNotes}</li>` : ''}
          </ul>

          <p><a href="${supabaseUrl}/admin" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Otevřít admin panel</a></p>
        `
      });

      // Send confirmation to user
      if (userEmail) {
        await resend.emails.send({
          from: 'PendlerApp <noreply@resend.dev>',
          to: [userEmail],
          subject: 'Potvrzení žádosti o asistované podání',
          html: `
            <h2>Děkujeme za vaši žádost!</h2>
            <p>Vaše žádost o asistované podání daňového přiznání byla úspěšně přijata.</p>
            
            <h3>Co se děje dále:</h3>
            <ol>
              <li>Náš tým expertů zkontroluje vaše údaje do 24 hodin</li>
              <li>Připravíme a zkontrolujeme vaše daňové přiznání</li>
              <li>Odešleme vám potvrzení o podání</li>
            </ol>

            <h3>Souhrn vašich údajů:</h3>
            <ul>
              <li><strong>Odhad daňového návratu:</strong> ${(submission.calculation_result.totalDeductions * 0.25).toFixed(2)}€</li>
              <li><strong>Celkové odpočty:</strong> ${submission.calculation_result.totalDeductions.toFixed(2)}€</li>
              <li><strong>Priorita:</strong> ${submission.priority}</li>
            </ul>

            <p>Budeme vás informovat o každé změně stavu vaší žádosti.</p>
            
            <p style="color: #666; font-size: 12px;">
              ID žádosti: ${submission.id}<br>
              Podáno: ${new Date(submission.created_at).toLocaleString('cs-CZ')}
            </p>
          `
        });
      }

    } else if (type === 'status_update' && userEmail) {
      // Send status update to user
      const statusMessage = getStatusMessage(new_status!);
      
      await resend.emails.send({
        from: 'PendlerApp <noreply@resend.dev>',
        to: [userEmail],
        subject: `Aktualizace stavu žádosti - ${statusLabels[new_status as keyof typeof statusLabels]}`,
        html: `
          <h2>Aktualizace stavu vaší žádosti</h2>
          <p>Stav vaší žádosti o asistované podání byl změněn.</p>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Nový stav:</strong> ${statusLabels[new_status as keyof typeof statusLabels]}</p>
            ${old_status ? `<p><strong>Předchozí stav:</strong> ${statusLabels[old_status as keyof typeof statusLabels]}</p>` : ''}
          </div>

          ${statusMessage}

          ${submission.admin_notes ? `
            <h3>Poznámka od našeho týmu:</h3>
            <div style="background: #e3f2fd; padding: 15px; border-radius: 5px;">
              ${submission.admin_notes}
            </div>
          ` : ''}

          <p style="color: #666; font-size: 12px;">
            ID žádosti: ${submission.id}<br>
            Aktualizováno: ${new Date().toLocaleString('cs-CZ')}
          </p>
        `
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error sending notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

function getStatusMessage(status: string): string {
  switch (status) {
    case 'in_progress':
      return `
        <p>Náš tým začal zpracovávat vaše daňové přiznání. Zkontrolujeme všechny vaše údaje a připravíme kompletní dokumentaci.</p>
        <p>Očekávaná doba dokončení: 2-5 pracovních dní.</p>
      `;
    case 'completed':
      return `
        <p><strong>Gratulujeme!</strong> Vaše daňové přiznání bylo úspěšně zpracováno a odesláno finančnímu úřadu.</p>
        <p>V příloze naleznete kopii podaného přiznání a potvrzení o odeslání.</p>
        <p>Děkujeme za důvěru v naše služby!</p>
      `;
    case 'cancelled':
      return `
        <p>Vaše žádost byla zrušena. Pokud to bylo omylem nebo máte dotazy, neváhejte nás kontaktovat.</p>
      `;
    default:
      return '<p>Děkujeme za trpělivost během zpracování vaší žádosti.</p>';
  }
}

serve(handler);