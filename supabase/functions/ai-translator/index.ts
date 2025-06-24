
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
    const systemPrompt = `Jsi překladač z češtiny a polštiny do němčiny. 
DŮLEŽITÉ PRAVIDLA:
- Překládej POUZE do němčiny
- Odpovídej POUZE německým překladem, žádný jiný text
- Nepiš žádné vysvětlení ani komentáře
- Pokud je text už v němčině, napiš ho znovu
- Vrať pouze čistý německý překlad bez formátování

Příklady:
Český text: "Dobrý den" → "Guten Tag"
Polský text: "Dzień dobry" → "Guten Tag"`;

    // First try Google Gemini
    try {
      console.log('Attempting Google Gemini API call...');
      
      const prompt = `${systemPrompt}\n\nText k překladu: "${message}"`;

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
            temperature: 0.1,
            topK: 10,
            topP: 0.8,
            maxOutputTokens: 100,
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
        let aiResponse = geminiData.candidates[0].content.parts[0].text.trim();
        
        // Clean up response - remove any formatting or extra text
        aiResponse = aiResponse.replace(/^\*\*.*?\*\*:?\s*/, ''); // Remove **Překlad**: or similar
        aiResponse = aiResponse.replace(/^🔄\s*\*\*.*?\*\*:?\s*/, ''); // Remove emoji formatting
        aiResponse = aiResponse.replace(/^\d+\.\s*/, ''); // Remove numbering
        aiResponse = aiResponse.trim();
        
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
