
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fallback Google Translate function
async function translateWithGoogleTranslate(text: string, sourceLang: string = 'auto', targetLang: string = 'de') {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data && data[0] && data[0][0]) {
      const translatedText = data[0][0][0];
      return {
        response: translatedText,
        fallback: true
      };
    }
    throw new Error('Google Translate API error');
  } catch (error) {
    throw new Error(`Fallback translation failed: ${error.message}`);
  }
}

// Detect language from text
function detectLanguage(text: string): { source: string, target: string } {
  const czechChars = /[áčďéěíňóřšťúůýž]/i;
  const polishChars = /[ąćęłńóśźż]/i;
  
  if (czechChars.test(text)) {
    return { source: 'cs', target: 'de' };
  } else if (polishChars.test(text)) {
    return { source: 'pl', target: 'de' };
  }
  return { source: 'auto', target: 'de' };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [] } = await req.json();
    
    // Detect source language
    const languages = detectLanguage(message);
    
    // Create system prompt for German translation
    const systemPrompt = `Jsi profesionální překladač z češtiny a polštiny do němčiny. 
DŮLEŽITÉ PRAVIDLA:
- Překládej POUZE do němčiny
- Odpovídej POUZE německým překladem, žádný jiný text
- Nepiš žádné vysvětlení ani komentáře
- Pokud je text už v němčině, napiš ho znovu
- Vrať pouze čistý německý překlad bez formátování
- Zachovej smysl a kontext původního textu

Příklady:
Český text: "Dobrý den" → "Guten Tag"
Polský text: "Dzień dobry" → "Guten Tag"`;

    // Try Lovable AI (Google Gemini 2.5 Flash)
    try {
      console.log('Attempting Lovable AI Gateway call...');
      
      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${lovableApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          temperature: 0.3,
          max_tokens: 200,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Lovable AI error:', response.status, errorText);
        
        // Handle rate limiting
        if (response.status === 429) {
          return new Response(JSON.stringify({ 
            error: 'Rate limit překročen. Zkuste to prosím za chvíli.',
            service: 'none',
            rateLimitExceeded: true
          }), {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        // Handle payment required
        if (response.status === 402) {
          return new Response(JSON.stringify({ 
            error: 'Nedostatek kreditů. Přidejte kredity ve Workspace nastavení.',
            service: 'none',
            paymentRequired: true
          }), {
            status: 402,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        throw new Error(`Lovable AI error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        let aiResponse = data.choices[0].message.content.trim();
        
        // Clean up response - remove any formatting or extra text
        aiResponse = aiResponse.replace(/^\*\*.*?\*\*:?\s*/, '');
        aiResponse = aiResponse.replace(/^🔄\s*\*\*.*?\*\*:?\s*/, '');
        aiResponse = aiResponse.replace(/^\d+\.\s*/, '');
        aiResponse = aiResponse.trim();
        
        console.log('Lovable AI success');
        
        return new Response(JSON.stringify({ 
          response: aiResponse,
          service: 'lovable-ai',
          usage: data.usage 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } else {
        throw new Error('Invalid Lovable AI response format');
      }

    } catch (lovableError) {
      console.error('Lovable AI failed, trying fallback:', lovableError.message);
      
      // Fallback to Google Translate
      const fallbackResult = await translateWithGoogleTranslate(message, languages.source, languages.target);
      
      console.log('Fallback translation successful');
      
      return new Response(JSON.stringify({ 
        response: fallbackResult.response,
        service: 'google-translate',
        fallback: true,
        error: `Překladač dočasně nedostupný: ${lovableError.message}` 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Complete error in ai-translator-v2 function:', error);
    return new Response(JSON.stringify({ 
      error: `Všechny překladové služby nedostupné: ${error.message}`,
      service: 'none'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
