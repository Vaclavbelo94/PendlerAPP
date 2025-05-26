
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const googleAIApiKey = Deno.env.get('GOOGLE_AI_API_KEY');

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
        response: `🔄 **Překlad**: ${translatedText}\n📝 **Kontext**: Automatický překlad (bez AI asistenta)\n💡 **Tip**: Pro detailnější vysvětlení zkuste později, až bude AI dostupná`,
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
  const germanChars = /[äöüßÄÖÜ]/i;
  
  if (czechChars.test(text)) {
    return { source: 'cs', target: 'de' };
  } else if (germanChars.test(text)) {
    return { source: 'de', target: 'cs' };
  }
  return { source: 'auto', target: 'cs' };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [] } = await req.json();

    // System prompt optimized for Gemini
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

    // First try Google Gemini
    try {
      console.log('Attempting Google Gemini API call...');
      
      const prompt = conversationHistory.length > 0 
        ? `${systemPrompt}\n\nKonverzace:\n${conversationHistory.map((msg: any) => `${msg.role}: ${msg.content}`).join('\n')}\n\nUživatel: ${message}`
        : `${systemPrompt}\n\nUživatel: ${message}`;

      const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${googleAIApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1000,
          }
        }),
      });

      if (!geminiResponse.ok) {
        const errorData = await geminiResponse.text();
        console.error('Gemini API error:', errorData);
        throw new Error(`Gemini API error: ${geminiResponse.status}`);
      }

      const geminiData = await geminiResponse.json();
      
      if (geminiData.candidates && geminiData.candidates[0] && geminiData.candidates[0].content) {
        const aiResponse = geminiData.candidates[0].content.parts[0].text;
        console.log('Gemini API success');
        
        return new Response(JSON.stringify({ 
          response: aiResponse,
          service: 'gemini',
          usage: geminiData.usageMetadata 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } else {
        throw new Error('Invalid Gemini response format');
      }

    } catch (geminiError) {
      console.error('Gemini API failed, trying fallback:', geminiError.message);
      
      // Fallback to Google Translate
      const languages = detectLanguage(message);
      const fallbackResult = await translateWithGoogleTranslate(message, languages.source, languages.target);
      
      console.log('Fallback translation successful');
      
      return new Response(JSON.stringify({ 
        response: fallbackResult.response,
        service: 'google-translate',
        fallback: true,
        error: `AI nedostupná: ${geminiError.message}` 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Complete error in ai-translator function:', error);
    return new Response(JSON.stringify({ 
      error: `Všechny překladové služby nedostupné: ${error.message}`,
      service: 'none'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
