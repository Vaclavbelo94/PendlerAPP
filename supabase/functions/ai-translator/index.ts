
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [] } = await req.json();

    const systemPrompt = `Jsi specializovaný AI asistent pro německo-český překlad a výuku jazyka. Pomáháš českým pendlerům a pracovníkům v Německu s komunikací.

TVOJE HLAVNÍ FUNKCE:
- Překlady mezi češtinou a němčinou s kontextovým vysvětlením
- Vysvětlení gramatiky, výslovnosti a kulturních rozdílů
- Praktické rady pro komunikaci v práci, na úřadech, v obchodech
- Pomoc s konkrétními situacemi (pohovory, prezentace, dokumenty)
- Výuka základních a pokročilých jazykových konstrukcí

STYL ODPOVĚDÍ:
- Přátelský a podporující tón
- Strukturované odpovědi s jasným rozdělením
- Vždy uveď překlad + vysvětlení kontextu
- Praktické příklady použití
- Krátké, ale kompletní informace
- Používej české znaky správně

FORMÁT ODPOVĚDÍ:
Pokud uživatel žádá překlad:
🔄 **Překlad**: [přeložený text]
📝 **Kontext**: [kdy a jak použít]
💡 **Tip**: [praktická rada nebo alternativa]

Pro složitější otázky strukturuj odpověď logicky s emoji pro lepší orientaci.

Specializuješ se na praktické situace českých pendlerů v Německu.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenAI API error');
    }

    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ 
      response: aiResponse,
      usage: data.usage 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-translator function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Došlo k chybě při zpracování požadavku' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
